export const subscribeToMonitoringApiRequest = (/* formData */) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, 500);
});

export const subscribeComingSoonApiCall = ({ email }) => fetch('https://cdpsaver.us20.list-manage.com/subscribe/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: 'Aleksandar',
      LNAME: 'Vučić',
    },
  }),
});
