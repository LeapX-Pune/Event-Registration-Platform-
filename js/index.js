/* ============================================================
   index.js — Homepage ke liye carousel aur interactions
   ============================================================ */

/* ===== HERO CAROUSEL ===== */
/* Ye hero section ka slider hai */
var idxCurrentSlide = 0;

function idxSlide(dir) {
  var carousel = document.getElementById('idxCarousel');
  var slides = carousel ? carousel.querySelectorAll('.idx-slide') : [];
  if (!slides.length) return;

  idxCurrentSlide = (idxCurrentSlide + dir + slides.length) % slides.length;
  carousel.style.transform = 'translateX(-' + (idxCurrentSlide * 100) + '%)';
  idxUpdateDots(slides.length);
}

function idxUpdateDots(total) {
  var dotsEl = document.getElementById('idxDots');
  if (!dotsEl) return;
  dotsEl.querySelectorAll('.idx-dot').forEach(function (d, i) {
    d.classList.toggle('active', i === idxCurrentSlide);
  });
}

function idxGoTo(i) {
  idxCurrentSlide = i;
  var carousel = document.getElementById('idxCarousel');
  var slides = carousel ? carousel.querySelectorAll('.idx-slide') : [];
  if (carousel) carousel.style.transform = 'translateX(-' + (i * 100) + '%)';
  idxUpdateDots(slides.length);
}

document.addEventListener('DOMContentLoaded', function () {
  /* Carousel transition set karo */
  var carousel = document.getElementById('idxCarousel');
  if (carousel) {
    carousel.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
    var slides = carousel.querySelectorAll('.idx-slide');

    /* Dots banao */
    var dotsEl = document.getElementById('idxDots');
    if (dotsEl) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'idx-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i+1));
        d.addEventListener('click', function () { idxGoTo(i); });
        dotsEl.appendChild(d);
      });
    }

    /* Auto-play — 4 seconds */
    setInterval(function () { idxSlide(1); }, 4000);
  }
});
