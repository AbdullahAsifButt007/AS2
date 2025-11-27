document.addEventListener('DOMContentLoaded', () => {
    const previews = document.querySelectorAll('.website-preview');
    const overlay = document.querySelector('.overlay-2');
    const overlayIframe = overlay.querySelector('.overlay-iframe');
    const overlayLoader = overlay.querySelector('.overlay-2 .loader');
    const closeBtn = overlay.querySelector('.close-btn-2');
    const deviceBtns = overlay.querySelectorAll('.device-btn');

    // Helper function to activate device button
    const activateDeviceButton = (device) => {
        deviceBtns.forEach(b => {
            if (b.dataset.device === device) {
                b.classList.add('active');
                overlayIframe.className = `overlay-iframe ${device}`;
            } else {
                b.classList.remove('active');
            }
        });
    };

    // Set default device based on viewport width
    const setDefaultDeviceByViewport = () => {
        if (window.innerWidth < 500) {
            activateDeviceButton('mobile');
        } else if (window.innerWidth < 900) {
            activateDeviceButton('tablet');
        } else {
            // Optional: Set default (e.g., desktop) if needed
            const desktopBtn = [...deviceBtns].find(btn => btn.dataset.device === 'desktop');
            if (desktopBtn) desktopBtn.classList.add('active');
        }
    };

    setDefaultDeviceByViewport();

    // Loader for preview iframes
    previews.forEach(preview => {
        const iframe = preview.querySelector('iframe');
        const loader = preview.querySelector('.loader');

        iframe.addEventListener('load', () => {
            loader.style.display = 'none';
            iframe.style.opacity = '1';
        });

        preview.addEventListener('click', () => {
            overlayIframe.style.opacity = '0';
            overlayLoader.style.display = 'block';
            overlayIframe.src = iframe.src;
            overlay.classList.add('active');
        });
    });

    // Loader for overlay iframe
    overlayIframe.addEventListener('load', () => {
        overlayLoader.style.display = 'none';
        overlayIframe.style.opacity = '1';
    });

    // Close overlay
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlayIframe.src = '';
        }, 300);
    });

    // Device switching
    deviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            deviceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            overlayIframe.className = `overlay-iframe ${btn.dataset.device}`;
        });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeBtn.click();
        }
    });

    // Click background to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeBtn.click();
        }
    });
});
