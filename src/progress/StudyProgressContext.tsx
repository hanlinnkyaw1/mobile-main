import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const STORAGE_KEY = 'jlpt-burmese-study-progress-v1';
export const DAILY_GOAL_MINUTES = 30;

export const STUDY_ROUTES = new Set([
  'Grammar',
  'KanjiDecks',
  'KanjiFlashcard',
  'Reading',
  'OldVocab',
  'KanjiGame',
]);

type DayRecord = { seconds: number };
type StoredProgress = { days: Record<string, DayRecord> };

type ProgressContextValue = {
  loaded: boolean;
  todaySeconds: number;
  todayMinutes: number;
  progressPercent: number;
  remainingMinutes: number;
  streakDays: number;
  weekMinutes: number[];
  startStudySession: (routeName: string) => void;
  stopStudySession: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function dayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function StudyProgressProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredProgress>({ days: {} });
  const [loaded, setLoaded] = useState(false);
  const [todaySeconds, setTodaySeconds] = useState(0);
  const activeRouteRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const secondsAtStartRef = useRef(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const storedRef = useRef(stored);

  useEffect(() => {
    storedRef.current = stored;
  }, [stored]);

  const save = useCallback(async (next: StoredProgress) => {
    storedRef.current = next;
    setStored(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const flushSession = useCallback(async () => {
    if (!startedAtRef.current || !activeRouteRef.current || appStateRef.current !== 'active') return;
    const elapsed = Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));
    const totalSeconds = secondsAtStartRef.current + elapsed;
    const key = dayKey();
    const current = storedRef.current.days[key]?.seconds ?? 0;
    const nextSeconds = Math.max(current, totalSeconds);
    const next: StoredProgress = {
      ...storedRef.current,
      days: { ...storedRef.current.days, [key]: { seconds: nextSeconds } },
    };
    setTodaySeconds(nextSeconds);
    await save(next);
  }, [save]);

  const stopStudySession = useCallback(() => {
    void flushSession();
    activeRouteRef.current = null;
    startedAtRef.current = null;
    secondsAtStartRef.current = 0;
  }, [flushSession]);

  const startStudySession = useCallback((routeName: string) => {
    if (!STUDY_ROUTES.has(routeName)) {
      stopStudySession();
      return;
    }
    if (activeRouteRef.current === routeName && startedAtRef.current) return;
    stopStudySession();
    const key = dayKey();
    activeRouteRef.current = routeName;
    secondsAtStartRef.current = storedRef.current.days[key]?.seconds ?? 0;
    startedAtRef.current = Date.now();
    setTodaySeconds(secondsAtStartRef.current);
  }, [stopStudySession]);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (cancelled) return;
        if (value) {
          try {
            const parsed = JSON.parse(value) as StoredProgress;
            const next = parsed?.days ? parsed : { days: {} };
            storedRef.current = next;
            setStored(next);
            setTodaySeconds(next.days[dayKey()]?.seconds ?? 0);
          } catch {
            setStored({ days: {} });
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeRouteRef.current && appStateRef.current === 'active') void flushSession();
    }, 15000);
    return () => clearInterval(timer);
  }, [flushSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appStateRef.current === 'active';
      appStateRef.current = nextState;
      if (wasActive && nextState !== 'active') {
        void flushSession();
        startedAtRef.current = null;
      } else if (!wasActive && nextState === 'active' && activeRouteRef.current) {
        const key = dayKey();
        secondsAtStartRef.current = storedRef.current.days[key]?.seconds ?? 0;
        startedAtRef.current = Date.now();
      }
    });
    return () => subscription.remove();
  }, [flushSession]);

  useEffect(() => () => { void flushSession(); }, [flushSession]);

  const todayMinutes = Math.floor(todaySeconds / 60);
  const progressPercent = Math.min(100, Math.round((todaySeconds / (DAILY_GOAL_MINUTES * 60)) * 100));
  const remainingMinutes = Math.max(0, DAILY_GOAL_MINUTES - todayMinutes);
  const weekMinutes = Array.from({ length: 7 }, (_, index) => {
    const seconds = stored.days[dayKey(addDays(new Date(), index - 6))]?.seconds ?? 0;
    return Math.floor(seconds / 60);
  });
  const streakDays = useMemo(() => {
    let streak = 0;
    for (let index = 0; index < 365; index += 1) {
      const seconds = stored.days[dayKey(addDays(new Date(), -index))]?.seconds ?? 0;
      if (seconds < 60) break;
      streak += 1;
    }
    return streak;
  }, [stored]);

  const value = useMemo(() => ({
    loaded,
    todaySeconds,
    todayMinutes,
    progressPercent,
    remainingMinutes,
    streakDays,
    weekMinutes,
    startStudySession,
    stopStudySession,
  }), [loaded, todaySeconds, todayMinutes, progressPercent, remainingMinutes, streakDays, weekMinutes, startStudySession, stopStudySession]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useStudyProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useStudyProgress must be used inside StudyProgressProvider');
  return context;
}
