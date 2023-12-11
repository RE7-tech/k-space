const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'foreground': 'rgba(0, 25, 108, 1)',
        'primary': 'rgba(222, 46, 88, 1)',
        'secondary': 'rgba(255, 255, 255, 1)',
        'success-dark': 'rgba(144, 200, 117, 1)',
        'blue-default': 'rgba(0, 25, 108, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'sans': ['Figtree', 'sans-serif', ...defaultTheme.fontFamily.sans],
        'figtree': ['Figtree', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.8125rem',
      },
      letterSpacing: {
        normal: '0.025em',
      },
      boxShadow: {
        'opaque': '0px 6px 0px 0px #EAEAEA'
      }
    },
  },
  plugins: [],
}
