// AlumniBanner.jsx
import React, { useState, useEffect, useRef } from "react";
import { Users, Globe2, CalendarDays, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { motion, animate, useMotionValue, useSpring, useTransform } from "framer-motion";

import schoolImage from "../assets/Images/SCHOOL BUILDING PICTURE.png";
import psgpsLogo from "../assets/PSGPS LOGO IN COREL.jpg";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// Headline splits into words for a staggered reveal, each word rising in
// with a slight blur-to-sharp focus pull for a more cinematic entrance.
const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};
const wordRise = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function Word({ children, className }) {
  return (
    <motion.span variants={wordRise} className={className} style={{ display: "inline-block" }}>
      {children}
    </motion.span>
  );
}

export default function AlumniBanner({
  imageUrl = schoolImage,
  onJoinClick,
  onLearnMoreClick,
}) {
  const heroRef = useRef(null);

  // Mouse-reactive glow: a soft light that drifts toward the cursor,
  // smoothed with a spring so it feels weighty rather than snapping.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const glowX = useTransform(smx, (v) => `${v * 100}%`);
  const glowY = useTransform(smy, (v) => `${v * 100}%`);

  const handlePointerMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={heroRef}
      className="ab-hero"
      style={{ "--ab-hero-image": `url(${imageUrl})` }}
      onPointerMove={handlePointerMove}
    >
      <style>{`
        .ab-hero {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding-top: 82px;
          box-sizing: border-box;
        }
        @media (max-width: 760px) {
          .ab-hero { min-height: 600px; }
        }

        .ab-hero-bg {
          position: absolute;
          inset: 0;
          background-image: var(--ab-hero-image);
          background-size: cover;
          background-position: center 35%;
          z-index: 0;
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-bg { animation: abKenBurns 26s ease-in-out infinite alternate; }
        }
        @keyframes abKenBurns {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.12) translate(-1.5%, -1%); }
        }

        .ab-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(4, 11, 24, 0.72) 0%, rgba(5, 15, 30, 0.5) 28%, rgba(5, 15, 30, 0.62) 68%, rgba(4, 11, 24, 0.85) 100%),
            linear-gradient(120deg, rgba(7, 29, 56, 0.35), transparent 55%, rgba(215, 173, 90, 0.12));
        }

        /* Cursor-follow spotlight, layered above the static ambient glow */
        .ab-hero-cursor-glow {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.55;
        }

        .ab-hero-glow {
          position: absolute;
          inset: -15% -10%;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle 420px at 20% 25%, rgba(215, 173, 90, 0.14), transparent 70%),
            radial-gradient(circle 460px at 85% 80%, rgba(31, 102, 184, 0.16), transparent 70%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-glow { animation: abGlowDrift 18s ease-in-out infinite alternate; }
        }
        @keyframes abGlowDrift {
          from { transform: translate(0, 0); }
          to   { transform: translate(30px, -24px); }
        }

        /* Fine grain overlay for a less "flat CSS gradient" premium feel */
        .ab-hero-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .ab-particle {
          position: absolute;
          bottom: -10px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(215, 173, 90, 0.6);
          pointer-events: none;
          z-index: 1;
          box-shadow: 0 0 8px 1px rgba(215, 173, 90, 0.5);
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-particle { animation: abFloatUp linear infinite; }
        }
        @keyframes abFloatUp {
          0%   { transform: translateY(0) scale(0.6); opacity: 0; }
          10%  { opacity: 0.85; }
          50%  { transform: translateY(-260px) translateX(-8px) scale(1); }
          90%  { opacity: 0.25; }
          100% { transform: translateY(-520px) translateX(16px) scale(0.7); opacity: 0; }
        }

        .ab-hero-copy {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 6vw 90px;
          text-align: center;
        }

        /* Rotating dashed ring orbiting the logo, plus a slow counter-rotating
           sparkle — a small decorative flourish that reads as "living" crest */
        .ab-hero-logo-wrap {
          position: relative;
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ab-hero-logo-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px dashed rgba(215, 173, 90, 0.55);
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-logo-ring { animation: abSpin 14s linear infinite; }
        }
        @keyframes abSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ab-hero-logo-sparkle {
          position: absolute;
          top: -4px;
          right: 6px;
          color: var(--gold-soft, #f5dc97);
          filter: drop-shadow(0 0 6px rgba(245, 220, 151, 0.8));
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-logo-sparkle { animation: abTwinkle 2.4s ease-in-out infinite; }
        }
        @keyframes abTwinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.85) rotate(0deg); }
          50%      { opacity: 1;    transform: scale(1.05) rotate(18deg); }
        }

        .ab-hero-logo {
          width: 64px; height: 64px; object-fit: contain; border-radius: 14px;
          background: #fff; padding: 7px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.3);
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-soft, #f5dc97);
        }
        .ab-eyebrow::before,
        .ab-eyebrow::after { content: ""; width: 26px; height: 1px; background: var(--gold-soft, #f5dc97); }

        .ab-hero-copy h1 {
          font-family: var(--font-display, serif);
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 0.98;
          font-weight: 600;
          color: #fbfcff;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 8px 30px rgba(0,0,0,0.35);
        }
        .ab-hero-copy h1 em {
          font-style: normal;
          background: linear-gradient(90deg, var(--gold, #d7ad5a), var(--gold-soft, #f5dc97), var(--gold, #d7ad5a));
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-copy h1 em { animation: abShimmer 5s ease-in-out infinite; }
        }
        @keyframes abShimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        .ab-hero-desc {
          max-width: 560px;
          font-size: 15.5px;
          line-height: 1.75;
          color: rgba(230, 238, 250, 0.88);
          margin: 0;
        }

        .ab-stats {
          display: flex;
          gap: 14px;
          padding-top: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ab-stat {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          min-width: 128px;
          overflow: hidden;
          transform-style: preserve-3d;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .ab-stat::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(215,173,90,0.18) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }
        .ab-stat:hover::before { transform: translateX(120%); }
        .ab-stat:hover {
          background: rgba(255,255,255,0.11);
          border-color: rgba(215, 173, 90, 0.5);
        }
        .ab-stat strong {
          font-family: var(--font-display, serif);
          font-size: 26px; font-weight: 700; color: #fff;
          display: flex; align-items: baseline; gap: 3px;
        }
        .ab-stat strong span { font-size: 15px; color: var(--gold-soft, #f5dc97); }
        .ab-stat small {
          font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase;
          color: rgba(230, 238, 250, 0.7); font-weight: 700;
        }
        .ab-stat-icon {
          width: 26px; height: 26px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 8px;
          background: rgba(215, 173, 90, 0.2);
          color: var(--gold-soft, #f5dc97);
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-stat-icon { animation: abPulse 3.4s ease-in-out infinite; }
          .ab-stat:nth-child(2) .ab-stat-icon { animation-delay: 0.4s; }
          .ab-stat:nth-child(3) .ab-stat-icon { animation-delay: 0.8s; }
        }
        @keyframes abPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(215, 173, 90, 0.4); }
          50% { box-shadow: 0 0 0 7px rgba(215, 173, 90, 0); }
        }

        .ab-hero-actions { display: flex; gap: 14px; padding-top: 8px; flex-wrap: wrap; justify-content: center; }
        .ab-btn-primary {
          position: relative;
          padding: 14px 28px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #eac67a 0%, #d1a04d 100%);
          color: #0d2140;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.04em;
          cursor: pointer;
          box-shadow: 0 16px 30px rgba(218, 162, 72, 0.32);
          overflow: hidden;
        }
        .ab-btn-primary::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle 60px at var(--bx, 50%) var(--by, 50%), rgba(255,255,255,0.55), transparent 60%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .ab-btn-primary:hover::after { opacity: 1; }
        .ab-btn-outline {
          padding: 14px 24px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .ab-btn-outline:hover { border-color: rgba(215,173,90,0.8); background: rgba(255,255,255,0.09); }
        .ab-btn-outline svg { transition: transform 0.2s ease; }
        .ab-btn-outline:hover svg { transform: translateX(3px); }

        .ab-scroll-cue {
          position: absolute;
          left: 50%;
          bottom: 26px;
          z-index: 2;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(230, 238, 250, 0.65);
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-scroll-cue svg { animation: abBounce 1.8s ease-in-out infinite; }
        }
        @keyframes abBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(6px); opacity: 1; }
        }

        /* Thin animated gold line tracing the very bottom edge of the hero,
           a quiet finishing touch that separates it from the next section */
        .ab-hero-edge {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px;
          z-index: 2;
          background: linear-gradient(90deg, transparent, rgba(215,173,90,0.9), transparent);
          background-size: 200% 100%;
        }
        @media (prefers-reduced-motion: no-preference) {
          .ab-hero-edge { animation: abEdgeSweep 6s linear infinite; }
        }
        @keyframes abEdgeSweep {
          from { background-position: 0% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>

      <div className="ab-hero-bg" aria-hidden="true" />
      <div className="ab-hero-overlay" aria-hidden="true" />

      <motion.div
        className="ab-hero-cursor-glow"
        aria-hidden="true"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(circle 360px at ${x} ${y}, rgba(215,173,90,0.16), transparent 70%)`
          ),
        }}
      />

      <div className="ab-hero-glow" aria-hidden="true" />
      <div className="ab-hero-grain" aria-hidden="true" />

      <span className="ab-particle" style={{ left: "14%", animationDuration: "10s", animationDelay: "0s" }} />
      <span className="ab-particle" style={{ left: "32%", animationDuration: "13s", animationDelay: "3s" }} />
      <span className="ab-particle" style={{ left: "55%", animationDuration: "11s", animationDelay: "1.4s" }} />
      <span className="ab-particle" style={{ left: "72%", animationDuration: "14s", animationDelay: "5s" }} />
      <span className="ab-particle" style={{ left: "88%", animationDuration: "12s", animationDelay: "2s" }} />

      <motion.div className="ab-hero-copy" variants={container} initial="hidden" animate="show">
        <motion.div variants={rise} className="ab-hero-logo-wrap">
          <span className="ab-hero-logo-ring" aria-hidden="true" />
          <Sparkles size={16} className="ab-hero-logo-sparkle" aria-hidden="true" />
          <img className="ab-hero-logo" src={psgpsLogo} alt="PSG Public Schools" />
        </motion.div>

        <motion.span variants={rise} className="ab-eyebrow">PSGPS Alumni Association</motion.span>

        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="show"
          aria-label="Together, we thrive"
        >
          <Word>Together,</Word>
          <br />
          <Word className="ab-em-wrap"><em>we</em></Word> <Word><em>thrive</em></Word>
        </motion.h1>

        <motion.p variants={rise} className="ab-hero-desc">
          A lifelong community of PSGPS alumni — reconnecting classmates,
          mentoring the next generation, and building on what this school gave us.
        </motion.p>

        <motion.div variants={rise} className="ab-stats">
          <Stat icon={Users} value={900} suffix="+" label="Alumni connected" />
          <Stat icon={Globe2} value={15} suffix="+" label="Countries" />
          <Stat icon={CalendarDays} value={5} suffix="+" label="Annual events" />
        </motion.div>

        <motion.div variants={rise} className="ab-hero-actions">
          <motion.button
            type="button"
            className="ab-btn-primary"
            onClick={onJoinClick}
            whileHover={{ y: -3, boxShadow: "0 20px 36px rgba(218,162,72,0.45)" }}
            whileTap={{ scale: 0.97 }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--bx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--by", `${e.clientY - r.top}px`);
            }}
          >
            Join the association
          </motion.button>
          <motion.button
            type="button"
            className="ab-btn-outline"
            onClick={onLearnMoreClick}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Learn more
            <ArrowRight size={14} aria-hidden="true" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="ab-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        Scroll
        <ChevronDown size={16} strokeWidth={2.4} />
      </motion.div>

      <div className="ab-hero-edge" aria-hidden="true" />
    </section>
  );
}

function Stat({ icon: Icon, value, suffix, label }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      className="ab-stat"
      whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <span className="ab-stat-icon">
        <Icon size={13} strokeWidth={2} aria-hidden="true" />
      </span>
      <strong>
        {display}
        <span>{suffix}</span>
      </strong>
      <small>{label}</small>
    </motion.div>
  );
}