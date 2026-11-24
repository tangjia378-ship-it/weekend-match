import { MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { Job } from '../types';
import { formatSalary, formatDistance, formatWorkTime } from '../utils/formatters';
import { categoryLabels, categoryColors } from '../utils/categoryConfig';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const matchScoreColor =
    job.matchScore && job.matchScore >= 85
      ? 'text-green-600 bg-green-50'
      : job.matchScore && job.matchScore >= 70
      ? 'text-blue-600 bg-blue-50'
      : 'text-gray-600 bg-gray-50';

  return (
    <div
      onClick={onClick}
      className="card p-5 cursor-pointer hover:scale-[1.02] transition-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                categoryColors[job.category]
              }`}
            >
              {categoryLabels[job.category]}
            </span>
          </div>
          <p className="text-sm text-gray-600">{job.businessName}</p>
        </div>
        {job.matchScore && (
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg ${matchScoreColor}`}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{job.matchScore}%</span>
          </div>
        )}
      </div>

      {/* Salary - Prominent */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-primary-600">{formatSalary(job)}</span>
      </div>

      {/* Info Grid */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>{job.location}</span>
          {job.distance && (
            <span className="ml-2 text-primary-600 font-medium">
              {formatDistance(job.distance)}
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>{formatWorkTime(job.workTime)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>
            招{job.recruitCount}人 · 已报名{job.appliedCount}人
          </span>
        </div>
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full btn-primary text-sm py-2.5">
          立即报名
        </button>
      </div>
    </div>
  );
};
