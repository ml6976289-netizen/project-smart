import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid, Home, Settings2, Sparkles, Watch } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Progress from './pages/Progress';
import FocusSession from './pages/FocusSession';
import Settings from './pages/Settings';
import LoginPage from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastContainer } from './components/ui/Toast';


interface NavItem {
  id: 'dashboard' | 'schedule' | 'progress' | 'focus' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Grid },
  { id: 'progress', label: 'Progress', icon: Sparkles },
  { id: 'focus', label: 'Focus Mode', icon: Watch },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

function AppContent() {
  const [activePage, setActivePage] = useState<NavItem['id']>('dashboard');
  const { isDarkMode, toggleDarkMode, isAuthenticated, logout } = useAppContext();

  // Get the label of the current active page
  const pageTitle = useMemo(() => {
    const active = navItems.find((item) => item.id === activePage);
    return active ? active.label : 'Dashboard';
  }, [activePage]);

  /**
   * Dynamically render the correct component based on activePage state
   * This ensures seamless navigation between different views
   */
  const renderPage = () => {
    switch (activePage) {
      case 'schedule':
        return <Schedule />;
      case 'progress':
        return <Progress />;
      case 'focus':
        return <FocusSession />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onStartFocus={() => setActivePage('focus')} onViewDetails={() => setActivePage('progress')} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-white'
          : 'bg-[radial-gradient(circle_at_top,_rgba(0,98,255,0.12),_transparent_28%),radial-gradient(circle_at_50%_20%,_rgba(0,98,255,0.08),_transparent_25%),#f8fbff] text-slate-900'
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        {/* Sidebar Navigation - Pass setActivePage to handle navigation */}
        <Sidebar activeItem={activePage} navItems={navItems} onSelect={setActivePage} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          {/* Navbar with page title, notification handler, and dark mode toggle */}
          <Navbar pageTitle={pageTitle} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} onLogout={logout} />

          {/* Dynamic page content with smooth transitions */}
          <div className="mt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastContainer />
      <AppContent />
    </AppProvider>
  );
}
