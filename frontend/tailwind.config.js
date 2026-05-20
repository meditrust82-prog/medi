/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          cyan:     '#06B6D4',
          'cyan-d': '#0891B2',
          lime:     '#7CC62D',
          'lime-d': '#65A524',
          red:      '#E53E3E',
          'red-d':  '#C53030',
        },
        dark: {
          bg:      '#121212',
          surface: '#1E1E1E',
          card:    '#252525',
          border:  '#374151',
          muted:   '#9CA3AF',
        },
        primary: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        secondary: {
          50:  '#f7fee7',
          100: '#ecfccb',
          500: '#7CC62D',
          600: '#65A524',
          700: '#4d7c0f',
        },
        accent: {
          500: '#E53E3E',
          600: '#C53030',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6,182,212,0.35)',
        'lime-glow': '0 0 20px rgba(124,198,45,0.35)',
        'dark-card': '0 4px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
