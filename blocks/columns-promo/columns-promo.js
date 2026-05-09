export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Convert video links to <video> elements
      const videoLink = col.querySelector('a[href$=".mp4"], a[href*=".mp4?"]');
      if (videoLink) {
        const videoUrl = videoLink.href;
        const poster = col.querySelector('picture img');
        const video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        if (poster) video.poster = poster.src;
        video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        col.textContent = '';
        col.appendChild(video);
      }
    });
  });
}
