export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const link = col.querySelector('a');
      if (!link) return;

      // The title attribute preserves the original URL before AEM path sanitization
      const originalUrl = link.title || '';
      const href = link.getAttribute('href') || '';
      const isVideo = originalUrl.match(/\.(mp4|webm|ogg)(\?|$)/i)
        || href.match(/\.(mp4|webm|ogg)(\?|$)/i)
        || href.match(/-mp4$/i);

      if (isVideo) {
        const videoSrc = originalUrl.match(/^https?:\/\//) ? originalUrl : href;
        const video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
        col.textContent = '';
        col.appendChild(video);
      }
    });
  });
}
