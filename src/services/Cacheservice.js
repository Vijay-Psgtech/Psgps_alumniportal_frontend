// Cache Service - handles localStorage caching of banner and notification data

const CACHE_PREFIX = 'psg_alumni_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheService = {
  /**
   * Get cached data by key
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if expired/not found
   */
  get(key) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const { data, timestamp, duration } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > duration;

      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} duration - Cache duration in milliseconds (default: 5 min)
   * @returns {boolean} - Success status
   */
  set(key, data, duration = DEFAULT_CACHE_DURATION) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        duration,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Clear cache by key
   * @param {string} key - Cache key
   * @returns {boolean} - Success status
   */
  clear(key) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  },

  /**
   * Clear all cached data
   * @returns {boolean} - Success status
   */
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Cache clear all error:', error);
      return false;
    }
  },

  /**
   * Check if cache exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean} - Cache validity status
   */
  has(key) {
    return this.get(key) !== null;
  },

  /**
   * Get all cached data
   * @returns {Object} - All cached data
   */
  getAll() {
    try {
      const result = {};
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cleanKey = key.replace(CACHE_PREFIX, '');
          const data = this.get(cleanKey);
          if (data) {
            result[cleanKey] = data;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Cache get all error:', error);
      return {};
    }
  },
};

export default cacheService;