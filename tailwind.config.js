/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chiya: {
          orange: 'var(--color-orange)', // primary
          pink: 'var(--color-pink)',   // accent
          yellow: 'var(--color-yellow)', // accent
          teal: 'var(--color-teal)',   // supporting
          ink: 'var(--color-ink)',    // text
          cream: 'var(--color-cream)',  // background
        },
        // Backwards compatibility/standard aliases
        primary: {
          50: '#FFF6ED',
          100: '#FFEAD4',
          500: '#F2622E',
          600: '#D54D1B',
          700: '#B83B10',
          800: '#942E0C',
          900: '#2B2118',
        },
        secondary: {
          500: '#E8437B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'], // Redirect serif to display for consistent branding
      },
      borderRadius: {
        'card-sm': '16px',
        'card-lg': '24px',
      },
      boxShadow: {
        'pop': '4px 4px 0px 0px #2B2118',
        'pop-hover': '2px 2px 0px 0px #2B2118',
        'pop-pink': '4px 4px 0px 0px #E8437B',
        'pop-orange': '4px 4px 0px 0px #F2622E',
      }
    },
  },
  plugins: [],
}
