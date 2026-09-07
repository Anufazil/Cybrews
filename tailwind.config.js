/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0E17",
        panel: "#131926",
        panel2: "#0E131E",
        line: "#232B3B",
        cyan: "#4CE0D2",
        amber: "#FFB454",
        red: "#FF6B6B",
        text: "#DCE3ED",
        muted: "#8A94A6",
        muted2: "#5A6478",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
