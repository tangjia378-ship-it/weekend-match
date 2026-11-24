interface SalaryData {
  salary: {
    min: number;
    max: number;
    unit: 'hour' | 'day' | 'task';
  };
}

interface WorkTimeData {
  date: string;
  startTime: string;
  endTime: string;
}

export const formatSalary = (job: SalaryData): string => {
  const { min, max, unit } = job.salary;
  const unitLabel = unit === 'hour' ? '时' : unit === 'day' ? '天' : '单';

  if (min === max) {
    return `¥${min}/${unitLabel}`;
  }
  return `¥${min}-${max}/${unitLabel}`;
};

export const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const formatWorkTime = (workTime: WorkTimeData): string => {
  const date = new Date(workTime.date);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];

  return `${workTime.date.slice(5)} ${weekday} ${workTime.startTime}-${workTime.endTime}`;
};
