(function () {
  var navSignIn = document.getElementById('navSignIn');
  var myEventsLinks = document.querySelectorAll('.my-events-link, #regMyEventsLink, #catMyEventsLink, #edMyEventsLink, [href="my-events.html"].nav-link');
  var mobileMyEvents = document.getElementById('mobileMyEvents');

  function updateNavbar() {
    var session = sessionStorage.getItem('eventpulse_user');
    if (session) {
      try {
        var user = JSON.parse(session);
        if (navSignIn) {
          navSignIn.textContent = user.name || user.email;
          navSignIn.onclick = function () { window.location.href = 'signin.html'; };
        }
        myEventsLinks.forEach(function (el) { el.style.display = ''; });
        if (mobileMyEvents) mobileMyEvents.style.display = '';
        return;
      } catch (e) {}
    }
    if (navSignIn) {
      navSignIn.textContent = 'Sign In';
      navSignIn.onclick = function () { window.location.href = 'signin.html'; };
    }
    myEventsLinks.forEach(function (el) { el.style.display = 'none'; });
    if (mobileMyEvents) mobileMyEvents.style.display = 'none';
  }

  updateNavbar();
  window.addEventListener('storage', updateNavbar);
})();
