import { TimeEvent, eventTypeConfig, Weekday, weekdayLabelsShort } from '../types/schedule';
import { formatDateDisplay, isToday } from '../utils/scheduleUtils';

interface WeekCalendarProps {
  weekDates: string[]; // 本周7天的日期数组
  events: TimeEvent[];
  availableTimeSlots: Array<{ weekday: Weekday; startTime: string; endTime: string }>;
  onAddEvent: (date: string, weekday: Weekday) => void;
  onEditEvent: (event: TimeEvent) => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  weekDates,
  events,
  availableTimeSlots,
  onAddEvent,
  onEditEvent,
}) => {
  // 时间槽：从0点到24点，每2小时一格
  const timeSlots = Array.from({ length: 12 }, (_, i) => i * 2);

  const getEventsForDateAndSlot = (date: string, hour: number): TimeEvent[] => {
    const weekday = new Date(date).getDay() as Weekday;

    return events.filter((event) => {
      // 检查事件是否在这一天
      const isThisDay = event.isRecurring
        ? event.weekday === weekday
        : event.date === date;

      if (!isThisDay) return false;

      // 检查事件是否在这个时间槽内（2小时范围）
      const eventStart = parseInt(event.startTime.split(':')[0]);
      const eventEnd = parseInt(event.endTime.split(':')[0]) + (parseInt(event.endTime.split(':')[1]) > 0 ? 1 : 0);
      return eventStart < hour + 2 && eventEnd > hour;
    });
  };

  const isAvailableSlot = (weekday: Weekday, hour: number): boolean => {
    return availableTimeSlots.some((slot) => {
      const slotStart = parseInt(slot.startTime.split(':')[0]);
      const slotEnd = parseInt(slot.endTime.split(':')[0]);
      return slot.weekday === weekday && hour >= slotStart && hour < slotEnd;
    });
  };

  return (
    <div className="hidden md:block bg-white rounded-card shadow-card overflow-hidden">
      {/* Header - 星期标题 */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-3 bg-gray-50 border-r border-gray-200"></div>
        {weekDates.map((date) => {
          const weekday = new Date(date).getDay();
          const isTodayDate = isToday(date);
          return (
            <div
              key={date}
              className={`p-3 text-center border-r border-gray-200 ${
                isTodayDate ? 'bg-primary-50' : 'bg-gray-50'
              }`}
            >
              <div className={`text-xs font-medium ${isTodayDate ? 'text-primary-600' : 'text-gray-500'}`}>
                {weekdayLabelsShort[weekday]}
              </div>
              <div className={`text-sm font-semibold mt-1 ${isTodayDate ? 'text-primary-700' : 'text-gray-900'}`}>
                {formatDateDisplay(date)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {timeSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            {/* Time Label */}
            <div className="p-2 text-xs text-gray-500 border-r border-gray-200 flex items-center justify-center">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>

            {/* Day Cells */}
            {weekDates.map((date) => {
              const weekday = new Date(date).getDay() as Weekday;
              const dayEvents = getEventsForDateAndSlot(date, hour);
              const isAvailable = isAvailableSlot(weekday, hour);

              return (
                <div
                  key={date}
                  className={`min-h-[80px] p-1 border-r border-gray-200 cursor-pointer relative ${
                    isAvailable ? 'bg-green-50/30' : ''
                  }`}
                  onClick={() => dayEvents.length === 0 && onAddEvent(date, weekday)}
                >
                  {dayEvents.map((event) => {
                    const config = eventTypeConfig[event.type];
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                        className={`text-xs p-1.5 rounded mb-1 border cursor-pointer hover:shadow-md transition-shadow ${config.color}`}
                      >
                        <div className="font-medium truncate">{event.name}</div>
                        <div className="text-xs opacity-80">
                          {event.startTime}-{event.endTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span className="text-gray-600">可兼职时间</span>
        </div>
        {Object.entries(eventTypeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded border ${config.color.split(' ')[0]}`}></div>
            <span className="text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
