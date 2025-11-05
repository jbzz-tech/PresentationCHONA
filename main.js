(() => {
  const slidesRoot = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const controlsBar = document.getElementById('controls-bar');
  const bloqueio = document.getElementById('bloqueio');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFull = document.getElementById('btn-full');

  let current = 0;
  let inactivityTimer = null;
  const INACTIVITY_MS = 3000;

  function showSlide(i) {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    current = i;
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === current);
    });
    if (!controlsBar.classList.contains('hidden')) {
      document.documentElement.classList.add('controls-visible');
    }
  }

  function showControls() {
    controlsBar.classList.remove('hidden');
    document.documentElement.classList.add('controls-visible');
    resetInactivityTimer();
  }

  function hideControls() {
    controlsBar.classList.add('hidden');
    document.documentElement.classList.remove('controls-visible');
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      hideControls();
    }, INACTIVITY_MS);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(()=>{});
    } else {
      document.exitFullscreen?.().catch(()=>{});
    }
  }

  function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
      bloqueio.classList.remove('hidden');
      bloqueio.setAttribute('aria-hidden','false');
      slidesRoot.style.display = 'none';
    } else {
      bloqueio.classList.add('hidden');
      bloqueio.setAttribute('aria-hidden','true');
      slidesRoot.style.display = 'block';
      showSlide(current);
      showControls();
    }
  }

  btnPrev.addEventListener('click', () => { showSlide(current - 1); showControls(); });
  btnNext.addEventListener('click', () => { showSlide(current + 1); showControls(); });
  btnFull.addEventListener('click', () => { toggleFullscreen(); showControls(); });

  ['mousemove','touchstart','touchmove','wheel','keydown'].forEach(ev => {
    window.addEventListener(ev, () => { 
      if (slidesRoot.style.display !== 'none') showControls();
    }, { passive: true });
  });

  function init() {
    slides.forEach(s => s.classList.remove('active'));
    slides.forEach(s => {
      const content = s.querySelector('.slide-content');
      if (content) content.setAttribute('tabindex','0');
    });
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
  }
  init();

  window._presentation = { showSlide };

})();