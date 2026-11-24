import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AvailableTimeSlot, Weekday, weekdayLabels } from '../types/schedule';

interface AvailableTimeSettingsProps {
  availableTime: AvailableTimeSlot[];
  onUpdate: (slots: AvailableTimeSlot[]) => void;
}

export const AvailableTimeSettings: React.FC<AvailableTimeSettingsProps> = ({
  availableTime,
  onUpdate,
}) => {
  const [editingSlot, setEditingSlot] = useState<{
    weekday: Weekday;
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleAddSlot = () => {
    if (!editingSlot) return;

    if (!editingSlot.startTime || !editingSlot.endTime) {
      alert('请选择时间');
      return;
    }

    if (editingSlot.startTime >= editingSlot.endTime) {
      alert('结束时间必须晚于开始时间');
      return;
    }

    const newSlot: AvailableTimeSlot = {
      id: Date.now().toString(),
      weekday: editingSlot.weekday,
      startTime: editingSlot.startTime,
      endTime: editingSlot.endTime,
    };

    onUpdate([...availableTime, newSlot]);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    onUpdate(availableTime.filter((slot) => slot.id !== id));
  };

  const groupedSlots = availableTime.reduce((acc, slot) => {
    if (!acc[slot.weekday]) {
      acc[slot.weekday] = [];
    }
    acc[slot.weekday].push(slot);
    return acc;
  }, {} as Record<number, AvailableTimeSlot[]>);

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">可兼职时间设置</h3>
        <p className="text-sm text-gray-600">
          设置您每周愿意工作的时间段，系统会自动扣除课程和活动占用的时间
        </p>
      </div>

      {/* Current Settings */}
      <div className="space-y-3 mb-6">
        {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
          const slots = groupedSlots[weekday] || [];
          return (
            <div key={weekday} className="flex items-start space-x-3">
              <div className="w-16 text-sm font-medium text-gray-700 pt-2">
                {weekdayLabels[weekday]}
              </div>
              <div className="flex-1">
                {slots.length > 0 ? (
                  <div className="space-y-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-green-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-green-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 py-2">未设置</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Slot */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">添加可兼职时间</h4>
        {editingSlot ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择星期</label>
              <select
                value={editingSlot.weekday}
                onChange={(e) =>
                  setEditingSlot({
                    ...editingSlot,
                    weekday: Number(e.target.value) as Weekday,
                  })
                }
                className="input-field"
              >
                {weekdayLabels.map((label, index) => (
                  <option key={index} value={index}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                <input
                  type="time"
                  value={editingSlot.startTime}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, startTime: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                <input
                  type="time"
                  value={editingSlot.endTime}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, endTime: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddSlot}
                className="flex-1 btn-primary text-sm py-2"
              >
                确认添加
              </button>
              <button
                onClick={() => setEditingSlot(null)}
                className="flex-1 btn-secondary text-sm py-2"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() =>
              setEditingSlot({ weekday: 1, startTime: '18:00', endTime: '22:00' })
            }
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加可兼职时间</span>
          </button>
        )}
      </div>
    </div>
  );
};
