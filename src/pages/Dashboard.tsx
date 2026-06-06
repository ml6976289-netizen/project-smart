import { ArrowRight, PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';

const scheduleItems = [
  { title: 'Digital Drafting', time: '02:00 PM - 04:00 PM', tag: 'Project Work' },
  { title: 'Structural Mechanics', time: '09:00 AM - 10:30 AM', tag: '90 MIN' },
  { title: 'Architectural History', time: '11:00 AM - 12:30 PM', tag: 'Deep Reading' },
];

const exams = [
  { label: 'OCTOBER 28', countdown: '4 days left', title: 'Advanced Geometry & Calculus', subtitle: '10:00 AM' },
  { label: 'NOVEMBER 02', countdown: '9 days left', title: 'Materials Science Final', subtitle: 'Online Submission' },
];

interface DashboardProps {
  onStartFocus: () => void;
  onViewDetails: () => void;
}

export default function Dashboard({ onStartFocus, onViewDetails }: DashboardProps) {
  const { progressData } = useAppContext();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Hello, ABD! Ready for today’s session?</p>
            <p className="text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">Tuesday, October 24</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Today’s Study Schedule</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">3 focus blocks remaining for today</p>
            </div>
            <button
              type="button"
              onClick={onStartFocus}
              className="inline-flex items-center gap-2 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Start Focus Mode
              <PlayCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {scheduleItems.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:shadow-soft dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{item.time}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                      {item.tag}
                    </span>
                    <button
                      type="button"
                      onClick={onStartFocus}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white text-primary shadow-sm transition hover:scale-105 dark:bg-slate-900 dark:text-white"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Weekly progress</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Keep the momentum</h3>
            </div>
            <button
            type="button"
            onClick={onViewDetails}
            className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
              View details
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {progressData.map((item) => (
              <StatCard
                key={item.subject}
                title={item.subject}
                value={`${item.hours.toFixed(1)} hrs`}
                subtitle={`${item.sessions} sessions logged`}
                accent={`${Math.round((item.hours / 12) * 10)}% goal`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Campus alerts</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">You have 4 reminders today</h3>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {exams.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{item.countdown}</span>
                    <h4 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Daily focus boost</h3>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Use the quick action below to jump into a Pomodoro session.</p>
          <button
            type="button"
            onClick={onStartFocus}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Start 25m Focus
            <PlayCircle className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
