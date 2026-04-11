import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";

const ThemeCtx = createContext({ dark: false, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Editorial+New:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #fafaf9;
  --bg-2: #f4f3f0;
  --bg-3: #eeecea;
  --surface: #ffffff;
  --border: rgba(0,0,0,0.08);
  --border-2: rgba(0,0,0,0.14);
  --ink: #0a0a0a;
  --ink-2: #3a3a3a;
  --ink-3: #777;
  --ink-4: #aaa;
  --accent: #0057ff;
  --accent-2: #3d7bff;
  --accent-bg: #e8efff;
  --gold: #c9963d;
  --gold-bg: #fdf4e3;
  --green: #0b7a3e;
  --green-bg: #e3f5ec;
  --red: #c03a2b;
  --red-bg: #fcecea;
  --shadow-xs:0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm:0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
  --shadow-md:0 8px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg:0 20px 56px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07);
  --shadow-xl:0 32px 80px rgba(0,0,0,0.16);
  --r-sm: 8px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px;
  --font-display:'Syne',sans-serif;
  --font-body:'Instrument Sans',sans-serif;
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
  --ease-smooth:cubic-bezier(0.4,0,0.2,1);
  --t: 0.22s;
}

[data-dark] {
  --bg: #0c0c0d;
  --bg-2: #111113;
  --bg-3: #18181b;
  --surface: #1a1a1e;
  --border: rgba(255,255,255,0.08);
  --border-2: rgba(255,255,255,0.14);
  --ink: #f0f0ef;
  --ink-2: #c8c8c5;
  --ink-3: #888;
  --ink-4: #555;
  --accent: #4d8aff;
  --accent-2: #7aaaff;
  --accent-bg: rgba(77,138,255,0.12);
  --gold: #e0b060;
  --gold-bg: rgba(224,176,96,0.1);
  --green: #2ecc71;
  --green-bg: rgba(46,204,113,0.1);
  --red: #ff6b5b;
  --red-bg: rgba(255,107,91,0.1);
  --shadow-xs:0 1px 3px rgba(0,0,0,0.3);
  --shadow-sm:0 4px 12px rgba(0,0,0,0.4);
  --shadow-md:0 8px 28px rgba(0,0,0,0.5);
  --shadow-lg:0 20px 56px rgba(0,0,0,0.6);
  --shadow-xl:0 32px 80px rgba(0,0,0,0.7);
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
  overflow-x: hidden;
  transition: background var(--t) var(--ease-smooth), color var(--t) var(--ease-smooth);
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }
::selection { background: var(--accent-bg); color: var(--accent); }

@keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes scaleIn  { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:none } }
@keyframes slideDown{ from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:none } }
@keyframes spin     { to { transform:rotate(360deg) } }
@keyframes shimmer  { from { background-position:-200% 0 } to { background-position:200% 0 } }
@keyframes pulse    { 0%,100% { opacity:1;transform:scale(1) } 50% { opacity:.5;transform:scale(.8) } }
@keyframes toastIn  { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:none } }
@keyframes bounceDot{ 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
@keyframes gradShift{ 0%,100% { background-position:0% 50% } 50% { background-position:100% 50% } }
@keyframes shrink { from { width:100% } to { width:0 } }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 60px;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid var(--border);
  transition: all var(--t) var(--ease-smooth);
}
.nav.scrolled { box-shadow: var(--shadow-sm); }
.nav-logo {
  font-family: var(--font-display); font-size: 18px; font-weight: 800;
  color: var(--ink); letter-spacing: -0.5px; display: flex; align-items: center;
  gap: 8px; cursor: pointer; text-decoration: none; user-select: none;
  transition: opacity var(--t);
}
.nav-logo:hover { opacity: 0.75; }
.nav-badge {
  background: var(--accent); color: #fff;
  font-family: var(--font-body); font-size: 9px; font-weight: 700;
  letter-spacing: 1px; padding: 2px 7px; border-radius: 99px;
  text-transform: uppercase;
}
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-link {
  font-size: 13.5px; font-weight: 500; color: var(--ink-3);
  cursor: pointer; background: none; border: none; padding: 6px 12px;
  border-radius: var(--r-sm); transition: all var(--t); font-family: var(--font-body);
  position: relative;
}
.nav-link:hover { color: var(--ink); background: var(--bg-2); }
.nav-link.active { color: var(--ink); font-weight: 600; }
.nav-link.active::after {
  content:''; position:absolute; bottom:-1px; left:12px; right:12px;
  height:2px; background:var(--accent); border-radius:99px;
}
.nav-right { display: flex; gap: 8px; align-items: center; }

.hamburger {
  display: none; flex-direction: column; gap: 5px; background: none; border: none;
  padding: 6px; cursor: pointer; border-radius: var(--r-sm);
  transition: background var(--t);
}
.hamburger:hover { background: var(--bg-2); }
.ham-bar {
  width: 20px; height: 2px; background: var(--ink); border-radius: 99px;
  transition: all var(--t) var(--ease-smooth); transform-origin: center;
}
.hamburger.open .ham-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open .ham-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open .ham-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu {
  display: none; position: fixed; top: 60px; inset-inline: 0; z-index: 99;
  background: color-mix(in srgb, var(--bg) 95%, transparent);
  backdrop-filter: blur(24px); border-bottom: 1px solid var(--border);
  padding: 16px 24px 24px; flex-direction: column; gap: 4px;
  animation: slideDown 0.2s var(--ease-smooth);
}
.mobile-menu.open { display: flex; }
.mobile-nav-link {
  font-size: 15px; font-weight: 500; color: var(--ink-2); cursor: pointer;
  background: none; border: none; padding: 12px 16px; border-radius: var(--r-md);
  transition: all var(--t); font-family: var(--font-body); text-align: left;
  width: 100%;
}
.mobile-nav-link:hover { background: var(--bg-2); color: var(--ink); }
.mobile-divider { height: 1px; background: var(--border); margin: 8px 0; }
.mobile-btns { display: flex; gap: 8px; padding: 8px 0; }
.mobile-btns > * { flex: 1; }

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 7px; border: none; border-radius: var(--r-sm);
  font-family: var(--font-body); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all var(--t) var(--ease-smooth); white-space: nowrap;
  position: relative; overflow: hidden; user-select: none;
}
.btn::after {
  content:''; position:absolute; inset:0; opacity:0;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.25) 0%, transparent 60%);
  transition:opacity var(--t);
}
.btn:hover::after { opacity:1; }
.btn:active { transform: scale(0.97); }
.btn-sm  { padding: 7px 14px; font-size: 13px; border-radius: var(--r-sm); }
.btn-md  { padding: 10px 20px; }
.btn-lg  { padding: 14px 28px; font-size: 15px; border-radius: var(--r-md); }
.btn-xl  { padding: 16px 36px; font-size: 16px; border-radius: var(--r-md); }
.btn-primary { background: var(--ink); color: var(--bg); box-shadow: var(--shadow-xs); }
.btn-primary:hover { background: var(--ink-2); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn-accent {
  background: var(--accent); color: #fff;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent);
}
.btn-accent:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 40%, transparent); }
.btn-ghost {
  background: transparent; color: var(--ink);
  border: 1px solid var(--border-2);
}
.btn-ghost:hover { background: var(--bg-2); border-color: var(--border-2); }
.btn-success { background: var(--green); color: #fff; }
.btn-danger { background: var(--red); color: #fff; }

.btn-icon {
  width: 36px; height: 36px; padding: 0; border-radius: var(--r-sm);
  background: var(--bg-2); color: var(--ink-2); border: 1px solid var(--border);
  font-size: 16px;
}
.btn-icon:hover { background: var(--bg-3); color: var(--ink); }

.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 130px 48px 100px; position: relative; overflow: hidden; text-align: center;
}
.hero-mesh {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 60% at 20% 20%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, color-mix(in srgb, var(--gold) 6%, transparent), transparent 60%),
    radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 60%);
}
.hero-noise {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}
.hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 80%);
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 99px; padding: 6px 16px; margin-bottom: 32px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.5px; color: var(--ink-2);
  box-shadow: var(--shadow-xs); position: relative; z-index: 1;
  animation: fadeUp 0.5s both;
}
.eyebrow-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent); animation: pulse 2s infinite;
}
.hero-h1 {
  font-family: var(--font-display); font-size: clamp(52px, 8vw, 96px);
  font-weight: 800; line-height: 1.02; letter-spacing: -3px;
  max-width: 900px; margin-bottom: 24px;
  position: relative; z-index: 1; animation: fadeUp 0.6s 0.1s both;
}
.hero-h1 .gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 50%, var(--gold) 100%);
  background-size: 200% 200%; -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradShift 4s ease infinite;
}
.hero-sub {
  font-size: clamp(16px, 2vw, 19px); color: var(--ink-3); max-width: 500px;
  line-height: 1.75; margin-bottom: 44px; position: relative; z-index: 1;
  animation: fadeUp 0.6s 0.2s both;
}
.hero-btns {
  display: flex; gap: 12px; align-items: center; justify-content: center;
  flex-wrap: wrap; position: relative; z-index: 1; animation: fadeUp 0.6s 0.3s both;
}
.hero-stats {
  margin-top: 80px; display: flex; gap: 0; align-items: stretch;
  position: relative; z-index: 1; animation: fadeUp 0.6s 0.4s both;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); box-shadow: var(--shadow-sm);
  overflow: hidden; flex-wrap: wrap;
}
.stat-item {
  padding: 20px 36px; text-align: center; flex: 1; min-width: 120px;
  border-right: 1px solid var(--border); transition: background var(--t);
}
.stat-item:last-child { border-right: none; }
.stat-item:hover { background: var(--bg-2); }
.stat-n { font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--ink); line-height: 1; }
.stat-l { font-size: 11px; color: var(--ink-4); margin-top: 4px; letter-spacing: 0.3px; }

