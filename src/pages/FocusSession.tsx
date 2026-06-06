import FocusTimer from '../components/ui/FocusTimer';

export default function FocusSession() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-panel">
        <h2 className="text-4xl font-semibold text-slate-950">Focus Session</h2>
        <p className="mt-3 text-slate-600">Start a deep study session, keep track of your progress, and stay in flow.</p>
      </div>
      <FocusTimer />
    </div>
  );
}
