import { TimeEvent, AvailableTimeSlot } from '../types/schedule';

const EVENTS_KEY = 'weekend_match_events';
const AVAILABLE_TIME_KEY = 'weekend_match_available_time';

// 演示数据 - 时间事件
const DEMO_EVENTS: TimeEvent[] = [
  {
    id: 'evt1',
    name: '高等数学',
    type: 'course',
    startTime: '08:00',
    endTime: '09:40',
    isRecurring: true,
    weekday: 1, // 周一
  },
  {
    id: 'evt2',
    name: '高等数学',
    type: 'course',
    startTime: '08:00',
    endTime: '09:40',
    isRecurring: true,
    weekday: 3, // 周三
  },
  {
    id: 'evt3',
    name: '大学英语',
    type: 'course',
    startTime: '10:00',
    endTime: '11:40',
    isRecurring: true,
    weekday: 2, // 周二
  },
  {
    id: 'evt4',
    name: '大学英语',
    type: 'course',
    startTime: '10:00',
    endTime: '11:40',
    isRecurring: true,
    weekday: 4, // 周四
  },
  {
    id: 'evt5',
    name: '图书馆自习',
    type: 'study',
    startTime: '14:00',
    endTime: '17:00',
    isRecurring: true,
    weekday: 5, // 周五
  },
  {
    id: 'evt6',
    name: '社团例会',
    type: 'club',
    startTime: '19:00',
    endTime: '21:00',
    isRecurring: true,
    weekday: 3, // 周三
  },
];

// 演示数据 - 可兼职时间
const DEMO_AVAILABLE_TIME: AvailableTimeSlot[] = [
  { id: 'at1', weekday: 1, startTime: '18:00', endTime: '22:00' }, // 周一
  { id: 'at2', weekday: 3, startTime: '18:00', endTime: '22:00' }, // 周三
  { id: 'at3', weekday: 5, startTime: '17:00', endTime: '22:00' }, // 周五
  { id: 'at4', weekday: 6, startTime: '09:00', endTime: '18:00' }, // 周六
  { id: 'at5', weekday: 0, startTime: '14:00', endTime: '20:00' }, // 周日
];

// 加载时间事件
export const loadEvents = (): TimeEvent[] => {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }
  return DEMO_EVENTS;
};

// 保存时间事件
export const saveEvents = (events: TimeEvent[]): void => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
};

// 加载可兼职时间
export const loadAvailableTime = (): AvailableTimeSlot[] => {
  try {
    const data = localStorage.getItem(AVAILABLE_TIME_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load available time:', error);
  }
  return DEMO_AVAILABLE_TIME;
};

// 保存可兼职时间
export const saveAvailableTime = (slots: AvailableTimeSlot[]): void => {
  try {
    localStorage.setItem(AVAILABLE_TIME_KEY, JSON.stringify(slots));
  } catch (error) {
    console.error('Failed to save available time:', error);
  }
};

// 恢复演示数据
export const resetScheduleDemoData = (): void => {
  saveEvents(DEMO_EVENTS);
  saveAvailableTime(DEMO_AVAILABLE_TIME);
};