.trust-bar {
  background: var(--bg-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 14px 56px; display: flex; align-items: center; justify-content: center;
  gap: 40px; flex-wrap: wrap; overflow: hidden;
}
.trust-item { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 500; color: var(--ink-3); }
.trust-item span { font-size: 14px; }

.section { padding: 100px 56px; }
.section-center { text-align: center; }
.eyebrow {
  display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
}
.section-h2 {
  font-family: var(--font-display); font-size: clamp(34px, 4vw, 54px);
  font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; color: var(--ink);
}
.section-sub {
  font-size: 17px; color: var(--ink-3); line-height: 1.75;
  max-width: 520px; margin: 16px auto 0;
}

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 60px; }
.feat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-xl); padding: 32px; cursor: default;
  transition: all 0.3s var(--ease-smooth); position: relative; overflow: hidden;
}
.feat-card::before {
  content:''; position:absolute; inset:0; opacity:0;
  background: radial-gradient(circle at var(--mx,50%) var(--my,50%), var(--accent-bg), transparent 60%);
  transition: opacity 0.4s;
}
.feat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--accent); }
.feat-card:hover::before { opacity: 1; }
.feat-icon-wrap {
  width: 48px; height: 48px; border-radius: var(--r-md); background: var(--bg-2);
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  font-size: 22px; margin-bottom: 20px; transition: transform 0.3s var(--ease-spring);
}
.feat-card:hover .feat-icon-wrap { transform: scale(1.1) rotate(-4deg); }
.feat-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.3px; }
.feat-desc { font-size: 14px; color: var(--ink-3); line-height: 1.75; }

.how-section { background: var(--ink); color: var(--bg); padding: 100px 56px; }
[data-dark] .how-section { background: var(--bg-3); }
.how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0; margin-top: 60px; border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-xl); overflow: hidden; }
.how-card {
  padding: 36px 28px; border-right: 1px solid rgba(255,255,255,0.08);
  transition: background 0.3s;
}
.how-card:last-child { border-right: none; }
.how-card:hover { background: rgba(255,255,255,0.04); }
.how-num { font-family: var(--font-display); font-size: 56px; font-weight: 800; color: var(--accent); opacity: 0.3; line-height: 1; margin-bottom: 16px; }
.how-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 10px; color: rgba(255,255,255,0.9); }
.how-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.75; }

.testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 52px; }
.testi-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 28px; transition: all 0.3s;
}
.testi-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.testi-stars { color: var(--gold); font-size: 13px; margin-bottom: 14px; letter-spacing: 2px; }
.testi-quote { font-size: 15px; line-height: 1.75; color: var(--ink-2); margin-bottom: 20px; }
.testi-author { display: flex; align-items: center; gap: 10px; }
.testi-avatar {
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-family: var(--font-display); font-size: 13px; font-weight: 700;
  flex-shrink: 0;
}
.testi-name { font-size: 13px; font-weight: 600; }
.testi-role { font-size: 12px; color: var(--ink-4); }

.about-hero { padding: 140px 56px 80px; text-align: center; position: relative; overflow: hidden; }
.about-mission-box {
  background: var(--ink); color: var(--bg); border-radius: var(--r-xl);
  padding: 60px; text-align: center; margin-bottom: 80px; position: relative; overflow: hidden;
}
[data-dark] .about-mission-box { background: var(--bg-3); border: 1px solid var(--border); }
.about-mission-box blockquote {
  font-family: var(--font-display); font-size: clamp(20px, 3vw, 28px);
  font-style: italic; line-height: 1.55; font-weight: 400;
  max-width: 640px; margin: 0 auto 20px;
}
.about-mission-box cite { font-size: 13px; opacity: 0.4; letter-spacing: 1px; text-transform: uppercase; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 60px; }
.value-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 28px;
  transition: all 0.3s;
}
.value-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-sm); border-color: var(--accent); }
.value-num { font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
.value-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.value-desc { font-size: 14px; color: var(--ink-3); line-height: 1.7; }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 60px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 28px; text-align: center; transition: all 0.3s;
}
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--accent); }
.stat-big { font-family: var(--font-display); font-size: 38px; font-weight: 800; color: var(--ink); line-height: 1; }
.stat-small { font-size: 12px; color: var(--ink-4); margin-top: 8px; }
.team-section { background: var(--bg-2); border-radius: var(--r-xl); padding: 48px; margin-bottom: 60px; border: 1px solid var(--border); }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin-top: 40px; }
.team-card { text-align: center; transition: transform 0.3s var(--ease-spring); }
.team-card:hover { transform: translateY(-4px); }
.team-avatar {
  width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 22px; font-weight: 800;
  border: 2px solid var(--border);
}
.team-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.team-role { font-size: 12px; color: var(--ink-3); }

