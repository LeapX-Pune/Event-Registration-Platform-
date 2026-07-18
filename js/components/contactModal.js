/* =====================================================
   EventPulse - Contact Us Modal
   ===================================================== */

(function () {
  function formMarkup() {
    return (
      '<form id="contactForm" novalidate>' +
        '<div class="form-group">' +
          '<label class="form-label" for="contactName">Full Name</label>' +
          '<input class="form-input" id="contactName" name="name" type="text" placeholder="Jane Doe" autocomplete="name" required>' +
          '<div class="form-error-text" id="contactNameError" hidden></div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label" for="contactEmail">Email</label>' +
          '<input class="form-input" id="contactEmail" name="email" type="email" placeholder="jane@example.com" autocomplete="email" required>' +
          '<div class="form-error-text" id="contactEmailError" hidden></div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label" for="contactPhone">Phone Number</label>' +
          '<input class="form-input" id="contactPhone" name="phone" type="tel" placeholder="+1 555 000 0000" autocomplete="tel" required>' +
          '<div class="form-error-text" id="contactPhoneError" hidden></div>' +
        '</div>' +
        '<div class="form-group" style="margin-bottom:0;">' +
          '<label class="form-label" for="contactDetails">Description / Project Details</label>' +
          '<textarea class="form-input" id="contactDetails" name="details" placeholder="Tell us about your event or project..." required></textarea>' +
          '<div class="form-error-text" id="contactDetailsError" hidden></div>' +
        '</div>' +
      '</form>'
    );
  }

  function ensureModal() {
    if (document.getElementById('contactModal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'contactModal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'contactModalTitle');
    overlay.innerHTML =
      '<div class="modal-backdrop" data-contact-close></div>' +
      '<div class="modal-container">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<h2 id="contactModalTitle" class="modal-title">Contact Us</h2>' +
            '<button type="button" class="btn-icon" data-contact-close aria-label="Close contact form">' +
              '<span class="material-symbols-outlined">close</span>' +
            '</button>' +
          '</div>' +
          '<div class="modal-body" id="contactModalBody">' + formMarkup() + '</div>' +
          '<div class="modal-footer" id="contactModalFooter">' +
            '<button type="button" class="btn btn-outline" data-contact-close>Cancel</button>' +
            '<button type="submit" form="contactForm" class="btn btn-primary" id="contactSubmitBtn">Submit</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('[data-contact-close]')) closeContactModal();
    });

    bindForm();
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeContactModal();
    });
  }

  function bindForm() {
    var form = document.getElementById('contactForm');
    if (form && !form._bound) {
      form.addEventListener('submit', handleSubmit);
      form._bound = true;
    }
  }

  function resetFormView() {
    var body = document.getElementById('contactModalBody');
    var footer = document.getElementById('contactModalFooter');
    if (!body) return;
    body.innerHTML = formMarkup();
    if (footer) footer.style.display = 'flex';
    bindForm();
    clearErrors();
  }

  function clearErrors() {
    ['Name', 'Email', 'Phone', 'Details'].forEach(function (key) {
      var input = document.getElementById('contact' + key);
      var err = document.getElementById('contact' + key + 'Error');
      if (input) input.classList.remove('error');
      if (err) {
        err.hidden = true;
        err.textContent = '';
      }
    });
  }

  function showError(field, message) {
    var input = document.getElementById('contact' + field);
    var err = document.getElementById('contact' + field + 'Error');
    if (input) input.classList.add('error');
    if (err) {
      err.hidden = false;
      err.textContent = message;
    }
  }

  function validate() {
    clearErrors();
    var name = (document.getElementById('contactName').value || '').trim();
    var email = (document.getElementById('contactEmail').value || '').trim();
    var phone = (document.getElementById('contactPhone').value || '').trim();
    var details = (document.getElementById('contactDetails').value || '').trim();
    var ok = true;

    if (name.length < 2) {
      showError('Name', 'Please enter your full name.');
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Email', 'Please enter a valid email address.');
      ok = false;
    }
    if (phone.replace(/\D/g, '').length < 7) {
      showError('Phone', 'Please enter a valid phone number.');
      ok = false;
    }
    if (details.length < 10) {
      showError('Details', 'Please provide at least 10 characters about your project.');
      ok = false;
    }
    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    var body = document.getElementById('contactModalBody');
    var footer = document.getElementById('contactModalFooter');
    body.innerHTML =
      '<div class="contact-success">' +
        '<div class="contact-success-icon"><span class="material-symbols-outlined" style="font-size:32px;">check_circle</span></div>' +
        '<h3>Message sent!</h3>' +
        '<p>Thanks for reaching out. Our team will get back to you shortly.</p>' +
        '<button type="button" class="btn btn-primary" data-contact-close>Done</button>' +
      '</div>';
    if (footer) footer.style.display = 'none';
  }

  function openContactModal() {
    ensureModal();
    resetFormView();
    var overlay = document.getElementById('contactModal');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = document.getElementById('contactName');
      if (first) first.focus();
    }, 50);
  }

  function closeContactModal() {
    var overlay = document.getElementById('contactModal');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    resetFormView();
  }

  window.openContactModal = openContactModal;
  window.closeContactModal = closeContactModal;
  window.triggerContactMsg = openContactModal;

  document.addEventListener('DOMContentLoaded', function () {
    ensureModal();
    document.querySelectorAll('[data-open-contact]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openContactModal();
      });
    });
  });
})();
