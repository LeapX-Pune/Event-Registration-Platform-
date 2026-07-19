(function() {
  var currentEvent = null;

  function init() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    if (id) currentEvent = Storage.getById(Number(id));

    var infoEl = document.getElementById("regEventInfo");
    if (currentEvent) {
      infoEl.textContent = currentEvent.title + " \u2022 " + Helpers.formatDate(currentEvent.date) + " \u2022 " + (currentEvent.venue || currentEvent.location || "Online");
      document.getElementById("confirmEventName").textContent = currentEvent.title;
    } else {
      infoEl.textContent = "Event not found.";
      document.getElementById("submitRegistration").disabled = true;
    }

    document.getElementById("submitRegistration").addEventListener("click", handleRegistration);

    var session = sessionStorage.getItem("eventpulse_user");
    if (session) {
      try {
        var user = JSON.parse(session);
        if (!document.getElementById("regName").value) document.getElementById("regName").value = user.name || "";
        if (!document.getElementById("regEmail").value) document.getElementById("regEmail").value = user.email || "";
      } catch(e) {}
    }

    var navSignIn = document.getElementById("navSignIn");
    if (navSignIn && session) {
      try {
        var user = JSON.parse(session);
        navSignIn.textContent = user.name || user.email;
        navSignIn.onclick = function() { window.location.href = "signin.html"; };
      } catch(e) {}
    }
  }

  function handleRegistration() {
    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var phone = document.getElementById("regPhone").value.trim();
    var company = document.getElementById("regCompany").value.trim();

    if (!name || !email || !phone) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!currentEvent) {
      showToast("Event not found.", "error");
      return;
    }

    if (Number(currentEvent.attendees || 0) >= Number(currentEvent.maxAttendees)) {
      showToast("This event is fully booked.", "error");
      return;
    }

    Storage.addRegistration({
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      name: name,
      email: email,
      phone: phone,
      company: company
    });

    Storage.update(currentEvent.id, { attendees: Number(currentEvent.attendees || 0) + 1 });
    currentEvent.attendees++;

    document.getElementById("confirmDetails").textContent = name + " \u2022 " + email + " \u2022 " + phone;
    document.getElementById("confirmModal").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function showToast(message, type) {
    var container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.id = "toastContainer";
      document.body.appendChild(container);
    }
    var el = document.createElement("div");
    el.className = "toast " + (type || "success");
    el.textContent = message;
    container.appendChild(el);
    setTimeout(function() {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.3s";
      setTimeout(function() { el.remove(); }, 300);
    }, 3000);
  }

  document.addEventListener("DOMContentLoaded", function() {
    init();
    var regMyEvents = document.getElementById('regMyEventsLink');
    var session = sessionStorage.getItem('eventpulse_user');
    if (regMyEvents && session) regMyEvents.style.display = '';
  });
})();

function closeConfirmModal(e) {
  if (e) e.stopPropagation();
  var modal = document.getElementById("confirmModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    var modal = document.getElementById("confirmModal");
    if (modal && modal.classList.contains("active")) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});
