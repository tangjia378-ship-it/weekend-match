import { useState, useMemo } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { JobDetailModal } from '../components/JobDetailModal';
import { ApplicationFormModal } from '../components/ApplicationFormModal';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { JobCategory, UserRole, Job } from '../types';

interface HomePageProps {
  currentRole: UserRole;
}

// 演示用的学生姓名
const DEMO_STUDENT_NAME = '张小明';

export const HomePage: React.FC<HomePageProps> = ({ currentRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { jobs, addApplication, hasApplied } = useData();
  const { showToast } = useToast();

  // Filter jobs based on search and category
  const filteredJobs = useMemo(() => {
    let jobList = [...jobs];

    if (selectedCategory) {
      jobList = jobList.filter((job) => job.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      jobList = jobList.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.businessName.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    return jobList;
  }, [jobs, searchQuery, selectedCategory]);

  // Sort by match score
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      return scoreB - scoreA;
    });
  }, [filteredJobs]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyClick = () => {
    if (selectedJob && hasApplied(DEMO_STUDENT_NAME, selectedJob.id)) {
      showToast('您已经报名过该岗位了', 'warning');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = (data: { studentName: string; phone: string; message: string }) => {
    if (!selectedJob) return;

    const newApplication = {
      id: Date.now().toString(),
      studentName: data.studentName,
      jobTitle: selectedJob.title,
      jobId: selectedJob.id,
      appliedAt: new Date().toLocaleString('zh-CN'),
      status: 'pending' as const,
      phone: data.phone,
      message: data.message,
    };

    addApplication(newApplication);
    showToast('报名成功！请等待商家审核');
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft mb-4">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentRole === 'student' ? '找到最适合你的周末兼职' : '快速招募可靠的兼职学生'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {currentRole === 'student' ? '周末时光，高效变现' : '发布岗位，快速招人'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentRole === 'student'
                ? '根据你的时间、距离和期望薪资，智能匹配最合适的兼职机会'
                : '面向校园周边，快速找到靠谱的兼职学生，提升招聘效率'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={
                currentRole === 'student'
                  ? '搜索兼职岗位、商家名称...'
                  : '搜索已发布的岗位...'
              }
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-bold text-gray-900">
                {currentRole === 'student' ? '推荐岗位' : '我的岗位'}
              </h3>
              <span className="text-sm text-gray-500">
                共 {sortedJobs.length} 个岗位
              </span>
            </div>
          </div>

          {/* Jobs Grid */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">暂无符合条件的岗位</p>
              <p className="text-gray-400 text-sm mt-2">试试调整筛选条件或搜索关键词</p>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedJob && !showApplicationForm && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyClick}
        />
      )}

      {selectedJob && showApplicationForm && (
        <ApplicationFormModal
          job={selectedJob}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
};
