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
			screens: {
				'laptop': '900px',
			},
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'heading': ['"Red Hat Display"', 'sans-serif'],
        'brand': ['"Playfair Display"', 'serif'],
        'body': ['Outfit', 'sans-serif'],
      },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					muted: 'hsl(var(--primary-muted))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'good-text': 'hsl(var(--good-text))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'scroll-left': {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(-50%)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'logoFadeIn': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				// Performance-optimized floating animations using transform only
				'float-slow': {
					'0%, 100%': {
						transform: 'translate(0, 0)'
					},
					'50%': {
						transform: 'translate(10px, -20px)'
					}
				},
				'float-medium': {
					'0%, 100%': {
						transform: 'translate(-50%, -50%)'
					},
					'50%': {
						transform: 'translate(calc(-50% - 15px), calc(-50% + 15px))'
					}
				},
				'float-fast': {
					'0%, 100%': {
						transform: 'translate(0, 0)'
					},
					'50%': {
						transform: 'translate(12px, -10px)'
					}
				},
				'float-reverse': {
					'0%, 100%': {
						transform: 'translate(0, 0)'
					},
					'50%': {
						transform: 'translate(-8px, 18px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'scale-in': 'scaleIn 0.4s ease-out',
				'slide-in-left': 'slideInLeft 0.6s ease-out',
				'slide-in-right': 'slideInRight 0.6s ease-out',
				'gradient-shift': 'gradient-shift 30s ease infinite',
				'logo-fade-in': 'logoFadeIn 0.8s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'scroll': 'scroll-left 40s linear infinite',
				// Performance-optimized floating animations
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'float-medium': 'float-medium 10s ease-in-out infinite',
				'float-fast': 'float-fast 9s ease-in-out infinite',
				'float-reverse': 'float-reverse 11s ease-in-out infinite'
			},
		backgroundImage: {
			'gradient-primary': 'var(--gradient-primary)',
			'gradient-primary-subtle': 'var(--gradient-primary-subtle)',
			'gradient-primary-glow': 'var(--gradient-primary-glow)',
			'gradient-rainbow': 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(200, 100%, 50%), hsl(320, 100%, 65%))',
			'gradient-rainbow-r': 'linear-gradient(to right, hsl(262, 83%, 58%), hsl(200, 100%, 50%), hsl(320, 100%, 65%))',
			'gradient-rainbow-subtle': 'linear-gradient(135deg, hsl(262, 83%, 58% / 0.2), hsl(200, 100%, 50% / 0.2), hsl(320, 100%, 65% / 0.2))',
		},
			boxShadow: {
				'premium': 'var(--shadow-premium)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
