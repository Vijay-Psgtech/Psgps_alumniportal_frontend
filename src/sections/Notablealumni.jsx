import React from 'react'
import { NoteableAlumniData } from '../content/data/NoteableAlumniData'

const Notablealumni = () => {
  const scrollingAlumni = [...NoteableAlumniData, ...NoteableAlumniData]

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-16 sm:py-20" id="notable-alumni" aria-labelledby="notable-alumni-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#1f66b8]">
            <span className="h-px w-8 bg-[#d7ad5a]" aria-hidden="true" />
            Notable alumni
            <span className="h-px w-8 bg-[#d7ad5a]" aria-hidden="true" />
          </span>
          <h2 id="notable-alumni-title" className="mt-4 font-[var(--font-display)] text-4xl font-semibold leading-tight text-[#071d38] sm:text-5xl">
            Journeys worth celebrating
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#556a7d] sm:text-base">
            Meet the PSGPSians carrying the values of our school into classrooms, companies, communities, and the world.
          </p>
        </div>
      </div>

      <div className="relative mt-10 w-full [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:mt-12">
        <div className="group flex w-max animate-notable-alumni-scroll gap-5 px-5 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] sm:gap-6 sm:px-8" role="list" aria-label="Notable alumni profiles">
          {scrollingAlumni.map((alumnus, index) => (
            <article
              className="w-[min(78vw,245px)] shrink-0 overflow-hidden rounded-2xl border border-[#d9e3f0] bg-white shadow-[0_16px_40px_rgba(7,29,56,0.09)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_48px_rgba(7,29,56,0.16)] sm:w-[245px]"
              key={`${alumnus.id}-${index}`}
              role="listitem"
            >
              <div className="relative aspect-[4/4.7] overflow-hidden bg-[#eaf1f8]">
                <img
                  className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
                  src={alumnus.image}
                  alt={alumnus.name}
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071d38]/45 to-transparent" aria-hidden="true" />
              </div>
              <div className="min-h-[136px] p-5">
                <h3 className="text-lg font-extrabold leading-snug text-[#071d38]">{alumnus.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-5 text-[#556a7d]">
                  {alumnus.currentDesignation || 'PSGPS alumnus'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#8aa0b7]">
        Hover or focus to pause
      </p>
    </section>
  )
}

export default Notablealumni