export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#f6f8fa",
          card: "#ffffff",
          border: "#e2e5e9",
          text: "#1b1f24",
          subt: "#5b6168",
        },
        primary: {
          100: "#dff5ff",
          300: "#7dd3fc",
          500: "#0ea5e9",
          hover: "#0284c7",
        },
      },
    },
  },
  plugins: [],
};
