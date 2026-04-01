import { useState, useRef, useCallback, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --cream: #faf7f2;
    --gold: #c9a84c;
    --gold-light: #e8d5a0;
    --gold-dark: #9a7a2e;
    --sage: #4a6741;
    --sage-light: #e8f0e6;
    --rust: #c4522a;
    --mist: #e8e4dc;
    --shadow: rgba(13,13,13,0.08);
    --shadow-lg: rgba(13,13,13,0.15);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .serif { font-family: 'Fraunces', serif; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 48px;
    background: rgba(245,240,232,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--mist);
    transition: box-shadow 0.3s;
  }
  .nav.scrolled { box-shadow: 0 2px 24px var(--shadow-lg); }
  .nav-logo {
    font-family: 'Fraunces', serif;
    font-size: 22px; font-weight: 700;
    color: var(--ink); letter-spacing: -0.5px;
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .nav-logo-badge {
    background: var(--gold);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 9px; font-weight: 600; letter-spacing: 1.2px;
    padding: 2px 7px; border-radius: 20px; text-transform: uppercase;
  }
  .nav-links { display: flex; align-items: center; gap: 32px; }
  .nav-link {
    font-size: 14px; font-weight: 500; color: #555;
    text-decoration: none; cursor: pointer;
    transition: color 0.2s;
  }
  .nav-link:hover { color: var(--ink); }
  .nav-cta {
    background: var(--ink); color: var(--cream);
    border: none; border-radius: 8px;
    padding: 10px 22px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .nav-cta:hover { background: #2a2a2a; transform: translateY(-1px); box-shadow: 0 4px 12px var(--shadow-lg); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 120px 48px 80px;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(74,103,65,0.08) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image: linear-gradient(var(--mist) 1px, transparent 1px),
                      linear-gradient(90deg, var(--mist) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.5;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--paper); border: 1px solid var(--gold-light);
    border-radius: 100px; padding: 6px 16px;
    font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--gold-dark);
    margin-bottom: 28px; position: relative; z-index: 1;
    animation: fadeSlideUp 0.6s ease both;
  }
  .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .hero-h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(42px, 7vw, 82px);
    font-weight: 700; line-height: 1.05;
    letter-spacing: -2px; color: var(--ink);
    max-width: 820px; margin-bottom: 24px;
    position: relative; z-index: 1;
    animation: fadeSlideUp 0.7s 0.1s ease both;
  }
  .hero-h1 em { font-style: italic; color: var(--gold-dark); }
  .hero-sub {
    font-size: 18px; color: #666; max-width: 520px;
    line-height: 1.7; margin-bottom: 44px;
    position: relative; z-index: 1;
    animation: fadeSlideUp 0.7s 0.2s ease both;
  }
  .hero-actions {
    display: flex; gap: 16px; align-items: center;
    position: relative; z-index: 1;
    animation: fadeSlideUp 0.7s 0.3s ease both;
    flex-wrap: wrap; justify-content: center;
  }
  .btn-primary {
    background: var(--ink); color: var(--cream);
    border: none; border-radius: 10px;
    padding: 14px 32px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: #1a1a1a; transform: translateY(-2px); box-shadow: 0 8px 24px var(--shadow-lg); }
  .btn-secondary {
    background: transparent; color: var(--ink);
    border: 1.5px solid var(--mist); border-radius: 10px;
    padding: 14px 28px; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-secondary:hover { border-color: var(--ink); background: var(--paper); }

  .hero-proof {
    margin-top: 64px; display: flex; gap: 48px; align-items: center;
    position: relative; z-index: 1;
    animation: fadeSlideUp 0.7s 0.4s ease both;
    flex-wrap: wrap; justify-content: center;
  }
  .hero-stat { text-align: center; }
  .hero-stat-n { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--ink); }
  .hero-stat-l { font-size: 12px; color: #888; letter-spacing: 0.5px; margin-top: 2px; }
  .hero-divider { width: 1px; height: 40px; background: var(--mist); }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FEATURES ── */
  .section { padding: 96px 48px; }
  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--gold-dark);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(30px, 4vw, 48px);
    font-weight: 700; line-height: 1.15;
    letter-spacing: -1px; max-width: 540px;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px; margin-top: 56px;
  }
  .feature-card {
    background: var(--paper); border: 1px solid var(--mist);
    border-radius: 16px; padding: 32px;
    transition: all 0.3s; position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba(201,168,76,0.05));
    pointer-events: none;
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px var(--shadow); border-color: var(--gold-light); }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--ink); color: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 20px;
  }
  .feature-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; margin-bottom: 10px; }
  .feature-desc { font-size: 14px; color: #666; line-height: 1.7; }

  /* ── HOW IT WORKS ── */
  .how-bg { background: var(--ink); color: var(--cream); }
  .how-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; margin-top: 56px; }
  .how-step { position: relative; }
  .how-step-num {
    font-family: 'Fraunces', serif; font-size: 64px; font-weight: 700;
    color: var(--gold); opacity: 0.3; line-height: 1; margin-bottom: 8px;
  }
  .how-step-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; margin-bottom: 10px; }
  .how-step-desc { font-size: 14px; color: rgba(245,240,232,0.6); line-height: 1.7; }

  /* ── UPLOAD PAGE ── */
  .upload-page {
    min-height: 100vh; padding: 100px 48px 80px;
    display: flex; flex-direction: column; align-items: center;
  }
  .upload-page-header { text-align: center; margin-bottom: 48px; }
  .upload-page-header h2 { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 700; letter-spacing: -1px; }
  .upload-page-header p { color: #666; margin-top: 12px; font-size: 16px; }

  .upload-container { width: 100%; max-width: 700px; }
  .drop-zone {
    border: 2px dashed var(--mist); border-radius: 20px;
    padding: 64px 40px; text-align: center;
    cursor: pointer; transition: all 0.3s; background: var(--paper);
    position: relative;
  }
  .drop-zone:hover, .drop-zone.dragover {
    border-color: var(--gold); background: rgba(201,168,76,0.04);
  }
  .drop-zone-icon { font-size: 48px; margin-bottom: 16px; }
  .drop-zone h3 { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; margin-bottom: 8px; }
  .drop-zone p { color: #888; font-size: 14px; }
  .drop-zone input { display: none; }
  .file-types {
    display: flex; gap: 8px; justify-content: center; margin-top: 20px; flex-wrap: wrap;
  }
  .file-type-badge {
    background: var(--mist); border-radius: 6px;
    padding: 4px 10px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px; color: #666;
  }

  .file-preview {
    margin-top: 24px; background: var(--paper);
    border: 1px solid var(--mist); border-radius: 16px;
    padding: 20px 24px; display: flex; align-items: center; gap: 16px;
  }
  .file-preview-icon { font-size: 32px; }
  .file-preview-info { flex: 1; }
  .file-preview-name { font-weight: 600; font-size: 15px; }
  .file-preview-size { font-size: 12px; color: #888; margin-top: 2px; }
  .file-preview-remove {
    background: none; border: 1px solid var(--mist); border-radius: 8px;
    padding: 6px 12px; cursor: pointer; font-size: 12px; color: #888;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .file-preview-remove:hover { border-color: var(--rust); color: var(--rust); }

  .text-input-area {
    margin-top: 16px;
  }
  .text-input-area label {
    display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;
    text-transform: uppercase; letter-spacing: 0.8px;
  }
  .text-input-area textarea {
    width: 100%; height: 180px; border: 1.5px solid var(--mist);
    border-radius: 12px; padding: 16px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; line-height: 1.7; background: var(--paper); color: var(--ink);
    resize: vertical; transition: border-color 0.2s; outline: none;
  }
  .text-input-area textarea:focus { border-color: var(--gold); }

  .or-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 24px 0; color: #aaa; font-size: 13px;
  }
  .or-divider::before, .or-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--mist);
  }

  .upload-btn {
    width: 100%; margin-top: 24px; padding: 16px;
    background: var(--ink); color: var(--cream);
    border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .upload-btn:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-2px); box-shadow: 0 8px 24px var(--shadow-lg); }
  .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── PROCESSING ── */
  .processing-page {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 48px;
    text-align: center;
  }
  .spinner-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid var(--mist);
    border-top-color: var(--gold);
    animation: spin 0.9s linear infinite;
    margin: 0 auto 32px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .processing-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; margin-bottom: 12px; }
  .processing-sub { color: #888; font-size: 15px; }
  .processing-steps { display: flex; gap: 8px; margin-top: 40px; flex-wrap: wrap; justify-content: center; }
  .processing-step {
    background: var(--paper); border: 1px solid var(--mist);
    border-radius: 100px; padding: 6px 16px; font-size: 13px; color: #666;
    display: flex; align-items: center; gap: 6px;
  }
  .processing-step.active { border-color: var(--gold); color: var(--gold-dark); background: rgba(201,168,76,0.06); }
  .processing-step-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* ── RESULT ── */
  .result-page { min-height: 100vh; padding: 100px 48px 80px; }
  .result-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 32px; }
  .result-header h2 { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 700; letter-spacing: -0.8px; }
  .result-header p { color: #888; margin-top: 6px; font-size: 15px; }
  .result-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .result-btn {
    background: var(--paper); border: 1.5px solid var(--mist);
    border-radius: 10px; padding: 10px 20px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 7px; color: var(--ink);
  }
  .result-btn:hover { border-color: var(--ink); background: var(--paper); }
  .result-btn.primary { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .result-btn.primary:hover { background: #1a1a1a; }
  .result-btn.copied { background: var(--sage); color: #fff; border-color: var(--sage); }

  .toggle-tabs {
    display: inline-flex; background: var(--mist); border-radius: 10px;
    padding: 4px; gap: 4px; margin-bottom: 28px;
  }
  .tab {
    padding: 8px 24px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif; color: #666;
  }
  .tab.active { background: var(--cream); color: var(--ink); box-shadow: 0 1px 4px var(--shadow); }

  .result-card {
    background: var(--paper); border: 1px solid var(--mist);
    border-radius: 20px; padding: 40px; line-height: 1.9;
    font-size: 15px; color: var(--ink); position: relative;
  }
  .result-card.simplified {
    border-color: var(--gold-light);
    background: linear-gradient(135deg, var(--paper) 0%, rgba(201,168,76,0.04) 100%);
  }
  .result-badge {
    position: absolute; top: 20px; right: 20px;
    background: var(--sage-light); color: var(--sage);
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; padding: 4px 12px; border-radius: 100px;
  }
  .result-card h3 { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; margin-bottom: 16px; color: #333; }
  .result-section { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid var(--mist); }
  .result-section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .result-section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 10px; }

  .key-points { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .key-point {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 14px 16px; background: var(--cream); border-radius: 10px;
    border-left: 3px solid var(--gold);
  }
  .key-point-icon { color: var(--gold); font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .key-point-text { font-size: 14px; line-height: 1.6; }

  .risk-item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 12px 16px; background: rgba(196,82,42,0.05); border-radius: 10px;
    margin-bottom: 8px; border-left: 3px solid var(--rust);
  }
  .risk-icon { color: var(--rust); font-size: 16px; flex-shrink: 0; }

  /* ── AUTH MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(13,13,13,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal {
    background: var(--cream); border-radius: 24px;
    padding: 48px; width: 100%; max-width: 440px;
    position: relative; animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .modal-close {
    position: absolute; top: 20px; right: 20px;
    background: var(--mist); border: none; border-radius: 50%;
    width: 32px; height: 32px; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .modal-close:hover { background: var(--gold-light); }
  .modal h3 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .modal p { color: #888; font-size: 14px; margin-bottom: 32px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #555; }
  .form-group input {
    width: 100%; padding: 12px 16px; border: 1.5px solid var(--mist);
    border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.2s;
  }
  .form-group input:focus { border-color: var(--gold); }
  .form-submit {
    width: 100%; padding: 14px; background: var(--ink); color: var(--cream);
    border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
    cursor: pointer; margin-top: 8px; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .form-submit:hover { background: #1a1a1a; }
  .modal-switch { text-align: center; margin-top: 20px; font-size: 14px; color: #888; }
  .modal-switch button { background: none; border: none; color: var(--gold-dark); font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }

  /* ── FOOTER ── */
  .footer {
    background: var(--ink); color: rgba(245,240,232,0.7);
    padding: 64px 48px 32px;
  }
  .footer-top { display: flex; gap: 48px; flex-wrap: wrap; justify-content: space-between; margin-bottom: 48px; }
  .footer-brand { max-width: 280px; }
  .footer-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--cream); margin-bottom: 12px; }
  .footer-brand-desc { font-size: 14px; line-height: 1.7; }
  .footer-col h4 { font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--cream); margin-bottom: 16px; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { color: rgba(245,240,232,0.6); text-decoration: none; font-size: 14px; transition: color 0.2s; cursor: pointer; }
  .footer-links a:hover { color: var(--cream); }
  .footer-bottom { border-top: 1px solid rgba(245,240,232,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-size: 13px; }

  /* ── TOASTS ── */
  .toast {
    position: fixed; bottom: 32px; right: 32px; z-index: 300;
    background: var(--ink); color: var(--cream);
    padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 24px var(--shadow-lg);
    animation: toastIn 0.3s ease, toastOut 0.3s 2.5s ease forwards;
    display: flex; align-items: center; gap: 8px;
  }
  @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toastOut { from{opacity:1} to{opacity:0} }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .hero { padding: 100px 24px 60px; }
    .section { padding: 64px 24px; }
    .upload-page, .result-page { padding: 90px 24px 60px; }
    .processing-page { padding: 24px; }
    .result-card { padding: 24px; }
    .modal { padding: 32px 24px; }
    .footer { padding: 48px 24px 24px; }
  }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    scale: "⚖️", sparkles: "✨", shield: "🛡️", bolt: "⚡",
    upload: "📤", file: "📄", pdf: "📕", doc: "📘", txt: "📝",
    check: "✓", copy: "⎘", download: "↓", arrow: "→",
    close: "×", warning: "⚠️", info: "ℹ️", lock: "🔒",
    user: "👤", star: "★", clock: "⏱", globe: "🌐",
  };
  return <span role="img" aria-label={name}>{icons[name] || "•"}</span>;
};

// ─── SAMPLE AI RESPONSE PARSER ────────────────────────────────────────────────
function parseAIResponse(text) {
  // Parse structured sections from AI response
  const sections = {};
  const lines = text.split('\n');
  let currentSection = 'summary';
  let buffer = [];

  const flush = () => {
    if (buffer.length) sections[currentSection] = buffer.join('\n').trim();
    buffer = [];
  };

  for (const line of lines) {
    if (/PLAIN SUMMARY|SUMMARY/i.test(line)) { flush(); currentSection = 'summary'; }
    else if (/KEY POINTS|IMPORTANT POINTS/i.test(line)) { flush(); currentSection = 'keyPoints'; }
    else if (/RISKS|RED FLAGS|WATCH OUT/i.test(line)) { flush(); currentSection = 'risks'; }
    else if (/PLAIN ENGLISH|SIMPLE VERSION/i.test(line)) { flush(); currentSection = 'plainEnglish'; }
    else buffer.push(line);
  }
  flush();

  // Extract bullet points
  const extractBullets = (text = '') =>
    text.split('\n').map(l => l.replace(/^[-•*\d.]+\s*/, '').trim()).filter(Boolean);

  return {
    summary: sections.summary || text.slice(0, 400),
    keyPoints: extractBullets(sections.keyPoints).slice(0, 5),
    risks: extractBullets(sections.risks).slice(0, 3),
    plainEnglish: sections.plainEnglish || sections.summary || text,
  };
}

// ─── ANTHROPIC API CALL ───────────────────────────────────────────────────────
async function simplifyWithAI(text) {
  const response = await fetch("http://localhost:5001/simplify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Navbar({ onLogin, onSignup, page, setPage, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo" onClick={() => setPage('landing')}>
        LegalEase
        <span className="nav-logo-badge">AI</span>
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => setPage('landing')}>Home</span>
        <span className="nav-link" onClick={() => setPage('upload')}>Simplify</span>
        <a className="nav-link" href="#features">Features</a>
        <a className="nav-link" href="#how">How it works</a>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        {user ? (
          <>
            <span style={{fontSize:13,color:'#666'}}>Hi, {user.name}</span>
            <button className="nav-cta" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <>
            <button className="btn-secondary" style={{padding:'8px 18px',fontSize:13}} onClick={onLogin}>Log in</button>
            <button className="nav-cta" onClick={onSignup}>Sign up free</button>
          </>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        AI-Powered Legal Simplification
      </div>
      <h1 className="hero-h1 serif">
        Simplify Legal<br /><em>Documents</em> Instantly
      </h1>
      <p className="hero-sub">
        Upload any contract, agreement, or legal filing. Our AI breaks it down into plain language you can actually understand — in seconds.
      </p>
      <div className="hero-actions">
        <button className="btn-primary" onClick={() => setPage('upload')}>
          Try Now for Free <Icon name="arrow" />
        </button>
        <button className="btn-secondary" onClick={() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>
          See how it works
        </button>
      </div>
      <div className="hero-proof">
        <div className="hero-stat">
          <div className="hero-stat-n serif">50K+</div>
          <div className="hero-stat-l">Documents Simplified</div>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat">
          <div className="hero-stat-n serif">98%</div>
          <div className="hero-stat-l">Accuracy Rate</div>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat">
          <div className="hero-stat-n serif">&lt;10s</div>
          <div className="hero-stat-l">Processing Time</div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: 'sparkles', title: 'AI-Powered Simplification', desc: 'Advanced language models trained on legal texts transform complex legalese into clear, readable English.' },
    { icon: 'bolt', title: 'Instant Processing', desc: 'Get simplified results in under 10 seconds. No waiting, no queues — just fast, accurate analysis.' },
    { icon: 'shield', title: 'Bank-Grade Security', desc: 'Your documents are encrypted end-to-end. We never store your sensitive legal files.' },
    { icon: 'scale', title: 'Key Clause Detection', desc: 'Automatically highlights important clauses, obligations, deadlines, and potential red flags.' },
    { icon: 'file', title: 'Multi-Format Support', desc: 'Works with PDF, DOCX, and plain text. Paste directly or upload your file.' },
    { icon: 'globe', title: 'Multiple Jurisdictions', desc: 'Understands legal language from US, UK, EU, and international contracts.' },
  ];
  return (
    <section className="section" id="features">
      <div className="section-label">Why LegalEase</div>
      <h2 className="section-title serif">Everything you need to understand legal documents</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon"><Icon name={f.icon} /></div>
            <div className="feature-title serif">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowSection({ setPage }) {
  const steps = [
    { title: 'Upload Your Document', desc: 'Drag & drop your PDF, DOCX, or paste text directly into the editor.' },
    { title: 'AI Analyzes It', desc: 'Our model reads every clause, detects legal jargon, and identifies key terms.' },
    { title: 'Get Plain English', desc: 'Receive a clear summary, key points, and plain-English version in seconds.' },
    { title: 'Take Action', desc: 'Copy, download, or share the simplified version with confidence.' },
  ];
  return (
    <section className="section how-bg" id="how">
      <div className="section-label" style={{color:'var(--gold)'}}>The Process</div>
      <h2 className="section-title serif" style={{color:'var(--cream)'}}>
        From confusing legalese<br />to crystal-clear English
      </h2>
      <div className="how-steps">
        {steps.map((s, i) => (
          <div className="how-step" key={i}>
            <div className="how-step-num serif">0{i+1}</div>
            <div className="how-step-title serif">{s.title}</div>
            <div className="how-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:48}}>
        <button className="btn-primary" onClick={() => setPage('upload')} style={{background:'var(--gold)',color:'var(--ink)'}}>
          Start Simplifying <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}

function UploadPage({ onProcess }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (f.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = e => setText(e.target.result);
      reader.readAsText(f);
    }
  };

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const fileIcon = file ? (
    file.name.endsWith('.pdf') ? '📕' :
    file.name.endsWith('.docx') ? '📘' : '📝'
  ) : '📄';

  const canProcess = file || text.trim().length > 50;

  const handleProcess = () => {
    const content = text.trim() || (file ? `[Simulated content from ${file.name}]` : '');
    onProcess(content || getDemoText());
  };

  return (
    <div className="upload-page">
      <div className="upload-page-header">
        <h2 className="serif">Upload Your Document</h2>
        <p>Supports PDF, DOCX, TXT — or paste your text below</p>
      </div>
      <div className="upload-container">
        <div
          className={`drop-zone ${dragging ? 'dragover' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0])} />
          <div className="drop-zone-icon">📂</div>
          <h3 className="serif">{dragging ? 'Drop it here!' : 'Drag & drop your file'}</h3>
          <p>or click to browse your computer</p>
          <div className="file-types">
            {['PDF','DOCX','TXT'].map(t => <span key={t} className="file-type-badge">{t}</span>)}
          </div>
        </div>

        {file && (
          <div className="file-preview">
            <div className="file-preview-icon">{fileIcon}</div>
            <div className="file-preview-info">
              <div className="file-preview-name">{file.name}</div>
              <div className="file-preview-size">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button className="file-preview-remove" onClick={() => { setFile(null); setText(''); }}>Remove</button>
          </div>
        )}

        <div className="or-divider">or paste text directly</div>

        <div className="text-input-area">
          <label>Paste Legal Text</label>
          <textarea
            placeholder="Paste your contract, agreement, or any legal text here..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <button className="upload-btn" disabled={!canProcess} onClick={handleProcess}>
          <Icon name="sparkles" /> Simplify with AI
        </button>
        <p style={{textAlign:'center',fontSize:12,color:'#aaa',marginTop:12}}>
          <Icon name="lock" /> Your document is encrypted and never stored
        </p>
      </div>
    </div>
  );
}

function ProcessingPage({ step }) {
  const steps = ['Reading document', 'Identifying clauses', 'Simplifying language', 'Detecting risks'];
  return (
    <div className="processing-page">
      <div className="spinner-ring" />
      <h2 className="processing-title serif">Analyzing your document...</h2>
      <p className="processing-sub">Our AI is reading every clause and simplifying it for you.</p>
      <div className="processing-steps">
        {steps.map((s, i) => (
          <div key={i} className={`processing-step ${i <= step ? 'active' : ''}`}>
            <span className="processing-step-dot" />
            {i < step ? <><Icon name="check" /> </> : ''}{s}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultPage({ result, originalText, onReset }) {
  const [tab, setTab] = useState('simplified');
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    const txt = tab === 'simplified' ? result.plainEnglish : originalText;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([
      `LEGALEASE AI — DOCUMENT SIMPLIFICATION\n${'='.repeat(40)}\n\n`,
      `SUMMARY\n${result.summary}\n\n`,
      `KEY POINTS\n${result.keyPoints.map((p,i) => `${i+1}. ${p}`).join('\n')}\n\n`,
      `RISKS TO WATCH\n${result.risks.map(r => `• ${r}`).join('\n')}\n\n`,
      `PLAIN ENGLISH VERSION\n${result.plainEnglish}`
    ], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'legalease-simplified.txt';
    a.click();
  };

  return (
    <div className="result-page">
      <div className="result-header">
        <div>
          <h2 className="serif">Simplification Complete</h2>
          <p>Your document has been analyzed and simplified by AI</p>
        </div>
        <div className="result-actions">
          <button className="result-btn" onClick={onReset}>← New Document</button>
          <button className={`result-btn ${copied ? 'copied' : ''}`} onClick={copyText}>
            <Icon name="copy" /> {copied ? 'Copied!' : 'Copy text'}
          </button>
          <button className="result-btn primary" onClick={download}>
            <Icon name="download" /> Download
          </button>
        </div>
      </div>

      <div className="toggle-tabs">
        <button className={`tab ${tab==='simplified'?'active':''}`} onClick={()=>setTab('simplified')}>
          ✨ Simplified
        </button>
        <button className={`tab ${tab==='original'?'active':''}`} onClick={()=>setTab('original')}>
          📄 Original
        </button>
      </div>

      {tab === 'simplified' ? (
        <div className="result-card simplified">
          <span className="result-badge">AI Simplified</span>

          <div className="result-section">
            <div className="result-section-title">Plain English Summary</div>
            <p style={{fontSize:15,lineHeight:1.8,color:'#333'}}>{result.summary}</p>
          </div>

          {result.keyPoints.length > 0 && (
            <div className="result-section">
              <div className="result-section-title">Key Points to Know</div>
              <ul className="key-points">
                {result.keyPoints.map((pt, i) => (
                  <li key={i} className="key-point">
                    <span className="key-point-icon">✓</span>
                    <span className="key-point-text">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.risks.length > 0 && (
            <div className="result-section">
              <div className="result-section-title">⚠ Risks & Watch-outs</div>
              {result.risks.map((r, i) => (
                <div key={i} className="risk-item">
                  <span className="risk-icon">⚠</span>
                  <span style={{fontSize:14}}>{r}</span>
                </div>
              ))}
            </div>
          )}

          <div className="result-section">
            <div className="result-section-title">Full Plain English Version</div>
            <p style={{fontSize:15,lineHeight:1.9,color:'#444',whiteSpace:'pre-wrap'}}>{result.plainEnglish}</p>
          </div>
        </div>
      ) : (
        <div className="result-card">
          <span className="result-badge" style={{background:'var(--mist)',color:'#666'}}>Original</span>
          <p style={{fontSize:14,lineHeight:1.9,color:'#555',whiteSpace:'pre-wrap',fontFamily:'monospace'}}>{originalText}</p>
        </div>
      )}
    </div>
  );
}

function AuthModal({ mode, onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [form, setForm] = useState({name:'',email:'',password:''});

  const submit = () => {
    if (!form.email || !form.password) return;
    onAuth({ name: form.name || form.email.split('@')[0], email: form.email });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        <h3 className="serif">{isLogin ? 'Welcome back' : 'Create account'}</h3>
        <p>{isLogin ? 'Sign in to access your documents.' : 'Join 50,000+ users simplifying legal docs.'}</p>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Jane Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
        )}
        <div className="form-group">
          <label>Email address</label>
          <input type="email" placeholder="jane@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        </div>
        <button className="form-submit" onClick={submit}>{isLogin ? 'Sign in' : 'Create free account'}</button>
        <div className="modal-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up free' : 'Sign in'}</button>
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
          <div className="footer-logo serif">LegalEase AI</div>
          <p className="footer-brand-desc">Making legal documents accessible to everyone through the power of AI.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><a onClick={() => setPage('upload')}>Simplify Document</a></li>
            <li><a>API Access</a></li>
            <li><a>Pricing</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a>About</a></li>
            <li><a>Blog</a></li>
            <li><a>Careers</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a>Privacy Policy</a></li>
            <li><a>Terms of Service</a></li>
            <li><a>Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 LegalEase AI. All rights reserved.</span>
        <span style={{fontSize:12,color:'rgba(245,240,232,0.4)'}}>Not legal advice. For informational purposes only.</span>
      </div>
    </footer>
  );
}

function getDemoText() {
  return `TERMS AND CONDITIONS OF SERVICE AGREEMENT

This Terms and Conditions of Service Agreement ("Agreement") is entered into as of the date of acceptance ("Effective Date") by and between LegalCorp Inc., a Delaware corporation ("Company," "we," "us," or "our"), and the individual or entity accepting these terms ("User," "you," or "your").

1. ACCEPTANCE OF TERMS
By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Agreement. If you do not agree to these terms, you must immediately discontinue use of the Service. The Company reserves the right, in its sole discretion, to modify these terms at any time without prior notice.

2. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE.

3. INDEMNIFICATION
You agree to defend, indemnify, and hold harmless the Company and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service.

4. GOVERNING LAW
These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from this agreement shall be resolved through binding arbitration.`;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('landing');
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleProcess = async (text) => {
  setOriginalText(text);
  setPage('processing');
  setProcessingStep(0);

  const stepTimer = setInterval(() => {
    setProcessingStep(s => Math.min(s + 1, 3));
  }, 800);

  try {
    const response = await fetch("http://localhost:5001/simplify-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    clearInterval(stepTimer);
    setProcessingStep(3);

    setResult({
      summary: data.result,
      keyPoints: [],
      risks: [],
      plainEnglish: data.result
    });

    setPage('result');

  } catch (err) {
    clearInterval(stepTimer);
    console.error(err);
  }
};

  return (
    <>
      <style>{CSS}</style>
      <Navbar
        page={page} setPage={setPage}
        onLogin={() => setAuthMode('login')}
        onSignup={() => setAuthMode('signup')}
        user={user}
        onLogout={() => { setUser(null); showToast('Logged out successfully'); }}
      />

      {page === 'landing' && (
        <>
          <HeroSection setPage={setPage} />
          <FeaturesSection />
          <HowSection setPage={setPage} />
          <Footer setPage={setPage} />
        </>
      )}

      {page === 'upload' && (
        <UploadPage onProcess={handleProcess} />
      )}

      {page === 'processing' && (
        <ProcessingPage step={processingStep} />
      )}

      {page === 'result' && result && (
        <>
          <ResultPage
            result={result}
            originalText={originalText}
            onReset={() => { setPage('upload'); setResult(null); }}
          />
          <Footer setPage={setPage} />
        </>
      )}

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

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}