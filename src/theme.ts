export const colors = {
  bg: '#0F1020',
  bgElevated: '#1A1C3A',
  card: '#232651',
  primary: '#7C5CFF',
  primaryDark: '#5D3FD3',
  accent: '#FFB547',
  success: '#3DDC84',
  danger: '#FF5A6B',
  text: '#FFFFFF',
  textMuted: '#A9AED1',
  border: '#2F3366',
  gold: '#FFD23F',
  silver: '#C0C8D8',
  bronze: '#CD7F32',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '500' as const, color: colors.text },
  small: { fontSize: 13, fontWeight: '500' as const, color: colors.textMuted },
};
