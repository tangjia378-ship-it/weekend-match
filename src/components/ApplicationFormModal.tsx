import { useState } from 'react';
import { X } from 'lucide-react';
import { Job } from '../types';

interface ApplicationFormModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (data: { studentName: string; phone: string; message: string }) => void;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  job,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = '请输入姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系方式';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = '请输入正确的手机号码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">报名申请</h2>
            <p className="text-sm text-gray-600">{job.title} · {job.businessName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className={`input-field ${errors.studentName ? 'border-red-300' : ''}`}
              placeholder="请输入您的姓名"
            />
            {errors.studentName && (
              <p className="text-sm text-red-600 mt-1">{errors.studentName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系方式 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
              placeholder="请输入手机号码"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自我介绍（选填）
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="input-field resize-none"
              rows={4}
              placeholder="简单介绍一下自己，以及为什么适合这份工作..."
            />
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
              提交报名
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
