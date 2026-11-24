// 商家端相关类型定义

export interface BusinessStats {
  publishedJobs: number;
  totalApplications: number;
  pendingReview: number;
  hired: number;
}

export interface JobApplication {
  id: string;
  studentName: string;
  studentAvatar?: string;
  jobTitle: string;
  jobId: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  phone?: string;
  wechat?: string;
  message?: string;
}

export interface BusinessJob {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'closed';
  applicationCount: number;
  hiredCount: number;
  createdAt: string;
  workTime: {
    date: string;
    startTime: string;
    endTime: string;
  };
  salary: {
    min: number;
    max: number;
    unit: 'hour' | 'day' | 'task';
  };
}

export type BusinessPage = 'dashboard' | 'jobs' | 'applications' | 'messages';
