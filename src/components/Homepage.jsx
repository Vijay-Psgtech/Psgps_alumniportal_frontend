import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from './HeroBanner'
import LeadershipSection from './LeadershipSection'
import Notablealumni from '../sections/Notablealumni'
import { albumsAPI, eventsAPI, API_BASE } from '../services/api'
import { alumniEvents, galleryAlbums } from '../content/data/EventsGalleryData'
import { CalendarDays, Globe2, Handshake, MapPin, Search, UsersRound } from 'lucide-react'

const imageUrl = (value) => {
  if (!value) return ''
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('/')) return trimmed
  return `${API_BASE}/${trimmed.replace(/\\/g, '/')}`
}

const formatEventDate = (value) => {
  if (!value) return 'Date TBD'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function HomePage() {
  const [directoryQuery, setDirectoryQuery] = useState('')
  const [directoryFilter, setDirectoryFilter] = useState('All Alumni')
  const [eventList, setEventList] = useState([])
  const [albumList, setAlbumList] = useState([])
  const [featuredEventIndex, setFeaturedEventIndex] = useState(0)
  const [featuredAlbumIndex, setFeaturedAlbumIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fallbackEventData = alumniEvents.map((event) => ({
      ...event,
      id: event.slug,
      slug: event.slug,
      cover: event.cover || event.images?.[0] || '',
      dateLabel: formatEventDate(event.date),
    }))

    const fallbackAlbumData = galleryAlbums.map((album) => ({
      ...album,
      id: album.slug,
      slug: album.slug,
      cover: album.cover || album.images?.[0] || '',
      description: album.description || `Memories from ${album.title || 'our alumni community'}`,
    }))

    const loadFeaturedContent = async () => {
      try {
        const [eventsRes, albumsRes] = await Promise.all([
          eventsAPI.getAll(),
          albumsAPI.getAll(),
        ])

        if (!isMounted) return

        const eventList = Array.isArray(eventsRes?.data?.data)
          ? eventsRes.data.data
          : Array.isArray(eventsRes?.data) ? eventsRes.data : []

        const albumList = Array.isArray(albumsRes?.data?.data)
          ? albumsRes.data.data
          : Array.isArray(albumsRes?.data) ? albumsRes.data : []

        const normalizedEvents = (eventList.length ? eventList : fallbackEventData).map((event) => ({
          ...event,
          id: event._id || event.id || event.slug,
          slug: event.slug || event._id || event.id,
          cover: event.imageUrl || event.coverImage || event.cover || '',
          dateLabel: formatEventDate(event.date),
        }))

        const normalizedAlbums = (albumList.length ? albumList : fallbackAlbumData).map((album) => ({
          ...album,
          id: album._id || album.id || album.slug,
          slug: album.slug || album.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || album._id || album.id,
          cover: album.coverImage || album.images?.[0] || album.cover || '',
          description: album.description || `Memories from ${album.title || 'our alumni community'}`,
        }))

        setEventList(normalizedEvents)
        setAlbumList(normalizedAlbums)
        setFeaturedEventIndex(0)
        setFeaturedAlbumIndex(0)
      } catch (error) {
        console.error('Failed to load homepage content:', error)
        if (isMounted) {
          setEventList(fallbackEventData)
          setAlbumList(fallbackAlbumData)
          setFeaturedEventIndex(0)
          setFeaturedAlbumIndex(0)
        }
      }
    }

    loadFeaturedContent()

    return () => {
      isMounted = false
    }
  }, [])

  const featuredEvent = eventList[featuredEventIndex] || eventList[0] || null
  const featuredAlbum = albumList[featuredAlbumIndex] || albumList[0] || null

  useEffect(() => {
    if (!eventList.length) return
    const intervalId = setInterval(() => {
      setFeaturedEventIndex((previous) => (previous + 1) % eventList.length)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [eventList.length])

  useEffect(() => {
    if (!albumList.length) return
    const intervalId = setInterval(() => {
      setFeaturedAlbumIndex((previous) => (previous + 1) % albumList.length)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [albumList.length])

  useEffect(() => {
    let frameId
    const updateParallax = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => document.documentElement.style.setProperty('--scroll-shift', window.scrollY))
    }
    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    const revealTargets = document.querySelectorAll('.welcome-section, .module-card, .leaders-section .section-heading, .leader-card, .numbers-section .section-heading, .impact-grid article, .directory-section .section-heading, .directory-search, .directory-filters, .connection-card, .site-footer')
    revealTargets.forEach((element) => element.classList.add('scroll-reveal'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    revealTargets.forEach((element) => observer.observe(element))
    return () => {
      window.removeEventListener('scroll', updateParallax)
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [])

  const featuredEventTitle = featuredEvent?.title || 'Alumni celebration'
  const featuredEventDate = featuredEvent?.dateLabel || 'Date TBD'
  const featuredEventVenue = featuredEvent?.venue || 'PSG Public Schools'
  const featuredEventCategory = featuredEvent?.category || 'Community'
  const featuredEventLink = featuredEvent ? `/events/${featuredEvent.id || featuredEvent.slug}` : '/events'
  const featuredAlbumTitle = featuredAlbum?.title || 'Community gallery'
  const featuredAlbumCover = imageUrl(featuredAlbum?.cover || featuredAlbum?.images?.[0])
  const featuredAlbumLink = featuredAlbum ? `/gallery/${featuredAlbum.slug || featuredAlbum.id}` : '/gallery'

  return (
    <main className="site-shell">
      <HeroBanner />
      <LeadershipSection />
      <Notablealumni />
      {/*Event & album section */}
      <section className="welcome-section" id="about"><div><span className="section-kicker">Our community</span><h2>One school.<br /><em>Many journeys.</em></h2></div><p>From the classrooms of PSG Public Schools to every corner of the world, our alumni carry a shared spirit of curiosity, character, and contribution. Stay connected to the people and place that shaped you.</p><a className="text-link" href="#community">Discover our story <span aria-hidden="true">&#8594;</span></a></section>
      <section className="module-grid" id="community">
        <article className="module-card blue-card"><span className="card-icon">&#9733;</span><span className="section-kicker">Stay connected</span><h3>Find your people</h3><p>Reconnect with classmates and grow your professional network.</p><a href="#directory">Explore the directory <span aria-hidden="true">&#8594;</span></a></article>
        <article className="module-card event-card feature-animated" id="events" key={`featured-event-${featuredEvent?.id || featuredEventTitle}`}>
          <span className="section-kicker">Mark your calendar</span>
          <h3>{featuredEventTitle}</h3>
          <div className="event-row"><strong>{featuredEventDate.split(' ')[1]?.replace(',', '') || 'Next'}</strong><div><b>{featuredEventCategory}</b><small>{featuredEventDate} &middot; {featuredEventVenue}</small></div><span aria-hidden="true">&#8594;</span></div>
          <Link to={featuredEventLink}>View event details <span aria-hidden="true">&#8594;</span></Link>
        </article>
        <article className="module-card story-card feature-animated" id="stories" key={`featured-story-${featuredAlbum?.id || featuredAlbumTitle}`}>
          <span className="section-kicker">Gallery spotlight</span>
          {featuredAlbumCover ? <img className="module-card-image" src={featuredAlbumCover} alt={featuredAlbumTitle} /> : null}
          <h3>{featuredAlbumTitle}</h3>
          <p>{featuredAlbum?.description || 'Moments that keep our alumni story alive.'}</p>
          <Link to={featuredAlbumLink}>Explore gallery <span aria-hidden="true">&#8594;</span></Link>
        </article>
      </section>

      {/*Numbers Section */}
      <section className="numbers-section" id="impact">
        <div className="section-heading"><span className="section-pill">Our impact</span><h2>By The Numbers</h2><p>Our vibrant alumni community continues to grow stronger, building bonds and creating opportunities that make a lasting difference.</p></div>
        <div className="impact-grid"><article><span className="impact-icon people-icon" aria-hidden="true"><UsersRound size={24} strokeWidth={1.8} /></span><strong>900<span>+</span></strong><b>Active alumni</b><p>A network of achievers inspiring and supporting one another.</p></article><article><span className="impact-icon globe-icon" aria-hidden="true"><Globe2 size={24} strokeWidth={1.8} /></span><strong>15<span>+</span></strong><b>Countries</b><p>Our alumni presence spans the globe, united by shared values.</p></article><article><span className="impact-icon calendar-icon" aria-hidden="true"><CalendarDays size={24} strokeWidth={1.8} /></span><strong>5<span>+</span></strong><b>Annual events</b><p>Bringing alumni together to connect, collaborate and celebrate milestones.</p></article></div>
      </section>

      {/*Find your alumni section*/}
      <section className="directory-section" id="directory">
        <div className="section-heading"><span className="directory-heading-icon" aria-hidden="true"><Search size={34} strokeWidth={2.1} /></span><h2>Find Fellow <em>PSGPSians</em></h2><p>Discover and connect with the PSGPS Alumni Network</p></div>
        <label className="directory-search"><Search size={19} aria-hidden="true" /><input value={directoryQuery} onChange={(event) => setDirectoryQuery(event.target.value)} placeholder="Search by name, batch, or profession..." aria-label="Search alumni" /></label>
        <div className="directory-filters">{['All Alumni', 'Near You', 'Your Interests'].map((filter) => <button className={directoryFilter === filter ? 'active' : ''} key={filter} type="button" onClick={() => setDirectoryFilter(filter)}>{filter === 'Near You' ? <MapPin size={14} aria-hidden="true" /> : filter === 'Your Interests' ? <Handshake size={14} aria-hidden="true" /> : <UsersRound size={14} aria-hidden="true" />}{filter}</button>)}</div>
        <div className="connection-grid">
          <article className="connection-card connection-card-batch"><span className="connection-icon"><UsersRound size={42} strokeWidth={1.8} /></span><h3>Connect with<br />Batch Mates</h3><span className="connection-rule" /><p>Find and reconnect with your classmates from PSG Public Schools.</p></article>
          <article className="connection-card connection-card-near"><span className="connection-icon"><MapPin size={42} strokeWidth={1.8} /></span><h3>Alumni Near You</h3><span className="connection-rule" /><p>Discover alumni living in your city or area.</p></article>
          <article className="connection-card connection-card-interest"><span className="connection-icon"><Handshake size={42} strokeWidth={1.8} /></span><h3>Shared Interests</h3><span className="connection-rule" /><p>Find alumni with similar professional goals and hobbies.</p></article>
        </div>
        <a className="directory-cta" href="#join"><span aria-hidden="true">&#8594;</span>Start connecting now</a>
      </section>

    </main>
  )
}

export default HomePage
