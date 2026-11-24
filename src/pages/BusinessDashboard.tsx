import { useState } from 'react';
import { Plus, Briefcase, Users, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { PublishJobForm } from '../components/PublishJobForm';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { formatSalary, formatWorkTime } from '../utils/formatters';
import { Job } from '../types';

// 演示商家名称
const DEMO_BUSINESS_NAME = '星享咖啡';

export const BusinessDashboard: React.FC = () => {
  const [showPublishForm, setShowPublishForm] = useState(false);
  const { jobs, applications, addJob } = useData();
  const { showToast } = useToast();

  // 只统计属于当前商家的数据
  const businessJobs = jobs.filter((job) => job.businessName === DEMO_BUSINESS_NAME);
  const businessJobIds = businessJobs.map((job) => job.id);
  const businessApplications = applications.filter((app) => businessJobIds.includes(app.jobId));

  const stats = {
    publishedJobs: businessJobs.length,
    totalApplications: businessApplications.length,
    pendingReview: businessApplications.filter((app) => app.status === 'pending').length,
    hired: businessApplications.filter((app) => app.status === 'approved').length,
  };

  const recentApplications = businessApplications.slice(0, 5);
  const recentJobs = businessJobs.slice(0, 3);

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: '待审核',
      approved: '已录用',
      rejected: '已拒绝',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getJobStatusLabel = (status: string) => {
    const labels = {
      active: '招聘中',
      paused: '已暂停',
      closed: '已关闭',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getJobStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-orange-100 text-orange-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handlePublishJob = (data: any) => {
    const newJob: Job = {
      id: Date.now().toString(),
      title: data.title,
      category: data.category,
      businessName: DEMO_BUSINESS_NAME,
      location: data.location,
      salary: {
        min: data.salaryMin,
        max: data.salaryMax,
        unit: data.salaryUnit,
      },
      workTime: {
        date: data.workDate,
        startTime: data.startTime,
        endTime: data.endTime,
      },
      requirements: [],
      tags: [],
      recruitCount: data.recruitCount,
      appliedCount: 0,
      description: data.description,
    };

    addJob(newJob);
    showToast('岗位发布成功！');
    setShowPublishForm(false);
  };

  const getJobApplicationCount = (jobId: string) => {
    return businessApplications.filter((app) => app.jobId === jobId).length;
  };

  const getJobApprovedCount = (jobId: string) => {
    return businessApplications.filter((app) => app.jobId === jobId && app.status === 'approved').length;
  };

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-business-50 via-white to-business-50/30 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              欢迎回来，星享咖啡
            </h1>
            <p className="text-gray-600">管理您的兼职招聘，快速找到合适的候选人</p>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => setShowPublishForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>发布新岗位</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">数据概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="已发布岗位"
              value={stats.publishedJobs}
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="收到的报名"
              value={stats.totalApplications}
              icon={Users}
              color="green"
            />
            <StatCard
              title="待审核报名"
              value={stats.pendingReview}
              icon={Clock}
              color="orange"
            />
            <StatCard
              title="已录用人数"
              value={stats.hired}
              icon={CheckCircle}
              color="purple"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最近发布的岗位</h2>
              <button className="text-sm text-business-600 hover:text-business-700 font-medium">
                查看全部 →
              </button>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatSalary(job)} · {formatWorkTime(job.workTime)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${getJobStatusColor(
                        job.status || 'active'
                      )}`}
                    >
                      {getJobStatusLabel(job.status || 'active')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>报名 {getJobApplicationCount(job.id)} 人</span>
                    <span>已录用 {getJobApprovedCount(job.id)} 人</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Applications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最新报名</h2>
              <button className="text-sm text-business-600 hover:text-business-700 font-medium">
                查看全部 →
              </button>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">{app.jobTitle}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{app.appliedAt}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Publish Job Modal */}
      {showPublishForm && (
        <PublishJobForm onClose={() => setShowPublishForm(false)} onSubmit={handlePublishJob} />
      )}
    </div>
  );
};
