import { X, MapPin, Clock, Users, Briefcase, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Job } from '../types';
import { formatSalary, formatDistance, formatWorkTime } from '../utils/formatters';
import { categoryLabels } from '../utils/categoryConfig';
import { useSchedule } from '../contexts/ScheduleContext';
import { checkJobTimeMatch } from '../utils/scheduleUtils';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onApply }) => {
  const { events, availableTime } = useSchedule();
  const timeMatch = checkJobTimeMatch(job, events, availableTime);

  const getMatchIcon = () => {
    switch (timeMatch.status) {
      case 'matched':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'conflict':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'not_set':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMatchColor = () => {
    switch (timeMatch.status) {
      case 'matched':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'conflict':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'not_set':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
            <p className="text-gray-600">{job.businessName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Salary */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">薪资待遇</h3>
            <p className="text-3xl font-bold text-primary-600">{formatSalary(job)}</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-900">{job.location}</p>
                {job.distance && (
                  <p className="text-sm text-primary-600 mt-1">距离 {formatDistance(job.distance)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-gray-900">{formatWorkTime(job.workTime)}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-gray-900">
                招募 {job.recruitCount} 人，已报名 {job.appliedCount || 0} 人
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-gray-900">{categoryLabels[job.category]}</p>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">福利标签</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">工作内容</h3>
            <p className="text-gray-900 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">任职要求</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-900">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Match Score Note */}
          {job.matchScore && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">推荐匹配度：{job.matchScore}%</span>
                <span className="text-blue-700 ml-2">（演示数据，仅供参考）</span>
              </p>
            </div>
          )}

          {/* Time Match Status */}
          <div className={`border rounded-lg p-4 flex items-start space-x-3 ${getMatchColor()}`}>
            {getMatchIcon()}
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1">时间匹配情况</p>
              <p className="text-sm">{timeMatch.message}</p>
              {timeMatch.status === 'not_set' && (
                <p className="text-xs mt-2 opacity-80">
                  前往「我的时间」页面设置您的可兼职时间
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <button onClick={onApply} className="w-full btn-primary py-3">
            立即报名
          </button>
        </div>
      </div>
    </div>
  );
};
