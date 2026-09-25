import React from 'react'
import HeroBanner from './HeroBanner'
import LeadershipSection from '../sections/LeadershipSection'
import Notablealumni from '../sections/Notablealumni'
import NumbersSection from '../sections/NumbersSection'
import FindAlumniSection from '../sections/FindAlumniSection'
import EventsAlbumSection from '../sections/EventsAlbumSection'
import usePageTitle from '../hooks/usePageTitle'


function HomePage() {
  usePageTitle("Official Community Portal for PSG Public Schools Alumni")
  return (
    <main className="site-shell">
      <HeroBanner />
      <LeadershipSection />
      <Notablealumni />
      <EventsAlbumSection />
      <NumbersSection />
      <FindAlumniSection />
    </main>
  )
}

export default HomePage
