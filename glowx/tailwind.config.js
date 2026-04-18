/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#8B6914',
        },
        glowx: {
          black: '#050505',
          dark: '#0A0A0A',
          dark2: '#111111',
          dark3: '#1A1A1A',
          dark4: '#242424',
          white: '#F5F0E8',
          white2: '#D4C9B0',
          text: '#8A8070',
          green: '#4CC98A',
          red: '#C94C4C',
          blue: '#4C8AC9',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease both',
        'pulse-slow': 'pulse 2s infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #8B6914)',
        'hero-radial': 'radial-gradient(ellipse 60% 80% at 60% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
