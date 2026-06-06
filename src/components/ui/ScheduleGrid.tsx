import { useMemo } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'];

interface ScheduleEntry {
  slot: string;
  subject: string;
  color: string;
}

interface ScheduleGridProps {
  sessions: ScheduleEntry[];
  onSlotClick: (slot: string) => void;
}

export default function ScheduleGrid({ sessions, onSlotClick }: ScheduleGridProps) {
  const headers = useMemo(
    () => [
      <div key="time-label" className="px-4 text-sm font-semibold text-slate-500 dark:text-slate-400" />,
      ...days.map((day) => (
        <div key={day} className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
          {day}
        </div>
      )),
    ],
    [],
  );

  return (
    <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-panel dark:border-slate-700 dark:bg-slate-950">
      <div className="min-w-[900px] p-6">
        {/* Grid: first column for times, then one column per day */}
        <div className="grid grid-cols-[160px_repeat(7,minmax(0,1fr))] gap-4">
          {/* Headers */}
          {headers}

          {/* Rows: each time creates a row across all columns */}
          {times.map((time) => (
            <>
              {/* Time column */}
              <div key={`time-${time}`} className="flex items-center rounded-2xl bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {time}
              </div>

              {/* Day slots */}
              {days.map((day) => {
                const slot = `${day}-${time}`;
                const session = sessions.find((entry) => entry.slot === slot);
                return (
                  <div key={slot} className="flex items-start">
                    <button
                      type="button"
                      onClick={() => onSlotClick(slot)}
                      className={`w-full flex flex-col items-start justify-center gap-1 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                        session
                          ? 'text-white shadow-soft'
                          : 'border border-dashed border-slate-200 bg-slate-50 text-slate-600 hover:border-solid hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      style={session ? { backgroundColor: session.color } : undefined}
                    >
                      {session ? (
                        <span className="truncate font-semibold">{session.subject}</span>
                      ) : (
                        <span className="opacity-70">+ Add</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
