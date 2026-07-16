/* ============================================================
   about.js — About page ke liye UI interactions
   Scroll reveal, stat counter animation aur hover effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== STAT COUNTER ANIMATION ===== */
  /* Ye numbers ko 0 se target value tak animate karta hai */
  function animateCounter(el, target, suffix) {
    var start = 0;
    var duration = 1600;
    var startTime = null;
    var numTarget = parseFloat(target.replace(/[^0-9.]/g, ''));

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var current = (numTarget * eased).toFixed(target.includes('.') ? 1 : 0);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Stats section visible hone pe counter start karo */
  var statsAnimated = false;
  var statNums = document.querySelectorAll('.about-stat-num');

  var statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      var data = ['50,000+', '2.4M+', '8.7M+', '340+'];
      var suffixes = ['+', 'M+', 'M+', '+'];
      statNums.forEach(function (el, i) {
        animateCounter(el, data[i], '');
      });
    }
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.about-stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  /* ===== SCROLL REVEAL for cards ===== */
  /* Ye cards ko scroll karne pe fade-in karta hai */
  var revealEls = document.querySelectorAll(
    '.about-stat-card, .about-why-card, .about-team-card, .about-timeline-card, .about-value-chip'
  );

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease ' + (i % 4 * 0.08) + 's, transform 0.5s ease ' + (i % 4 * 0.08) + 's';
    revealObserver.observe(el);
  });

});
