import { BusinessStats, JobApplication, BusinessJob } from '../types/business';

export const mockBusinessStats: BusinessStats = {
  publishedJobs: 8,
  totalApplications: 42,
  pendingReview: 15,
  hired: 12,
};

export const mockBusinessJobs: BusinessJob[] = [
  {
    id: '1',
    title: '周末咖啡师',
    status: 'active',
    applicationCount: 8,
    hiredCount: 2,
    createdAt: '2024-01-20',
    workTime: {
      date: '2024-01-27',
      startTime: '09:00',
      endTime: '18:00',
    },
    salary: {
      min: 25,
      max: 30,
      unit: 'hour',
    },
  },
  {
    id: '2',
    title: '服装导购',
    status: 'active',
    applicationCount: 12,
    hiredCount: 3,
    createdAt: '2024-01-18',
    workTime: {
      date: '2024-01-28',
      startTime: '10:00',
      endTime: '18:00',
    },
    salary: {
      min: 22,
      max: 28,
      unit: 'hour',
    },
  },
  {
    id: '3',
    title: '餐厅服务员',
    status: 'paused',
    applicationCount: 15,
    hiredCount: 4,
    createdAt: '2024-01-15',
    workTime: {
      date: '2024-01-27',
      startTime: '11:00',
      endTime: '20:00',
    },
    salary: {
      min: 20,
      max: 25,
      unit: 'hour',
    },
  },
];

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    studentName: '张小明',
    jobTitle: '周末咖啡师',
    jobId: '1',
    appliedAt: '2024-01-24 14:30',
    status: 'pending',
    phone: '138****1234',
    wechat: 'zhangxm',
    message: '我对咖啡制作很感兴趣，之前有过相关经验，周末两天都可以到岗。',
  },
  {
    id: '2',
    studentName: '李小红',
    jobTitle: '周末咖啡师',
    jobId: '1',
    appliedAt: '2024-01-24 10:15',
    status: 'approved',
    phone: '139****5678',
    wechat: 'lixh2024',
    message: '我很喜欢咖啡文化，希望能在周末学习相关技能。',
  },
  {
    id: '3',
    studentName: '王大伟',
    jobTitle: '服装导购',
    jobId: '2',
    appliedAt: '2024-01-23 16:45',
    status: 'pending',
    phone: '137****9012',
    wechat: 'wangdw',
    message: '有零售经验，擅长与顾客沟通。',
  },
  {
    id: '4',
    studentName: '刘芳芳',
    jobTitle: '服装导购',
    jobId: '2',
    appliedAt: '2024-01-23 09:20',
    status: 'approved',
    phone: '136****3456',
    wechat: 'liuff',
  },
  {
    id: '5',
    studentName: '陈浩然',
    jobTitle: '餐厅服务员',
    jobId: '3',
    appliedAt: '2024-01-22 15:00',
    status: 'rejected',
    phone: '135****7890',
    wechat: 'chenhr',
  },
];