.contact-page { padding: 140px 56px 80px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; max-width: 960px; margin: 60px auto 0; align-items: start; }
.contact-method {
  display: flex; gap: 14px; align-items: center; padding: 16px 18px;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
  margin-bottom: 10px; transition: all 0.2s;
}
.contact-method:hover { border-color: var(--accent); transform: translateX(4px); box-shadow: var(--shadow-xs); }
.contact-method-icon {
  width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--bg-2);
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.contact-method-title { font-size: 13px; font-weight: 600; }
.contact-method-val { font-size: 12px; color: var(--ink-3); }
.contact-form-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 36px; box-shadow: var(--shadow-sm);
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
.form-input, .form-textarea, .form-select {
  width: 100%; padding: 11px 14px; border: 1px solid var(--border-2); border-radius: var(--r-sm);
  font-family: var(--font-body); font-size: 14px; background: var(--bg); color: var(--ink);
  outline: none; transition: all 0.2s; appearance: none;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg);
}
.form-textarea { height: 130px; resize: vertical; line-height: 1.6; }
.submit-success {
  background: var(--green-bg); border: 1px solid color-mix(in srgb, var(--green) 30%, transparent);
  border-radius: var(--r-md); padding: 24px; text-align: center; color: var(--green);
  animation: scaleIn 0.3s var(--ease-spring);
}
.faq-section { max-width: 760px; margin: 80px auto 0; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q {
  font-size: 15px; font-weight: 600; cursor: pointer; display: flex;
  justify-content: space-between; align-items: center; gap: 16px;
  padding: 20px 0; transition: color 0.2s;
}
.faq-q:hover { color: var(--accent); }
.faq-icon { font-size: 18px; color: var(--ink-3); flex-shrink: 0; transition: transform 0.3s var(--ease-spring); }
.faq-icon.open { transform: rotate(45deg); color: var(--accent); }
.faq-a { font-size: 14px; color: var(--ink-3); line-height: 1.8; max-height: 0; overflow: hidden; transition: max-height 0.4s, padding 0.3s; }
.faq-a.open { max-height: 200px; padding-bottom: 20px; }

.upload-page { min-height: 100vh; padding: 100px 24px 80px; display: flex; flex-direction: column; align-items: center; }
.upload-wrap { width: 100%; max-width: 640px; }
.drop-zone {
  border: 2px dashed var(--border-2); border-radius: var(--r-xl);
  padding: 60px 32px; text-align: center; cursor: pointer;
  transition: all 0.25s var(--ease-smooth); background: var(--surface);
  position: relative; overflow: hidden;
}
.drop-zone::before {
  content:''; position:absolute; inset:0; opacity:0;
  background: radial-gradient(ellipse at 50% 0%, var(--accent-bg), transparent 70%);
  transition: opacity 0.3s;
}
.drop-zone:hover, .drop-zone.drag {
  border-color: var(--accent); border-style: solid;
  transform: scale(1.005); box-shadow: var(--shadow-md), 0 0 0 4px var(--accent-bg);
}
.drop-zone:hover::before, .drop-zone.drag::before { opacity: 1; }
.drop-icon {
  font-size: 44px; margin-bottom: 14px; display: block;
  transition: transform 0.3s var(--ease-spring);
}
.drop-zone:hover .drop-icon, .drop-zone.drag .drop-icon { transform: scale(1.15) translateY(-4px); }
.drop-zone h3 { font-family: var(--font-display); font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.drop-zone p { color: var(--ink-3); font-size: 14px; }
.file-types { display: flex; gap: 6px; justify-content: center; margin-top: 18px; flex-wrap: wrap; }
.type-badge {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 6px;
  padding: 3px 9px; font-size: 11px; font-weight: 700; color: var(--ink-3); letter-spacing: 0.5px;
}
.file-preview {
  margin-top: 16px; background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 16px 20px; display: flex; align-items: center; gap: 14px;
  animation: slideDown 0.3s var(--ease-spring);
}
.file-info { flex: 1; }
.file-name { font-weight: 600; font-size: 14px; }
.file-size { font-size: 12px; color: var(--ink-4); margin-top: 2px; }
.progress-bar-wrap { margin-top: 12px; height: 3px; background: var(--bg-2); border-radius: 99px; overflow: hidden; }
.progress-bar-fill {
  height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 0.4s var(--ease-smooth);
}
.or-divider { display: flex; align-items: center; gap: 14px; margin: 20px 0; color: var(--ink-4); font-size: 13px; }
.or-divider::before, .or-divider::after { content:''; flex:1; height:1px; background:var(--border); }
.paste-area {
  width: 100%; height: 180px; border: 1.5px solid var(--border-2); border-radius: var(--r-md);
  padding: 14px; font-family: var(--font-body); font-size: 14px; line-height: 1.7;
  background: var(--surface); color: var(--ink); resize: vertical; outline: none; transition: all 0.2s;
}
.paste-area:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
.simplify-btn {
  width: 100%; margin-top: 16px; padding: 16px; background: var(--ink); color: var(--bg);
  border: none; border-radius: var(--r-md); font-family: var(--font-body);
  font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  gap: 9px; cursor: pointer; transition: all 0.25s var(--ease-smooth); position: relative; overflow: hidden;
}
.simplify-btn:not(:disabled):hover { background: var(--ink-2); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.simplify-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.security-note { text-align: center; font-size: 12px; color: var(--ink-4); margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 5px; }

.proc-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; }
.skeleton {
  background: linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--r-sm);
}
.proc-skeleton-wrap { width: 100%; max-width: 640px; margin-top: 40px; }
.skel-line { height: 14px; margin-bottom: 10px; }
.skel-line.short { width: 40%; }
.skel-line.medium { width: 70%; }
.skel-line.long { width: 90%; }
.skel-line.full { width: 100%; }
.skel-block { height: 80px; margin-bottom: 14px; border-radius: var(--r-md); }
.skel-header { height: 28px; width: 50%; margin-bottom: 20px; border-radius: var(--r-sm); }
.spinner-ring {
  width: 48px; height: 48px; border-radius: 50%;
  border: 3px solid var(--border-2); border-top-color: var(--accent);
  animation: spin 0.8s linear infinite; margin: 0 auto 28px;
}
.proc-label { font-family: var(--font-display); font-size: 26px; font-weight: 700; margin-bottom: 8px; }
.proc-sub { color: var(--ink-3); font-size: 15px; }
.typing-dots { display: flex; gap: 4px; justify-content: center; margin-top: 16px; }
.typing-dots span {
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
  animation: bounceDot 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.15s; }
.typing-dots span:nth-child(3) { animation-delay: 0.3s; }
.step-pills { display: flex; gap: 8px; margin-top: 32px; flex-wrap: wrap; justify-content: center; }
.step-pill {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 99px;
  padding: 6px 16px; font-size: 13px; color: var(--ink-3); display: flex; align-items: center; gap: 7px;
  transition: all 0.3s;
}
.step-pill.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
.step-pill.done { border-color: var(--green); color: var(--green); background: var(--green-bg); }

.result-page { min-height: 100vh; padding: 100px 56px 80px; }
.result-hdr { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
.result-hdr-title { font-family: var(--font-display); font-size: 36px; font-weight: 800; letter-spacing: -1px; }
.result-hdr-sub { color: var(--ink-3); margin-top: 4px; font-size: 14px; }
.result-acts { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; padding-top: 4px; }
.tabs { display: inline-flex; background: var(--bg-2); border-radius: var(--r-md); padding: 4px; gap: 2px; margin-bottom: 24px; border: 1px solid var(--border); }
.tab-btn {
  padding: 7px 22px; border-radius: var(--r-sm); font-size: 13px; font-weight: 600;
  background: transparent; color: var(--ink-3); border: none; cursor: pointer; transition: all 0.2s;
  font-family: var(--font-body); white-space: nowrap;
}
.tab-btn.on { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-xs); }
.result-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 40px; line-height: 1.85; animation: fadeIn 0.4s;
}
.result-card.simplified { border-color: color-mix(in srgb, var(--accent) 30%, transparent); }
.result-badge {
  display: inline-flex; align-items: center; gap: 6px; border-radius: 99px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
  padding: 4px 12px; margin-bottom: 28px;
}
.result-badge.ai { background: var(--accent-bg); color: var(--accent); }
.result-badge.original { background: var(--bg-2); color: var(--ink-3); }
.sec-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.sec-block { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
.sec-block:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.kp-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.kp {
  display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px;
  background: var(--bg); border-radius: var(--r-md); border-left: 3px solid var(--accent);
  transition: all 0.2s;
}
.kp:hover { transform: translateX(3px); background: var(--accent-bg); }
.kp-icon { color: var(--accent); font-size: 13px; flex-shrink: 0; margin-top: 2px; }
.kp-txt { font-size: 14px; line-height: 1.65; }
.risk-item {
  display: flex; gap: 10px; align-items: flex-start; padding: 11px 14px;
  background: var(--red-bg); border-radius: var(--r-md); margin-bottom: 7px;
  border-left: 3px solid var(--red); font-size: 14px; line-height: 1.6;
}
.risk-icon { color: var(--red); flex-shrink: 0; }
.copy-flash {
  position: fixed; inset: 0; z-index: 999; pointer-events: none;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  animation: fadeIn 0.15s, fadeIn 0.15s 0.3s reverse both;
}

.history-wrap { margin-top: 28px; }
.history-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
}
.history-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.history-sub { font-size: 13px; color: var(--ink-3); }
.history-grid { display: grid; gap: 14px; }
.history-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 20px;
  transition: all 0.25s var(--ease-smooth);
}
.history-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--accent);
}
.history-card-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
}
.history-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-bg); color: var(--accent);
  border-radius: 99px; padding: 5px 12px; font-size: 11px;
  font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
}
.history-date { font-size: 12px; color: var(--ink-4); }
.history-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--ink-4); margin-bottom: 6px;
}
.history-text {
  font-size: 14px; line-height: 1.8; color: var(--ink-2); white-space: pre-wrap;
}
.history-divider { height: 1px; background: var(--border); margin: 14px 0; }
.history-empty {
  background: var(--surface);
  border: 1px dashed var(--border-2);
  border-radius: var(--r-lg);
  padding: 26px;
  text-align: center;
  color: var(--ink-3);
  font-size: 14px;
}
.history-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: fadeIn 0.2s;
}
.modal {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-xl);
  padding: 44px; width: 100%; max-width: 420px; position: relative;
  box-shadow: var(--shadow-xl); animation: scaleIn 0.3s var(--ease-spring);
}
.modal-x {
  position: absolute; top: 16px; right: 16px; background: var(--bg-2);
  border: 1px solid var(--border); border-radius: 50%;
  width: 32px; height: 32px; cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.modal-x:hover { background: var(--bg-3); transform: rotate(90deg); }
.modal h3 { font-family: var(--font-display); font-size: 26px; font-weight: 800; margin-bottom: 6px; }
.modal .modal-sub { color: var(--ink-3); font-size: 14px; margin-bottom: 28px; }
.mg { margin-bottom: 14px; }
.mg label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
.mg input {
  width: 100%; padding: 11px 14px; border: 1px solid var(--border-2); border-radius: var(--r-sm);
  font-family: var(--font-body); font-size: 14px; background: var(--bg); color: var(--ink); outline: none; transition: all 0.2s;
}
.mg input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
.modal-sw { text-align: center; margin-top: 18px; font-size: 13px; color: var(--ink-3); }
.modal-sw button { background: none; border: none; color: var(--accent); font-weight: 600; font-family: var(--font-body); cursor: pointer; font-size: 13px; }

.toast-container { position: fixed; bottom: 28px; right: 28px; z-index: 400; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
.toast {
  background: var(--ink); color: var(--bg); padding: 13px 20px;
  border-radius: var(--r-md); font-size: 13px; font-weight: 500;
  box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 10px;
  pointer-events: auto; min-width: 220px; max-width: 340px;
  border: 1px solid rgba(255,255,255,0.08);
  animation: toastIn 0.35s var(--ease-spring);
}
[data-dark] .toast { border-color: var(--border); }
.toast.success .toast-icon { color: var(--green); }
.toast.error .toast-icon { color: var(--red); }
.toast.info .toast-icon { color: var(--accent-2); }
.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-msg { flex: 1; line-height: 1.4; }
.toast-close { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 15px; padding: 0 2px; }
.toast-close:hover { color: rgba(255,255,255,0.8); }
.toast-progress {
  position: absolute; bottom: 0; left: 0; height: 2px;
  background: rgba(255,255,255,0.25); border-radius: 0 0 var(--r-md) var(--r-md);
  animation: shrink 3s linear forwards;
}

.theme-toggle {
  width: 40px; height: 22px; border-radius: 99px; background: var(--bg-3);
  border: 1px solid var(--border-2); cursor: pointer; position: relative;
  transition: all 0.3s; flex-shrink: 0;
}
.theme-toggle:hover { border-color: var(--accent); }
.theme-knob {
  position: absolute; top: 2px; width: 16px; height: 16px; border-radius: 50%;
  background: var(--ink); transition: all 0.3s var(--ease-spring);
  left: 2px; display: flex; align-items: center; justify-content: center; font-size: 9px;
}
[data-dark] .theme-knob { left: calc(100% - 18px); background: var(--accent); }

.footer {
  background: var(--ink); color: rgba(255,255,255,0.5);
  padding: 72px 56px 32px;
}
[data-dark] .footer { background: var(--bg-3); border-top: 1px solid var(--border); }
.footer-top { display: flex; gap: 48px; flex-wrap: wrap; justify-content: space-between; margin-bottom: 56px; }
.footer-brand { max-width: 260px; }
.footer-logo { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 12px; }
.footer-brand p { font-size: 13px; line-height: 1.75; }
.footer-col h4 { font-weight: 700; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.9); margin-bottom: 16px; }
.footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-links a {
  color: rgba(255,255,255,0.45); text-decoration: none; font-size: 14px;
  transition: color 0.2s; cursor: pointer; display: inline-flex; align-items: center;
}
.footer-links a:hover { color: #fff; }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px; font-size: 12px;
}

.cta-section {
  padding: 80px 56px; background: var(--ink); text-align: center; position: relative; overflow: hidden;
}
[data-dark] .cta-section { background: var(--bg-3); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.cta-section::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse 60% 80% at 50% 50%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%);
  pointer-events: none;
}
.cta-h2 { font-family: var(--font-display); font-size: clamp(32px,5vw,58px); font-weight: 800; color: #fff; letter-spacing: -1.5px; margin-bottom: 20px; line-height: 1.08; position: relative; }
.cta-sub { color: rgba(255,255,255,0.55); font-size: 17px; margin-bottom: 36px; position: relative; }

.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s var(--ease-smooth), transform 0.65s var(--ease-smooth); }
.reveal.visible { opacity: 1; transform: none; }
.page-enter { animation: fadeUp 0.4s var(--ease-smooth) both; }

