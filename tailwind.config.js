/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arapey: ['Arapey', 'serif'],
        Poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#1E40AF', 
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

