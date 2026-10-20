// Color Palette (WCAG AA compliant)
export const colors = {
  // Neutral
  white: '#ffffff',
  gray50: '#f5f5f7',
  gray100: '#efeff1',
  gray200: '#e5e5e7',
  gray300: '#d2d2d7',
  gray400: '#a1a1a6',
  gray500: '#86868b',
  gray600: '#6f6f77',
  gray700: '#51515a',
  gray800: '#424245',
  black: '#1d1d1f',

  // Primary
  blue: '#0071e3',
  blueLight: '#0077ed',
  blueDark: '#0056b3',

  // Semantic
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  info: '#30b0c0',
};

// Typography
export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  // Font sizes
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px

  // Font weights
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '6px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
  base: '0 4px 12px rgba(0, 0, 0, 0.08)',
  md: '0 10px 30px rgba(0, 0, 0, 0.12)',
  lg: '0 20px 40px rgba(0, 0, 0, 0.16)',
};

// Focus styles (WCAG accessible)
export const focusStyles = `
  outline: 2px solid #0071e3;
  outline-offset: 2px;
`;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
};
