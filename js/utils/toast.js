var showToast = (function() {
  var container = null;

  function getContainer() {
    if (!container) {
      container = document.getElementById('toastContainer');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
      }
    }
    return container;
  }

  return function(message, type) {
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'success');
    el.textContent = message;
    getContainer().appendChild(el);
    setTimeout(function() {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(function() { el.remove(); }, 300);
    }, 3000);
  };
})();
