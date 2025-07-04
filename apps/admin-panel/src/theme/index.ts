import { createTheme, ThemeOptions } from '@mui/material/styles'

// Colores oficiales de De Compas
const colors = {
  primary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#FFCF06', // Color principal amarillo
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#2C2C2C', // Gris oscuro oficial
    900: '#18181b',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#E0E0E0', // Gris claro oficial
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  black: '#000000', // Negro oficial
  white: '#ffffff',
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  // Colores específicos para dark mode
  dark: {
    bg: {
      primary: '#0f0f0f',
      secondary: '#1a1a1a',
      card: '#262626',
      hover: '#333333',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d4d4d8',
      muted: '#a1a1aa',
    },
    border: {
      primary: '#404040',
      secondary: '#2a2a2a',
    }
  }
}

export const createCustomTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light'
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.primary[500], // Amarillo principal - se mantiene igual
        light: colors.primary[100],
        dark: colors.primary[700],
        contrastText: colors.black,
      },
      secondary: {
        main: isLight ? colors.gray[800] : colors.gray[300], // Gris - se invierte
        light: isLight ? colors.gray[200] : colors.gray[600],
        dark: isLight ? colors.black : colors.gray[100],
        contrastText: isLight ? colors.white : colors.black,
      },
      error: {
        main: colors.error[500],
        light: colors.error[100],
        dark: colors.error[700],
      },
      warning: {
        main: colors.warning[500],
        light: colors.warning[100],
        dark: colors.warning[700],
      },
      success: {
        main: colors.success[500],
        light: colors.success[100],
        dark: colors.success[700],
      },
      grey: colors.gray,
      background: {
        default: isLight ? colors.neutral[50] : colors.dark.bg.primary,
        paper: isLight ? colors.white : colors.dark.bg.card,
      },
      text: {
        primary: isLight ? colors.black : colors.dark.text.primary,
        secondary: isLight ? colors.gray[800] : colors.dark.text.secondary,
        disabled: isLight ? colors.gray[400] : colors.dark.text.muted,
      },
      divider: isLight ? colors.neutral[200] : colors.dark.border.secondary,
      action: {
        hover: isLight ? colors.neutral[100] : colors.dark.bg.hover,
        selected: isLight ? colors.primary[50] : colors.dark.bg.hover,
        disabled: isLight ? colors.gray[300] : colors.gray[600],
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      h2: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        color: isLight ? colors.black : colors.dark.text.primary,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: isLight ? colors.gray[700] : colors.dark.text.secondary,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      isLight ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      isLight ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
      isLight ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      isLight ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      isLight ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      isLight ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            boxShadow: isLight ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : '0 1px 2px 0 rgb(0 0 0 / 0.3)',
            '&:hover': {
              boxShadow: isLight ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
            },
          },
          containedPrimary: {
            backgroundColor: colors.primary[500],
            color: colors.black,
            '&:hover': {
              backgroundColor: colors.primary[600],
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isLight ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
            borderRadius: 8,
            border: `1px solid ${isLight ? colors.neutral[200] : colors.dark.border.secondary}`,
            backgroundColor: isLight ? colors.white : colors.dark.bg.card,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: isLight ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
            backgroundColor: isLight ? colors.white : colors.dark.bg.card,
            border: `1px solid ${isLight ? colors.neutral[200] : colors.dark.border.secondary}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? colors.white : colors.dark.bg.card,
            color: isLight ? colors.black : colors.dark.text.primary,
            border: `1px solid ${isLight ? colors.neutral[200] : colors.dark.border.secondary}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? colors.neutral[300] : colors.dark.text.secondary,
            opacity: 1,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isLight ? colors.white : colors.dark.bg.card,
              '& fieldset': {
                borderColor: isLight ? colors.neutral[200] : colors.dark.border.primary,
              },
              '&:hover fieldset': {
                borderColor: isLight ? colors.gray[400] : colors.gray[500],
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary[500],
              },
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${isLight ? colors.neutral[200] : colors.dark.border.secondary}`,
            backgroundColor: isLight ? colors.white : colors.dark.bg.card,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              backgroundColor: isLight ? colors.neutral[50] : colors.dark.bg.secondary,
              fontWeight: 600,
              color: isLight ? colors.black : colors.dark.text.primary,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? colors.neutral[200] : colors.dark.border.secondary}`,
            color: isLight ? colors.black : colors.dark.text.primary,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? colors.white : colors.dark.bg.card,
            color: isLight ? colors.black : colors.dark.text.primary,
            boxShadow: isLight ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
          },
        },
      },
    },
  }

  return createTheme(themeOptions)
}

// Mantener compatibilidad con el tema anterior
export const theme = createCustomTheme('light') 