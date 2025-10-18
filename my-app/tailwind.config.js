/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff007f',
        'neon-cyan': '#00ffc8',
        'dark-bg': '#0d011f',
        'darker-bg': '#070011',
      },
      fontFamily: {
        'sans': ['Roboto Mono', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
        'mono': ['VT323', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 4s infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 1s infinite',
        'pulse': 'pulse 2s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 72%, 100%': {
            opacity: '0.99',
            'text-shadow': '0 0 10px #00ffc8, 0 0 20px #00ffc8, 0 0 30px #00ffc8',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 71.999%': {
            opacity: '0.7',
            'text-shadow': 'none',
          },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': {
            'text-shadow': '0.05em 0 0 rgba(255, 0, 128, 0.75), -0.05em -0.025em 0 rgba(0, 255, 128, 0.75), -0.025em 0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '14%': {
            'text-shadow': '0.05em 0 0 rgba(255, 0, 128, 0.75), -0.05em -0.025em 0 rgba(0, 255, 128, 0.75), -0.025em 0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '15%': {
            'text-shadow': '-0.05em -0.025em 0 rgba(255, 0, 128, 0.75), 0.025em 0.025em 0 rgba(0, 255, 128, 0.75), -0.05em -0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '49%': {
            'text-shadow': '-0.05em -0.025em 0 rgba(255, 0, 128, 0.75), 0.025em 0.025em 0 rgba(0, 255, 128, 0.75), -0.05em -0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '50%': {
            'text-shadow': '0.025em 0.05em 0 rgba(255, 0, 128, 0.75), 0.05em 0 0 rgba(0, 255, 128, 0.75), 0 -0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '99%': {
            'text-shadow': '0.025em 0.05em 0 rgba(255, 0, 128, 0.75), 0.05em 0 0 rgba(0, 255, 128, 0.75), 0 -0.05em 0 rgba(0, 128, 255, 0.75)',
          },
          '100%': {
            'text-shadow': '-0.025em 0 0 rgba(255, 0, 128, 0.75), -0.025em -0.025em 0 rgba(0, 255, 128, 0.75), -0.025em -0.05em 0 rgba(0, 128, 255, 0.75)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
