import { JobCategory } from '../types';

export const categoryLabels: Record<JobCategory, string> = {
  catering: '餐饮服务',
  retail: '零售导购',
  education: '教育培训',
  promotion: '促销推广',
  delivery: '配送跑腿',
  other: '其他',
};

export const categoryColors: Record<JobCategory, string> = {
  catering: 'bg-orange-100 text-orange-700',
  retail: 'bg-pink-100 text-pink-700',
  education: 'bg-blue-100 text-blue-700',
  promotion: 'bg-purple-100 text-purple-700',
  delivery: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
};
