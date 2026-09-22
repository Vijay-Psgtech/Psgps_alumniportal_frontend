// frontend/src/pages/DonatePage.jsx
// ✅ IIT Madras "Joy of Giving" aesthetic
// ✅ Fully dynamic — live stats from API
// ✅ Razorpay (INR) ONLY — Stripe removed per product spec
// ✅ PAN (text, regex AAAAA9999A) + Aadhaar (12-digit numeric) text inputs with strict validation
// ✅ Amount restricted to ₹5,000 – ₹25,000
// ✅ Cause selection flows into donation record
// ✅ All logic wired to your existing donationAPI & backend

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, GraduationCap, FlaskConical, Building2, Users,
  ShieldCheck, ChevronRight, AlertCircle, CheckCircle2,
  Sparkles,
} from "lucide-react";
import { donationAPI } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  :root {
    --navy:    #0c1f3f;
    --navy2:   #142848;
    --navy3:   #1a3460;
    --gold:    #bf8f2e;
    --gold2:   #ddb84a;
    --gold3:   #f0d080;
    --cream:   #faf8f2;
    --parchment: #f3ede0;
    --slate:   #4a5568;
    --muted:   #718096;
    --light:   #eee8d8;
    --white:   #ffffff;
    --error:   #b91c1c;
    --success: #15803d;
    --border:  rgba(12,31,63,0.14);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .jog-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--navy);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── HERO ─────────────────────────────── */
  .jog-hero {
    background: var(--navy);
    position: relative;
    overflow: hidden;
    padding: 96px 48px 72px;
    text-align: center;
  }
  .jog-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 55% at 50% 120%, rgba(191,143,46,0.28) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 80% 10%,  rgba(191,143,46,0.08) 0%, transparent 60%),
      repeating-linear-gradient(
        -45deg, transparent, transparent 48px,
        rgba(255,255,255,0.014) 48px, rgba(255,255,255,0.014) 49px
      );
    pointer-events: none;
  }
  .jog-hero-inner { position: relative; max-width: 760px; margin: 0 auto; }
  .jog-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--gold3); margin-bottom: 22px;
  }
  .jog-eyebrow::before, .jog-eyebrow::after {
    content: ''; display: inline-block; width: 32px; height: 1px;
    background: var(--gold2); opacity: 0.55;
  }
  .jog-hero h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(36px, 5.5vw, 68px);
    font-weight: 700; color: var(--white);
    line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 18px;
  }
  .jog-hero h1 em { font-style: italic; color: var(--gold3); }
  .jog-hero p {
    font-size: 16px; color: rgba(255,255,255,0.58);
    max-width: 520px; margin: 0 auto 44px; line-height: 1.8;
  }

  /* stats bar */
  .jog-stats-bar {
    display: grid; grid-template-columns: repeat(4,1fr);
    max-width: 700px; margin: 0 auto;
    border: 1px solid rgba(191,143,46,0.35); border-radius: 4px; overflow: hidden;
  }
  .jog-stat {
    padding: 18px 12px; border-right: 1px solid rgba(191,143,46,0.2);
    text-align: center;
  }
  .jog-stat:last-child { border-right: none; }
  .jog-stat-num {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(20px, 2.5vw, 28px); font-weight: 700;
    color: var(--gold3); line-height: 1; margin-bottom: 5px;
  }
  .jog-stat-label {
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.38);
  }
  .jog-stat-loading {
    width: 60px; height: 20px; background: rgba(255,255,255,0.08);
    border-radius: 3px; margin: 0 auto 5px; animation: jogPulse 1.4s ease infinite;
  }

  /* ── BREADCRUMB / PROGRESS ─────────────── */
  .jog-progress {
    background: var(--parchment);
    border-bottom: 1px solid var(--border);
    padding: 14px 48px;
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--muted);
  }
  .jog-prog-step { display: flex; align-items: center; gap: 6px; }
  .jog-prog-num {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    background: var(--light); color: var(--muted);
    transition: all 0.3s;
  }
  .jog-prog-step.active .jog-prog-num  { background: var(--navy); color: var(--gold3); }
  .jog-prog-step.done .jog-prog-num    { background: var(--success); color: white; }
  .jog-prog-step.active .jog-prog-label { color: var(--navy); font-weight: 600; }
  .jog-prog-divider { flex: 1; max-width: 40px; height: 1px; background: var(--border); }

  /* ── CAUSE CARDS ──────────────────────── */
  .jog-causes { padding: 72px 48px; background: var(--parchment); }
  .jog-section-hd { text-align: center; margin-bottom: 44px; }
  .jog-section-hd h2 {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(26px, 3.5vw, 42px); font-weight: 700;
    color: var(--navy); letter-spacing: -0.015em; margin-bottom: 8px;
  }
  .jog-section-hd p { font-size: 14px; color: var(--muted); }
  .jog-causes-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 14px; max-width: 1080px; margin: 0 auto;
  }
  .cause-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 6px; padding: 26px 20px; cursor: pointer;
    transition: all 0.22s ease; position: relative; overflow: hidden;
    user-select: none;
  }
  .cause-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: var(--gold);
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
  }
  .cause-card:hover  { border-color: var(--gold); box-shadow: 0 4px 20px rgba(191,143,46,0.14); }
  .cause-card.active { border-color: var(--gold); box-shadow: 0 4px 20px rgba(191,143,46,0.2); background: #fffdf5; }
  .cause-card:hover::after, .cause-card.active::after { transform: scaleX(1); }
  .cause-icon {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: var(--light); color: var(--navy); margin-bottom: 14px;
    transition: all 0.22s;
  }
  .cause-card.active .cause-icon, .cause-card:hover .cause-icon
    { background: var(--navy); color: var(--gold3); }
  .cause-title { font-weight: 600; font-size: 13.5px; color: var(--navy); margin-bottom: 5px; }
  .cause-desc  { font-size: 11.5px; color: var(--muted); line-height: 1.6; }
  .cause-badge {
    position: absolute; top: 12px; right: 12px;
    background: var(--navy); color: var(--gold3);
    font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase;
    padding: 3px 7px; border-radius: 2px; font-weight: 700;
  }
  .cause-check {
    position: absolute; top: 12px; right: 12px;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--gold); display: flex; align-items: center; justify-content: center;
  }

  /* ── FORM SECTION ──────────────────────── */
  .jog-form-section { padding: 72px 48px; background: var(--cream); }
  .jog-form-inner {
    max-width: 1040px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 360px; gap: 36px; align-items: start;
  }

  /* form panel */
  .jog-form-panel {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(12,31,63,0.06);
  }
  .jog-form-top {
    background: var(--navy2); padding: 26px 34px;
    border-bottom: 2px solid var(--gold);
  }
  .jog-form-top h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 22px; font-weight: 700; color: var(--white); margin-bottom: 4px;
  }
  .jog-form-top p { font-size: 11.5px; color: rgba(255,255,255,0.48); letter-spacing: 0.04em; }
  .jog-cause-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(191,143,46,0.2); color: var(--gold3);
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    padding: 4px 10px; border-radius: 20px; margin-top: 8px;
  }
  .jog-form-body { padding: 32px 34px; display: flex; flex-direction: column; gap: 22px; }

  /* field */
  .jog-field { display: flex; flex-direction: column; gap: 6px; }
  .jog-label {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--navy);
  }
  .jog-label span { color: var(--error); margin-left: 2px; }
  .jog-input, .jog-textarea {
    padding: 10px 13px; border: 1px solid rgba(12,31,63,0.18);
    border-radius: 4px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--navy); background: var(--cream);
    transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  }
  .jog-input:focus, .jog-textarea:focus {
    outline: none; border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(191,143,46,0.13);
  }
  .jog-input.err { border-color: var(--error); }
  .jog-textarea { resize: vertical; min-height: 72px; }

  /* amount presets */
  .preset-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 7px; margin-top: 4px; }
  .preset-btn {
    padding: 9px 4px; background: var(--light); border: 1px solid var(--border);
    border-radius: 4px; font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--navy);
    transition: all 0.18s; text-align: center;
  }
  .preset-btn:hover, .preset-btn.active {
    background: var(--navy); color: var(--gold3); border-color: var(--navy);
  }

  /* amount range badge */
  .amount-range-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; color: var(--muted);
    background: var(--light); border: 1px solid var(--border);
    padding: 3px 9px; border-radius: 20px; margin-top: 2px; width: fit-content;
  }

  /* amount input wrapper */
  .amount-wrap { position: relative; }
  .amount-sym {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    font-size: 15px; font-weight: 600; color: var(--navy); pointer-events: none;
  }
  .amount-wrap .jog-input { padding-left: 26px; }

  /* form row */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* anon toggle */
  .anon-row {
    display: flex; align-items: center; gap: 10px; padding: 11px 13px;
    background: var(--light); border-radius: 4px; border: 1px solid var(--border);
    cursor: pointer; user-select: none;
  }
  .anon-row input { width: 15px; height: 15px; accent-color: var(--navy); cursor: pointer; }
  .anon-row label { font-size: 12.5px; font-weight: 500; cursor: pointer; color: var(--navy); }

  /* section divider */
  .form-divider {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted);
  }
  .form-divider::before, .form-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── FIELD ERROR ──────────────────────── */
  .field-err {
    display: flex; align-items: center; gap: 4px;
    font-size: 10.5px; color: var(--error); margin-top: 1px;
  }

  /* ── KYC hint ─────────────────────────── */
  .kyc-note {
    display: flex; gap: 8px; padding: 11px 13px;
    background: rgba(12,31,63,0.04); border-left: 3px solid var(--gold);
    border-radius: 0 4px 4px 0; font-size: 11.5px; color: var(--muted); line-height: 1.55;
  }

  /* ── ALERTS ───────────────────────────── */
  .alert {
    display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
    border-radius: 4px; font-size: 13px; line-height: 1.55;
  }
  .alert.error  { background: #fef2f2; border: 1px solid #fca5a5; color: var(--error); }
  .alert.success{ background: #f0fdf4; border: 1px solid #86efac; color: var(--success); }
  .alert svg    { flex-shrink: 0; margin-top: 1px; }

  /* ── SIDEBAR ──────────────────────────── */
  .jog-sidebar { display: flex; flex-direction: column; gap: 18px; position: sticky; top: 80px; }

  /* summary card */
  .summary-card { background: var(--navy); border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(12,31,63,0.2); }
  .summary-head {
    padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,0.09);
    display: flex; align-items: center; gap: 10px;
  }
  .summary-head h4 {
    font-family: 'Libre Baskerville', serif;
    font-size: 17px; font-weight: 700; color: var(--white);
  }
  .summary-body { padding: 18px 22px; }
  .sum-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; font-size: 12.5px; color: rgba(255,255,255,0.52);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .sum-row:last-of-type { border-bottom: none; }
  .sum-row .v { color: var(--gold3); font-weight: 600; font-size: 13px; }
  .sum-total {
    margin-top: 14px; padding: 13px 15px;
    background: rgba(191,143,46,0.16); border: 1px solid rgba(191,143,46,0.32); border-radius: 4px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .sum-total .tl { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
  .sum-total .tv {
    font-family: 'Libre Baskerville', serif;
    font-size: 26px; font-weight: 700; color: var(--gold3);
  }

  /* donate button */
  .donate-btn {
    width: 100%; margin-top: 14px; padding: 14px;
    background: var(--gold); color: var(--navy);
    border: none; border-radius: 4px;
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s;
  }
  .donate-btn:hover:not(:disabled) {
    background: var(--gold2); transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(191,143,46,0.35);
  }
  .donate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .donate-btn .spin {
    width: 15px; height: 15px; border: 2px solid rgba(12,31,63,0.3);
    border-top-color: var(--navy); border-radius: 50%;
    animation: jogSpin 0.7s linear infinite;
  }
  .secure-note {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    margin-top: 9px; font-size: 10.5px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em;
  }

  /* tax card */
  .tax-card {
    background: var(--white); border: 1px solid var(--border);
    border-left: 4px solid var(--gold); border-radius: 4px; padding: 16px 18px;
  }
  .tax-card h5 {
    font-size: 12.5px; font-weight: 600; color: var(--navy);
    margin-bottom: 5px; display: flex; align-items: center; gap: 6px;
  }
  .tax-card p { font-size: 11.5px; color: var(--muted); line-height: 1.65; }

  /* impact card */
  .impact-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 6px; padding: 20px;
  }
  .impact-card h5 {
    font-family: 'Libre Baskerville', serif;
    font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 12px;
  }
  .impact-row {
    display: flex; align-items: flex-start; gap: 9px;
    margin-bottom: 9px; font-size: 11.5px; color: var(--slate); line-height: 1.55;
  }
  .impact-row svg { flex-shrink: 0; margin-top: 1px; color: var(--gold); }

  /* ── TESTIMONIAL ──────────────────────── */
  .jog-testimonial {
    background: var(--navy2); padding: 68px 48px; text-align: center;
    border-top: 2px solid rgba(191,143,46,0.2);
  }
  .quote-mark {
    font-family: 'Libre Baskerville', serif; font-size: 72px;
    color: var(--gold); opacity: 0.35; line-height: 0.4; display: block; margin-bottom: 22px;
  }
  .jog-testimonial blockquote {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(18px, 2.8vw, 30px); font-style: italic;
    color: rgba(255,255,255,0.88); max-width: 650px;
    margin: 0 auto 22px; line-height: 1.55;
  }
  .jog-testimonial cite {
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold2); font-style: normal;
  }

  /* ── ANIMATIONS ───────────────────────── */
  @keyframes jogSpin    { to { transform: rotate(360deg); } }
  @keyframes jogPulse   { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }

  /* ── RESPONSIVE ───────────────────────── */
  @media (max-width: 880px) {
    .jog-form-inner   { grid-template-columns: 1fr; }
    .jog-sidebar      { position: static; }
    .jog-hero         { padding: 72px 24px 56px; }
    .jog-progress     { padding: 12px 24px; }
    .jog-stats-bar    { grid-template-columns: repeat(2,1fr); }
    .jog-stat         { border-bottom: 1px solid rgba(191,143,46,0.2); }
    .jog-stat:nth-child(2n){ border-right: none; }
    .jog-causes, .jog-form-section { padding: 52px 24px; }
    .jog-form-body    { padding: 24px; }
    .jog-form-top     { padding: 20px 24px; }
    .preset-grid      { grid-template-columns: repeat(2,1fr); }
    .form-row         { grid-template-columns: 1fr; }
  }
  @media (max-width: 500px) {
    .jog-stats-bar { grid-template-columns: 1fr 1fr; }
  }
`;

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const MIN_INR = 5000;
const MAX_INR = 25000;

const PAN_REGEX     = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^[0-9]{12}$/;

const CAUSES = [
  {
    id: "scholarship", icon: GraduationCap,
    title: "Student Scholarships",
    desc: "Fund merit & need-based aid for deserving students.",
    badge: "High need",
    impact: {
      5000:  "Cover one student's exam fees for a semester",
      10000: "Fund a semester's books & study materials",
      15000: "Sponsor one month of tuition for a student",
      25000: "Full semester scholarship for one student",
    },
  },
  {
    id: "research", icon: FlaskConical,
    title: "Research Initiatives",
    desc: "Fuel cutting-edge projects across disciplines.",
    badge: null,
    impact: {
      5000:  "Purchase lab consumables for a research project",
      10000: "Sponsor a student researcher for a month",
      15000: "Equip part of a research workstation",
      25000: "Fund an end-to-end research project cycle",
    },
  },
  {
    id: "infrastructure", icon: Building2,
    title: "Campus Infrastructure",
    desc: "Renovate labs, halls, libraries & sports facilities.",
    badge: null,
    impact: {
      5000:  "Fund a library book collection",
      10000: "Sponsor classroom technology upgrade",
      15000: "Renovate a seminar room partition",
      25000: "Equip an entire computer lab station",
    },
  },
  {
    id: "wellness", icon: Heart,
    title: "Student Wellness",
    desc: "Support mental health, clubs & campus life.",
    badge: "New",
    impact: {
      5000:  "Fund a mental health session for 5 students",
      10000: "Sponsor a full student club activity",
      15000: "Run a wellness workshop series",
      25000: "Run a full-semester wellness programme",
    },
  },
  {
    id: "alumni_connect", icon: Users,
    title: "Alumni Connect",
    desc: "Build bridges between graduates and the institute.",
    badge: null,
    impact: {
      5000:  "Sponsor a virtual mentorship session",
      10000: "Support an alumni networking event",
      15000: "Fund a mentorship programme for 10 students",
      25000: "Establish a full alumni mentoring series",
    },
  },
];

// ✅ Updated presets: ₹5K – ₹25K only
const INR_PRESETS = [
  { amount: 5000,  label: "₹5,000"  },
  { amount: 10000, label: "₹10,000" },
  { amount: 15000, label: "₹15,000" },
  { amount: 25000, label: "₹25,000" },
];

const STEPS = ["Choose Cause", "Donation Details", "Confirm & Pay"];

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════ */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
});

const slideDownForm = {
  hidden:  { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  exit:    { opacity: 0, y: -40, transition: { duration: 0.3 } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const DonatePage = () => {

  /* ── form state ── */
  const [step, setStep]       = useState(1);
  const [cause, setCause]     = useState("scholarship");
  const [amount, setAmount]   = useState("");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [pan, setPan]         = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  usePageTitle("Donate");

  /* ── field-level errors ── */
  const [fieldErrors, setFieldErrors] = useState({});

  /* ── async state ── */
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState(null);

  /* ── derived ── */
  const feeAmt   = amount ? +(parseFloat(amount) * 0.02).toFixed(2) : 0;
  const totalAmt = amount ? +(parseFloat(amount) * 1.02).toFixed(2) : 0;
  const activeCause = CAUSES.find(c => c.id === cause);

  /* ── load live stats ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await donationAPI.getDonationStats();
        setLiveStats(res.data);
      } catch {
        setLiveStats(null);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  /* ── PAN input handler: uppercase + restrict chars ── */
  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setPan(val);
    if (fieldErrors.pan) {
      setFieldErrors(p => ({ ...p, pan: PAN_REGEX.test(val) ? "" : "Invalid PAN format (e.g. ABCDE1234F)" }));
    }
  };

  /* ── Aadhaar input handler: digits only, max 12 ── */
  const handleAadhaarChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(val);
    if (fieldErrors.aadhaar) {
      setFieldErrors(p => ({ ...p, aadhaar: AADHAAR_REGEX.test(val) ? "" : "Aadhaar must be exactly 12 digits" }));
    }
  };

  /* ── full form validation ── */
  const validate = useCallback(() => {
    const errs = {};

    // Amount
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      errs.amount = "Please enter a valid donation amount.";
    } else if (amt < MIN_INR) {
      errs.amount = `Minimum donation amount is ₹${MIN_INR.toLocaleString()}.`;
    } else if (amt > MAX_INR) {
      errs.amount = `Maximum donation amount is ₹${MAX_INR.toLocaleString()}.`;
    }

    // Donor info
    if (!anonymous) {
      if (!name.trim())  errs.name  = "Full name is required.";
      if (!email.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.email = "Enter a valid email address.";
      }
    }

    // PAN — always required
    if (!pan) {
      errs.pan = "PAN number is required.";
    } else if (!PAN_REGEX.test(pan)) {
      errs.pan = "Invalid PAN format. Expected: ABCDE1234F";
    }

    // Aadhaar — always required
    if (!aadhaar) {
      errs.aadhaar = "Aadhaar number is required.";
    } else if (!AADHAAR_REGEX.test(aadhaar)) {
      errs.aadhaar = "Aadhaar must be exactly 12 digits.";
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError("Please fix the errors highlighted below.");
      return false;
    }
    setError("");
    return true;
  }, [amount, anonymous, name, email, pan, aadhaar]);

  /* ── Razorpay handler ── */
  const handleRazorpay = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        amount:        parseFloat(amount),
        currency:      "INR",
        paymentMethod: "razorpay",
        cause,
        isAnonymous:   anonymous,
        message:       message || "",
        donorName:     anonymous ? "Anonymous" : name,
        donorEmail:    anonymous ? "anonymous@psgcas.ac.in" : email,
        donorPhone:    phone || "",
        pan:           pan.toUpperCase(),
        aadhaar:       aadhaar,
      };

      const res = await donationAPI.create(payload);
      const { razorpayOrderId, amount: amt, currency: cur, donationId } = res.data;

      if (!razorpayOrderId) {
        setError("Failed to create payment order. Please try again.");
        setLoading(false); return;
      }

      const opts = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      amt,
        currency:    cur,
        order_id:    razorpayOrderId,
        name:        "PSG Arts Alumni Foundation",
        description: `Joy of Giving — ${activeCause?.title}`,
        handler: async (pr) => {
          try {
            const vr = await donationAPI.verifyRazorpayPayment({
              razorpay_order_id:   pr.razorpay_order_id,
              razorpay_payment_id: pr.razorpay_payment_id,
              razorpay_signature:  pr.razorpay_signature,
              donationId,
            });
            if (vr.data.success) {
              setSuccess(true);
              setAmount(""); setName(""); setEmail(""); setPhone("");
              setPan(""); setAadhaar(""); setMessage(""); setStep(1);
              setTimeout(() => setSuccess(false), 7000);
            } else { setError("Payment verification failed. Please contact support."); }
          } catch { setError("Verification error. Please try again."); }
          finally  { setLoading(false); }
        },
        prefill: { name: anonymous ? "" : name, email: anonymous ? "" : email, contact: phone || "" },
        notes:   { cause, message, isAnonymous: anonymous },
        theme:   { color: "#0c1f3f" },
        modal:   { ondismiss: () => setLoading(false) },
      };

      const open = () => { const r = new window.Razorpay(opts); r.open(); };
      if (typeof window.Razorpay === "undefined") {
        const s = document.createElement("script");
        s.src     = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload  = open;
        s.onerror = () => { setError("Failed to load payment gateway."); setLoading(false); };
        document.head.appendChild(s);
      } else { open(); }
    } catch (e) {
      setError(e.response?.data?.message || "Payment initiation failed.");
      setLoading(false);
    }
  }, [amount, cause, anonymous, message, name, email, phone, pan, aadhaar, activeCause]);

  /* ── submit ── */
  const handleSubmit = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    handleRazorpay();
  }, [validate, handleRazorpay]);

  /* ── impact message ── */
  const getImpact = () => {
    if (!amount || parseFloat(amount) < MIN_INR) return null;
    const impacts = activeCause?.impact;
    if (!impacts) return null;
    const thresholds = Object.keys(impacts).map(Number).sort((a, b) => b - a);
    const matched = thresholds.find(t => parseFloat(amount) >= t);
    return matched ? impacts[matched] : null;
  };

  /* ── hero stats ── */
  const heroStats = [
    {
      num:   statsLoading ? null : liveStats?.totalAmountINR
               ? `₹${(liveStats.totalAmountINR / 1e5).toFixed(1)}L+` : "₹4.2Cr+",
      label: "Raised this year",
    },
    {
      num:   statsLoading ? null : liveStats?.totalDonations
               ? `${liveStats.totalDonations}+` : "340+",
      label: "Donations made",
    },
    { num: "80G",  label: "Tax exemption" },
    { num: "100%", label: "Goes to the cause" },
  ];

  /* ═════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════ */
  return (
    <>
      <style>{G}</style>
      <div className="jog-root">

        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="jog-hero">
          <motion.div className="jog-hero-inner" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp(0)} className="jog-eyebrow">
              <Sparkles size={11} /> Joy of Giving
            </motion.div>
            <motion.h1 variants={fadeUp(0.08)}>
              Give the <em>gift</em> of<br />education & opportunity.
            </motion.h1>
            <motion.p variants={fadeUp(0.16)}>
              Every contribution to PSG Arts Alumni Foundation powers scholarships,
              research, and infrastructure — shaping tomorrow's leaders today.
            </motion.p>
            <motion.div className="jog-stats-bar" variants={fadeUp(0.24)}>
              {heroStats.map((s, i) => (
                <div className="jog-stat" key={i}>
                  {statsLoading && !s.num
                    ? <div className="jog-stat-loading" />
                    : <div className="jog-stat-num">{s.num}</div>
                  }
                  <div className="jog-stat-label">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══ PROGRESS BAR ══════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.div
              className="jog-progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {STEPS.map((label, i) => {
                const n = i + 1;
                const isDone   = step > n;
                const isActive = step === n;
                return (
                  <React.Fragment key={label}>
                    <div className={`jog-prog-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                      <div className="jog-prog-num">
                        {isDone ? <CheckCircle2 size={12} /> : n}
                      </div>
                      <span className="jog-prog-label">{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="jog-prog-divider" />}
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ CAUSE CARDS ═══════════════════════════════════ */}
        <section className="jog-causes">
          <motion.div
            className="jog-section-hd"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp()}
          >
            <h2>Choose Your Cause</h2>
            <p>Direct your gift where it matters most to you.</p>
          </motion.div>
          <motion.div
            className="jog-causes-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {CAUSES.map((c) => (
              <motion.div
                key={c.id}
                className={`cause-card ${cause === c.id ? "active" : ""}`}
                variants={fadeUp()}
                onClick={() => { setCause(c.id); setStep(s => Math.max(s, 2)); }}
              >
                {cause === c.id
                  ? <div className="cause-check"><CheckCircle2 size={13} color="white" /></div>
                  : c.badge && <span className="cause-badge">{c.badge}</span>
                }
                <div className="cause-icon"><c.icon size={19} /></div>
                <div className="cause-title">{c.title}</div>
                <div className="cause-desc">{c.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ FORM + SIDEBAR ════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.section
              className="jog-form-section"
              variants={slideDownForm}
              initial="hidden" animate="visible" exit="exit"
            >
              <motion.div
                className="jog-form-inner"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              >

                {/* ─── LEFT: FORM ─── */}
                <motion.div className="jog-form-panel" variants={fadeUp()}>
                  <div className="jog-form-top">
                    <h3>Make Your Donation</h3>
                    <p>Secure payment via Razorpay · INR only · Every rupee reaches the cause.</p>
                    <div className="jog-cause-pill">
                      {activeCause && <activeCause.icon size={11} />}
                      {activeCause?.title ?? "General Fund"}
                    </div>
                  </div>

                  <form className="jog-form-body" onSubmit={handleSubmit} noValidate>

                    {/* ── Alerts ── */}
                    <AnimatePresence>
                      {error && (
                        <motion.div className="alert error"
                          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                          <AlertCircle size={15} /> {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div className="alert success"
                          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                          <CheckCircle2 size={15} />
                          <span>
                            <strong>Thank you for your generosity!</strong><br />
                            Your donation was processed successfully. A receipt and 80G certificate will be sent to your email.
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Amount ── */}
                    <div className="jog-field">
                      <label className="jog-label" htmlFor="donate-amount">
                        Donation Amount (₹) <span>*</span>
                      </label>
                      <div className="amount-wrap">
                        <span className="amount-sym">₹</span>
                        <input
                          id="donate-amount" type="number"
                          min={MIN_INR} max={MAX_INR} step="100"
                          value={amount}
                          onChange={e => {
                            setAmount(e.target.value);
                            setStep(s => Math.max(s, 2));
                            if (fieldErrors.amount) setFieldErrors(p => ({ ...p, amount: "" }));
                          }}
                          placeholder="Enter amount (₹5,000 – ₹25,000)"
                          className={`jog-input ${fieldErrors.amount ? "err" : ""}`}
                        />
                      </div>
                      {fieldErrors.amount
                        ? <span className="field-err"><AlertCircle size={11} />{fieldErrors.amount}</span>
                        : <span className="amount-range-badge">Accepted range: ₹5,000 – ₹25,000</span>
                      }
                      <div className="preset-grid">
                        {INR_PRESETS.map(p => (
                          <button key={p.amount} type="button"
                            className={`preset-btn ${parseFloat(amount) === p.amount ? "active" : ""}`}
                            onClick={() => {
                              setAmount(p.amount.toString());
                              setStep(s => Math.max(s, 2));
                              if (fieldErrors.amount) setFieldErrors(p2 => ({ ...p2, amount: "" }));
                            }}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Anonymous toggle ── */}
                    <div className="anon-row" onClick={() => setAnonymous(a => !a)}>
                      <input type="checkbox" id="anon" checked={anonymous} readOnly />
                      <label htmlFor="anon">
                        Donate anonymously — your identity won't be publicly displayed
                      </label>
                    </div>

                    {/* ── Donor Info ── */}
                    <AnimatePresence>
                      {!anonymous && (
                        <motion.div
                          initial={{ opacity:0, height:0 }}
                          animate={{ opacity:1, height:"auto" }}
                          exit={{ opacity:0, height:0 }}
                          style={{ overflow:"hidden" }}
                        >
                          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                            <div className="form-row">
                              <div className="jog-field">
                                <label className="jog-label" htmlFor="d-name">
                                  Full Name <span>*</span>
                                </label>
                                <input id="d-name" type="text" value={name}
                                  onChange={e => { setName(e.target.value); if (fieldErrors.name) setFieldErrors(p => ({ ...p, name:"" })); }}
                                  placeholder="Your full name"
                                  className={`jog-input ${fieldErrors.name ? "err" : ""}`} />
                                {fieldErrors.name && <span className="field-err"><AlertCircle size={11}/>{fieldErrors.name}</span>}
                              </div>
                              <div className="jog-field">
                                <label className="jog-label" htmlFor="d-email">
                                  Email Address <span>*</span>
                                </label>
                                <input id="d-email" type="email" value={email}
                                  onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(p => ({ ...p, email:"" })); }}
                                  placeholder="you@example.com"
                                  className={`jog-input ${fieldErrors.email ? "err" : ""}`} />
                                {fieldErrors.email && <span className="field-err"><AlertCircle size={11}/>{fieldErrors.email}</span>}
                              </div>
                            </div>
                            <div className="jog-field">
                              <label className="jog-label" htmlFor="d-phone">Phone Number</label>
                              <input id="d-phone" type="tel" value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+91 98765 43210" className="jog-input" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Message ── */}
                    <div className="jog-field">
                      <label className="jog-label" htmlFor="d-msg">
                        Message to the Institution
                      </label>
                      <textarea id="d-msg" value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Share your story or motivation for giving…"
                        className="jog-textarea" />
                    </div>

                    {/* ── KYC: PAN + AADHAAR TEXT INPUTS ── */}
                    <div className="form-divider">KYC for 80G Tax Certificate</div>

                    <div className="kyc-note">
                      <ShieldCheck size={13} style={{ flexShrink:0, marginTop:2, color:"var(--gold)" }} />
                      <span>
                        PAN and Aadhaar are required for all donations as per Indian tax regulations (Section 80G).
                        Your details are encrypted and never shared with third parties.
                      </span>
                    </div>

                    <div className="form-row">
                      {/* PAN */}
                      <div className="jog-field">
                        <label className="jog-label" htmlFor="d-pan">
                          PAN Number <span>*</span>
                        </label>
                        <input
                          id="d-pan" type="text"
                          value={pan}
                          onChange={handlePanChange}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className={`jog-input ${fieldErrors.pan ? "err" : ""}`}
                          style={{ textTransform:"uppercase", letterSpacing:"0.1em" }}
                        />
                        {fieldErrors.pan
                          ? <span className="field-err"><AlertCircle size={11}/>{fieldErrors.pan}</span>
                          : pan.length > 0 && PAN_REGEX.test(pan)
                            ? <span style={{ fontSize:"10.5px", color:"var(--success)" }}>✓ Valid PAN</span>
                            : <span style={{ fontSize:"10.5px", color:"var(--muted)" }}>Format: AAAAA9999A</span>
                        }
                      </div>

                      {/* Aadhaar */}
                      <div className="jog-field">
                        <label className="jog-label" htmlFor="d-aadhaar">
                          Aadhaar Number <span>*</span>
                        </label>
                        <input
                          id="d-aadhaar" type="text"
                          inputMode="numeric"
                          value={aadhaar}
                          onChange={handleAadhaarChange}
                          placeholder="12-digit Aadhaar"
                          maxLength={12}
                          className={`jog-input ${fieldErrors.aadhaar ? "err" : ""}`}
                          style={{ letterSpacing:"0.12em" }}
                        />
                        {fieldErrors.aadhaar
                          ? <span className="field-err"><AlertCircle size={11}/>{fieldErrors.aadhaar}</span>
                          : <span style={{ fontSize:"10.5px", color: aadhaar.length === 12 ? "var(--success)" : "var(--muted)" }}>
                              {aadhaar.length === 12 ? "✓ 12 digits entered" : `${aadhaar.length}/12 digits`}
                            </span>
                        }
                      </div>
                    </div>

                  </form>
                </motion.div>

                {/* ─── RIGHT: SIDEBAR ─── */}
                <motion.div className="jog-sidebar" variants={fadeUp(0.12)}>

                  {/* Summary */}
                  <div className="summary-card">
                    <div className="summary-head">
                      <Heart size={16} color="#ddb84a" />
                      <h4>Your Gift Summary</h4>
                    </div>
                    <div className="summary-body">
                      <div className="sum-row">
                        <span>Cause</span>
                        <span className="v" style={{ textAlign:"right", maxWidth:"160px", fontSize:"11.5px" }}>
                          {activeCause?.title}
                        </span>
                      </div>
                      <div className="sum-row">
                        <span>Donation</span>
                        <span className="v">₹{amount || "—"}</span>
                      </div>
                      <div className="sum-row">
                        <span>Gateway fee (2%)</span>
                        <span className="v">{amount ? `₹${feeAmt}` : "—"}</span>
                      </div>
                      <div className="sum-row">
                        <span>PAN</span>
                        <span className="v" style={{ fontSize:"11.5px" }}>
                          {PAN_REGEX.test(pan) ? <span style={{ color:"#86efac" }}>✓ Verified</span> : "—"}
                        </span>
                      </div>
                      <div className="sum-row">
                        <span>Aadhaar</span>
                        <span className="v" style={{ fontSize:"11.5px" }}>
                          {AADHAAR_REGEX.test(aadhaar) ? <span style={{ color:"#86efac" }}>✓ Entered</span> : "—"}
                        </span>
                      </div>
                      <div className="sum-total">
                        <span className="tl">Total</span>
                        <span className="tv">{amount ? `₹${totalAmt}` : "₹0"}</span>
                      </div>
                      <button
                        className="donate-btn"
                        type="button"
                        disabled={loading || !amount}
                        onClick={handleSubmit}
                      >
                        {loading
                          ? <><div className="spin" /> Processing…</>
                          : <><Heart size={15} /> Donate Now <ChevronRight size={14} /></>
                        }
                      </button>
                      <p className="secure-note">
                        <ShieldCheck size={11} /> Secured by Razorpay · INR only
                      </p>
                    </div>
                  </div>

                  {/* Tax benefit */}
                  <div className="tax-card">
                    <h5><ShieldCheck size={13} color="#bf8f2e" /> Tax Benefit</h5>
                    <p>
                      All donations are 100% tax-exempt under Section 80G of the Income Tax Act.
                      Enter your PAN above to receive your deduction certificate by email.
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="impact-card">
                    <h5>Your Impact</h5>
                    {getImpact() ? (
                      <>
                        <div className="impact-row">
                          <ChevronRight size={13} /> {getImpact()}
                        </div>
                        <div className="impact-row">
                          <ChevronRight size={13} />
                          Directed to <strong style={{ marginLeft:3 }}>{activeCause?.title}</strong> fund.
                        </div>
                      </>
                    ) : (
                      <div className="impact-row">
                        <ChevronRight size={13} />
                        Select an amount (₹5,000–₹25,000) above to see the impact your gift will make.
                      </div>
                    )}
                  </div>

                </motion.div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══ TESTIMONIAL ═══════════════════════════════════ */}
        <section className="jog-testimonial">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp()}
          >
            <span className="quote-mark">"</span>
            <blockquote>
              I was inspired to give back as a way to demonstrate gratitude to the
              institution and the professors who shaped my career. Knowing my donation
              directly supports a student's journey makes every rupee worthwhile.
            </blockquote>
            <cite>— Distinguished Alumnus, Batch of 1998</cite>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default DonatePage;