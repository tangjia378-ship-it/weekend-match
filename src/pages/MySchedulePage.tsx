import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { WeekCalendar } from '../components/WeekCalendar';
import { AvailableTimeSettings } from '../components/AvailableTimeSettings';
import { EventFormModal } from '../components/EventFormModal';
import { TimeEvent, AvailableTimeSlot, Weekday } from '../types/schedule';
import { loadEvents, saveEvents, loadAvailableTime, saveAvailableTime } from '../utils/scheduleStorage';
import { getWeekDates, getPreviousWeek, getNextWeek } from '../utils/scheduleUtils';
import { useToast } from '../contexts/ToastContext';

export const MySchedulePage: React.FC = () => {
  const [events, setEvents] = useState<TimeEvent[]>([]);
  const [availableTime, setAvailableTime] = useState<AvailableTimeSlot[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimeEvent | undefined>();
  const [initialDate, setInitialDate] = useState<string>('');
  const [initialWeekday, setInitialWeekday] = useState<Weekday>(1);
  const [activeTab, setActiveTab] = useState<'calendar' | 'settings'>('calendar');

  const { showToast } = useToast();

  // 初始化数据
  useEffect(() => {
    setEvents(loadEvents());
    setAvailableTime(loadAvailableTime());

    // 获取本周日期
    const dates = getWeekDates();
    setWeekDates(dates);
    setCurrentWeekStart(dates[0]);
  }, []);

  // 更新周历
  useEffect(() => {
    if (currentWeekStart) {
      const monday = new Date(currentWeekStart);
      const dates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      setWeekDates(dates);
    }
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(getNextWeek(currentWeekStart));
  };

  const handleToday = () => {
    const dates = getWeekDates();
    setCurrentWeekStart(dates[0]);
  };

  const handleAddEvent = (date: string, weekday: Weekday) => {
    setEditingEvent(undefined);
    setInitialDate(date);
    setInitialWeekday(weekday);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: TimeEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSubmitEvent = (event: TimeEvent) => {
    let newEvents: TimeEvent[];
    if (editingEvent) {
      newEvents = events.map((e) => (e.id === event.id ? event : e));
      showToast('事件已更新');
    } else {
      newEvents = [...events, event];
      showToast('事件已添加');
    }
    setEvents(newEvents);
    saveEvents(newEvents);
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleDeleteEvent = (eventId: string) => {
    const newEvents = events.filter((e) => e.id !== eventId);
    setEvents(newEvents);
    saveEvents(newEvents);
    showToast('事件已删除');
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleUpdateAvailableTime = (slots: AvailableTimeSlot[]) => {
    setAvailableTime(slots);
    saveAvailableTime(slots);
    showToast('可兼职时间已更新');
  };

  // 计算周范围显示
  const getWeekRangeDisplay = () => {
    if (weekDates.length === 0) return '';
    const start = new Date(weekDates[0]);
    const end = new Date(weekDates[6]);
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
  };

  return (
    <div className="min-h-screen bg-bg-soft py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">我的时间</h1>
          <p className="text-gray-600">管理您的课程、活动和可兼职时间</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-button font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            周历视图
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-button font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            可兼职时间
          </button>
        </div>

        {activeTab === 'calendar' && (
          <>
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-soft">
              <button
                onClick={handlePreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">
                  {getWeekRangeDisplay()}
                </span>
                <button
                  onClick={handleToday}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  <span>本周</span>
                </button>
              </div>

              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Week Calendar */}
            <WeekCalendar
              weekDates={weekDates}
              events={events}
              availableTimeSlots={availableTime}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
            />

            {/* Mobile Hint */}
            <div className="md:hidden mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 提示：在电脑上查看完整的周历视图效果更佳
              </p>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <AvailableTimeSettings
            availableTime={availableTime}
            onUpdate={handleUpdateAvailableTime}
          />
        )}

        {/* Event Form Modal */}
        {showEventForm && (
          <EventFormModal
            event={editingEvent}
            initialDate={initialDate}
            initialWeekday={initialWeekday}
            onClose={() => {
              setShowEventForm(false);
              setEditingEvent(undefined);
            }}
            onSubmit={handleSubmitEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
};
