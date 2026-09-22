// ✅ Service Worker Registration Utility
// Place this file at: src/utils/registerServiceWorker.js

/**
 * Register the service worker
 */
export const registerServiceWorker = async () => {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('ℹ️ Service Workers not supported in this browser');
    return null;
  }

  try {
    console.log('📦 Attempting to register service worker...');
    
    // Register the service worker
    const registration = await navigator.serviceWorker.register(
      '/service-worker.js',
      {
        scope: '/',
        // ✅ Bypass cache during development
        updateViaCache: 'none',
      }
    );

    console.log('✅ Service Worker registered successfully:', registration);

    // ✅ Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    
    // ✅ Helpful error messages
    if (error.message.includes('MIME')) {
      console.error('💡 Fix: Ensure service-worker.js is served as application/javascript');
      console.error('💡 Check: public/service-worker.js exists');
      console.error('💡 Vite: service-worker.js should be in /public folder');
    } else if (error.message.includes('404')) {
      console.error('💡 Fix: File not found - create public/service-worker.js');
    } else if (error.message.includes('SecurityError')) {
      console.error('💡 Fix: MIME type issue - service-worker.js not served correctly');
      console.error('💡 Solution: Make sure file is in /public folder');
    }
    
    return null;
  }
};

/**
 * Unregister all service workers (for debugging)
 */
export const unregisterServiceWorkers = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const unregisterPromises = registrations.map((registration) => {
      console.log('🗑️ Unregistering service worker:', registration);
      return registration.unregister();
    });

    await Promise.all(unregisterPromises);
    console.log('✅ All service workers unregistered');
  } catch (error) {
    console.error('❌ Error unregistering service workers:', error);
  }
};

/**
 * Check service worker status
 */
export const checkServiceWorkerStatus = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('ℹ️ Service Workers not supported');
    return null;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('ℹ️ No service workers registered');
      return null;
    }

    registrations.forEach((registration) => {
      console.log('✅ Service Worker Status:');
      console.log('  Scope:', registration.scope);
      console.log('  Active:', registration.active ? 'Yes ✅' : 'No ❌');
      console.log('  Installing:', registration.installing ? 'Yes' : 'No');
      console.log('  Waiting:', registration.waiting ? 'Yes' : 'No');
    });

    return registrations;
  } catch (error) {
    console.error('❌ Error checking service worker status:', error);
    return null;
  }
};

export default registerServiceWorker;