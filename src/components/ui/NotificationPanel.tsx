interface NotificationPanelProps {
  notifications: Array<{ title: string; type: string; subtitle: string; time: string }>;
}

const labelMap: Record<string, { label: string; color: string }> = {
  exams: { label: 'EXAMS', color: 'text-red-500 bg-red-100' },
  deadlines: { label: 'DEADLINES', color: 'text-amber-600 bg-amber-100' },
  reminders: { label: 'REMINDERS', color: 'text-sky-600 bg-sky-100' },
  breaks: { label: 'BREAKS', color: 'text-slate-600 bg-slate-100' },
};

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Notifications</p>
        </div>
        <button className="text-sm font-semibold text-primary">Mark all read</button>
      </div>
      <div className="mt-6 space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${labelMap[item.type].color}`}>
                {labelMap[item.type].label}
              </span>
              <span className="text-xs font-medium text-slate-500">{item.time}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.subtitle}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <button className="text-sm font-semibold text-primary">View all activity</button>
      </div>
    </div>
  );
}
