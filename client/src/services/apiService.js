// import clientConfig from '../config/clientConfig.json';

export const subscribeToMonitoringApiRequest = (/* formData */) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, 500);
});

// TODO IMPLEMENT FALLBACK IN THE FUTURE
// export const getCdpForProxyAddressApiCall = proxyAddress => fetch(clientConfig.proxyServer,
//   {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       query: `{ allCups( condition: { lad: "${proxyAddress}" } ) { nodes { id, block } } }`,
//     }),
//   }).then(res => res.json()).then(res => res.data.allCups.nodes[0]);
