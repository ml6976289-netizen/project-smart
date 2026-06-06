import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useToast } from './Toast';

const initialSeconds = 25 * 60;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default function FocusTimer() {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Physics II');
  const [selectedAmbience, setSelectedAmbience] = useState('Quiet Rain');
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientControllerRef = useRef<{
    stop: () => void;
  } | null>(null);
  const toast = useToast();

  const ensureAudioContext = async () => {
    if (!audioContextRef.current) {
      const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtor) return null;
      audioContextRef.current = new AudioCtor();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const stopAmbientSound = () => {
    ambientControllerRef.current?.stop();
    ambientControllerRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setRemaining((current: number) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          if (isSoundEnabled) {
            playNotificationSound();
          }
          toast.show(`🎉 Focus session completed! Great work on ${selectedSubject}!`, 'success', 5000);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, isSoundEnabled, selectedSubject, toast]);

  useEffect(() => {
    if (!isSoundEnabled) {
      stopAmbientSound();
      return;
    }

    let cancelled = false;
    const startAmbient = async () => {
      const controller = await createAmbientSound(selectedAmbience);
      if (!cancelled) {
        ambientControllerRef.current = controller;
      } else {
        controller.stop();
      }
    };

    startAmbient();

    return () => {
      cancelled = true;
      stopAmbientSound();
    };
  }, [selectedAmbience, isSoundEnabled]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  const playNotificationSound = async () => {
    try {
      const audioContext = await ensureAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = 880;
      gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch {
      // ignore audio errors in unsupported browsers
    }
  };

  const createAmbientSound = async (type: string) => {
    try {
      const audioContext = await ensureAudioContext();
      if (!audioContext) {
        return { stop: () => {} };
      }

      const masterGain = audioContext.createGain();
      const noiseGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
      masterGain.connect(audioContext.destination);
      noiseGain.connect(masterGain);

      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i += 1) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = audioContext.createBiquadFilter();

      let toneOscillator: OscillatorNode | null = null;
      let toneGain: GainNode | null = null;
      let targetGain = 0.03;

      switch (type) {
        case 'Waves':
          filter.type = 'lowpass';
          filter.frequency.value = 900;
          filter.Q.value = 0.7;
          targetGain = 0.03;
          break;
        case 'Forest':
          filter.type = 'bandpass';
          filter.frequency.value = 650;
          filter.Q.value = 1.2;
          targetGain = 0.025;
          toneOscillator = audioContext.createOscillator();
          toneGain = audioContext.createGain();
          toneOscillator.type = 'sine';
          toneOscillator.frequency.value = 320;
          toneGain.gain.value = 0.01;
          toneOscillator.connect(toneGain);
          toneGain.connect(masterGain);
          break;
        case 'Fireplace':
          filter.type = 'lowpass';
          filter.frequency.value = 420;
          filter.Q.value = 0.9;
          targetGain = 0.02;
          toneOscillator = audioContext.createOscillator();
          toneGain = audioContext.createGain();
          toneOscillator.type = 'triangle';
          toneOscillator.frequency.value = 90;
          toneGain.gain.value = 0.015;
          toneOscillator.connect(toneGain);
          toneGain.connect(masterGain);
          break;
        default:
          filter.type = 'highpass';
          filter.frequency.value = 1200;
          filter.Q.value = 0.8;
          targetGain = 0.035;
          break;
      }

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseSource.start();
      toneOscillator?.start();

      masterGain.gain.linearRampToValueAtTime(targetGain, audioContext.currentTime + 1.2);

      return {
        stop: () => {
          masterGain.gain.cancelScheduledValues(audioContext.currentTime);
          masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1);
          noiseSource.stop(audioContext.currentTime + 0.1);
          toneOscillator?.stop(audioContext.currentTime + 0.1);
          noiseSource.disconnect();
          filter.disconnect();
          noiseGain.disconnect();
          masterGain.disconnect();
          toneOscillator?.disconnect();
          toneGain?.disconnect();
        },
      };
    } catch {
      return { stop: () => {} };
    }
  };

  const progress = useMemo(() => 100 - (remaining / initialSeconds) * 100, [remaining]);

  const handleReset = () => {
    setRemaining(initialSeconds);
    setIsRunning(false);
  };

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-panel dark:bg-slate-800">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Current Phase: Deep Focus</span>
          <motion.div
            className="mx-auto my-8 flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white shadow-soft dark:bg-slate-800"
            animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
            transition={isRunning ? { duration: 2, repeat: Infinity } : {}}
          >
            <svg viewBox="0 0 220 220" className="h-[220px] w-[220px]">
              <circle cx="110" cy="110" r="96" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="16" fill="none" />
              <motion.circle
                cx="110"
                cy="110"
                r="96"
                className="stroke-primary"
                strokeWidth="16"
                strokeDasharray={Math.PI * 2 * 96}
                strokeDashoffset={Math.PI * 2 * 96 * (1 - progress / 100)}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 110 110)"
              />
            </svg>
            <motion.div
              className="absolute text-5xl font-semibold text-slate-950 dark:text-white"
              animate={remaining < 60 && isRunning ? { scale: [1, 1.05, 1] } : {}}
              transition={remaining < 60 && isRunning ? { duration: 0.5, repeat: Infinity } : {}}
            >
              {formatTime(remaining)}
            </motion.div>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsRunning((value: boolean) => !value)}
              className="inline-flex items-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`inline-flex items-center gap-2 rounded-3xl border px-5 py-3 text-sm font-semibold transition ${
                isSoundEnabled
                  ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="space-y-5 rounded-[2rem] bg-white p-6 shadow-panel dark:bg-slate-800"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-4 rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-950 dark:text-white">{selectedSubject}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Chapter 4: Gothic Architecture</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Review
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Solve questions
              </li>
            </ul>
            <select
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option>Physics II</option>
              <option>Architecture</option>
              <option>Materials Science</option>
              <option>Digital Drafting</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5 dark:border-slate-600">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Focus ambience</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Quiet Rain', 'Waves', 'Forest', 'Fireplace'].map((label) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setSelectedAmbience(label);
                    setIsSoundEnabled(true);
                  }}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    selectedAmbience === label
                      ? 'border-primary bg-primary/10 text-primary dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-200'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 text-center dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Completed sessions</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">3 / 4</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Study time today</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">2h 45m</p>
            </div>
          </div>
          <p className="text-sm italic text-slate-500 dark:text-slate-400">"Architecture is the art of balancing space and mass, just as the mind balances work and rest."</p>
        </motion.div>
      </div>
    </div>
  );
}
