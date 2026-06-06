import { FormEvent, useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useAppContext();
  const { show: showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const success = await login(email, password);
    if (success) {
      showToast('Welcome back! You are now logged in.', 'success');
      return;
    }

    setIsSubmitting(false);
    showToast('Invalid email or password. Try again.', 'error');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,98,255,0.14),_transparent_30%),#f3f8ff] px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow-2xl dark:bg-slate-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-soft">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Log in to access your Engineering study dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-semibold text-slate-950 dark:text-white">First time here?</p>
          <p className="mt-2">Enter an email and password to create a local account. Your login is saved in the browser.</p>
        </div>
      </div>
    </div>
  );
}
