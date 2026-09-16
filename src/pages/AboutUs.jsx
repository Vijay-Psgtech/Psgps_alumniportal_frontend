import React from 'react'
import schoolImage from '../assets/SCHOOL BUILDING PICTURE.png'

const AboutUs = () => {
    return (
        <div className="relative w-full overflow-hidden bg-[#0a1330] font-inter font-light text-white ">
            <div
                className="absolute inset-0 bg-cover bg-center lg:left-[30%]"
                style={{ backgroundImage: `url(${schoolImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1330] via-[#0a1330] lg:via-[#0a1330]/95 to-transparent" />
            <div className="absolute inset-0 bg-[#0a1330]/40 lg:bg-transparent" />
            <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                <p className="text-lg text-white mb-4">
                    PSG Public Schools ardently believe that Education is a process and not a product. Swami Chinmayananda once said: 'Children are not empty vessels to be filled but lamps to be lit'. One of the mission statements of the school is that a rigorous academic program would be ensured, coupled with a rich repertoire of Co-curricular and Extra-curricular activities, allowing latent talents to bloom in a nurturing, non-threatening environment. Here, 'All the students will experience Success which is essential in building Self-esteem'. The objective of the school is to leave the legacy of overall development in the students, endow them with a much-needed holistic education and give them a competitive edge over their counterparts elsewhere, thus molding them into worthy citizens of a global village.
                </p>
            </div>
            {/* Mission & Vision */}
            <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 max-w-3xl">
                <h2 className="text-3xl font-bold text-white mb-4">Vision</h2>
                <p className="text-lg text-white mb-4">
                    To be a pioneering institution that fosters excellence in education through a holistic, inclusive, and technology-driven approach. We envision a safe, nurturing, and dynamic learning ecosystem that enhances critical thinking, creativity, collaboration, and ethical leadership, equipping students to excel in an evolving global landscape
                </p>
            </div>
            <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 max-w-3xl">
                <h2 className="text-3xl font-bold text-white mb-4">Mission</h2>
                <p className="text-lg text-white mb-4">
                    • CURRICULUM:
                    The school will build state of the art infrastructure which is essential to reach the vision.<br />
                    • PEDAGOGY:
                    The school shall have a student-centric, technology-driven, and dynamic curriculum that maximises participation and unlocks the full potential of every child in the learning process.<br />
                    • ASSESSMENTS:
                    Emphasising experiential and active learning, we will design assessment plans aligned with Multiple Intelligences (MI) to cater to diverse learners.
                </p>
            </div>
        </div>
    )
}
export default AboutUs