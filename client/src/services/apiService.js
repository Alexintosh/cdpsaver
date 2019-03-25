export const subscribeToMonitoringApiRequest = (/* formData */) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, 500);
});

export const subscribeComingSoonApiCall = email => fetch('https://cdpsaver.com/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
  }),
});

export const contactUsApiCall = data => fetch('https://cdpsaver.com/api/send_email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
