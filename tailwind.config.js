/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "10xl": "3rem",
      },
      borderRadius: {
        "5xl": "3rem",
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
        // Add more custom values as needed
      },
      colors: {
        primary: {
          100: "#ededf7",
          200: "#cfc6f3",
          300: "#836cde",
          500: "#5F43D0",
        },
        secondary: {
          500: "#A695EA",
        },
        accent: {
          500: "#6D4FE3",
        },
        background: {
          500: "#F8F8FC",
          dark: "#111111",
        },
        light: {
          DEFAULT: '#ffffff',
        },
        button: {
          DEFAULT: '#5600E8',
          dark: '#985EFF',
          hover: '#6200EE',
          darkhover: '#BB86FC'
        },
        container: {
          DEFAULT: '#F3F4F6',
          dark: '#1d1d1d'
        },
        navbar: {
          DEFAULT: '#f8f8f8',
          dark: '#1f1f1f'
        },
      },
      boxShadow: {
        btn: "6px 6px 0px 0px rgba(0, 0, 0, 1)",
        banner: "25px 30px 0px 0px rgba(0, 0, 0, 1)",
        dahboard: "-4px -4px 48px 0px rgba(0, 0, 0, 0.25)",
        dahboardFront: "-4px -4px 13px 0px rgba(0, 0, 0, 0.25)"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
