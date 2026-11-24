import { TimeEvent, AvailableTimeSlot, TimeMatchResult, Weekday } from '../types/schedule';
import { Job } from '../types';

// 解析时间字符串为分钟数（从0点开始）
export const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 格式化分钟数为时间字符串
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// 判断两个时间段是否重叠
export const isTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);
  return s1 < e2 && s2 < e1;
};

// 获取指定日期的星期几
export const getWeekday = (dateStr: string): Weekday => {
  const date = new Date(dateStr);
  return date.getDay() as Weekday;
};

// 获取某一天的所有事件（包括重复事件和单次事件）
export const getEventsForDate = (events: TimeEvent[], dateStr: string): TimeEvent[] => {
  const weekday = getWeekday(dateStr);
  return events.filter((event) => {
    if (event.isRecurring) {
      return event.weekday === weekday;
    } else {
      return event.date === dateStr;
    }
  });
};

// 获取某一天某个星期的可兼职时间设置
export const getAvailableTimeForWeekday = (
  availableTime: AvailableTimeSlot[],
  weekday: Weekday
): AvailableTimeSlot[] => {
  return availableTime.filter((slot) => slot.weekday === weekday);
};

// 计算某一天的真实可用时间段（扣除已占用时间）
export const calculateAvailableSlots = (
  availableTime: AvailableTimeSlot[],
  events: TimeEvent[],
  weekday: Weekday
): Array<{ startTime: string; endTime: string }> => {
  const slots = getAvailableTimeForWeekday(availableTime, weekday);
  if (slots.length === 0) return [];

  const result: Array<{ startTime: string; endTime: string }> = [];

  slots.forEach((slot) => {
    // 将可兼职时间段拆分成更小的片段（如果有事件占用）
    let currentStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);

    // 获取该时间段内的所有事件，按开始时间排序
    const conflictEvents = events
      .filter((event) =>
        isTimeOverlap(slot.startTime, slot.endTime, event.startTime, event.endTime)
      )
      .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

    conflictEvents.forEach((event) => {
      const eventStart = parseTime(event.startTime);
      const eventEnd = parseTime(event.endTime);

      // 如果事件开始前有空闲时间
      if (currentStart < eventStart) {
        result.push({
          startTime: formatTime(currentStart),
          endTime: formatTime(eventStart),
        });
      }

      // 更新当前开始时间到事件结束后
      currentStart = Math.max(currentStart, eventEnd);
    });

    // 如果最后还有剩余时间
    if (currentStart < slotEnd) {
      result.push({
        startTime: formatTime(currentStart),
        endTime: formatTime(slotEnd),
      });
    }
  });

  return result;
};

// 判断岗位工作时间是否匹配学生的可用时间
export const checkJobTimeMatch = (
  job: Job,
  events: TimeEvent[],
  availableTime: AvailableTimeSlot[]
): TimeMatchResult => {
  const jobDate = job.workTime.date;
  const jobStart = job.workTime.startTime;
  const jobEnd = job.workTime.endTime;
  const weekday = getWeekday(jobDate);

  // 检查是否设置了该天的可兼职时间
  const availableSlots = getAvailableTimeForWeekday(availableTime, weekday);
  if (availableSlots.length === 0) {
    return {
      status: 'not_set',
      message: `您尚未设置${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][weekday]}的可兼职时间`,
    };
  }

  // 检查岗位时间是否在可兼职时间范围内
  const isInAvailableRange = availableSlots.some((slot) =>
    isTimeOverlap(slot.startTime, slot.endTime, jobStart, jobEnd)
  );

  if (!isInAvailableRange) {
    return {
      status: 'conflict',
      message: `该岗位工作时间（${jobStart}-${jobEnd}）不在您设置的可兼职时间内`,
    };
  }

  // 获取该天的所有事件
  const dayEvents = getEventsForDate(events, jobDate);

  // 检查是否与已有事件冲突
  const conflictEvents = dayEvents.filter((event) =>
    isTimeOverlap(jobStart, jobEnd, event.startTime, event.endTime)
  );

  if (conflictEvents.length > 0) {
    const conflictNames = conflictEvents.map((e) => e.name).join('、');
    return {
      status: 'conflict',
      message: `该岗位工作时间与您的 ${conflictNames} 冲突`,
      conflictEvents,
    };
  }

  // 计算真实可用时间段
  const realAvailableSlots = calculateAvailableSlots(availableTime, dayEvents, weekday);

  // 检查岗位时间是否完全在某个可用时间段内
  const isFullyAvailable = realAvailableSlots.some((slot) => {
    const slotStart = parseTime(slot.startTime);
    const slotEnd = parseTime(slot.endTime);
    const jStart = parseTime(jobStart);
    const jEnd = parseTime(jobEnd);
    return jStart >= slotStart && jEnd <= slotEnd;
  });

  if (isFullyAvailable) {
    const weekdayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][weekday];
    return {
      status: 'matched',
      message: `该岗位工作时间为${weekdayName} ${jobStart}-${jobEnd}，与您设置的可兼职时间完全匹配`,
    };
  }

  return {
    status: 'conflict',
    message: `该岗位工作时间与您的可用时间段不完全匹配`,
  };
};

// 获取本周的日期范围
export const getWeekDates = (referenceDate: Date = new Date()): string[] => {
  const dates: string[] = [];
  const current = new Date(referenceDate);

  // 获取本周一的日期
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
  current.setDate(diff);
  current.setHours(0, 0, 0, 0);

  // 生成周一到周日的日期
  for (let i = 0; i < 7; i++) {
    const date = new Date(current);
    date.setDate(current.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
};

// 切换到上一周
export const getPreviousWeek = (currentMonday: string): string => {
  const date = new Date(currentMonday);
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
};

// 切换到下一周
export const getNextWeek = (currentMonday: string): string => {
  const date = new Date(currentMonday);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

// 格式化日期显示
export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 判断是否是今天
export const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};
