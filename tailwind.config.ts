import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
				],
			},
			colors: {
				border: {
					DEFAULT: 'hsl(var(--border))',
					subtle: 'hsl(var(--border-subtle))',
				},
				input: {
					DEFAULT: 'hsl(var(--input))',
					border: 'hsl(var(--input-border))',
					focus: 'hsl(var(--input-focus))',
				},
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					elevated: 'hsl(var(--background-elevated))',
					glass: 'hsl(var(--background-glass))',
				},
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))',
					active: 'hsl(var(--primary-active))',
					subtle: 'hsl(var(--primary-subtle))',
					glow: 'hsl(var(--primary-glow))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))',
					active: 'hsl(var(--secondary-active))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
					subtle: 'hsl(var(--muted-subtle))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					hover: 'hsl(var(--accent-hover))',
					active: 'hsl(var(--accent-active))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					elevated: 'hsl(var(--card-elevated))',
					glass: 'hsl(var(--card-glass))',
					border: 'hsl(var(--card-border))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					tertiary: 'hsl(var(--text-tertiary))',
					quaternary: 'hsl(var(--text-quaternary))',
					subtle: 'hsl(var(--text-subtle))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				'2xl': 'calc(var(--radius-xl) + 4px)',
				xl: 'var(--radius-xl)',
				lg: 'var(--radius-lg)',
				md: 'var(--radius)',
				sm: 'calc(var(--radius) - 2px)',
				xs: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'15': '3.75rem',
				'18': '4.5rem',
				'22': '5.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			backdropBlur: {
				xs: '2px',
				'3xl': '64px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.96)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'accordion-up': 'accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-up': 'slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
			},
			boxShadow: {
				'subtle': '0 1px 2px -1px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.06)',
				'soft': '0 2px 4px -2px rgba(0, 0, 0, 0.06), 0 4px 8px -2px rgba(0, 0, 0, 0.08)',
				'medium': '0 4px 6px -2px rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.12)',
				'strong': '0 8px 12px -4px rgba(0, 0, 0, 0.12), 0 16px 32px -8px rgba(0, 0, 0, 0.16)',
				'glow': '0 0 0 1px hsl(var(--primary) / 0.1), 0 4px 12px -2px hsl(var(--primary) / 0.25), 0 8px 24px -4px hsl(var(--primary) / 0.15)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
