import { useMemo, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import ScheduleGrid from '../components/ui/ScheduleGrid';
import NotificationPanel from '../components/ui/NotificationPanel';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../context/AppContext';

const notifications = [
  { title: 'Final Exam: Advanced Structural Theory in 2 days', type: 'exams', subtitle: 'Get final review ready and revise key formulas.', time: '2 mins ago' },
  { title: "Draft submission for 'Urban Planning Project' due tomorrow", type: 'deadlines', subtitle: 'Complete your sketch set and citation list.', time: '1 hour ago' },
  { title: 'Weekly review session starts at 6:00 PM', type: 'reminders', subtitle: 'Prepare summary notes and question bank.', time: '4 hours ago' },
  { title: 'Remember to stand up and stretch during long sessions', type: 'breaks', subtitle: 'A quick break improves focus and retention.', time: 'Yesterday' },
];

export default function Schedule() {
  const { sessions, addSession } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repeatWeekly, setRepeatWeekly] = useState(true);

  const activeSessionCount = useMemo(() => sessions.length, [sessions]);

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleAddSession = (data: { subject: string; color: string }) => {
    if (!selectedSlot) return;
    addSession({
      id: `${selectedSlot}-${data.subject}`,
      slot: selectedSlot,
      subject: data.subject,
      color: data.color,
      completed: false,
    });
    setSelectedSlot(null);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSession}
        daySlot={selectedSlot ?? undefined}
      />
      <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Academic Calendar</p>
            <h3 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Weekly Schedule</h3>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">GMT +2</div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">This week</p>
                <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{activeSessionCount} sessions scheduled</p>
              </div>
              <button
                type="button"
                onClick={() => setRepeatWeekly((prev: boolean) => !prev)}
                className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold transition ${
                  repeatWeekly
                    ? 'bg-primary text-white shadow-soft'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {repeatWeekly && <Check className="h-4 w-4" />}
                Weekly Repeat
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Click any slot to add a study session and choose a subject color.</p>
          </div>
          <ScheduleGrid sessions={sessions} onSlotClick={handleSlotClick} />
        </div>
      </div>

      <div className="space-y-6">
        <NotificationPanel notifications={notifications} />
        <div className="rounded-[2rem] bg-white p-6 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quick tips</p>
              <h4 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">Plan your best week</h4>
            </div>
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>Schedule longer blocks for complex subjects like architecture and physics.</li>
            <li>Use color-coded sessions to spot priorities quickly.</li>
            <li>Repeat high-impact slots weekly for steady progress.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
