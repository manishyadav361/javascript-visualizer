export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#F3F6FA",
          panel: "#FFFFFF",
          panelSoft: "#EEF3F8",
          border: "#D9E1EA",
          muted: "#64748B",
          text: "#1E293B",
          strong: "#0F172A",
          stack: "#2563EB",
          heap: "#7C3AED",
          micro: "#059669",
          macro: "#D97706",
          active: "#E3B341",
          code: "#F8FAFC"
        }
      },
      boxShadow: {
        glow: "0 10px 28px rgb(37 99 235 / 0.12)"
      }
    }
  },
  plugins: []
};
