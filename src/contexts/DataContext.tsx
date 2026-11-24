import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job } from '../types';
import { JobApplication } from '../types/business';
import { loadJobs, saveJobs, loadApplications, saveApplications, initializeDemoData } from '../utils/storage';

interface DataContextType {
  jobs: Job[];
  applications: JobApplication[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  addApplication: (application: JobApplication) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  getJobById: (id: string) => Job | undefined;
  getApplicationsByJobId: (jobId: string) => JobApplication[];
  hasApplied: (studentName: string, jobId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // 初始化数据
  useEffect(() => {
    initializeDemoData();
    setJobs(loadJobs());
    setApplications(loadApplications());
  }, []);

  // 添加岗位
  const addJob = (job: Job) => {
    const newJobs = [...jobs, job];
    setJobs(newJobs);
    saveJobs(newJobs);
  };

  // 更新岗位
  const updateJob = (id: string, updates: Partial<Job>) => {
    const newJobs = jobs.map((job) => (job.id === id ? { ...job, ...updates } : job));
    setJobs(newJobs);
    saveJobs(newJobs);
  };

  // 添加报名
  const addApplication = (application: JobApplication) => {
    const newApplications = [...applications, application];
    setApplications(newApplications);
    saveApplications(newApplications);

    // 更新岗位的报名人数
    const job = jobs.find((j) => j.id === application.jobId);
    if (job) {
      updateJob(job.id, { appliedCount: (job.appliedCount || 0) + 1 });
    }
  };

  // 更新报名
  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    const newApplications = applications.map((app) =>
      app.id === id ? { ...app, ...updates } : app
    );
    setApplications(newApplications);
    saveApplications(newApplications);
  };

  // 根据ID获取岗位
  const getJobById = (id: string) => {
    return jobs.find((job) => job.id === id);
  };

  // 获取某岗位的所有报名
  const getApplicationsByJobId = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId);
  };

  // 检查是否已报名
  const hasApplied = (studentName: string, jobId: string) => {
    return applications.some((app) => app.studentName === studentName && app.jobId === jobId);
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        updateJob,
        addApplication,
        updateApplication,
        getJobById,
        getApplicationsByJobId,
        hasApplied,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
