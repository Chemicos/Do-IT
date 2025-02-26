/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        'doit-green': '#50AA02'
      },
      backgroundColor: {
        'doit-darkgray': '#292929',
        'doit-graybtn': '#323232',
        'doit-green': '#50AA02'
      },
      borderColor: {
        'doit-grayborder': '#4D4D4D',
        'doit-green': '#50AA02'
      },
      ringColor: {
        'doit-green': '#50AA02'
      }
    },
  },
  plugins: [],
}

