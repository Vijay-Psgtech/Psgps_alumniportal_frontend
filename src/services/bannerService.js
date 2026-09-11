// Banner Service - handles banner data fetching
// This service will try to fetch from the API, but fallback to mock data

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BANNER_API = `${API_BASE_URL}/api/banner`;

const mockBannerData = {
  id: "default-banner",
  title: "Connect, Grow & Lead Together",
  description:
    "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
  subtitle: "Welcome to Excellence",
  backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop",
  features: [
    { icon: "Users", text: "12K+ Alumni Connected" },
    { icon: "Globe", text: "35+ Countries" },
    { icon: "Sparkles", text: "200+ Annual Events" },
  ],
  primaryButtonText: "Join Now",
  secondaryButtonText: "Learn More",
  isActive: true,
  updatedAt: new Date().toISOString(),
};

export const bannerService = {
  async getActiveBanner() {
    try {
      const response = await fetch(`${BANNER_API}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Banner fetched from API:', data);
        return { success: true, data };
      } else {
        console.warn('Banner API returned:', response.status);
        return { success: false, data: mockBannerData };
      }
    } catch (error) {
      console.warn('Banner API Error - using mock data:', error.message);
      return { success: false, data: mockBannerData };
    }
  },

  async updateBanner(bannerData) {
    try {
      const response = await fetch(`${BANNER_API}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to update banner' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default bannerService;