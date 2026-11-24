// 时间事件类型
export type EventType = 'course' | 'study' | 'club' | 'personal' | 'other';

// 星期枚举
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=周日, 1=周一, ..., 6=周六

// 时间事件
export interface TimeEvent {
  id: string;
  name: string;
  type: EventType;
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  isRecurring: boolean; // 是否每周重复
  weekday?: Weekday; // 重复事件的星期
  date?: string; // 单次事件的具体日期 "2024-11-27"
  note?: string;
  color?: string; // 用于显示的颜色
}

// 可兼职时间段
export interface AvailableTimeSlot {
  id: string;
  weekday: Weekday;
  startTime: string; // "18:00"
  endTime: string; // "22:00"
}

// 时间匹配结果
export type TimeMatchStatus = 'matched' | 'conflict' | 'not_set' | 'unknown';

export interface TimeMatchResult {
  status: TimeMatchStatus;
  message: string;
  conflictEvents?: TimeEvent[];
}

// 事件类型配置
export const eventTypeConfig: Record<EventType, { label: string; color: string }> = {
  course: { label: '课程', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  study: { label: '自习', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  club: { label: '社团活动', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  personal: { label: '个人安排', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  other: { label: '其他', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

// 星期标签
export const weekdayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const weekdayLabelsShort = ['日', '一', '二', '三', '四', '五', '六'];
