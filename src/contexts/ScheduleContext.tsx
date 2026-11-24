import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TimeEvent, AvailableTimeSlot } from '../types/schedule';
import { loadEvents, loadAvailableTime, saveEvents, saveAvailableTime } from '../utils/scheduleStorage';

interface ScheduleContextType {
  events: TimeEvent[];
  availableTime: AvailableTimeSlot[];
  updateEvents: (events: TimeEvent[]) => void;
  updateAvailableTime: (slots: AvailableTimeSlot[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<TimeEvent[]>([]);
  const [availableTime, setAvailableTime] = useState<AvailableTimeSlot[]>([]);

  useEffect(() => {
    setEvents(loadEvents());
    setAvailableTime(loadAvailableTime());
  }, []);

  const updateEvents = (newEvents: TimeEvent[]) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const updateAvailableTime = (newSlots: AvailableTimeSlot[]) => {
    setAvailableTime(newSlots);
    saveAvailableTime(newSlots);
  };

  return (
    <ScheduleContext.Provider
      value={{
        events,
        availableTime,
        updateEvents,
        updateAvailableTime,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within ScheduleProvider');
  }
  return context;
};
