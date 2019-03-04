export const subscribeToMonitoringApiRequest = (/* formData */) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, 500);
});

export const subscribeComingSoonApiCall = ({ email }) => fetch('https://formspree.io/nesa993@gmail.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
  }),
});
