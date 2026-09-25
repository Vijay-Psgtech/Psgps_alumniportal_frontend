import React, { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

const BacktoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-[#0d2d52] hover:bg-[#071d38] text-white p-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d2d52]"
            >
                <ChevronUp className="w-5 h-5" />
            </button>
        </div>
    )
}

export default BacktoTop