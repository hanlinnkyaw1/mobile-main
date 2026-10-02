import { Platform, type ViewStyle } from 'react-native';

/** Core palette — slate neutrals + indigo primary */
export const colors = {
  bg: '#eef2f6',
  bgSubtle: '#e8edf4',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',

  ink: '#0f172a',
  text: '#0f172a',
  muted: '#64748b',
  subtle: '#94a3b8',

  border: '#e2e8f0',
  borderStrong: '#cbd5e1',

  /** Navigation header */
  headerBg: '#0f172a',
  onHeader: '#f8fafc',
  headerMuted: '#94a3b8',

  /** Brand */
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primaryLight: '#818cf8',
  accent: '#6366f1',
  onPrimary: '#ffffff',

  /** Semantic */
  success: '#059669',
  successBg: '#ecfdf5',
  danger: '#e11d48',
  dangerBg: '#fff1f2',
  warning: '#d97706',
  info: '#0284c7',
  link: '#2563eb',

  /** Legacy keys used across screens */
  card: '#ffffff',
  green: '#059669',
  blue: '#2563eb',
  yellow: '#d97706',
  pink: '#db2777',
  primaryDarkLegacy: '#4338ca',
};

/** JLPT level accents — consistent across grammar, reading, lists */
export const jlptLevel = {
  N5: '#10b981',
  N4: '#0ea5e9',
  N3: '#8b5cf6',
  N2: '#f97316',
  N1: '#e11d48',
} as const;

export function jlptLevelColor(level: string): string {
  const key = level as keyof typeof jlptLevel;
  return jlptLevel[key] ?? colors.muted;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  none: {},
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    android: { elevation: 6 },
    default: {},
  }),
};

export const type = {
  hero: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.3 },
  headline: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  overline: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
};
