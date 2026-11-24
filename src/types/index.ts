// 用户角色
export type UserRole = 'student' | 'business';

// 兼职类别
export type JobCategory =
  | 'catering'
  | 'retail'
  | 'education'
  | 'promotion'
  | 'delivery'
  | 'other';

// 兼职岗位
export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  businessName: string;
  location: string;
  distance?: number; // 距离（公里）
  salary: {
    min: number;
    max: number;
    unit: 'hour' | 'day' | 'task';
  };
  workTime: {
    date: string; // 日期，如 "2024-01-20"
    startTime: string; // 开始时间，如 "09:00"
    endTime: string; // 结束时间，如 "18:00"
  };
  requirements: string[];
  tags: string[];
  recruitCount: number; // 招募人数
  appliedCount: number; // 已报名人数
  matchScore?: number; // 匹配度（0-100）
  description: string;
  status?: 'active' | 'paused' | 'closed'; // 招聘状态（商家端使用）
  contactInfo?: {
    phone?: string;
    wechat?: string;
  };
}

// 筛选条件
export interface FilterOptions {
  category?: JobCategory[];
  minSalary?: number;
  maxDistance?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  keywords?: string;
}
