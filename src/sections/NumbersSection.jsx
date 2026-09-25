import React from 'react';
import { CalendarDays, Globe2, UsersRound } from 'lucide-react'

const NumbersSection = () => {
    return (
        <section className="numbers-section" id="impact">
            <div className="section-heading"><span className="section-pill">Our impact</span><h2>By The Numbers</h2><p>Our vibrant alumni community continues to grow stronger, building bonds and creating opportunities that make a lasting difference.</p></div>
            <div className="impact-grid"><article><span className="impact-icon people-icon" aria-hidden="true"><UsersRound size={24} strokeWidth={1.8} /></span><strong>900<span>+</span></strong><b>Active alumni</b><p>A network of achievers inspiring and supporting one another.</p></article><article><span className="impact-icon globe-icon" aria-hidden="true"><Globe2 size={24} strokeWidth={1.8} /></span><strong>15<span>+</span></strong><b>Countries</b><p>Our alumni presence spans the globe, united by shared values.</p></article><article><span className="impact-icon calendar-icon" aria-hidden="true"><CalendarDays size={24} strokeWidth={1.8} /></span><strong>5<span>+</span></strong><b>Annual events</b><p>Bringing alumni together to connect, collaborate and celebrate milestones.</p></article></div>
        </section>
    )
}

export default NumbersSection