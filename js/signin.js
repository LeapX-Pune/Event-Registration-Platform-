(function() {
  var loginForm = document.getElementById("loginForm");
  var signupForm = document.getElementById("signupForm");
  var profileView = document.getElementById("profileView");
  var authError = document.getElementById("authError");
  var authTitle = document.getElementById("authTitle");
  var authSubtitle = document.getElementById("authSubtitle");
  var navSignIn = document.getElementById("navSignIn");

  function showError(msg) {
    authError.textContent = msg;
    authError.style.display = "block";
  }

  function hideError() {
    authError.style.display = "none";
  }

  function showLogin() {
    hideError();
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    profileView.style.display = "none";
    authTitle.textContent = "Sign In";
    authSubtitle.textContent = "Welcome back to EventPulse";
  }

  function showSignup() {
    hideError();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    profileView.style.display = "none";
    authTitle.textContent = "Create Account";
    authSubtitle.textContent = "Join EventPulse today";
  }

  function showProfile(user) {
    hideError();
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    profileView.style.display = "block";
    document.getElementById("profileName").textContent = user.name || user.email;
    document.getElementById("profileEmail").textContent = user.email;
    authTitle.textContent = "Your Profile";
    authSubtitle.textContent = "Manage your account";
    if (navSignIn) navSignIn.textContent = user.name || user.email;
  }

  function checkSession() {
    var session = sessionStorage.getItem("eventpulse_user");
    if (session) {
      try {
        var user = JSON.parse(session);
        showProfile(user);
        return user;
      } catch(e) {
        sessionStorage.removeItem("eventpulse_user");
      }
    }
    showLogin();
    return null;
  }

  document.getElementById("showSignup").addEventListener("click", function(e) {
    e.preventDefault();
    showSignup();
  });

  document.getElementById("showLogin").addEventListener("click", function(e) {
    e.preventDefault();
    showLogin();
  });

  function getRedirect() {
    var p = new URLSearchParams(window.location.search);
    return p.get("redirect") || "index.html";
  }

  document.getElementById("loginBtn").addEventListener("click", function() {
    hideError();
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value;
    if (!email || !password) {
      showError("Please fill in all fields.");
      return;
    }
    var user = Storage.authenticate(email, password);
    if (!user) {
      showError("Invalid email or password. Please try again or sign up.");
      return;
    }
    sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
    window.location.href = getRedirect();
  });

  document.getElementById("signupBtn").addEventListener("click", function() {
    hideError();
    var name = document.getElementById("signupName").value.trim();
    var email = document.getElementById("signupEmail").value.trim();
    var password = document.getElementById("signupPassword").value;
    if (!name || !email || !password) {
      showError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }
    var user = Storage.addUser({ name: name, email: email, password: password });
    if (!user) {
      showError("An account with this email already exists.");
      return;
    }
    sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
    window.location.href = getRedirect();
  });

  document.getElementById("logoutBtn").addEventListener("click", function() {
    sessionStorage.removeItem("eventpulse_user");
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    showLogin();
    if (navSignIn) navSignIn.textContent = "Sign In";
  });

  document.addEventListener("DOMContentLoaded", checkSession);

  window.getCurrentUser = function() {
    var session = sessionStorage.getItem("eventpulse_user");
    if (session) {
      try { return JSON.parse(session); } catch(e) {}
    }
    return null;
  };
})();
