import { Search, Filter, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

// 演示商家名称
const DEMO_BUSINESS_NAME = '星享咖啡';

export const BusinessApplicationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { applications, jobs, updateApplication } = useData();
  const { showToast } = useToast();

  // 只显示属于当前商家岗位的报名
  const businessJobIds = jobs
    .filter((job) => job.businessName === DEMO_BUSINESS_NAME)
    .map((job) => job.id);

  const businessApplications = applications.filter((app) =>
    businessJobIds.includes(app.jobId)
  );

  const filteredApplications =
    filter === 'all'
      ? businessApplications
      : businessApplications.filter((app) => app.status === filter);

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

  const statusCounts = {
    all: businessApplications.length,
    pending: businessApplications.filter((a) => a.status === 'pending').length,
    approved: businessApplications.filter((a) => a.status === 'approved').length,
    rejected: businessApplications.filter((a) => a.status === 'rejected').length,
  };

  const handleApprove = (appId: string) => {
    updateApplication(appId, { status: 'approved' });
    showToast('已录用该申请人');
  };

  const handleReject = (appId: string) => {
    updateApplication(appId, { status: 'rejected' });
    showToast('已拒绝该申请');
  };

  return (
    <div className="min-h-screen bg-bg-soft py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">报名管理</h1>
          <p className="text-sm text-gray-600">查看和处理学生的报名申请</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索学生姓名或岗位..."
              className="w-full pl-10 pr-4 py-2.5 rounded-button border border-gray-200 focus:border-business-500 focus:ring-2 focus:ring-business-100 outline-none transition-all"
            />
          </div>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待审核' },
            { key: 'approved', label: '已录用' },
            { key: 'rejected', label: '已拒绝' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-button font-medium transition-all ${
                filter === tab.key
                  ? 'bg-business-500 text-white shadow-soft'
                  : 'bg-white text-gray-700 shadow-soft hover:shadow-card'
              }`}
            >
              {tab.label} ({statusCounts[tab.key as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">申请岗位：{app.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>报名时间：{app.appliedAt}</span>
                  </div>
                  {app.message && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
                      <p className="line-clamp-2">{app.message}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    {app.phone && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                    {app.wechat && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{app.wechat}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {getStatusLabel(app.status)}
                  </span>
                </div>
              </div>

              {app.status === 'pending' && (
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-button font-medium transition-colors"
                  >
                    录用
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-button font-medium transition-colors"
                  >
                    拒绝
                  </button>
                  <button className="px-4 py-2 text-business-600 hover:bg-business-50 rounded-button font-medium transition-colors">
                    查看详情
                  </button>
                </div>
              )}

              {app.status !== 'pending' && (
                <div className="pt-4 border-t border-gray-100">
                  <button className="text-sm text-business-600 hover:text-business-700 font-medium">
                    查看详情 →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">暂无报名记录</p>
            <p className="text-gray-400 text-sm">
              {filter === 'all' ? '还没有学生报名您的岗位' : `暂无${getStatusLabel(filter)}的报名`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