@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .hero, .section { padding-left: 24px; padding-right: 24px; }
  .how-section { padding: 64px 24px; }
  .how-grid { grid-template-columns: 1fr; }
  .how-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .how-card:last-child { border-bottom: none; }
  .result-page, .contact-page { padding-left: 20px; padding-right: 20px; }
  .about-hero, .about-mission { padding-left: 24px; padding-right: 24px; }
  .contact-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .result-card { padding: 24px; }
  .footer { padding: 48px 24px 24px; }
  .cta-section { padding: 64px 24px; }
  .trust-bar { padding: 12px 20px; gap: 20px; }
  .hero-stats { border-radius: var(--r-md); }
  .stat-item { padding: 14px 20px; }
  .result-hdr { flex-direction: column; }
  .result-acts { width: 100%; }
}
`;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useCardGlow(ref) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, [ref]);
}

function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'success'}`} style={{ position: 'relative', overflow: 'hidden' }}>
          <span className="toast-icon">{t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '✓'}</span>
          <span className="toast-msg">{t.msg}</span>
          <button className="toast-close" onClick={() => dismiss(t.id)}>✕</button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  const dismiss = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, show, dismiss };
}

function getDemoText() {
  return `TERMS AND CONDITIONS OF SERVICE AGREEMENT

This Terms and Conditions of Service Agreement ("Agreement") is entered into as of the date of acceptance ("Effective Date") by and between LegalCorp Inc., a Delaware corporation ("Company"), and the individual accepting these terms ("User").

1. ACCEPTANCE OF TERMS
By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Agreement. The Company reserves the right, in its sole discretion, to modify these terms at any time without prior notice.

2. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.

3. INDEMNIFICATION
You agree to defend, indemnify, and hold harmless the Company and its employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses.

4. GOVERNING LAW
These Terms shall be governed by the laws of the State of Delaware, United States. Any disputes shall be resolved through binding arbitration.`;
}

