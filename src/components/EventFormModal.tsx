import { useState } from 'react';
import { X } from 'lucide-react';
import { TimeEvent, EventType, eventTypeConfig, Weekday, weekdayLabels } from '../types/schedule';

interface EventFormModalProps {
  event?: TimeEvent; // 如果传入，则为编辑模式
  initialDate?: string; // 初始日期（添加单次事件时）
  initialWeekday?: Weekday; // 初始星期（添加重复事件时）
  onClose: () => void;
  onSubmit: (event: TimeEvent) => void;
  onDelete?: (eventId: string) => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  event,
  initialDate,
  initialWeekday,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const isEdit = !!event;

  const [formData, setFormData] = useState({
    name: event?.name || '',
    type: event?.type || ('course' as EventType),
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '11:00',
    isRecurring: event?.isRecurring ?? true,
    weekday: event?.weekday ?? initialWeekday ?? 1,
    date: event?.date || initialDate || '',
    note: event?.note || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入事件名称';
    }

    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间';
    }

    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = '结束时间必须晚于开始时间';
    }

    if (!formData.isRecurring && !formData.date) {
      newErrors.date = '请选择日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newEvent: TimeEvent = {
        id: event?.id || Date.now().toString(),
        name: formData.name,
        type: formData.type,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isRecurring: formData.isRecurring,
        weekday: formData.isRecurring ? formData.weekday : undefined,
        date: !formData.isRecurring ? formData.date : undefined,
        note: formData.note || undefined,
      };
      onSubmit(newEvent);
    }
  };

  const handleDelete = () => {
    if (event && onDelete && window.confirm('确定要删除这个事件吗？')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? '编辑事件' : '添加事件'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              事件名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-300' : ''}`}
              placeholder="如：高等数学"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">事件类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
              className="input-field"
            >
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">重复方式</label>
            <div className="flex gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.isRecurring}
                  onChange={() => setFormData({ ...formData, isRecurring: true })}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">每周重复</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!formData.isRecurring}
                  onChange={() => setFormData({ ...formData, isRecurring: false })}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">单次事件</span>
              </label>
            </div>
          </div>

          {formData.isRecurring ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">星期</label>
              <select
                value={formData.weekday}
                onChange={(e) => setFormData({ ...formData, weekday: Number(e.target.value) as Weekday })}
                className="input-field"
              >
                {weekdayLabels.map((label, index) => (
                  <option key={index} value={index}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`input-field ${errors.date ? 'border-red-300' : ''}`}
              />
              {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
            </div>
          )}

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
            <label className="block text-sm font-medium text-gray-700 mb-2">备注（选填）</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input-field resize-none"
              rows={2}
              placeholder="补充说明..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            {isEdit && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-button font-medium transition-colors"
              >
                删除
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-button text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {isEdit ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
