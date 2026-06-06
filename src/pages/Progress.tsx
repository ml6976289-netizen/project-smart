import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import { useAppContext } from '../context/AppContext';

export default function Progress() {
  const { progressData } = useAppContext();
  const totalHours = progressData.reduce((sum, item) => sum + item.hours, 0);
  const totalSessions = progressData.reduce((sum, item) => sum + item.sessions, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
        <h2 className="text-4xl font-semibold text-slate-950 dark:text-white">Your Learning Progress</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Visualizing your academic journey and deep work cycles.</p>
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
        <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
          <div className="space-y-5">
            {progressData.map((subject) => (
              <ProgressBar
                key={subject.subject}
                label={subject.subject}
                description={`${subject.sessions} sessions logged`}
                value={Math.min(100, Math.round((subject.hours / 15) * 100))}
              />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <StatCard
            title="Total Study Hours"
            value={`${totalHours.toFixed(1)} hrs`}
            subtitle="You’ve maintained strong momentum across subjects."
            accent={`+${Math.round(totalHours / 12)}% weekly`}
          />
          <div className="rounded-[2rem] bg-white p-6 shadow-panel dark:bg-slate-900 dark:border dark:border-slate-700">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Subjects Completed</p>
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>{progressData.length}</span>
                <span>/ 8</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className={`h-3 flex-1 rounded-full ${index < progressData.length ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
