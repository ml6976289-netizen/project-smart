import { Bell, CircleDot, Moon, SunMedium } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface NavbarProps {
  pageTitle: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Navbar({ pageTitle, isDarkMode, onToggleDarkMode, onLogout }: NavbarProps) {
  const { show: showToast } = useToast();

  const handleNotificationClick = () => {
    showToast('You have 3 new notifications', 'info');
  };

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] bg-white/90 p-5 shadow-panel backdrop-blur-xl dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Welcome back</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">{pageTitle}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNotificationClick}
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
        >
          {isDarkMode ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => {
            onLogout();
            showToast('You have been logged out.', 'info');
          }}
          className="inline-flex h-12 rounded-3xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
        >
          Logout
        </button>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200">
          <CircleDot className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
