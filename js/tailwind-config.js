/*!
 * js/tailwind-config.js — SHARED CORE (identical for every member; never edit)
 * Design system "CLAY STUDIO": premium product-launch look. Matte inflated-clay surfaces (terracotta, sage, cream, cocoa, brass),
 * studio spotlights, long soft contact shadows, real 3D scenes (preserve-3d, translateZ), centred symmetrical layouts.
 * Tailwind configuration only (tokens, keyframes, animations). It is not custom CSS.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FFF8F1', 100: '#FBEFE4', 200: '#F5E1D0', 300: '#EBCDB6' },
        clay: { DEFAULT: '#D9774E', 50: '#FFF1EA', 100: '#FBE0D3', 200: '#F5C4AC', 300: '#EEA582', 400: '#E58A62', 500: '#D9774E', 600: '#BF5F37', 700: '#9C4A2A' },
        sage: { DEFAULT: '#6A9672', 50: '#F1F6F0', 100: '#E3EDE2', 200: '#C9DCC9', 300: '#A8C6AA', 400: '#86AD8B', 500: '#6A9672', 600: '#4F7757', 700: '#3C5E45' },
        cocoa: { DEFAULT: '#2B1D1A', 800: '#3A2822', 700: '#4F3830', 600: '#6B4F45' },
        gold: { DEFAULT: '#C9A24B', 300: '#E2C987', 600: '#A88334' },
        mist: { DEFAULT: '#CFE3EC', 300: '#E3F0F5', 600: '#7FA9BC' },
        danger: '#B3261E'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        clay: 'inset 0 2px 0 rgba(255,255,255,.9), inset 0 -10px 20px rgba(156,74,42,.10), 0 22px 40px -18px rgba(43,29,26,.28)',
        'clay-lg': 'inset 0 3px 0 rgba(255,255,255,.95), inset 0 -16px 30px rgba(156,74,42,.12), 0 44px 70px -28px rgba(43,29,26,.38)',
        'clay-btn': 'inset 0 2px 0 rgba(255,255,255,.45), inset 0 -6px 12px rgba(100,38,18,.40), 0 16px 26px -10px rgba(156,74,42,.65)',
        'clay-dark': 'inset 0 2px 0 rgba(255,255,255,.14), inset 0 -8px 16px rgba(0,0,0,.35), 0 20px 34px -14px rgba(0,0,0,.55)',
        well: 'inset 0 4px 10px rgba(43,29,26,.14), inset 0 -2px 0 rgba(255,255,255,.9)',
        plinth: '0 50px 60px -30px rgba(43,29,26,.45)',
        contact: '0 30px 30px -20px rgba(43,29,26,.5)'
      },
      backgroundImage: {
        'spot-cream': 'radial-gradient(60% 55% at 50% 0%,#FFFFFF 0%,rgba(255,255,255,0) 70%),linear-gradient(180deg,#FFF8F1,#FBEFE4)',
        'spot-blush': 'radial-gradient(55% 50% at 50% 8%,#FFF3EA 0%,rgba(255,243,234,0) 70%),linear-gradient(180deg,#FBE3D6,#F5C9B3)',
        'spot-sage': 'radial-gradient(55% 50% at 50% 8%,#F4F9F3 0%,rgba(244,249,243,0) 70%),linear-gradient(180deg,#E3EDE2,#C9DCC9)',
        'spot-mist': 'radial-gradient(55% 50% at 50% 8%,#F4FAFC 0%,rgba(244,250,252,0) 70%),linear-gradient(180deg,#E3F0F5,#CFE3EC)',
        'spot-cocoa': 'radial-gradient(50% 45% at 50% 0%,#5A4036 0%,rgba(90,64,54,0) 70%),linear-gradient(180deg,#2B1D1A,#1F1412)',
        'clay-grad': 'linear-gradient(160deg,#D7693F 0%,#BF5430 55%,#A64427 100%)',
        'sage-grad': 'linear-gradient(160deg,#5E8A67 0%,#4A7552 55%,#3C5E45 100%)',
        'gold-grad': 'linear-gradient(160deg,#E8D08F 0%,#C9A24B 60%,#A88334 100%)',
        'orb': 'radial-gradient(circle at 32% 26%,#FFFFFF 0%,#FBE0D3 28%,#EEA582 70%,#D9774E 100%)',
        'orb-sage': 'radial-gradient(circle at 32% 26%,#FFFFFF 0%,#E3EDE2 28%,#A8C6AA 70%,#6A9672 100%)',
        'orb-gold': 'radial-gradient(circle at 32% 26%,#FFFFFF 0%,#F6E9C4 28%,#E2C987 70%,#C9A24B 100%)',
        'floor-grid': 'linear-gradient(rgba(43,29,26,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(43,29,26,.12) 1px,transparent 1px)',
        'sheen': 'linear-gradient(115deg,transparent 30%,rgba(255,255,255,.6) 48%,transparent 66%)'
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(36px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop: { '0%': { opacity: '0', transform: 'scale(.82)' }, '70%': { opacity: '1', transform: 'scale(1.03)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        tiltIn: { from: { opacity: '0', transform: 'perspective(1200px) rotateX(26deg) translateY(40px)' }, to: { opacity: '1', transform: 'perspective(1200px) rotateX(0) translateY(0)' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideL: { from: { opacity: '0', transform: 'translateX(-50px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideR: { from: { opacity: '0', transform: 'translateX(50px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        floatY: { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-16px) rotate(3deg)' } },
        sway: { '0%,100%': { transform: 'rotateY(-9deg) rotateX(3deg)' }, '50%': { transform: 'rotateY(9deg) rotateX(-3deg)' } },
        wave: { '0%': { opacity: '.7', transform: 'scale(.55)' }, '100%': { opacity: '0', transform: 'scale(1.5)' } },
        sheen: { from: { transform: 'translateX(-140%) skewX(-18deg)' }, to: { transform: 'translateX(300%) skewX(-18deg)' } },
        spinY: { from: { transform: 'rotateY(0deg)' }, to: { transform: 'rotateY(360deg)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        draw: { to: { strokeDashoffset: '0' } },
        breathe: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' } }
      },
      animation: {
        'rise': 'rise .9s cubic-bezier(.16,1,.3,1) both',
        'pop': 'pop .8s cubic-bezier(.16,1,.3,1) both',
        'tilt-in': 'tiltIn 1s cubic-bezier(.16,1,.3,1) both',
        'fade': 'fade .9s ease-out both',
        'slide-l': 'slideL .9s cubic-bezier(.16,1,.3,1) both',
        'slide-r': 'slideR .9s cubic-bezier(.16,1,.3,1) both',
        'float': 'floatY 7s ease-in-out infinite',
        'float-slow': 'floatY 11s ease-in-out infinite',
        'sway': 'sway 9s ease-in-out infinite',
        'wave': 'wave 3.2s ease-out infinite',
        'sheen': 'sheen 3.4s ease-in-out infinite',
        'spin-y': 'spinY 16s linear infinite',
        'marquee': 'marquee 44s linear infinite',
        'draw': 'draw 2.4s ease-out forwards',
        'breathe': 'breathe 5s ease-in-out infinite'
      }
    }
  }
};
