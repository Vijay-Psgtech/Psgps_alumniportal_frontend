import React, { useState } from 'react'
import { Handshake, MapPin, Search, UsersRound } from 'lucide-react'

const FindAlumniSection = () => {
    const [directoryQuery, setDirectoryQuery] = useState('')
      const [directoryFilter, setDirectoryFilter] = useState('All Alumni')

    return (
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
    )
}

export default FindAlumniSection