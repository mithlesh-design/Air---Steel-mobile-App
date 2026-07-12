import { Platform } from 'react-native';

export const Colors = {
  dark: {
    bgBase: '#0A0A0A',
    bgCard: '#141414',
    bgElevated: '#1A1A1A',
    bgInput: '#141414',
    panel: '#0D0D0D',
    border: '#2A2A2A',
    borderSubtle: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#888888',
    textMuted: 'rgba(255,255,255,0.30)',
    textDim: 'rgba(255,255,255,0.20)',
    // Matches web theme.css: brand-orange resolves to WHITE in dark, orange only in light.
    brandOrange: '#FFFFFF',
    white: '#FFFFFF',
    black: '#0A0A0A',
  },
  light: {
    bgBase: '#EFEEEA',
    bgCard: '#FFFFFF',
    bgElevated: '#ECEAE6',
    bgInput: '#FFFFFF',
    panel: '#F2F1ED',
    border: '#E0DFDB',
    borderSubtle: '#ECEAE6',
    textPrimary: '#0F0F0F',
    textSecondary: '#686460',
    textMuted: 'rgba(0,0,0,0.35)',
    textDim: 'rgba(0,0,0,0.20)',
    brandOrange: '#C85A00',
    white: '#FFFFFF',
    black: '#0F0F0F',
  },
} as const;

// Web relies on many intermediate white-opacity classes (text-white/35, /50, /60…).
// These are the dark-mode values; on light backgrounds use Ink.
export const WhiteA = {
  6: 'rgba(255,255,255,0.06)',
  8: 'rgba(255,255,255,0.08)',
  10: 'rgba(255,255,255,0.10)',
  12: 'rgba(255,255,255,0.12)',
  15: 'rgba(255,255,255,0.15)',
  20: 'rgba(255,255,255,0.20)',
  25: 'rgba(255,255,255,0.25)',
  30: 'rgba(255,255,255,0.30)',
  35: 'rgba(255,255,255,0.35)',
  40: 'rgba(255,255,255,0.40)',
  50: 'rgba(255,255,255,0.50)',
  55: 'rgba(255,255,255,0.55)',
  60: 'rgba(255,255,255,0.60)',
  70: 'rgba(255,255,255,0.70)',
  80: 'rgba(255,255,255,0.80)',
} as const;

export const Fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemibold: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyLight: 'Inter_300Light',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
} as const;

export const Radius = {
  card: 24,
  cardLg: 28,
  button: 999,
  input: 16,
  tag: 999,
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  page: 24,
} as const;

export const Shadow = {
  card: Platform.select({
    android: { elevation: 8 },
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
  }),
  modal: Platform.select({
    android: { elevation: 24 },
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.7,
      shadowRadius: 32,
    },
  }),
} as const;

export const Animation = {
  spring: { damping: 26, stiffness: 300 },
  springFast: { damping: 28, stiffness: 400 },
  springSnappy: { damping: 24, stiffness: 280 },
  // Brand easing — cubic-bezier(0.22, 1, 0.36, 1). Use: Easing.bezier(...Animation.bezier)
  bezier: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: {
    fast: 200,
    normal: 350,
    slow: 600,
    luxury: 800,
  },
} as const;
