import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeroBanner from './HeroBanner'
import LeadershipSection from '../sections/LeadershipSection'
import Notablealumni from '../sections/Notablealumni'
import NumbersSection from '../sections/NumbersSection'
import FindAlumniSection from '../sections/FindAlumniSection'
import EventsAlbumSection from '../sections/EventsAlbumSection'
import usePageTitle from '../hooks/usePageTitle'


function HomePage() {
  const navigate = useNavigate()
  usePageTitle("Official Community Portal for PSG Public Schools Alumni")
  return (
    <main className="site-shell">
      <HeroBanner
        onJoinClick={() => navigate('/alumni/register')}
        onLearnMoreClick={() => document.getElementById('leaders')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <LeadershipSection />
      <Notablealumni />
      <EventsAlbumSection />
      <NumbersSection />
      <FindAlumniSection />
    </main>
  )
}

export default HomePage
