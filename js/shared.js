// Audio Control Functionality
function setupAudioControls(audioId, toggleId) {
    const bgMusic = document.getElementById(audioId);
    const audioToggle = document.getElementById(toggleId);
  
    // Try to start audio (may be blocked by browser autoplay policies)
    function startAudio() {
      bgMusic.volume = 0.5;
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented, show button to allow user to start
          audioToggle.style.display = 'flex';
          audioToggle.textContent = '🔇';
        });
      }
    }
    
    // Toggle audio on/off
    audioToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        audioToggle.textContent = '🔊';
      } else {
        bgMusic.pause();
        audioToggle.textContent = '🔇';
      }
    });
    
    // Start audio when page loads
    // window.addEventListener('load', startAudio);
    
    // Alternatively, start audio on first user interaction
    // document.body.addEventListener('click', function() {
    //   if (bgMusic.paused) {
    //     startAudio();
    //   }
    // }, { once: true });
  }
  
  // Parallax Effect
  function setupParallax(selector) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 30;
      const y = (window.innerHeight / 2 - e.pageY) / 30;
      document.querySelector(selector).style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
    });
  }
  
  // Carousel Class
  class Carousel {
    constructor(options) {
      this.track = document.querySelector(options.trackSelector);
      this.cards = document.querySelectorAll(options.cardSelector);
      this.dots = document.querySelectorAll(options.dotSelector);
      this.prevBtn = document.getElementById(options.prevBtnId);
      this.nextBtn = document.getElementById(options.nextBtnId);
      this.container = document.getElementById(options.containerId);
      this.slideSound = document.getElementById(options.soundId);
      this.axis = options.axis || 'x'; // 'x' or 'y'
      this.radius = this.calculateRadius();
      this.currentIndex = 0;
      this.totalCards = this.cards.length;
      this.angle = 360 / this.totalCards;
      this.isSoundReady = false;
      
      this.init();
    }
  
    calculateRadius() {
      return this.axis === 'x' 
        ? Math.min(window.innerWidth, window.innerHeight) * 1.5
        : Math.min(window.innerWidth, window.innerHeight) * 1.5;
    }
  
    init() {
      this.setupEventListeners();
      this.updateCarousel();
      
      if (this.slideSound) {
        this.slideSound.addEventListener('canplaythrough', () => {
          this.isSoundReady = true;
        });
      }
    }
  
    setupEventListeners() {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
      this.nextBtn.addEventListener('click', () => this.navigate(1));
      
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToIndex(index));
      });
  
      window.addEventListener('resize', () => {
        this.radius = this.calculateRadius();
        this.updateCarousel();
      });
  
  // Vertical swipe handling for services page
  if (this.axis === 'x') { // Only for vertical carousels (services page)
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 50;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    this.container.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY;
      
      if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
        deltaY > 0 ? this.navigate(-1) : this.navigate(1);
      }
    });
  } 
  // Horizontal swipe handling for other pages (like team page)
  else {
    let touchStartX = 0;
    const SWIPE_THRESHOLD = 50;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    this.container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        deltaX > 0 ? this.navigate(-1) : this.navigate(1);
      }
    });
  }
    }
  
    navigate(direction) {
      this.currentIndex += direction;
      this.updateCarousel();
      this.playClickSound();
    }
  
    goToIndex(targetIndex) {
      const currentMod = this.mod(this.currentIndex, this.totalCards);
      let diff = targetIndex - currentMod;
      
      if (diff > this.totalCards / 2) diff -= this.totalCards;
      else if (diff < -this.totalCards / 2) diff += this.totalCards;
      
      this.currentIndex += diff;
      this.updateCarousel();
      this.playClickSound();
    }
  
    mod(n, m) {
      return ((n % m) + m) % m;
    }
  
    playClickSound() {
      if (!this.isSoundReady || !this.slideSound) return;
      this.slideSound.currentTime = 0;
      this.slideSound.volume = 0.5;
      this.slideSound.play().catch(error => console.log('Audio play prevented:', error));
    }
  
    updateCarousel() {
      const effectiveIndex = this.mod(this.currentIndex, this.totalCards);
      const rotation = this.currentIndex * this.angle * (this.axis === 'x' ? 1 : -1);
      
      this.track.style.transform = `translate(-50%, -50%) translateZ(-${this.radius}px) rotate${this.axis.toUpperCase()}(${rotation}deg)`;
  
      this.cards.forEach((card, index) => {
        const cardAngle = this.angle * index;
        card.style.transform = `translate(-50%, -50%) rotate${this.axis.toUpperCase()}(${this.axis === 'x' ? -cardAngle : cardAngle}deg) translateZ(${this.radius}px)`;
        card.classList.toggle('active', index === effectiveIndex);
      });
  
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === effectiveIndex);
      });
    }
  }
