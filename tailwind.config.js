/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        textShine: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%': { backgroundPosition: '0% center' },
        },
      },
      animation: {
        textShine: 'textShine 3s linear infinite',
      },
      backgroundSize: {
        '200%': '200% auto',
      },
    },
  },
  plugins: [
    require('tailwindcss-motion'),
    require('tailwind-scrollbar')
  ],
};
