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
    if (getRedirect() === "admin.html") {
      authTitle.textContent = "Admin Sign In";
      authSubtitle.textContent = "Welcome back, Administrator";
    } else {
      authTitle.textContent = "Sign In";
      authSubtitle.textContent = "Welcome back to EventPulse";
    }
  }

  function showSignup() {
    hideError();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    profileView.style.display = "none";
    if (getRedirect() === "admin.html") {
      authTitle.textContent = "Admin Sign Up";
      authSubtitle.textContent = "Register Admin Account";
    } else {
      authTitle.textContent = "Create Account";
      authSubtitle.textContent = "Join EventPulse today";
    }
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

  var signupRole = document.getElementById("signupRole");
  var standardFields = document.getElementById("standardSignupFields");
  var adminFields = document.getElementById("adminSignupFields");

  if (signupRole) {
    signupRole.addEventListener("change", function() {
      if (signupRole.value === "admin") {
        standardFields.style.display = "none";
        adminFields.style.display = "flex";
      } else {
        standardFields.style.display = "flex";
        adminFields.style.display = "none";
      }
    });
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

    // Auto-create default admin if logging in with admin credentials and not registered
    if (email === "admin" && password === "admin123") {
      var adminExists = Storage.getUsers().find(u => u.email === "admin");
      if (!adminExists) {
        Storage.addUser({
          name: "Admin User",
          email: "admin",
          password: "admin123",
          role: "admin",
          photo: null
        });
      }
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
    var role = signupRole ? signupRole.value : "user";

    if (role === "admin") {
      var adminUser = document.getElementById("adminSignupUser").value.trim();
      var adminId = document.getElementById("adminSignupId").value.trim();
      var adminPassword = document.getElementById("adminSignupPassword").value;
      var photoInput = document.getElementById("adminSignupPhoto");

      if (!adminUser || !adminId || !adminPassword) {
        showError("Please fill in all Admin fields.");
        return;
      }
      if (adminId !== "admin") {
        showError("Admin ID must be 'admin' only.");
        return;
      }
      if (adminPassword !== "admin123") {
        showError("Admin Password must be 'admin123' only.");
        return;
      }

      var proceedRegister = function(photoBase64) {
        var user = Storage.addUser({
          name: adminUser,
          email: "admin",
          password: "admin123",
          role: "admin",
          photo: photoBase64 || null
        });
        if (!user) {
          showError("An account with this email already exists.");
          return;
        }
        sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
        window.location.href = getRedirect();
      };

      if (photoInput && photoInput.files && photoInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          proceedRegister(e.target.result);
        };
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        proceedRegister(null);
      }
      return;
    }

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
    var user = Storage.addUser({ name: name, email: email, password: password, role: role });
    if (!user) {
      showError("An account with this email already exists.");
      return;
    }
    sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
    window.location.href = getRedirect();
  });

  function initAdminView() {
    var redirect = getRedirect();
    if (redirect === "admin.html") {
      var emailLabel = document.getElementById("loginEmailLabel");
      var emailInput = document.getElementById("loginEmail");
      if (emailLabel) emailLabel.textContent = "Admin ID";
      if (emailInput) {
        emailInput.placeholder = "Enter Admin ID";
        if (emailInput.value === "") {
          emailInput.value = "";
        }
      }
      if (signupRole) {
        signupRole.value = "admin";
      }
      var signupRoleGroup = document.getElementById("signupRoleGroup");
      if (signupRoleGroup) signupRoleGroup.style.display = "none";
      if (standardFields) standardFields.style.display = "none";
      if (adminFields) adminFields.style.display = "flex";
    } else {
      // Normal signup: remove Admin role from option list
      if (signupRole) {
        for (var i = 0; i < signupRole.options.length; i++) {
          if (signupRole.options[i].value === "admin") {
            signupRole.remove(i);
            break;
          }
        }
      }
    }
  }

  document.getElementById("logoutBtn").addEventListener("click", function() {
    sessionStorage.removeItem("eventpulse_user");
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    showLogin();
    if (navSignIn) navSignIn.textContent = "Sign In";
  });

  document.addEventListener("DOMContentLoaded", function() {
    initAdminView();
    checkSession();
  });

  window.getCurrentUser = function() {
    var session = sessionStorage.getItem("eventpulse_user");
    if (session) {
      try { return JSON.parse(session); } catch(e) {}
    }
    return null;
  };
})();
