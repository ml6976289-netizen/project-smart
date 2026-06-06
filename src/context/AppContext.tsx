import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface StudySession {
  id: string;
  subject: string;
  slot: string;
  color: string;
  completed: boolean;
}

export interface ProgressData {
  subject: string;
  hours: number;
  sessions: number;
  color: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  timezone: string;
}

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;

  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Sessions
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  removeSession: (id: string) => void;

  // Progress
  progressData: ProgressData[];
  updateProgress: (subject: string, hoursStudied: number) => void;

  // Profile
  profile: ProfileData;
  updateProfile: (profile: ProfileData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('isAuthenticated');
    return saved ? JSON.parse(saved) : false;
  });

  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(() => {
    const saved = window.localStorage.getItem('authCredentials');
    return saved ? (JSON.parse(saved) as { email: string; password: string }) : null;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = window.localStorage.getItem('studySessions');
    return saved ? (JSON.parse(saved) as StudySession[]) : [];
  });

  const [progressData, setProgressData] = useState<ProgressData[]>(() => {
    const saved = window.localStorage.getItem('progressData');
    return saved
      ? (JSON.parse(saved) as ProgressData[])
      : [
          { subject: 'Physics II', hours: 12.5, sessions: 15, color: '#0062ff' },
          { subject: 'Architecture', hours: 8, sessions: 10, color: '#ff6b35' },
          { subject: 'Materials Science', hours: 6, sessions: 8, color: '#4ecdc4' },
        ];
  });

  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = window.localStorage.getItem('userProfile');
    return saved
      ? (JSON.parse(saved) as ProfileData)
      : {
          fullName: 'Abdbabli505',
          email: 'abdbabli505@gmail.com',
          timezone: '(UTC+03:00) Asia/Baghdad',
        };
  });

  useEffect(() => {
    window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (credentials) {
      window.localStorage.setItem('authCredentials', JSON.stringify(credentials));
    }
  }, [credentials]);

  useEffect(() => {
    window.localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    window.localStorage.setItem('progressData', JSON.stringify(progressData));
  }, [progressData]);

  useEffect(() => {
    window.localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const login = async (email: string, password: string) => {
    try {
      const API = (await import('../services/api')).default;

      const response = await API.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setIsAuthenticated(true);
      return true;

    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addSession = (session: StudySession) => {
    setSessions((prev) => {
      const existingIndex = prev.findIndex((item) => item.slot === session.slot);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = session;
        return next;
      }
      return [...prev, session];
    });
  };

  const removeSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const updateProgress = (subject: string, hoursStudied: number) => {
    setProgressData((prev) =>
      prev.map((prog) =>
        prog.subject === subject
          ? {
              ...prog,
              hours: prog.hours + hoursStudied,
              sessions: prog.sessions + 1,
            }
          : prog,
      ),
    );
  };

  const updateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    if (credentials) {
      setCredentials({
        ...credentials,
        email: newProfile.email.trim().toLowerCase(),
      });
    }
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!credentials) {
      return false;
    }

    if (credentials.password !== currentPassword) {
      return false;
    }

    const updatedPassword = newPassword.trim();
    if (!updatedPassword) {
      return false;
    }

    setCredentials({ ...credentials, password: updatedPassword });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isDarkMode,
        toggleDarkMode,
        sessions,
        addSession,
        removeSession,
        progressData,
        updateProgress,
        profile,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