function parseAI(text) {
  const sec = {};
  const lines = text.split('\n');
  let cur = 'summary', buf = [];

  const flush = () => {
    if (buf.length) sec[cur] = buf.join('\n').trim();
    buf = [];
  };

  for (const l of lines) {
    if (/SUMMARY/i.test(l)) { flush(); cur = 'summary'; }
    else if (/KEY POINTS|IMPORTANT/i.test(l)) { flush(); cur = 'kp'; }
    else if (/RISKS|RED FLAGS/i.test(l)) { flush(); cur = 'risks'; }
    else if (/PLAIN ENGLISH|SIMPLE/i.test(l)) { flush(); cur = 'plain'; }
    else buf.push(l);
  }

  flush();

  const bullets = (t) =>
    (t || '')
      .split('\n')
      .map(l => l.replace(/^[-•*\d.]+\s*/, '').trim())
      .filter(Boolean);

  return {
    summary: sec.summary || text.slice(0, 400),
    keyPoints: bullets(sec.kp).slice(0, 5),
    risks: bullets(sec.risks).slice(0, 3),
    plainEnglish: sec.plain || sec.summary || text,
  };
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} title={dark ? 'Switch to light' : 'Switch to dark'} aria-label="Toggle dark mode">
      <div className="theme-knob">{dark ? '☀' : '☾'}</div>
    </button>
  );
}

