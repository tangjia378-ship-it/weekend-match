import { useState } from 'react';
import { X } from 'lucide-react';
import { JobCategory } from '../types';

interface PublishJobFormProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: JobCategory;
    salaryMin: number;
    salaryMax: number;
    salaryUnit: 'hour' | 'day' | 'task';
    workDate: string;
    startTime: string;
    endTime: string;
    location: string;
    recruitCount: number;
    description: string;
  }) => void;
}

export const PublishJobForm: React.FC<PublishJobFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'catering' as JobCategory,
    salaryMin: '',
    salaryMax: '',
    salaryUnit: 'hour' as 'hour' | 'day' | 'task',
    workDate: '',
    startTime: '',
    endTime: '',
    location: '',
    recruitCount: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = '请输入岗位名称';
    if (!formData.salaryMin) newErrors.salaryMin = '请输入最低薪资';
    if (!formData.salaryMax) newErrors.salaryMax = '请输入最高薪资';
    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      newErrors.salaryMax = '最高薪资不能低于最低薪资';
    }
    if (!formData.workDate) newErrors.workDate = '请选择工作日期';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.endTime) newErrors.endTime = '请选择结束时间';
    if (!formData.location.trim()) newErrors.location = '请输入工作地点';
    if (!formData.recruitCount) newErrors.recruitCount = '请输入招聘人数';
    if (!formData.description.trim()) newErrors.description = '请输入工作描述';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: formData.title,
        category: formData.category,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        salaryUnit: formData.salaryUnit,
        workDate: formData.workDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        recruitCount: Number(formData.recruitCount),
        description: formData.description,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">发布新岗位</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              岗位名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`input-field ${errors.title ? 'border-red-300' : ''}`}
              placeholder="如：周末咖啡师"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">岗位类别</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
              className="input-field"
            >
              <option value="catering">餐饮服务</option>
              <option value="retail">零售导购</option>
              <option value="education">教育培训</option>
              <option value="promotion">促销推广</option>
              <option value="delivery">配送跑腿</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低薪资 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                className={`input-field ${errors.salaryMin ? 'border-red-300' : ''}`}
                placeholder="20"
              />
              {errors.salaryMin && <p className="text-sm text-red-600 mt-1">{errors.salaryMin}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最高薪资 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                className={`input-field ${errors.salaryMax ? 'border-red-300' : ''}`}
                placeholder="30"
              />
              {errors.salaryMax && <p className="text-sm text-red-600 mt-1">{errors.salaryMax}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">单位</label>
              <select
                value={formData.salaryUnit}
                onChange={(e) => setFormData({ ...formData, salaryUnit: e.target.value as any })}
                className="input-field"
              >
                <option value="hour">元/小时</option>
                <option value="day">元/天</option>
                <option value="task">元/单</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工作日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.workDate}
              onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
              className={`input-field ${errors.workDate ? 'border-red-300' : ''}`}
            />
            {errors.workDate && <p className="text-sm text-red-600 mt-1">{errors.workDate}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={`input-field ${errors.startTime ? 'border-red-300' : ''}`}
              />
              {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                结束时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={`input-field ${errors.endTime ? 'border-red-300' : ''}`}
              />
              {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工作地点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`input-field ${errors.location ? 'border-red-300' : ''}`}
              placeholder="如：东校区商业街"
            />
            {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              招聘人数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.recruitCount}
              onChange={(e) => setFormData({ ...formData, recruitCount: e.target.value })}
              className={`input-field ${errors.recruitCount ? 'border-red-300' : ''}`}
              placeholder="3"
            />
            {errors.recruitCount && <p className="text-sm text-red-600 mt-1">{errors.recruitCount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工作描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`input-field resize-none ${errors.description ? 'border-red-300' : ''}`}
              rows={4}
              placeholder="详细描述工作内容、要求等..."
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-button text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button type="submit" className="flex-1 btn-primary">
              发布岗位
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
