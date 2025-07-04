/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#232A3C",
        medium: "#293245",

        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "oklch(0.708 0 0)",

        // Dark mode (flattened)
        "dark-background": "oklch(0.145 0 0)",
        "dark-foreground": "oklch(0.985 0 0)",
        "dark-primary": "oklch(0.922 0 0)",
        "dark-primary-foreground": "oklch(0.205 0 0)",
        "dark-secondary": "oklch(0.269 0 0)",
        "dark-secondary-foreground": "oklch(0.985 0 0)",
        "dark-muted": "oklch(0.269 0 0)",
        "dark-muted-foreground": "oklch(0.708 0 0)",
        "dark-accent": "oklch(0.371 0 0)",
        "dark-accent-foreground": "oklch(0.985 0 0)",
        "dark-destructive": "oklch(0.704 0.191 22.216)",
        "dark-border": "oklch(1 0 0 / 10%)",
        "dark-input": "oklch(1 0 0 / 15%)",
        "dark-ring": "oklch(0.556 0 0)",
      },
    },
  },
  plugins: [],
};
