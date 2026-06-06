import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const toastStore = {
  listeners: [] as Array<(toasts: Toast[]) => void>,
  toasts: [] as Toast[],
  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  },
  publish() {
    this.listeners.forEach((listener) => listener(this.toasts));
  },
  add(toast: Toast) {
    this.toasts = [...this.toasts, toast];
    this.publish();
  },
  remove(id: string) {
    this.toasts = this.toasts.filter((item) => item.id !== id);
    this.publish();
  },
};

export function useToast() {
  return {
    show: (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).slice(2, 10);
      toastStore.add({ id, message, type, duration });
      if (duration > 0) {
        window.setTimeout(() => toastStore.remove(id), duration);
      }
      return id;
    },
    remove: (id: string) => toastStore.remove(id),
  };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className={`flex items-center gap-3 rounded-3xl border px-4 py-4 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-200'
                : toast.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-900/20 dark:text-rose-200'
                : 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-900/20 dark:text-sky-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