function Navbar({ page, setPage, onLogin, onSignup, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const go = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => go('home')}>
          LegalEase <span className="nav-badge">AI</span>
        </div>

        <div className="nav-links">
          {[['home','Home'],['about','About'],['contact','Contact']].map(([p,l]) => (
            <button key={p} className={`nav-link${page === p ? ' active' : ''}`} onClick={() => go(p)}>{l}</button>
          ))}
          <button className={`nav-link${page === 'upload' ? ' active' : ''}`} onClick={() => go('upload')}>Simplify</button>
        </div>

        <div className="nav-right" style={{ gap: 8, display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', display: 'none' }} className="hide-mobile">Hi, {user.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={onLogin} style={{ display: 'none' }}>Log in</button>
              <button className="btn btn-primary btn-sm" onClick={onSignup}>Sign up</button>
            </>
          )}
          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className="ham-bar" /><span className="ham-bar" /><span className="ham-bar" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu open">
          {[['home','Home'],['about','About'],['contact','Contact'],['upload','Simplify']].map(([p,l]) => (
            <button key={p} className="mobile-nav-link" onClick={() => go(p)}>{l}</button>
          ))}
          <div className="mobile-divider" />
          <div className="mobile-btns">
            {user ? (
              <button className="btn btn-ghost btn-md" onClick={() => { onLogout(); setMenuOpen(false); }}>Log out</button>
            ) : (
              <>
                <button className="btn btn-ghost btn-md" onClick={() => { onLogin(); setMenuOpen(false); }}>Log in</button>
                <button className="btn btn-primary btn-md" onClick={() => { onSignup(); setMenuOpen(false); }}>Sign up free</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function HomePage({ setPage }) {
  useScrollReveal();

  const features = [
    { icon: '✦', title: 'AI Simplification', desc: 'Advanced language models trained on legal texts transform complex legalese into readable plain English.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Get simplified results in under 10 seconds. No waiting, no queues — just fast, accurate analysis.' },
    { icon: '⬡', title: 'Bank-Grade Security', desc: 'Your documents are encrypted end-to-end. We never store your sensitive legal files on our servers.' },
    { icon: '◎', title: 'Key Clause Detection', desc: 'Automatically highlights important clauses, obligations, deadlines, and potential red flags.' },
    { icon: '☐', title: 'Multi-Format Support', desc: 'Works with PDF, DOCX, and plain text. Paste directly or upload your file with ease.' },
    { icon: '◯', title: 'Global Jurisdictions', desc: 'Understands legal language from US, UK, EU, Indian, and international contracts.' },
  ];

  const testimonials = [
    { q: 'Finally understood my apartment lease. Found two clauses I would never have caught.', name: 'Priya S.', role: 'First-time renter', init: 'P', color: '#e8efff', tc: '#0057ff' },
    { q: 'Used it for a freelance contract. Saved me hours of confusion and probably saved me money.', name: 'James K.', role: 'Freelance designer', init: 'J', color: '#e3f5ec', tc: '#0b7a3e' },
    { q: 'As a small business owner, this tool is invaluable. Clear, fast, and accurate every time.', name: 'Anita R.', role: 'Startup founder', init: 'A', color: '#fdf4e3', tc: '#c9963d' },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-mesh" /><div className="hero-noise" /><div className="hero-grid" />
        <div className="hero-eyebrow" style={{ position:'relative', zIndex:1 }}>
          <span className="eyebrow-dot" /> AI-Powered Legal Simplification
        </div>
        <h1 className="hero-h1">
          Understand Any<br />
          <span className="gradient-text">Legal Document</span><br />
          Instantly
        </h1>
        <p className="hero-sub">Upload any contract or agreement. Our AI breaks it into plain language you can actually understand — in seconds.</p>
        <div className="hero-btns">
          <button className="btn btn-primary btn-xl" onClick={() => setPage('upload')}>
            Try for free <span>→</span>
          </button>
          <button className="btn btn-ghost btn-xl" onClick={() => setPage('about')}>Learn more</button>
        </div>
        <div className="hero-stats">
          {[['50K+','Documents Simplified'],['98%','Accuracy Rate'],['<10s','Processing Time'],['4.9★','User Rating']].map(([n,l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-n">{n}</div>
              <div className="stat-l">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="trust-bar">
        {[['🔒','256-bit Encryption'],['✓','SOC 2 Compliant'],['⚡','99.9% Uptime'],['🌐','40+ Countries'],['★','4.9 on ProductHunt']].map(([ic,lb]) => (
          <div className="trust-item" key={lb}><span>{ic}</span>{lb}</div>
        ))}
      </div>

      <section className="section">
        <div className="reveal section-center">
          <div className="eyebrow">Why LegalEase</div>
          <h2 className="section-h2">Everything you need to understand<br />any legal document</h2>
          <p className="section-sub">From simple leases to complex contracts — clarity in seconds.</p>
        </div>
        <div className="features-grid" style={{ marginTop: 56 }}>
          {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.07} />)}
        </div>
      </section>

      <section className="how-section">
        <div className="eyebrow" style={{ color: 'var(--accent-2)' }}>The Process</div>
        <h2 className="section-h2" style={{ color: '#fff', maxWidth: 500 }}>From confusing legalese<br />to crystal-clear English</h2>
        <div className="how-grid">
          {[
            { title: 'Upload Your Document', desc: 'Drag & drop your PDF, DOCX, or paste text directly into the editor.' },
            { title: 'AI Analyzes It', desc: 'Our model reads every clause, detects legal jargon, and identifies key terms.' },
            { title: 'Get Plain English', desc: 'Receive a clear summary, key points, and a plain-English version in seconds.' },
            { title: 'Take Action', desc: 'Copy, download, or share the simplified version with total confidence.' },
          ].map((s, i) => (
            <div className="how-card" key={i}>
              <div className="how-num">0{i+1}</div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44 }}>
          <button className="btn btn-accent btn-lg" onClick={() => setPage('upload')}>Start simplifying →</button>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="reveal section-center">
          <div className="eyebrow">Testimonials</div>
          <h2 className="section-h2">People love LegalEase</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card reveal" style={{ transitionDelay: `${i*0.1}s` }} key={i}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"{t.q}"</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color, color: t.tc }}>{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-h2">Ready to understand your<br /><em style={{ fontStyle:'italic', color:'var(--accent-2)' }}>legal documents?</em></h2>
        <p className="cta-sub">Join 50,000+ people who cut through legal complexity with LegalEase.</p>
        <button className="btn btn-accent btn-xl" style={{ position:'relative', zIndex:1 }} onClick={() => setPage('upload')}>
          Try LegalEase free →
        </button>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const ref = useRef(null);
  useCardGlow(ref);
  return (
    <div ref={ref} className="feat-card reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="feat-icon-wrap">{icon}</div>
      <div className="feat-title">{title}</div>
      <div className="feat-desc">{desc}</div>
    </div>
  );
}

function AboutPage({ setPage }) {
  useScrollReveal();
  const values = [
    { n:'01', title:'Accessibility', desc:'Legal language should not be a barrier. Everyone deserves to understand documents that affect their lives.' },
    { n:'02', title:'Accuracy', desc:'We never compromise on quality. Our AI is rigorously tested to ensure reliable, truthful simplifications.' },
    { n:'03', title:'Privacy', desc:'Your documents are yours. We encrypt everything end-to-end and never store your sensitive files.' },
    { n:'04', title:'Simplicity', desc:'Complexity is the enemy of understanding. We obsess over making our product as easy to use as possible.' },
  ];
  const team = [
    { name:'Saad Siddiqui', role:'CEO & Co-founder', init:'SS', color:'var(--accent-bg)', tc:'var(--accent)' },
    { name:'Mudir Ansari', role:'CTO & Co-founder', init:'MA', color:'var(--green-bg)', tc:'var(--green)' },
    { name:'MD Zaib', role:'Head of AI', init:'MZ', color:'var(--bg-3)', tc:'var(--ink-2)' },
    { name:'Sahil Alam', role:'Head of Design', init:'SA', color:'var(--red-bg)', tc:'var(--red)' },
  ];

  return (
    <>
      <section className="about-hero" style={{ position:'relative', zIndex:1 }}>
        <div className="hero-mesh" />
        <div style={{ position:'relative', zIndex:1, textAlign:'center', paddingTop:20 }}>
          <div className="eyebrow">Our Story</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(44px,7vw,84px)', fontWeight:800, letterSpacing:'-2.5px', lineHeight:1.04, marginBottom:24, marginTop:16 }}>
            Built for the people<br />who can't afford a lawyer
          </h1>
          <p style={{ fontSize:18, color:'var(--ink-3)', maxWidth:540, margin:'0 auto', lineHeight:1.8 }}>
            LegalEase was born out of frustration. We saw too many people sign documents they didn't fully understand — and we decided to do something about it.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 880, margin:'0 auto', padding:'60px 56px 80px' }}>
        <div className="about-mission-box reveal">
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in srgb, var(--accent) 10%, transparent), transparent)', borderRadius:'var(--r-xl)', pointerEvents:'none' }} />
          <blockquote style={{ position:'relative' }}>"Legal clarity shouldn't be a privilege reserved for those who can afford expensive lawyers. It should be a right accessible to everyone."</blockquote>
          <cite style={{ position:'relative' }}>— Saad Siddiqui, CEO & Co-founder</cite>
        </div>

        <div className="stats-row reveal">
          {[['50K+','Documents simplified'],['98%','Accuracy rate'],['140+','Countries served'],['4.9★','App store rating']].map(([n,l]) => (
            <div className="stat-card" key={l}><div className="stat-big">{n}</div><div className="stat-small">{l}</div></div>
          ))}
        </div>

        <div className="reveal"><div className="eyebrow">Our Values</div></div>
        <div className="values-grid" style={{ marginTop:16 }}>
          {values.map((v,i) => (
            <div className="value-card reveal" style={{ transitionDelay:`${i*0.08}s` }} key={i}>
              <div className="value-num">{v.n}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>

        <div className="team-section reveal">
          <div className="eyebrow">The Team</div>
          <h2 className="section-h2" style={{ marginTop:8 }}>The people behind LegalEase</h2>
          <div className="team-grid">
            {team.map((t,i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar" style={{ background:t.color, color:t.tc }}>{t.init}</div>
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-section reveal" style={{ borderRadius:'var(--r-xl)', marginTop:0 }}>
          <h2 className="cta-h2" style={{ fontSize:'clamp(26px,3.5vw,40px)' }}>Join us on our mission</h2>
          <p className="cta-sub">Try LegalEase free — no credit card required.</p>
          <button className="btn btn-accent btn-lg" style={{ position:'relative', zIndex:1 }} onClick={() => setPage('upload')}>Try LegalEase Free →</button>
        </div>
      </div>
    </>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);
  const [faqs, setFaqs] = useState({});
  useScrollReveal();

  const faqData = [
    { q:'Is LegalEase a substitute for legal advice?', a:'No. LegalEase is an informational tool designed to help you understand documents. It is not a law firm and does not provide legal advice. For important legal matters, please consult a qualified attorney.' },
    { q:'How secure are my documents?', a:'All documents are encrypted in transit using TLS 1.3 and at rest with AES-256. We do not store your documents after processing. Our infrastructure is SOC 2 Type II compliant.' },
    { q:'What file formats do you support?', a:'We support PDF, DOCX, and TXT files, as well as direct text pasting. We are actively working on adding support for more formats.' },
    { q:'How accurate is the AI simplification?', a:'Our AI achieves a 98% accuracy rate in identifying and correctly simplifying legal clauses, validated against a dataset of 10,000+ professionally reviewed documents.' },
    { q:'Can I use LegalEase for non-English documents?', a:'Currently LegalEase supports English-language documents only. We are working on expanding to Spanish, French, German, and Hindi in the next update.' },
  ];

  return (
    <div className="contact-page">
      <div style={{ textAlign:'center' }}>
        <div className="eyebrow">Get In Touch</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(40px,7vw,72px)', fontWeight:800, letterSpacing:'-2px', lineHeight:1.04, marginBottom:16, marginTop:12 }}>
          We'd love to hear from you
        </h1>
        <p style={{ color:'var(--ink-3)', fontSize:17, maxWidth:460, margin:'0 auto' }}>Have a question or feedback? Our team usually responds within 24 hours.</p>
      </div>

      <div className="contact-grid">
        <div>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, marginBottom:8 }}>Contact Methods</h3>
          <p style={{ fontSize:14, color:'var(--ink-3)', lineHeight:1.75, marginBottom:24 }}>Available Monday–Friday, 9am–6pm IST.</p>
          {[
            { icon:'✉️', title:'Email', val:'hello@legalease.ai' },
            { icon:'💬', title:'Live Chat', val:'Available in the app' },
            { icon:'𝕏', title:'Twitter / X', val:'@LegalEaseAI' },
            { icon:'💼', title:'LinkedIn', val:'LegalEase AI' },
          ].map((m,i) => (
            <div className="contact-method" key={i}>
              <div className="contact-method-icon">{m.icon}</div>
              <div><div className="contact-method-title">{m.title}</div><div className="contact-method-val">{m.val}</div></div>
            </div>
          ))}
        </div>

        <div className="contact-form-card">
          {sent ? (
            <div className="submit-success">
              <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
              <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Message sent!</p>
              <span style={{ fontSize:13, opacity:.8 }}>We'll get back to you within 24 hours.</span>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, marginBottom:22 }}>Send a Message</h3>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="jane@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                  <option value="">Select a topic…</option>
                  <option>General Inquiry</option><option>Technical Support</option>
                  <option>Billing & Pricing</option><option>Partnership / API</option>
                  <option>Privacy & Security</option><option>Other</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell us how we can help…" value={form.message} onChange={e => setForm({...form, message:e.target.value})} /></div>
              <button className="btn btn-primary btn-md" style={{ width:'100%', justifyContent:'center', marginTop:4 }} onClick={() => { if(!form.name||!form.email||!form.message) return; setSent(true); }} disabled={!form.name||!form.email||!form.message}>
                Send Message →
              </button>
            </>
          )}
        </div>
      </div>

      <div className="faq-section">
        <div className="eyebrow">FAQ</div>
        <h2 className="section-h2" style={{ marginTop:8, marginBottom:32 }}>Frequently asked questions</h2>
        {faqData.map((f,i) => (
          <div className="faq-item" key={i}>
            <div className="faq-q" onClick={() => setFaqs(p => ({...p,[i]:!p[i]}))}>
              <span>{f.q}</span>
              <span className={`faq-icon${faqs[i]?' open':''}`}>+</span>
            </div>
            <div className={`faq-a${faqs[i]?' open':''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadPage({ onProcess }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setProgress(0);

    const interval = setInterval(() => setProgress(p => {
      if (p >= 100) {
        clearInterval(interval);
        return 100;
      }
      return p + Math.random()*15;
    }), 80);

    if (f.type === 'text/plain') {
      const r = new FileReader();
      r.onload = e => setText(e.target.result);
      r.readAsText(f);
    }
  };

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const canGo = file || text.trim().length > 10;

  return (
    <div className="upload-page">
      <div style={{ textAlign:'center', marginBottom:44 }}>
        <div className="eyebrow">Simplify</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,56px)', fontWeight:800, letterSpacing:'-1.5px', marginTop:8 }}>Upload Your Document</h2>
        <p style={{ color:'var(--ink-3)', marginTop:12, fontSize:16 }}>Supports PDF, DOCX, TXT — or paste your text below</p>
      </div>

      <div className="upload-wrap">
        <div
          className={`drop-zone${drag?' drag':''}`}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={{ position:'relative', zIndex:1 }}
        >
          <input ref={ref} type="file" accept=".pdf,.docx,.txt" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
          <span className="drop-icon" style={{ position:'relative', zIndex:1 }}>{drag ? '🎯' : '📂'}</span>
          <h3 style={{ position:'relative', zIndex:1 }}>{drag ? 'Release to upload!' : 'Drag & drop your file'}</h3>
          <p style={{ position:'relative', zIndex:1 }}>or click to browse</p>
          <div className="file-types" style={{ position:'relative', zIndex:1 }}>
            {['PDF','DOCX','TXT'].map(t => <span key={t} className="type-badge">{t}</span>)}
          </div>
        </div>

        {file && (
          <div className="file-preview">
            <span style={{ fontSize:32 }}>{file.name.endsWith('.pdf')?'📕':file.name.endsWith('.docx')?'📘':'📝'}</span>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size/1024).toFixed(1)} KB</div>
              {progress < 100 && (
                <div className="progress-bar-wrap" style={{ marginTop:8 }}>
                  <div className="progress-bar-fill" style={{ width:`${Math.min(progress,100)}%` }} />
                </div>
              )}
              {progress >= 100 && <div style={{ fontSize:11, color:'var(--green)', marginTop:4, fontWeight:600 }}>✓ Ready</div>}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setFile(null); setText(''); setProgress(0); }}>Remove</button>
          </div>
        )}

        <div className="or-divider">or paste text directly</div>
        <label className="form-label" style={{ display:'block', marginBottom:8 }}>Paste Legal Text</label>
        <textarea
          className="paste-area"
          placeholder="Paste your contract, agreement, or any legal text here…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="simplify-btn"
          disabled={!canGo}
          onClick={() => onProcess(text.trim() || (file ? `[Content from ${file.name}]` : getDemoText()))}
        >
          <span>✦</span> Simplify with AI
        </button>
        <p className="security-note"><span>🔒</span> Your document is encrypted and never stored</p>
      </div>
    </div>
  );
}

function ProcessingPage({ step }) {
  const steps = ['Reading document','Identifying clauses','Simplifying language','Detecting risks'];
  return (
    <div className="proc-page">
      <div className="spinner-ring" />
      <h2 className="proc-label">Analyzing your document</h2>
      <p className="proc-sub">Our AI is reading every clause and simplifying it for you.</p>
      <div className="typing-dots"><span/><span/><span/></div>

      <div className="step-pills">
        {steps.map((s,i) => (
          <div key={i} className={`step-pill${i < step ? ' done' : i === step ? ' active' : ''}`}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'currentColor', display:'inline-block', flexShrink:0 }} />
            {i < step ? '✓ ' : ''}{s}
          </div>
        ))}
      </div>

      <div className="proc-skeleton-wrap">
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:32, marginTop:32 }}>
          <div className="skeleton skel-header" />
          <div className="skeleton skel-line long" />
          <div className="skeleton skel-line medium" />
          <div className="skeleton skel-line short" style={{ marginBottom:24 }} />
          <div className="skeleton skel-block" />
          <div className="skeleton skel-line full" />
          <div className="skeleton skel-line long" />
        </div>
      </div>
    </div>
  );
}

function ResultPage({
  result,
  original,
  onReset,
  showToast,
  history = [],
  onOpenHistory,
  onDeleteHistory,
  deletingId
}) {
  const [tab, setTab] = useState('s');
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(tab === 's' ? result.plainEnglish : original);
    setCopied(true);
    setFlash(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setFlash(false), 500);
    showToast('Copied to clipboard!');
  };

  const copyHistoryText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('History text copied!');
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const dl = () => {
    const b = new Blob(
      [
        `LEGALEASE AI
${'='.repeat(40)}

SUMMARY
${result.summary}

KEY POINTS
${result.keyPoints.map((p,i)=>`${i+1}. ${p}`).join('\n')}

RISKS
${result.risks.map(r=>`• ${r}`).join('\n')}

FULL VERSION
${result.plainEnglish}`
      ],
      { type:'text/plain' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'legalease-simplified.txt';
    a.click();
    showToast('Download started!', 'info');
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleString();
  };

  return (
    <>
      {flash && <div className="copy-flash" />}
      <div className="result-page page-enter">
        <div className="result-hdr">
          <div>
            <div className="result-hdr-title">Simplification Complete</div>
            <div className="result-hdr-sub">Your document has been analyzed and simplified by AI</div>
          </div>
          <div className="result-acts">
            <button className="btn btn-ghost btn-sm" onClick={onReset}>← New document</button>
            <button className={`btn btn-sm ${copied ? 'btn-success' : 'btn-ghost'}`} onClick={copy}>
              {copied ? '✓ Copied!' : '⎘ Copy'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={dl}>↓ Download</button>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab-btn${tab==='s'?' on':''}`} onClick={() => setTab('s')}>✦ Simplified</button>
          <button className={`tab-btn${tab==='o'?' on':''}`} onClick={() => setTab('o')}>📄 Original</button>
        </div>

        {tab === 's' ? (
          <div className="result-card simplified">
            <div className="result-badge ai">✦ AI Simplified</div>

            {result.summary && (
              <div className="sec-block">
                <div className="sec-label">Plain English Summary</div>
                <p style={{ fontSize:15, lineHeight:1.85, color:'var(--ink-2)' }}>{result.summary}</p>
              </div>
            )}

            {result.keyPoints?.length > 0 && (
              <div className="sec-block">
                <div className="sec-label">Key Points</div>
                <ul className="kp-list">
                  {result.keyPoints.map((p,i) => (
                    <li key={i} className="kp">
                      <span className="kp-icon">✓</span>
                      <span className="kp-txt">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.risks?.length > 0 && (
              <div className="sec-block">
                <div className="sec-label">⚠ Risks & Watch-outs</div>
                {result.risks.map((r,i) => (
                  <div key={i} className="risk-item">
                    <span className="risk-icon">⚠</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="sec-block">
              <div className="sec-label">Full Plain English Version</div>
              <p style={{ fontSize:15, lineHeight:1.95, color:'var(--ink-2)', whiteSpace:'pre-wrap' }}>{result.plainEnglish}</p>
            </div>
          </div>
        ) : (
          <div className="result-card">
            <div className="result-badge original">📄 Original</div>
            <p style={{ fontSize:14, lineHeight:1.9, color:'var(--ink-3)', whiteSpace:'pre-wrap', fontFamily:'monospace' }}>{original}</p>
          </div>
        )}

        <div className="history-wrap">
          <div className="history-head">
            <div>
              <div className="history-title">Recent History</div>
              <div className="history-sub">Your latest simplified legal documents</div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              No saved documents yet. Simplify a document to see it here.
            </div>
          ) : (
            <div className="history-grid">
              {history.map((doc) => (
                <div key={doc._id} className="history-card">
                  <div className="history-card-top">
                    <span className="history-badge">Saved Document</span>
                    <span className="history-date">{formatDate(doc.createdAt)}</span>
                  </div>

                  <div className="history-label">Original Text</div>
                  <div className="history-text">{doc.originalText}</div>

                  <div className="history-divider" />

                  <div className="history-label">Simplified Text</div>
                  <div className="history-text">{doc.simplifiedText}</div>

                  <div className="history-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => onOpenHistory(doc)}>
                      Open
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => copyHistoryText(doc.simplifiedText)}>
                      Copy
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteHistory(doc._id)}
                      disabled={deletingId === doc._id}
                    >
                      {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AuthModal({ mode, onClose, onAuth }) {
  const [login, setLogin] = useState(mode === 'login');
  const [f, setF] = useState({ name:'', email:'', password:'' });

  const go = () => {
    if (!f.email || !f.password) return;
    onAuth({ name:f.name || f.email.split('@')[0], email:f.email });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>
        <h3>{login ? 'Welcome back' : 'Create account'}</h3>
        <p className="modal-sub">{login ? 'Sign in to access your documents.' : 'Join 50,000+ users simplifying legal docs.'}</p>
        {!login && <div className="mg"><label>Full Name</label><input placeholder="Jane Smith" value={f.name} onChange={e=>setF({...f,name:e.target.value})} /></div>}
        <div className="mg"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} /></div>
        <div className="mg"><label>Password</label><input type="password" placeholder="••••••••" value={f.password} onChange={e=>setF({...f,password:e.target.value})} /></div>
        <button className="btn btn-primary btn-md" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={go}>
          {login ? 'Sign in' : 'Create free account'}
        </button>
        <div className="modal-sw">
          {login ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setLogin(!login)}>{login ? 'Sign up free' : 'Sign in'}</button>
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">LegalEase AI</div>
          <p>Making legal documents accessible to everyone through the power of AI.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><a onClick={() => setPage('upload')}>Simplify Document</a></li>
            <li><a>API Access</a></li>
            <li><a>Pricing</a></li>
            <li><a>Changelog</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a onClick={() => setPage('about')}>About Us</a></li>
            <li><a>Blog</a></li>
            <li><a>Careers</a></li>
            <li><a onClick={() => setPage('contact')}>Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a>Privacy Policy</a></li>
            <li><a>Terms of Service</a></li>
            <li><a>Cookie Policy</a></li>
            <li><a>Security</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a onClick={() => setPage('contact')}>Help Center</a></li>
            <li><a onClick={() => setPage('contact')}>Contact Us</a></li>
            <li><a>Status</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 LegalEase AI. All rights reserved.</span>
        <span style={{ color:'rgba(255,255,255,0.25)' }}>Not legal advice. For informational purposes only.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState('home');
  const [procStep, setProcStep] = useState(0);
  const [result, setResult] = useState(null);
  const [original, setOriginal] = useState('');
  const [history, setHistory] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const { toasts, show: showToast, dismiss } = useToasts();

  useEffect(() => {
    if (dark) document.documentElement.setAttribute('data-dark', '');
    else document.documentElement.removeAttribute('data-dark');
  }, [dark]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5001/documents');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('History fetch error:', error);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleProcess = async (text) => {
    setOriginal(text);
    setPage('processing');
    setProcStep(0);

    const t = setInterval(() => setProcStep(s => Math.min(s+1, 3)), 900);

    try {
      const res = await fetch('http://localhost:5001/simplify-text', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ text })
      });

      const data = await res.json();

      clearInterval(t);
      setProcStep(3);

      setResult(parseAI(data.result || data.simplifiedText || text));
      await fetchHistory();
      showToast('Document simplified and saved successfully!');
    } catch (error) {
      clearInterval(t);
      console.error('Process error:', error);

      setResult({
        summary: text.slice(0, 300),
        keyPoints: ['Review key clauses carefully', 'Note any deadlines or obligations', 'Consult a lawyer if unsure'],
        risks: ['Some clauses may limit your rights', 'Auto-renewal terms may apply'],
        plainEnglish: text,
      });

      showToast('Could not save to server. Showing fallback result.', 'error');
    }

    setPage('result');
  };

  const handleOpenHistory = (doc) => {
    setOriginal(doc.originalText);
    setResult(parseAI(doc.simplifiedText));
    setPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('History item opened!');
  };

  const handleDeleteHistory = async (id) => {
    try {
      setDeletingId(id);

      const res = await fetch(`http://localhost:5001/documents/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      setHistory((prev) => prev.filter((item) => item._id !== id));
      showToast('Document deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete document', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <style>{BASE_CSS}</style>

      <Navbar
        page={page}
        setPage={goTo}
        onLogin={() => setAuthMode('login')}
        onSignup={() => setAuthMode('signup')}
        user={user}
        onLogout={() => { setUser(null); showToast('Logged out successfully'); }}
      />

      <div key={page} className="page-enter">
        {page === 'home'       && <><HomePage setPage={goTo} /><Footer setPage={goTo} /></>}
        {page === 'about'      && <><AboutPage setPage={goTo} /><Footer setPage={goTo} /></>}
        {page === 'contact'    && <><ContactPage /><Footer setPage={goTo} /></>}
        {page === 'upload'     && <UploadPage onProcess={handleProcess} />}
        {page === 'processing' && <ProcessingPage step={procStep} />}
        {page === 'result' && result && (
          <>
            <ResultPage
              result={result}
              original={original}
              history={history}
              onReset={() => {
                setPage('upload');
                setResult(null);
              }}
              showToast={showToast}
              onOpenHistory={handleOpenHistory}
              onDeleteHistory={handleDeleteHistory}
              deletingId={deletingId}
            />
            <Footer setPage={goTo} />
          </>
        )}
      </div>

     {authMode && (
  <AuthModal
    mode={authMode}
    onClose={() => setAuthMode(null)}
    onAuth={(u) => {
      setUser(u);
      showToast(`Welcome, ${u.name}! 🎉`);
    }}
  />
)}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ThemeCtx.Provider>
  );
}