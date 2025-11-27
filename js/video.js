document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.close-btn');
    const iframe = overlay.querySelector('iframe');

    // Improve image loading
    thumbnails.forEach(thumbnail => {
        const img = thumbnail.querySelector('img');
        const timeoutDuration = 5000; // 5 seconds timeout
        let timeoutId;

        const handleComplete = (success = true) => {
            clearTimeout(timeoutId);
            thumbnail.classList.add(success ? 'loaded' : 'error');
        };

        // Timeout fallback
        timeoutId = setTimeout(() => handleComplete(false), timeoutDuration);

        // Prefer decode if available
        if (img.decode) {
            img.decode().then(() => handleComplete(true)).catch(() => handleComplete(false));
        } else {
            img.onload = () => handleComplete(true);
            img.onerror = () => handleComplete(false);
        }
    });

    // Thumbnail click handler
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.dataset.videoId;
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
            overlay.classList.add('active');
        });
    });

    // Close overlay
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        iframe.src = '';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            iframe.src = '';
        }
    });
});
