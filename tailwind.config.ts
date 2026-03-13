import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Aurora Color Palette
        aurora: {
          violet: "hsl(var(--aurora-violet))",
          purple: "hsl(var(--aurora-purple))",
          blue: "hsl(var(--aurora-blue))",
          cyan: "hsl(var(--aurora-cyan))",
          teal: "hsl(var(--aurora-teal))",
          green: "hsl(var(--aurora-green))",
          lime: "hsl(var(--aurora-lime))",
          gold: "hsl(var(--aurora-gold))",
          orange: "hsl(var(--aurora-orange))",
          rose: "hsl(var(--aurora-rose))",
          pink: "hsl(var(--aurora-pink))",
          magenta: "hsl(var(--aurora-magenta))",
        },
        // Status Colors
        status: {
          success: "hsl(var(--status-success))",
          warning: "hsl(var(--status-warning))",
          error: "hsl(var(--status-error))",
          info: "hsl(var(--status-info))",
          pending: "hsl(var(--status-pending))",
        },
        // Neon Colors
        neon: {
          violet: "hsl(var(--neon-violet))",
          cyan: "hsl(var(--neon-cyan))",
          green: "hsl(var(--neon-green))",
          orange: "hsl(var(--neon-orange))",
          red: "hsl(var(--neon-red))",
          purple: "hsl(var(--neon-purple))",
          blue: "hsl(var(--neon-blue))",
          teal: "hsl(var(--neon-teal))",
          pink: "hsl(var(--neon-pink))",
          gold: "hsl(var(--neon-gold))",
        },
        // Surface Colors
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
          elevated: "hsl(var(--surface-elevated))",
        },
        // Legacy compatibility
        sapphire: {
          DEFAULT: "hsl(var(--sapphire))",
          light: "hsl(var(--sapphire-light))",
        },
        graphite: {
          DEFAULT: "hsl(var(--graphite))",
          dark: "hsl(var(--graphite-dark))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        'glow-sm': '0 0 15px hsl(217 72% 36% / 0.25)',
        'glow-md': '0 0 30px hsl(217 72% 36% / 0.3)',
        'glow-lg': '0 0 50px hsl(217 72% 36% / 0.4)',
        'glow-cyan': '0 0 30px hsl(var(--aurora-cyan) / 0.4)',
        'glow-success': '0 0 30px hsl(var(--status-success) / 0.4)',
        'glow-warning': '0 0 30px hsl(var(--status-warning) / 0.4)',
        'glow-error': '0 0 30px hsl(var(--status-error) / 0.4)',
        'glow-red': '0 0 30px hsl(355 78% 55% / 0.35)',
        'card': '0 8px 32px hsl(222 55% 4% / 0.5)',
        'card-hover': '0 16px 48px hsl(222 55% 4% / 0.6)',
        'sv-royal': '0 4px 20px hsl(217 72% 36% / 0.3)',
        'sv-elevated': '0 8px 40px hsl(222 55% 4% / 0.6), inset 0 1px 0 hsl(217 72% 36% / 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%", filter: "hue-rotate(0deg)" },
          "50%": { backgroundPosition: "100% 50%", filter: "hue-rotate(30deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        aurora: "aurora 8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 5s ease infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-aurora": "var(--gradient-aurora)",
        "gradient-sunset": "var(--gradient-sunset)",
        "gradient-ocean": "var(--gradient-ocean)",
        "gradient-cosmic": "var(--gradient-cosmic)",
        "gradient-emerald": "var(--gradient-emerald)",
        "gradient-royal": "var(--gradient-royal)",
        "gradient-fire": "var(--gradient-fire)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
