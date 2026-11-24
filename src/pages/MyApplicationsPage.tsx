import { Clock, MapPin, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';

// 演示用的学生姓名（实际应该从登录状态获取）
const DEMO_STUDENT_NAME = '张小明';

export const MyApplicationsPage: React.FC = () => {
  const { applications, jobs } = useData();

  // 筛选当前学生的报名
  const myApplications = applications.filter((app) => app.studentName === DEMO_STUDENT_NAME);

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: '待审核',
      approved: '已录用',
      rejected: '未通过',
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

  return (
    <div className="min-h-screen bg-bg-soft py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">我的报名</h1>
          <p className="text-gray-600">
            共 {myApplications.length} 条报名记录
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">待审核</p>
            <p className="text-2xl font-bold text-orange-600">
              {myApplications.filter((a) => a.status === 'pending').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">已录用</p>
            <p className="text-2xl font-bold text-green-600">
              {myApplications.filter((a) => a.status === 'approved').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">未通过</p>
            <p className="text-2xl font-bold text-gray-600">
              {myApplications.filter((a) => a.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Applications List */}
        {myApplications.length > 0 ? (
          <div className="space-y-4">
            {myApplications
              .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
              .map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                if (!job) return null;

                return (
                  <div key={app.id} className="card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h3>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {getStatusLabel(app.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{job.businessName}</p>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {job.workTime.date} {job.workTime.startTime}-{job.workTime.endTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>报名时间：{app.appliedAt}</span>
                          </div>
                        </div>

                        {app.message && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">我的留言：{app.message}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {app.status === 'approved' && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-green-900">
                            🎉 恭喜！您已被录用，请联系商家确认上班时间
                          </p>
                          {app.phone && (
                            <p className="text-sm text-green-700 mt-1">联系方式：{app.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg mb-2">暂无报名记录</p>
            <p className="text-gray-400 text-sm">快去首页找找心仪的兼职吧</p>
          </div>
        )}
      </div>
    </div>
  );
};
