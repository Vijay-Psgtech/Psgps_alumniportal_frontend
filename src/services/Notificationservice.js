// Notification Service - handles notification data fetching
// This service will try to fetch from the API, but fallback to mock data

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const NOTIFICATION_API = `${API_BASE_URL}/api/notification-scrolls`;

const mockNotifications = [
  {
    id: "1",
    type: "success",
    title: "Welcome to PSG Alumni!",
    message: "Join 12K+ alumni members connecting across 35+ countries.",
  },
  {
    id: "2",
    type: "info",
    title: "Upcoming Event",
    message: "Join our networking session next month - early bird registration open!",
  },
  {
    id: "3",
    type: "warning",
    title: "Limited Spots Available",
    message: "Only 50 seats left for the Global Summit 2024. Register now!",
  },
  {
    id: "4",
    type: "trending",
    title: "Featured Alumni Story",
    message: "Read how our alumni members are making impact globally",
  },
];

export const notificationService = {
  async getActiveNotifications() {
    try {
      const response = await fetch(`${NOTIFICATION_API}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Notifications fetched from API:', data);
        return { success: true, data };
      } else {
        console.warn('Notification API returned:', response.status);
        return { success: false, data: mockNotifications };
      }
    } catch (error) {
      console.warn('Notification API Error - using mock data:', error.message);
      return { success: false, data: mockNotifications };
    }
  },

  async createNotification(notificationData) {
    try {
      const response = await fetch(`${NOTIFICATION_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to create notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateNotification(id, notificationData) {
    try {
      const response = await fetch(`${NOTIFICATION_API}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to update notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteNotification(id) {
    try {
      const response = await fetch(`${NOTIFICATION_API}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: 'Failed to delete notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default notificationService;