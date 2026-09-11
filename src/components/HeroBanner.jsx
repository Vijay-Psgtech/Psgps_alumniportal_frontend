import React from "react";
import {
  Users,
  Globe2,
  CalendarDays,
  Zap,
  ArrowRight,
  BookOpen,
  Flame,
  PersonStanding,
  Star,
  Wheat,
} from "lucide-react";
import schoolImage from '../assets/SCHOOL BUILDING PICTURE.png'
import psgpsLogo from '../assets/PSGPS LOGO IN COREL.jpg'

/**
 * PSG Public Schools — Alumni "Together We Thrive" banner
 *
 * Notes on adapting this:
 * - Replace the `backgroundImage` url in the <div className="... bg-[url(...)]">
 *   section below with your actual campus photo (or pass it in as a prop).
 * - Built mobile-first: text stacks and the photo hides below `lg`, matching
 *   how a banner like this would typically be used responsively.
 */
export default function AlumniBanner({
  imageUrl = `${schoolImage}`,
}) {
  return (
    <div className="relative w-full overflow-hidden bg-[#0a1330] font-sans">
      {/* Background photo (right side on large screens, full-bleed faded on small) */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:left-[30%]"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      {/* Left-side navy gradient so text stays legible over the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1330] via-[#0a1330] lg:via-[#0a1330]/95 to-transparent" />
      <div className="absolute inset-0 bg-[#0a1330]/40 lg:bg-transparent" />

      {/* Bottom decorative wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[70px] sm:h-[90px]"
        viewBox="0 0 1535 90"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 40 C 350 90, 900 0, 1535 55 L1535 90 L0 90 Z"
          fill="#0a1330"
        />
        <path
          d="M0 40 C 350 90, 900 0, 1535 55"
          stroke="#c9a15a"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 max-w-3xl">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <img src={psgpsLogo} alt="PSG Public Schools" className="w-60 h-30" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/90 px-4 py-1.5 mb-5">
          <Users className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-semibold tracking-wide">
            WELCOME TO EXCELLENCE
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
          TOGETHER
          <br />
          WE THRIVE
        </h1>
        <div className="mt-4 mb-5 h-1 w-20 bg-red-600" />

        {/* Body copy */}
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-md mb-6">
          Join the <span className="font-bold text-white">PSGPS Alumni</span>{" "}
          community—reconnect, collaborate, inspire, and create meaningful
          opportunities for lifelong success.
        </p>

        {/* Stats */}
        <div className="flex items-center divide-x divide-white/15 rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-7 w-fit backdrop-blur-sm">
          <Stat icon={Users} value="900+" label="Alumni Connected" first />
          <Stat icon={Globe2} value="15+" label="Countries" />
          <Stat icon={CalendarDays} value="5+" label="Annual Events" />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors px-6 py-3 text-white text-sm font-bold">
            <Zap className="w-4 h-4 fill-white" />
            JOIN NOW
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-white/40 hover:bg-white/10 transition-colors px-6 py-3 text-white text-sm font-bold">
            LEARN MORE
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom footer strip */}
      <div className="relative z-10 flex flex-col items-center pb-4 sm:pb-5 -mt-1">
        <div className="flex items-center gap-2 text-amber-400">
          <Wheat className="w-4 h-4" />
          <span className="text-sm sm:text-base font-semibold tracking-wide">
            PSGPS ALUMNI
          </span>
          <Wheat className="w-4 h-4 -scale-x-100" />
        </div>
        <p className="text-slate-300 text-[10px] sm:text-xs tracking-widest mt-1">
          STRONG ROOTS. SHARED JOURNEY. LIMITLESS IMPACT.
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, first }) {
  return (
    <div className={`flex items-center gap-2 ${first ? "pr-4" : "px-4"}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="leading-tight">
        <div className="text-white font-bold text-sm">{value}</div>
        <div className="text-slate-300 text-[11px] whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}
