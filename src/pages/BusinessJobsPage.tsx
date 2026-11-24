import { useState } from 'react';
import { Plus, MoreVertical, Users, Clock } from 'lucide-react';
import { PublishJobForm } from '../components/PublishJobForm';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { formatSalary, formatWorkTime } from '../utils/formatters';
import { Job } from '../types';

// 演示商家名称
const DEMO_BUSINESS_NAME = '星享咖啡';

export const BusinessJobsPage: React.FC = () => {
  const [showPublishForm, setShowPublishForm] = useState(false);
  const { jobs, applications, addJob } = useData();
  const { showToast } = useToast();

  // 只显示属于当前商家的岗位
  const businessJobs = jobs.filter((job) => job.businessName === DEMO_BUSINESS_NAME);
  const getStatusLabel = (status: string) => {
    const labels = {
      active: '招聘中',
      paused: '已暂停',
      closed: '已关闭',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
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
    return applications.filter((app) => app.jobId === jobId).length;
  };

  const getJobApprovedCount = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId && app.status === 'approved').length;
  };

  return (
    <div className="min-h-screen bg-bg-soft py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">岗位管理</h1>
            <p className="text-sm text-gray-600">管理您发布的所有兼职岗位</p>
          </div>
          <button
            onClick={() => setShowPublishForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">发布新岗位</span>
            <span className="sm:hidden">发布</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">招聘中</p>
            <p className="text-2xl font-bold text-green-600">
              {businessJobs.filter((j) => !j.status || j.status === 'active').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">已暂停</p>
            <p className="text-2xl font-bold text-orange-600">
              {businessJobs.filter((j) => j.status === 'paused').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">总报名</p>
            <p className="text-2xl font-bold text-blue-600">
              {applications.filter((app) =>
                businessJobs.some((job) => job.id === app.jobId)
              ).length}
            </p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {businessJobs.map((job) => {
            const jobApplicationCount = getJobApplicationCount(job.id);
            const jobApprovedCount = getJobApprovedCount(job.id);

            return (
              <div key={job.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(
                        job.status || 'active'
                      )}`}
                    >
                      {getStatusLabel(job.status || 'active')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatWorkTime(job.workTime)}</span>
                    </div>
                    <span className="font-semibold text-business-600">
                      {formatSalary(job)}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      报名 <span className="font-semibold text-gray-900">{jobApplicationCount}</span> 人
                    </span>
                  </div>
                  <div className="text-gray-600">
                    已录用 <span className="font-semibold text-green-600">{jobApprovedCount}</span> 人
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    编辑
                  </button>
                  <button className="text-sm text-business-600 hover:text-business-700 px-3 py-1.5 hover:bg-business-50 rounded-lg transition-colors">
                    查看报名
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {businessJobs.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">暂无发布的岗位</p>
            <p className="text-gray-400 text-sm">点击右上角"发布新岗位"开始招聘</p>
          </div>
        )}
      </div>

      {/* Publish Job Modal */}
      {showPublishForm && (
        <PublishJobForm onClose={() => setShowPublishForm(false)} onSubmit={handlePublishJob} />
      )}
    </div>
  );
};
