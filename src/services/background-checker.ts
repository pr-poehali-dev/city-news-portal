const CHECK_UPDATES_URL = 'https://functions.poehali.dev/ad6dbc40-341f-468c-bf43-bc78691be642';
const CHECK_INTERVAL = 10000;

let intervalId: number | null = null;

async function checkForUpdates() {
  try {
    await fetch(CHECK_UPDATES_URL);
  } catch (error) {
    console.error('Background check failed:', error);
  }
}

export function startBackgroundChecker() {
  if (intervalId !== null) {
    return;
  }
  
  checkForUpdates();
  intervalId = window.setInterval(checkForUpdates, CHECK_INTERVAL);
}

export function stopBackgroundChecker() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

if (typeof window !== 'undefined' && localStorage.getItem('notifications-subscribed') === 'true') {
  startBackgroundChecker();
}