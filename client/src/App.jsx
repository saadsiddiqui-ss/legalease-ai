import { useState, useRef, useCallback, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--ink:#0d0d0d;--paper:#f5f0e8;--cream:#faf7f2;
--gold:#c9a84c;--gold-light:#e8d5a0;--gold-dark:#9a7a2e;
--sage:#4a6741;--sage-light:#e8f0e6;--rust:#c4522a;
--mist:#e8e4dc;--shadow:rgba(13,13,13,0.08);--shadow-lg:rgba(13,13,13,0.15);
}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--ink);line-height:1.6;overflow-x:hidden}
.serif{font-family:'Fraunces',serif}
button{cursor:pointer;font-family:'DM Sans',sans-serif}

.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 56px;background:rgba(250,247,242,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--mist);transition:box-shadow 0.3s}
.nav.scrolled{box-shadow:0 2px 32px var(--shadow-lg)}
.nav-logo{font-family:'Fraunces',serif;font-size:21px;font-weight:700;color:var(--ink);letter-spacing:-0.5px;display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none}
.nav-badge{background:var(--gold);color:#fff;font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:1.5px;padding:3px 8px;border-radius:20px;text-transform:uppercase}
.nav-links{display:flex;align-items:center;gap:36px}
.nav-link{font-size:14px;font-weight:500;color:#666;cursor:pointer;transition:color 0.2s;background:none;border:none;padding:0}
.nav-link:hover,.nav-link.active{color:var(--ink)}
.nav-link.active{font-weight:600}
.nav-right{display:flex;gap:10px;align-items:center}
.btn-ghost{background:none;border:1.5px solid var(--mist);border-radius:8px;padding:9px 20px;font-size:14px;font-weight:500;color:var(--ink);transition:all 0.2s}
.btn-ghost:hover{border-color:var(--ink)}
.btn-dark{background:var(--ink);color:var(--cream);border:none;border-radius:8px;padding:9px 22px;font-size:14px;font-weight:600;transition:all 0.2s}
.btn-dark:hover{background:#1a1a1a;transform:translateY(-1px);box-shadow:0 4px 16px var(--shadow-lg)}

.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 48px 80px;position:relative;overflow:hidden;text-align:center}
.hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(201,168,76,0.15) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 80% 80%,rgba(74,103,65,0.08) 0%,transparent 60%)}
.hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(var(--mist) 1px,transparent 1px),linear-gradient(90deg,var(--mist) 1px,transparent 1px);background-size:52px 52px;opacity:0.45;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--paper);border:1px solid var(--gold-light);border-radius:100px;padding:7px 18px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-dark);margin-bottom:30px;position:relative;z-index:1;animation:fadeUp 0.6s ease both}
.pill-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(44px,7vw,84px);font-weight:700;line-height:1.04;letter-spacing:-2.5px;max-width:860px;margin-bottom:24px;position:relative;z-index:1;animation:fadeUp 0.7s 0.1s ease both}
.hero-h1 em{font-style:italic;color:var(--gold-dark)}
.hero-sub{font-size:18px;color:#666;max-width:520px;line-height:1.8;margin-bottom:44px;position:relative;z-index:1;animation:fadeUp 0.7s 0.2s ease both}
.hero-btns{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;animation:fadeUp 0.7s 0.3s ease both}
.btn-primary{background:var(--ink);color:var(--cream);border:none;border-radius:10px;padding:15px 34px;font-size:15px;font-weight:600;display:inline-flex;align-items:center;gap:9px;transition:all 0.2s}
.btn-primary:hover{background:#1a1a1a;transform:translateY(-2px);box-shadow:0 10px 28px var(--shadow-lg)}
.btn-outline{background:transparent;color:var(--ink);border:1.5px solid var(--mist);border-radius:10px;padding:15px 28px;font-size:15px;font-weight:500;display:inline-flex;align-items:center;gap:9px;transition:all 0.2s}
.btn-outline:hover{border-color:var(--ink);background:var(--paper)}
.hero-stats{margin-top:68px;display:flex;gap:52px;align-items:center;position:relative;z-index:1;animation:fadeUp 0.7s 0.4s ease both;flex-wrap:wrap;justify-content:center}
.stat-n{font-family:'Fraunces',serif;font-size:30px;font-weight:700;color:var(--ink)}
.stat-l{font-size:12px;color:#999;margin-top:3px;letter-spacing:0.3px}
.stat-div{width:1px;height:44px;background:var(--mist)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

.trust-bar{background:var(--paper);border-top:1px solid var(--mist);border-bottom:1px solid var(--mist);padding:20px 56px;display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:#777}

.section{padding:100px 56px}
.section-eyebrow{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold-dark);margin-bottom:14px}
.section-h2{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,50px);font-weight:700;line-height:1.12;letter-spacing:-1.2px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px;margin-top:60px}
.feat-card{background:var(--paper);border:1px solid var(--mist);border-radius:18px;padding:34px;transition:all 0.3s}
.feat-card:hover{transform:translateY(-5px);box-shadow:0 20px 48px var(--shadow);border-color:var(--gold-light)}
.feat-icon-wrap{width:52px;height:52px;border-radius:14px;background:var(--ink);display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:22px}
.feat-title{font-family:'Fraunces',serif;font-size:20px;font-weight:600;margin-bottom:10px}
.feat-desc{font-size:14px;color:#666;line-height:1.75}

.how-section{background:var(--ink);color:var(--cream);padding:100px 56px}
.how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:36px;margin-top:60px}
.how-card{padding:32px;border:1px solid rgba(245,240,232,0.1);border-radius:18px;transition:border-color 0.3s}
.how-card:hover{border-color:rgba(201,168,76,0.4)}
.how-num{font-family:'Fraunces',serif;font-size:60px;font-weight:700;color:var(--gold);opacity:0.25;line-height:1;margin-bottom:10px}
.how-title{font-family:'Fraunces',serif;font-size:19px;font-weight:600;margin-bottom:10px}
.how-desc{font-size:14px;color:rgba(245,240,232,0.6);line-height:1.75}

.about-hero{padding:140px 56px 80px;text-align:center;position:relative;overflow:hidden}
.about-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(201,168,76,0.1) 0%,transparent 70%);z-index:0}
.about-content{position:relative;z-index:1}
.about-mission{max-width:800px;margin:0 auto;padding:80px 56px}
.mission-box{background:var(--ink);color:var(--cream);border-radius:24px;padding:56px;text-align:center;margin-bottom:80px}
.mission-box blockquote{font-family:'Fraunces',serif;font-size:clamp(22px,3vw,32px);font-style:italic;line-height:1.5;font-weight:400;color:var(--cream);margin-bottom:16px}
.mission-box cite{font-size:13px;color:rgba(245,240,232,0.5);letter-spacing:1px;text-transform:uppercase}
.values-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-bottom:80px}
.value-card{background:var(--paper);border:1px solid var(--mist);border-radius:16px;padding:28px}
.value-num{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:var(--gold-dark);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.value-title{font-family:'Fraunces',serif;font-size:19px;font-weight:600;margin-bottom:8px}
.value-desc{font-size:14px;color:#666;line-height:1.7}
.team-section{background:var(--paper);border-radius:24px;padding:56px;margin-bottom:80px}
.team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;margin-top:40px}
.team-card{text-align:center}
.team-avatar{width:72px;height:72px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:24px;font-weight:600}
.team-name{font-family:'Fraunces',serif;font-size:16px;font-weight:600;margin-bottom:4px}
.team-role{font-size:13px;color:#888}
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:20px;margin-bottom:80px}
.stat-card{background:var(--paper);border:1px solid var(--mist);border-radius:16px;padding:28px;text-align:center}
.stat-big{font-family:'Fraunces',serif;font-size:42px;font-weight:700;color:var(--ink);line-height:1}
.stat-small{font-size:13px;color:#888;margin-top:8px}

.contact-page{padding:140px 56px 80px}
.contact-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:60px;max-width:1000px;margin:60px auto 0;align-items:start}
.contact-info h3{font-family:'Fraunces',serif;font-size:22px;font-weight:600;margin-bottom:8px}
.contact-info p{font-size:14px;color:#666;line-height:1.75;margin-bottom:32px}
.contact-method{display:flex;gap:14px;align-items:center;padding:18px 20px;background:var(--paper);border:1px solid var(--mist);border-radius:14px;margin-bottom:12px;transition:border-color 0.2s}
.contact-method:hover{border-color:var(--gold-light)}
.contact-method-icon{width:40px;height:40px;border-radius:10px;background:var(--ink);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.contact-method-title{font-size:13px;font-weight:600;margin-bottom:2px}
.contact-method-val{font-size:13px;color:#888}
.contact-form{background:var(--paper);border:1px solid var(--mist);border-radius:24px;padding:40px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#666;margin-bottom:7px}
.form-group input,.form-group textarea,.form-group select{width:100%;padding:12px 16px;border:1.5px solid var(--mist);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;background:var(--cream);color:var(--ink);outline:none;transition:border-color 0.2s}
.form-group input:focus,.form-group textarea:focus,.form-group select:focus{border-color:var(--gold)}
.form-group textarea{height:140px;resize:vertical;line-height:1.6}
.submit-btn{width:100%;padding:15px;background:var(--ink);color:var(--cream);border:none;border-radius:12px;font-size:15px;font-weight:600;transition:all 0.2s;margin-top:4px}
.submit-btn:hover{background:#1a1a1a;transform:translateY(-1px);box-shadow:0 8px 24px var(--shadow-lg)}
.submit-success{background:var(--sage-light);border:1px solid rgba(74,103,65,0.3);border-radius:12px;padding:20px;text-align:center;color:var(--sage)}
.faq-section{max-width:1000px;margin:80px auto 0}
.faq-item{border-bottom:1px solid var(--mist);padding:22px 0}
.faq-q{font-family:'Fraunces',serif;font-size:17px;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px}
.faq-icon{font-size:20px;color:var(--gold-dark);flex-shrink:0;transition:transform 0.3s}
.faq-icon.open{transform:rotate(45deg)}
.faq-a{font-size:14px;color:#666;line-height:1.8;max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s}
.faq-a.open{max-height:200px;padding-top:14px}

.upload-page{min-height:100vh;padding:100px 56px 80px;display:flex;flex-direction:column;align-items:center}
.upload-header{text-align:center;margin-bottom:48px}
.upload-header h2{font-family:'Fraunces',serif;font-size:42px;font-weight:700;letter-spacing:-1px}
.upload-header p{color:#777;margin-top:12px;font-size:16px}
.upload-wrap{width:100%;max-width:680px}
.drop-zone{border:2px dashed var(--mist);border-radius:22px;padding:68px 40px;text-align:center;cursor:pointer;transition:all 0.3s;background:var(--paper)}
.drop-zone:hover,.drop-zone.drag{border-color:var(--gold);background:rgba(201,168,76,0.03)}
.drop-icon{font-size:52px;margin-bottom:16px}
.drop-zone h3{font-family:'Fraunces',serif;font-size:22px;font-weight:600;margin-bottom:8px}
.drop-zone p{color:#999;font-size:14px}
.file-types{display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap}
.type-badge{background:var(--mist);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;color:#777;letter-spacing:0.5px}
.file-preview{margin-top:22px;background:var(--paper);border:1px solid var(--mist);border-radius:16px;padding:20px 24px;display:flex;align-items:center;gap:16px}
.file-icon{font-size:34px}
.file-info{flex:1}
.file-name{font-weight:600;font-size:15px}
.file-size{font-size:12px;color:#999;margin-top:2px}
.remove-btn{background:none;border:1px solid var(--mist);border-radius:8px;padding:6px 14px;font-size:12px;color:#888;transition:all 0.2s}
.remove-btn:hover{border-color:var(--rust);color:var(--rust)}
.or-divider{display:flex;align-items:center;gap:16px;margin:22px 0;color:#bbb;font-size:13px}
.or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:var(--mist)}
.paste-label{font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#777;margin-bottom:8px;display:block}
.paste-area{width:100%;height:190px;border:1.5px solid var(--mist);border-radius:14px;padding:16px;font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7;background:var(--paper);color:var(--ink);resize:vertical;outline:none;transition:border-color 0.2s}
.paste-area:focus{border-color:var(--gold)}
.simplify-btn{width:100%;margin-top:22px;padding:17px;background:var(--ink);color:var(--cream);border:none;border-radius:14px;font-size:16px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s}
.simplify-btn:hover:not(:disabled){background:#1a1a1a;transform:translateY(-2px);box-shadow:0 10px 28px var(--shadow-lg)}
.simplify-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none}
.security-note{text-align:center;font-size:12px;color:#bbb;margin-top:12px}

.proc-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;text-align:center}
.ring{width:76px;height:76px;border-radius:50%;border:3px solid var(--mist);border-top-color:var(--gold);animation:spin 0.9s linear infinite;margin:0 auto 34px}
@keyframes spin{to{transform:rotate(360deg)}}
.proc-title{font-family:'Fraunces',serif;font-size:30px;font-weight:600;margin-bottom:12px}
.proc-sub{color:#888;font-size:15px}
.proc-steps{display:flex;gap:8px;margin-top:40px;flex-wrap:wrap;justify-content:center}
.proc-step{background:var(--paper);border:1px solid var(--mist);border-radius:100px;padding:7px 18px;font-size:13px;color:#888;display:flex;align-items:center;gap:7px}
.proc-step.active{border-color:var(--gold);color:var(--gold-dark);background:rgba(201,168,76,0.06)}

.result-page{min-height:100vh;padding:100px 56px 80px}
.result-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:32px}
.result-hdr h2{font-family:'Fraunces',serif;font-size:38px;font-weight:700;letter-spacing:-0.8px}
.result-hdr p{color:#888;margin-top:6px;font-size:15px}
.result-acts{display:flex;gap:10px;flex-wrap:wrap}
.res-btn{background:var(--paper);border:1.5px solid var(--mist);border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;transition:all 0.2s;display:flex;align-items:center;gap:7px;color:var(--ink)}
.res-btn:hover{border-color:var(--ink)}
.res-btn.dark{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.res-btn.dark:hover{background:#1a1a1a}
.res-btn.ok{background:var(--sage);color:#fff;border-color:var(--sage)}
.tabs{display:inline-flex;background:var(--mist);border-radius:12px;padding:4px;gap:4px;margin-bottom:28px}
.tab-btn{padding:8px 26px;border-radius:9px;font-size:13px;font-weight:600;background:transparent;color:#777;border:none;transition:all 0.2s;font-family:'DM Sans',sans-serif}
.tab-btn.on{background:var(--cream);color:var(--ink);box-shadow:0 1px 6px var(--shadow)}
.result-card{background:var(--paper);border:1px solid var(--mist);border-radius:22px;padding:44px;line-height:1.9;position:relative}
.result-card.s{border-color:var(--gold-light);background:linear-gradient(135deg,var(--paper) 0%,rgba(201,168,76,0.03) 100%)}
.res-badge{position:absolute;top:22px;right:22px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 13px}
.res-badge.ai{background:var(--sage-light);color:var(--sage)}
.res-badge.og{background:var(--mist);color:#888}
.sec-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-dark);margin-bottom:10px}
.sec-block{margin-bottom:30px;padding-bottom:30px;border-bottom:1px solid var(--mist)}
.sec-block:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
.kp-list{list-style:none;display:flex;flex-direction:column;gap:10px}
.kp{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:var(--cream);border-radius:10px;border-left:3px solid var(--gold)}
.kp-icon{color:var(--gold);font-size:15px;flex-shrink:0;margin-top:2px}
.kp-txt{font-size:14px;line-height:1.65}
.risk{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;background:rgba(196,82,42,0.05);border-radius:10px;margin-bottom:8px;border-left:3px solid var(--rust);font-size:14px}
.risk-ic{color:var(--rust);flex-shrink:0}

.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(13,13,13,0.65);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fIn 0.2s ease}
@keyframes fIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--cream);border-radius:26px;padding:50px;width:100%;max-width:440px;position:relative;animation:sUp 0.3s ease}
@keyframes sUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.modal-x{position:absolute;top:20px;right:20px;background:var(--mist);border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;transition:background 0.2s}
.modal-x:hover{background:var(--gold-light)}
.modal h3{font-family:'Fraunces',serif;font-size:28px;font-weight:700;margin-bottom:8px}
.modal p{color:#888;font-size:14px;margin-bottom:32px}
.mg{margin-bottom:16px}
.mg label{display:block;font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#666;margin-bottom:6px}
.mg input{width:100%;padding:12px 16px;border:1.5px solid var(--mist);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;background:var(--paper);color:var(--ink);outline:none;transition:border-color 0.2s}
.mg input:focus{border-color:var(--gold)}
.form-sub{width:100%;padding:14px;background:var(--ink);color:var(--cream);border:none;border-radius:10px;font-size:15px;font-weight:600;margin-top:8px;transition:all 0.2s;font-family:'DM Sans',sans-serif}
.form-sub:hover{background:#1a1a1a}
.modal-sw{text-align:center;margin-top:20px;font-size:14px;color:#999}
.modal-sw button{background:none;border:none;color:var(--gold-dark);font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer}

.footer{background:var(--ink);color:rgba(245,240,232,0.65);padding:70px 56px 32px}
.footer-top{display:flex;gap:48px;flex-wrap:wrap;justify-content:space-between;margin-bottom:52px}
.footer-brand{max-width:280px}
.footer-logo{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--cream);margin-bottom:12px}
.footer-brand p{font-size:14px;line-height:1.75}
.footer-col h4{font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--cream);margin-bottom:18px}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:11px}
.footer-links a{color:rgba(245,240,232,0.55);text-decoration:none;font-size:14px;transition:color 0.2s;cursor:pointer}
.footer-links a:hover{color:var(--cream)}
.footer-bottom{border-top:1px solid rgba(245,240,232,0.1);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px}

.toast{position:fixed;bottom:32px;right:32px;z-index:300;background:var(--ink);color:var(--cream);padding:14px 24px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 8px 28px var(--shadow-lg);animation:tIn 0.3s ease;display:flex;align-items:center;gap:8px}
@keyframes tIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:768px){
  .nav{padding:14px 20px}
  .nav-links{display:none}
  .hero,.section,.upload-page,.result-page,.contact-page,.about-hero{padding-left:24px;padding-right:24px}
  .about-mission{padding:60px 24px}
  .contact-grid{grid-template-columns:1fr}
  .form-row{grid-template-columns:1fr}
  .result-card{padding:24px}
  .footer{padding:48px 24px 24px}
  .how-section{padding:64px 24px}
}
`;

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
  const flush = () => { if (buf.length) sec[cur] = buf.join('\n').trim(); buf = []; };
  for (const l of lines) {
    if (/SUMMARY/i.test(l)) { flush(); cur = 'summary'; }
    else if (/KEY POINTS|IMPORTANT/i.test(l)) { flush(); cur = 'kp'; }
    else if (/RISKS|RED FLAGS/i.test(l)) { flush(); cur = 'risks'; }
    else if (/PLAIN ENGLISH|SIMPLE/i.test(l)) { flush(); cur = 'plain'; }
    else buf.push(l);
  }
  flush();
  const bullets = t => (t || '').split('\n').map(l => l.replace(/^[-•*\d.]+\s*/, '').trim()).filter(Boolean);
  return {
    summary: sec.summary || text.slice(0, 400),
    keyPoints: bullets(sec.kp).slice(0, 5),
    risks: bullets(sec.risks).slice(0, 3),
    plainEnglish: sec.plain || sec.summary || text,
  };
}

// ── Navbar ──
function Navbar({ page, setPage, onLogin, onSignup, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-logo" onClick={() => setPage('home')}>
        LegalEase<span className="nav-badge">AI</span>
      </div>
      <div className="nav-links">
        {['home', 'about', 'contact'].map(p => (
          <button key={p} className={`nav-link${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        <button className={`nav-link${page === 'upload' ? ' active' : ''}`} onClick={() => setPage('upload')}>Simplify</button>
      </div>
      <div className="nav-right">
        {user ? (
          <><span style={{ fontSize: 13, color: '#777' }}>Hi, {user.name}</span><button className="btn-dark" onClick={onLogout}>Log out</button></>
        ) : (
          <><button className="btn-ghost" onClick={onLogin}>Log in</button><button className="btn-dark" onClick={onSignup}>Sign up free</button></>
        )}
      </div>
    </nav>
  );
}

// ── Home Page ──
function HomePage({ setPage }) {
  const features = [
    { icon: '✨', title: 'AI Simplification', desc: 'Advanced language models trained on legal texts transform complex legalese into readable plain English.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Get simplified results in under 10 seconds. No waiting, no queues — just fast, accurate analysis.' },
    { icon: '🛡️', title: 'Bank-Grade Security', desc: 'Your documents are encrypted end-to-end. We never store your sensitive legal files on our servers.' },
    { icon: '⚖️', title: 'Key Clause Detection', desc: 'Automatically highlights important clauses, obligations, deadlines, and potential red flags.' },
    { icon: '📄', title: 'Multi-Format Support', desc: 'Works with PDF, DOCX, and plain text. Paste directly or upload your file with ease.' },
    { icon: '🌐', title: 'Global Jurisdictions', desc: 'Understands legal language from US, UK, EU, Indian, and international contracts.' },
  ];
  const steps = [
    { title: 'Upload Your Document', desc: 'Drag & drop your PDF, DOCX, or paste text directly into the editor.' },
    { title: 'AI Analyzes It', desc: 'Our model reads every clause, detects legal jargon, and identifies key terms.' },
    { title: 'Get Plain English', desc: 'Receive a clear summary, key points, and a plain-English version in seconds.' },
    { title: 'Take Action', desc: 'Copy, download, or share the simplified version with total confidence.' },
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-bg" /><div className="hero-grid" />
        <div className="hero-pill"><span className="pill-dot" />AI-Powered Legal Simplification</div>
        <h1 className="hero-h1 serif">Understand Any<br /><em>Legal Document</em><br />Instantly</h1>
        <p className="hero-sub">Upload any contract, agreement, or legal filing. Our AI breaks it down into plain language you can actually understand — in seconds.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => setPage('upload')}>Try Now — It's Free →</button>
          <button className="btn-outline" onClick={() => setPage('about')}>Learn About Us</button>
        </div>
        <div className="hero-stats">
          <div><div className="stat-n serif">50K+</div><div className="stat-l">Documents Simplified</div></div>
          <div className="stat-div" />
          <div><div className="stat-n serif">98%</div><div className="stat-l">Accuracy Rate</div></div>
          <div className="stat-div" />
          <div><div className="stat-n serif">&lt;10s</div><div className="stat-l">Processing Time</div></div>
          <div className="stat-div" />
          <div><div className="stat-n serif">4.9★</div><div className="stat-l">User Rating</div></div>
        </div>
      </section>

      <div className="trust-bar">
        {[['🔒', '256-bit Encryption'], ['✓', 'SOC 2 Compliant'], ['⚡', '99.9% Uptime'], ['🌐', '40+ Countries'], ['❤️', 'Loved by 50,000+ Users']].map(([ic, lbl]) => (
          <div className="trust-item" key={lbl}><span style={{ fontSize: 15 }}>{ic}</span>{lbl}</div>
        ))}
      </div>

      <section className="section" id="features">
        <div className="section-eyebrow">Why LegalEase</div>
        <h2 className="section-h2 serif">Everything you need to understand<br />any legal document</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-icon-wrap">{f.icon}</div>
              <div className="feat-title serif">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-eyebrow" style={{ color: 'var(--gold)' }}>The Process</div>
        <h2 className="section-h2 serif" style={{ color: 'var(--cream)', maxWidth: 520 }}>From confusing legalese<br />to crystal-clear English</h2>
        <div className="how-grid">
          {steps.map((s, i) => (
            <div className="how-card" key={i}>
              <div className="how-num serif">0{i + 1}</div>
              <div className="how-title serif">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 52 }}>
          <button className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--ink)' }} onClick={() => setPage('upload')}>Start Simplifying →</button>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper)', textAlign: 'center' }}>
        <div className="section-eyebrow">Testimonials</div>
        <h2 className="section-h2 serif" style={{ maxWidth: 440, margin: '0 auto' }}>People love LegalEase</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 52 }}>
          {[
            { q: '"Finally I understood my apartment lease. Found two clauses I would never have caught."', name: 'Priya S.', role: 'First-time renter' },
            { q: '"Used it for a freelance contract. Saved me hours of confusion and probably saved me money."', name: 'James K.', role: 'Freelance designer' },
            { q: '"As a small business owner, this tool is invaluable. Clear, fast, and accurate every time."', name: 'Anita R.', role: 'Startup founder' },
          ].map((t, i) => (
            <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--mist)', borderRadius: 18, padding: 30, textAlign: 'left' }}>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 20, color: '#444' }}>{t.q}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', fontSize: 13, fontWeight: 600 }}>{t.name[0]}</div>
                <div><div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div><div style={{ fontSize: 12, color: '#999' }}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 56px', textAlign: 'center', background: 'var(--ink)' }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, color: 'var(--cream)', letterSpacing: '-1px', marginBottom: 20 }}>Ready to understand your<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>legal documents?</em></h2>
        <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: 17, marginBottom: 36 }}>Join 50,000+ people who use LegalEase to cut through legal complexity.</p>
        <button className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--ink)', fontSize: 16, padding: '16px 40px' }} onClick={() => setPage('upload')}>Try LegalEase Free →</button>
      </section>
    </>
  );
}

// ── About Page ──
function AboutPage({ setPage }) {
  const values = [
    { n: '01', title: 'Accessibility', desc: 'Legal language should not be a barrier. Everyone deserves to understand documents that affect their lives.' },
    { n: '02', title: 'Accuracy', desc: 'We never compromise on quality. Our AI is rigorously tested to ensure reliable, truthful simplifications.' },
    { n: '03', title: 'Privacy', desc: 'Your documents are yours. We encrypt everything end-to-end and never store your sensitive files.' },
    { n: '04', title: 'Simplicity', desc: 'Complexity is the enemy of understanding. We obsess over making our product as easy to use as possible.' },
  ];
  const team = [
    { name: 'Saad Siddiqui', role: 'CEO & Co-founder', init: 'SS', color: '#e8d5a0', tc: '#9a7a2e' },
    { name: 'Mudir Ansari', role: 'CTO & Co-founder', init: 'MA', color: '#e8f0e6', tc: '#4a6741' },
    { name: 'MD Zaib', role: 'Head of AI', init: 'MZ', color: '#faf7f2', tc: '#555' },
    { name: 'Sahil Alam', role: 'Head of Design', init: 'SA', color: 'rgba(196,82,42,0.1)', tc: '#c4522a' },
  ];
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-content">
          <div style={{ display: 'inline-block', background: 'var(--paper)', border: '1px solid var(--gold-light)', borderRadius: 100, padding: '7px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 28 }}>Our Story</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(42px,7vw,80px)', fontWeight: 700, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 24 }}>Built for the people<br />who can't afford a lawyer</h1>
          <p style={{ fontSize: 18, color: '#666', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>LegalEase was born out of frustration. We saw too many people sign documents they didn't fully understand — and we decided to do something about it.</p>
        </div>
      </section>
      <div className="about-mission">
        <div className="mission-box">
          <blockquote>"Legal clarity shouldn't be a privilege reserved for those who can afford expensive lawyers. It should be a right accessible to everyone."</blockquote>
          <cite>— Saad Siddiqui, CEO & Co-founder</cite>
        </div>
        <div className="stats-row">
          {[['50K+', 'Documents simplified'], ['98%', 'Accuracy rate'], ['140+', 'Countries served'], ['4.9★', 'App store rating']].map(([n, l]) => (
            <div className="stat-card" key={l}><div className="stat-big serif">{n}</div><div className="stat-small">{l}</div></div>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}><div className="section-eyebrow">Our Values</div></div>
        <div className="values-grid">
          {values.map((v, i) => (
            <div className="value-card" key={i}>
              <div className="value-num">{v.n}</div>
              <div className="value-title serif">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
        <div className="team-section">
          <div className="section-eyebrow">The Team</div>
          <h2 className="section-h2 serif" style={{ marginTop: 8 }}>The people behind LegalEase</h2>
          <div className="team-grid">
            {team.map((t, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar" style={{ background: t.color, color: t.tc }}>{t.init}</div>
                <div className="team-name serif">{t.name}</div>
                <div className="team-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', background: 'var(--ink)', borderRadius: 24, padding: 56 }}>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: 'var(--cream)', marginBottom: 16 }}>Join us on our mission</h3>
          <p style={{ color: 'rgba(245,240,232,0.6)', marginBottom: 32, fontSize: 16 }}>Try LegalEase free — no credit card required.</p>
          <button className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--ink)' }} onClick={() => setPage('upload')}>Try LegalEase Free →</button>
        </div>
      </div>
    </>
  );
}

// ── Contact Page ──
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [faqs, setFaqs] = useState({});
  const faqData = [
    { q: 'Is LegalEase a substitute for legal advice?', a: 'No. LegalEase is an informational tool designed to help you understand documents. It is not a law firm and does not provide legal advice. For important legal matters, please consult a qualified attorney.' },
    { q: 'How secure are my documents?', a: 'All documents are encrypted in transit using TLS 1.3 and at rest with AES-256. We do not store your documents after processing. Our infrastructure is SOC 2 Type II compliant.' },
    { q: 'What file formats do you support?', a: 'We support PDF, DOCX, and TXT files, as well as direct text pasting. We are actively working on adding support for more formats.' },
    { q: 'How accurate is the AI simplification?', a: 'Our AI achieves a 98% accuracy rate in identifying and correctly simplifying legal clauses, validated against a dataset of 10,000+ professionally reviewed documents.' },
    { q: 'Can I use LegalEase for non-English documents?', a: 'Currently LegalEase supports English-language documents only. We are working on expanding to Spanish, French, German, and Hindi in the next update.' },
  ];
  const submit = () => { if (!form.name || !form.email || !form.message) return; setSent(true); };
  const toggleFaq = i => setFaqs(f => ({ ...f, [i]: !f[i] }));
  return (
    <div className="contact-page">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'inline-block', background: 'var(--paper)', border: '1px solid var(--gold-light)', borderRadius: 100, padding: '7px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 28 }}>Get In Touch</div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(38px,6vw,70px)', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: 18 }}>We'd love to hear<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-dark)' }}>from you</em></h1>
        <p style={{ color: '#777', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>Have a question, feedback, or partnership inquiry? Our team usually responds within 24 hours.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>Contact Methods</h3>
          <p>Choose the method that works best for you. Our support team is available Monday–Friday, 9am–6pm IST.</p>
          {[
            { icon: '✉️', title: 'Email', val: 'hello@legalease.ai' },
            { icon: '💬', title: 'Live Chat', val: 'Available in the app' },
            { icon: '🐦', title: 'Twitter / X', val: '@LegalEaseAI' },
            { icon: '💼', title: 'LinkedIn', val: 'LegalEase AI' },
          ].map((m, i) => (
            <div className="contact-method" key={i}>
              <div className="contact-method-icon">{m.icon}</div>
              <div><div className="contact-method-title">{m.title}</div><div className="contact-method-val">{m.val}</div></div>
            </div>
          ))}
        </div>
        <div className="contact-form">
          {sent ? (
            <div className="submit-success">
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Message sent successfully!</p>
              <span style={{ fontSize: 13, opacity: 0.8 }}>We'll get back to you within 24 hours.</span>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Send a Message</h3>
              <div className="form-row">
                <div className="form-group"><label>Your Name</label><input placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="jane@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  <option value="">Select a topic…</option>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing & Pricing</option>
                  <option>Partnership / API</option>
                  <option>Privacy & Security</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group"><label>Message</label><textarea placeholder="Tell us how we can help…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
              <button className="submit-btn" onClick={submit} disabled={!form.name || !form.email || !form.message}>Send Message →</button>
            </>
          )}
        </div>
      </div>
      <div className="faq-section">
        <div className="section-eyebrow">FAQ</div>
        <h2 className="section-h2 serif" style={{ marginTop: 8, marginBottom: 36 }}>Frequently asked questions</h2>
        {faqData.map((f, i) => (
          <div className="faq-item" key={i}>
            <div className="faq-q" onClick={() => toggleFaq(i)}>
              <span>{f.q}</span>
              <span className={`faq-icon${faqs[i] ? ' open' : ''}`}>+</span>
            </div>
            <div className={`faq-a${faqs[i] ? ' open' : ''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Upload Page ──
function UploadPage({ onProcess }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const handleFile = f => {
    if (!f) return; setFile(f);
    if (f.type === 'text/plain') { const r = new FileReader(); r.onload = e => setText(e.target.result); r.readAsText(f); }
  };
  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, []);
  const canGo = file || text.trim().length > 50;
  const go = () => onProcess(text.trim() || (file ? `[Content from ${file.name}]` : getDemoText()));
  return (
    <div className="upload-page">
      <div className="upload-header"><h2 className="serif">Upload Your Document</h2><p>Supports PDF, DOCX, TXT — or paste your text below</p></div>
      <div className="upload-wrap">
        <div className={`drop-zone${drag ? ' drag' : ''}`} onClick={() => ref.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
          <input ref={ref} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <div className="drop-icon">📂</div>
          <h3 className="serif">{drag ? 'Drop it here!' : 'Drag & drop your file'}</h3>
          <p>or click to browse your computer</p>
          <div className="file-types">{['PDF', 'DOCX', 'TXT'].map(t => <span key={t} className="type-badge">{t}</span>)}</div>
        </div>
        {file && (
          <div className="file-preview">
            <div className="file-icon">{file.name.endsWith('.pdf') ? '📕' : file.name.endsWith('.docx') ? '📘' : '📝'}</div>
            <div className="file-info"><div className="file-name">{file.name}</div><div className="file-size">{(file.size / 1024).toFixed(1)} KB</div></div>
            <button className="remove-btn" onClick={() => { setFile(null); setText(''); }}>Remove</button>
          </div>
        )}
        <div className="or-divider">or paste text directly</div>
        <label className="paste-label">Paste Legal Text</label>
        <textarea className="paste-area" placeholder="Paste your contract, agreement, or any legal text here…" value={text} onChange={e => setText(e.target.value)} />
        <button className="simplify-btn" disabled={!canGo} onClick={go}>✨ Simplify with AI</button>
        <p className="security-note">🔒 Your document is encrypted and never stored</p>
      </div>
    </div>
  );
}

// ── Processing Page ──
function ProcessingPage({ step }) {
  const steps = ['Reading document', 'Identifying clauses', 'Simplifying language', 'Detecting risks'];
  return (
    <div className="proc-page">
      <div className="ring" />
      <h2 className="proc-title serif">Analyzing your document…</h2>
      <p className="proc-sub">Our AI is reading every clause and simplifying it for you.</p>
      <div className="proc-steps">
        {steps.map((s, i) => (
          <div key={i} className={`proc-step${i <= step ? ' active' : ''}`}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {i < step ? '✓ ' : ''}{s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Result Page ──
function ResultPage({ result, original, onReset }) {
  const [tab, setTab] = useState('s');
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(tab === 's' ? result.plainEnglish : original); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const dl = () => {
    const b = new Blob([`LEGALEASE AI\n${'='.repeat(40)}\n\nSUMMARY\n${result.summary}\n\nKEY POINTS\n${result.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nRISKS\n${result.risks.map(r => `• ${r}`).join('\n')}\n\nFULL VERSION\n${result.plainEnglish}`], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'legalease-simplified.txt'; a.click();
  };
  return (
    <div className="result-page">
      <div className="result-hdr">
        <div><h2 className="serif">Simplification Complete</h2><p>Your document has been analyzed and simplified by AI</p></div>
        <div className="result-acts">
          <button className="res-btn" onClick={onReset}>← New Document</button>
          <button className={`res-btn${copied ? ' ok' : ''}`} onClick={copy}>⎘ {copied ? 'Copied!' : 'Copy'}</button>
          <button className="res-btn dark" onClick={dl}>↓ Download</button>
        </div>
      </div>
      <div className="tabs">
        <button className={`tab-btn${tab === 's' ? ' on' : ''}`} onClick={() => setTab('s')}>✨ Simplified</button>
        <button className={`tab-btn${tab === 'o' ? ' on' : ''}`} onClick={() => setTab('o')}>📄 Original</button>
      </div>
      {tab === 's' ? (
        <div className="result-card s">
          <span className="res-badge ai">AI Simplified</span>
          <div className="sec-block"><div className="sec-label">Plain English Summary</div><p style={{ fontSize: 15, lineHeight: 1.85, color: '#333' }}>{result.summary}</p></div>
          {result.keyPoints.length > 0 && (<div className="sec-block"><div className="sec-label">Key Points</div><ul className="kp-list">{result.keyPoints.map((p, i) => <li key={i} className="kp"><span className="kp-icon">✓</span><span className="kp-txt">{p}</span></li>)}</ul></div>)}
          {result.risks.length > 0 && (<div className="sec-block"><div className="sec-label">⚠ Risks & Watch-outs</div>{result.risks.map((r, i) => <div key={i} className="risk"><span className="risk-ic">⚠</span><span>{r}</span></div>)}</div>)}
          <div className="sec-block"><div className="sec-label">Full Plain English Version</div><p style={{ fontSize: 15, lineHeight: 1.95, color: '#444', whiteSpace: 'pre-wrap' }}>{result.plainEnglish}</p></div>
        </div>
      ) : (
        <div className="result-card"><span className="res-badge og">Original</span><p style={{ fontSize: 14, lineHeight: 1.9, color: '#666', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{original}</p></div>
      )}
    </div>
  );
}

// ── Auth Modal ──
function AuthModal({ mode, onClose, onAuth }) {
  const [login, setLogin] = useState(mode === 'login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const go = () => { if (!f.email || !f.password) return; onAuth({ name: f.name || f.email.split('@')[0], email: f.email }); onClose(); };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>×</button>
        <h3 className="serif">{login ? 'Welcome back' : 'Create account'}</h3>
        <p>{login ? 'Sign in to access your documents.' : 'Join 50,000+ users simplifying legal docs.'}</p>
        {!login && <div className="mg"><label>Full Name</label><input placeholder="Jane Smith" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>}
        <div className="mg"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
        <div className="mg"><label>Password</label><input type="password" placeholder="••••••••" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
        <button className="form-sub" onClick={go}>{login ? 'Sign in' : 'Create free account'}</button>
        <div className="modal-sw">{login ? "Don't have an account? " : "Already have an account? "}<button onClick={() => setLogin(!login)}>{login ? 'Sign up free' : 'Sign in'}</button></div>
      </div>
    </div>
  );
}

// ── Footer ──
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo serif">LegalEase AI</div>
          <p>Making legal documents accessible to everyone through the power of AI.</p>
        </div>
        <div className="footer-col"><h4>Product</h4><ul className="footer-links"><li><a onClick={() => setPage('upload')}>Simplify Document</a></li><li><a>API Access</a></li><li><a>Pricing</a></li><li><a>Changelog</a></li></ul></div>
        <div className="footer-col"><h4>Company</h4><ul className="footer-links"><li><a onClick={() => setPage('about')}>About Us</a></li><li><a>Blog</a></li><li><a>Careers</a></li><li><a onClick={() => setPage('contact')}>Contact</a></li></ul></div>
        <div className="footer-col"><h4>Legal</h4><ul className="footer-links"><li><a>Privacy Policy</a></li><li><a>Terms of Service</a></li><li><a>Cookie Policy</a></li><li><a>Security</a></li></ul></div>
        <div className="footer-col"><h4>Support</h4><ul className="footer-links"><li><a onClick={() => setPage('contact')}>Help Center</a></li><li><a onClick={() => setPage('contact')}>Contact Us</a></li><li><a>Status</a></li></ul></div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 LegalEase AI. All rights reserved.</span>
        <span style={{ fontSize: 12, color: 'rgba(245,240,232,0.3)' }}>Not legal advice. For informational purposes only.</span>
      </div>
    </footer>
  );
}

// ── Main App ──
export default function App() {
  const [page, setPage] = useState('home');
  const [procStep, setProcStep] = useState(0);
  const [result, setResult] = useState(null);
  const [original, setOriginal] = useState('');
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const goTo = p => { setPage(p); window.scrollTo(0, 0); };

  const handleProcess = async text => {
    setOriginal(text); setPage('processing'); setProcStep(0);
    const t = setInterval(() => setProcStep(s => Math.min(s + 1, 3)), 800);
    try {
      // ── CHANGE THIS URL TO YOUR BACKEND ──
      const res = await fetch("http://localhost:5001/simplify-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      clearInterval(t); setProcStep(3);
      setResult(parseAI(data.result || data.simplified || text));
      setPage('result');
    } catch (e) {
      clearInterval(t);
      // Fallback demo result if backend is not running
      setResult({ summary: text.slice(0, 300), keyPoints: ['Review key clauses carefully', 'Note any deadlines or obligations', 'Consult a lawyer if unsure'], risks: ['Some clauses may limit your rights', 'Auto-renewal terms may apply'], plainEnglish: text });
      setPage('result');
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <Navbar page={page} setPage={goTo} onLogin={() => setAuthMode('login')} onSignup={() => setAuthMode('signup')} user={user} onLogout={() => { setUser(null); showToast('Logged out successfully'); }} />

      {page === 'home' && <><HomePage setPage={goTo} /><Footer setPage={goTo} /></>}
      {page === 'about' && <><AboutPage setPage={goTo} /><Footer setPage={goTo} /></>}
      {page === 'contact' && <><ContactPage /><Footer setPage={goTo} /></>}
      {page === 'upload' && <UploadPage onProcess={handleProcess} />}
      {page === 'processing' && <ProcessingPage step={procStep} />}
      {page === 'result' && result && <><ResultPage result={result} original={original} onReset={() => { setPage('upload'); setResult(null); }} /><Footer setPage={goTo} /></>}

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuth={u => { setUser(u); showToast(`Welcome, ${u.name}! 🎉`); }} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}