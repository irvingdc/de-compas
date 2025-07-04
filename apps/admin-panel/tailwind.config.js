/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita dark mode usando la clase 'dark'
  theme: {
    extend: {
      colors: {
        // Colores oficiales de De Compas
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
        secondary: {
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
        // Mantener compatibilidad con colores existentes
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Colores oficiales específicos con soporte para dark mode
        brand: {
          yellow: '#FFCF06',
          black: '#000000',
          white: '#FFFFFF',
          'gray-dark': '#2C2C2C',
          'gray-light': '#E0E0E0',
        },
        // Colores para dark mode
        dark: {
          bg: {
            primary: '#0f0f0f',    // Fondo principal oscuro
            secondary: '#1a1a1a',  // Fondo secundario
            card: '#262626',       // Fondo de tarjetas
            hover: '#333333',      // Estados hover
          },
          text: {
            primary: '#ffffff',    // Texto principal en dark
            secondary: '#d4d4d8',  // Texto secundario
            muted: '#a1a1aa',      // Texto deshabilitado
          },
          border: {
            primary: '#404040',    // Bordes principales
            secondary: '#2a2a2a',  // Bordes secundarios
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} 