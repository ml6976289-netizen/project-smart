import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject: string; color: string }) => void;
  daySlot?: string;
}

const COLORS = [
  { name: 'Blue', value: '#0062ff' },
  { name: 'Orange', value: '#ff6b35' },
  { name: 'Teal', value: '#4ecdc4' },
  { name: 'Purple', value: '#a78bfa' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#10b981' },
];

export default function Modal({ isOpen, onClose, onSubmit, daySlot }: ModalProps) {
  const [subject, setSubject] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim()) return;
    onSubmit({ subject, color: selectedColor });
    setSubject('');
    setSelectedColor(COLORS[0].value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-8 shadow-2xl dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Schedule session</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {daySlot ? `Add session for ${daySlot}` : 'New study session'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-3xl p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject name
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Physics II"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Pick a color</p>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-11 rounded-full border-2 transition ${
                        selectedColor === color.value ? 'border-slate-900 shadow-lg dark:border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Add session
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
