/* ============================================================
   event-details.js — Event Details page interactions
   Sirf UI animations hain — koi backend nahi
   ============================================================ */

/* Ye progress bar ko animate karta hai — page load pe */
document.addEventListener('DOMContentLoaded', function () {
  var fill = document.getElementById('edFill');
  if (fill) setTimeout(function () { fill.style.width = '49.6%'; }, 600);
});

/* Ye gallery image ko lightbox mein open karta hai */
function edOpenLightbox(el) {
  var img   = el.querySelector('img');
  var lbImg = document.getElementById('edLightboxImg');
  if (!img || !lbImg) return;
  lbImg.src = img.src;
  sOpenModal('edLightbox');
}

/* ESC key se lightbox band hoga */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') sCloseModal('edLightbox');
});
