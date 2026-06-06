import React from 'react';

type PageType = 'dashboard' | 'schedule' | 'progress' | 'focus' | 'settings';

interface SidebarProps {
  activeItem: PageType;
  onSelect: (id: PageType) => void;
  navItems: Array<{ id: PageType; label: string; icon: React.ComponentType<{ className?: string }> }>;
}

export default function Sidebar({ activeItem, onSelect, navItems }: SidebarProps) {
  return (
    <aside className="sticky top-0 z-10 hidden h-screen w-full max-w-[320px] flex-none flex-col border-r border-slate-200 bg-white/90 px-5 py-8 shadow-soft backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 lg:flex">
      <div className="mb-12 flex items-center gap-3 rounded-3xl bg-slate-50 px-5 py-5 shadow-panel dark:bg-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200/30">
          A
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-950 dark:text-white">The Engineering</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Smart Study System</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group flex w-full items-center gap-3 rounded-3xl px-4 py-4 text-left text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm group-hover:bg-slate-50 ${isActive ? 'bg-white' : 'bg-white dark:bg-slate-800'}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-primary dark:text-blue-400'}`} />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-50 p-5 shadow-panel dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">Study companion</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Focus sessions, progress tracking and smart schedule in one place.</p>
      </div>
    </aside>
  );
}
