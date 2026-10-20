// Brand Theme - Consistent across all pages
export const theme = {
  // Primary Brand Colors (Blue-Teal Gradient)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',      // Primary Blue
    600: '#0284c7',      // Darker Blue
    700: '#0369a1',      // Dark Blue
    800: '#075985',
    900: '#0c3a66',
  },

  // Secondary Brand Colors (Teal)
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',      // Accent Teal
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
  },

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    accent: 'linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 100%)',
    warm: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    cool: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    mesh: 'linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 50%, #8b5cf6 100%)',
  },
};

export default theme;
