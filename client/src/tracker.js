/* eslint-disable */
const trackList = document.querySelectorAll("[data-track]");

if (trackList.length !== 0)
  trackList.forEach(track => {
    track.addEventListener("click", () => {
      const action = track.attributes["data-track-action"].textContent;
      const category = track.attributes["data-track-category"].textContent;
      const name = track.attributes["data-track-name"].textContent;
      if (_paq && _paq.push)
        _paq.push(["trackEvent", `${category}`, `${action}`, `${name}`]);
    });
  });
