interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  accent?: string;
}

export default function StatCard({ title, value, subtitle, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        {accent ? (
          <span className="rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">{accent}</span>
        ) : null}
      </div>
      {subtitle ? <p className="mt-4 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
