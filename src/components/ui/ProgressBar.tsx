interface ProgressBarProps {
  label: string;
  description: string;
  value: number;
}

export default function ProgressBar({ label, description, value }: ProgressBarProps) {
  return (
    <div className="space-y-3 rounded-3xl bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{label}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className="text-sm font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
