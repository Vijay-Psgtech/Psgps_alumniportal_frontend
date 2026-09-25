import React from 'react'
import HeroBanner from './HeroBanner'
import LeadershipSection from '../sections/LeadershipSection'
import Notablealumni from '../sections/Notablealumni'
import NumbersSection from '../sections/NumbersSection'
import FindAlumniSection from '../sections/FindAlumniSection'
import EventsAlbumSection from '../sections/EventsAlbumSection'


function HomePage() {
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
