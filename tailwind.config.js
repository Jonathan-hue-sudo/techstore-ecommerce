/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tech: {
          dark:   "#0a0f1e",
          navy:   "#0d1b3e",
          blue:   "#0066ff",
          cyan:   "#00d4ff",
          accent: "#7c3aed",
        },
        primary: {
          50: "#eff6ff", 100: "#dbeafe",
          500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "tech-gradient": "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)",
        "blue-gradient": "linear-gradient(135deg, #0066ff, #0044cc)",
        "cyan-gradient": "linear-gradient(135deg, #00d4ff, #0066ff)",
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
