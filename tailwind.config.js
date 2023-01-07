/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'defaultLoader': {
          '0%': {
            transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(0deg) rotateY(0deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          },
          '50%': {
            transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(0deg) rotateY(180deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          }, 
          '100%': {
            transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotateX(180deg) rotateY(180deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          }
        },
        'widthChange': {
          '0%': {
            width: 0
          },
          '50%': {
            width: '100%',
          },
          '100%': {
            width: 0,
          }
        }
      },
      animation: {
        'defaultLoader': 'defaultLoader 1.5s ease-in-out infinite',
        'widthChange': 'widthChange 5s linear infinite'
      },
      backgroundImage: {
        'hero-pattern': `linear-gradient(
          rgba(216, 180, 254, 0.514), 
          rgba(0, 0, 0, 0.55),
          rgba(216, 180, 254, 0.314)), url(/hero.jpg)`,
        'hero-pattern-mobile': `linear-gradient(
          rgba(216, 180, 254, 0.514), 
          rgba(0, 0, 0, 0.95),
          rgba(216, 180, 254, 0.314)),
          url(/hero-mobile.jpg)
        `
      }
    },
  },
  plugins: []
}
/** @type {import('tailwindcss').Config} */