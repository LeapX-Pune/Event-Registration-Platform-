const Storage = {
  key: "eventhub_events",
  regKey: "eventhub_registrations",
  userKey: "eventhub_users",

  init() {
    if (!localStorage.getItem(this.key)) {
      this.save(DEFAULT_EVENTS);
    }
  },

  load() {
    const data = localStorage.getItem(this.key);
    if (!data) return DEFAULT_EVENTS;
    try { return JSON.parse(data); } catch(e) { return DEFAULT_EVENTS; }
  },

  save(events) {
    localStorage.setItem(this.key, JSON.stringify(events));
  },

  getById(id) {
    const numId = Number(id);
    return this.load().find(e => Number(e.id) === numId);
  },

  add(event) {
    const events = this.load();
    event.id = Date.now();
    event.attendees = 0;
    events.push(event);
    this.save(events);
    return event;
  },

  update(id, updates) {
    const events = this.load();
    const numId = Number(id);
    const idx = events.findIndex(e => Number(e.id) === numId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      this.save(events);
      return events[idx];
    }
    return null;
  },

  remove(id) {
    let events = this.load();
    const numId = Number(id);
    events = events.filter(e => Number(e.id) !== numId);
    this.save(events);
  },

  // ---- Registrations ----
  getRegistrations() {
    const data = localStorage.getItem(this.regKey);
    if (!data) return [];
    try { return JSON.parse(data); } catch(e) { return []; }
  },

  addRegistration(reg) {
    const regs = this.getRegistrations();
    reg.id = Date.now() + Math.random();
    reg.createdAt = new Date().toISOString();
    regs.push(reg);
    localStorage.setItem(this.regKey, JSON.stringify(regs));
    return reg;
  },

  getRegistrationsForEvent(eventId) {
    return this.getRegistrations().filter(r => Number(r.eventId) === Number(eventId));
  },

  // ---- Users / Auth ----
  getUsers() {
    const data = localStorage.getItem(this.userKey);
    if (!data) return [];
    try { return JSON.parse(data); } catch(e) { return []; }
  },

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async addUser(user) {
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => u.email === user.email);
    if (existingIdx !== -1) {
      if (user.email === 'admin') {
        // Overwrite the admin user to allow update/re-registration
        user.id = users[existingIdx].id;
        users[existingIdx] = user;
        localStorage.setItem(this.userKey, JSON.stringify(users));
        return user;
      }
      return null;
    }
    user.id = Date.now();
    user.password = await this.hashPassword(user.password);
    users.push(user);
    localStorage.setItem(this.userKey, JSON.stringify(users));
    return user;
  },

  async authenticate(email, password) {
    const users = this.getUsers();
    const hash = await this.hashPassword(password);
    return users.find(u => u.email === email && u.password === hash) || null;
  },

  // ---- Categories ----
  catKey: "eventhub_categories",

  getCategories() {
    const data = localStorage.getItem(this.catKey);
    if (data) { try { return JSON.parse(data); } catch(e) {} }
    const defaults = [
      { id: 1, name: "Music", icon: "music_note", color: "#9d4edd", eventCount: 0 },
      { id: 2, name: "Technology", icon: "computer", color: "#0ea5e9", eventCount: 0 },
      { id: 3, name: "Sports", icon: "sports_basketball", color: "#16a34a", eventCount: 0 },
      { id: 4, name: "Art", icon: "palette", color: "#ec4899", eventCount: 0 },
      { id: 5, name: "Workshop", icon: "school", color: "#d97706", eventCount: 0 },
      { id: 6, name: "Festival", icon: "celebration", color: "#dc2626", eventCount: 0 },
      { id: 7, name: "Business", icon: "business_center", color: "#2563eb", eventCount: 0 },
      { id: 8, name: "Education", icon: "menu_book", color: "#059669", eventCount: 0 },
      { id: 9, name: "Entertainment", icon: "theaters", color: "#7c3aed", eventCount: 0 },
      { id: 10, name: "Food", icon: "restaurant", color: "#ea580c", eventCount: 0 },
      { id: 11, name: "Health", icon: "favorite", color: "#0d9488", eventCount: 0 },
      { id: 12, name: "Community", icon: "groups", color: "#e11d48", eventCount: 0 }
    ];
    this.saveCategories(defaults);
    return defaults;
  },

  saveCategories(cats) {
    const events = this.load();
    cats.forEach(c => {
      c.eventCount = events.filter(e => (e.category || '').toLowerCase() === c.name.toLowerCase()).length;
    });
    localStorage.setItem(this.catKey, JSON.stringify(cats));
  },

  addCategory(cat) {
    const cats = this.getCategories();
    cat.id = Date.now();
    cat.eventCount = 0;
    cats.push(cat);
    this.saveCategories(cats);
    return cat;
  },

  updateCategory(id, updates) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => Number(c.id) === Number(id));
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...updates };
      this.saveCategories(cats);
      return cats[idx];
    }
    return null;
  },

  removeCategory(id) {
    let cats = this.getCategories();
    cats = cats.filter(c => Number(c.id) !== Number(id));
    this.saveCategories(cats);
  }
};

// ---- Dynamically Injected Admin Auth Modal ----
(function() {
  function showAdminPopup(event) {
    if (event) event.preventDefault();
    
    // Create modal overlay if it doesn't exist
    var overlay = document.getElementById("adminAuthModalOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "adminAuthModalOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      overlay.style.backdropFilter = "blur(8px)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "10000";
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease";
      
      // Inject CSS styles for inputs/buttons inside the modal
      var styleTag = document.createElement("style");
      styleTag.textContent = `
        #adminAuthModalContainer {
          background: var(--surface-container-low, #1e1b21);
          border: 1px solid rgba(224, 182, 255, 0.2);
          border-radius: var(--radius-xl, 16px);
          max-width: 440px;
          width: 90%;
          padding: 32px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          color: var(--on-surface, #e6e1e6);
          font-family: 'Sora', sans-serif;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        .adm-popup-title {
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
          color: var(--primary, #e0b6ff);
        }
        .adm-popup-subtitle {
          font-size: 13px;
          color: var(--on-surface-variant, #cac4cf);
          text-align: center;
          margin-bottom: 24px;
        }
        .adm-popup-group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .adm-popup-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--outline, #968f9a);
        }
        .adm-popup-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .adm-popup-input:focus {
          border-color: var(--primary, #e0b6ff);
        }
        .adm-popup-btn {
          background: var(--primary, #e0b6ff);
          color: var(--on-primary, #4a127d);
          font-weight: 700;
          border: none;
          border-radius: var(--radius-full, 99px);
          padding: 12px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 16px;
          transition: filter 0.2s;
        }
        .adm-popup-btn:hover {
          filter: brightness(1.1);
        }
        .adm-popup-toggle {
          text-align: center;
          font-size: 13px;
          margin-top: 16px;
          color: var(--on-surface-variant, #cac4cf);
        }
        .adm-popup-toggle a {
          color: var(--primary, #e0b6ff);
          text-decoration: none;
          font-weight: 600;
        }
        .adm-popup-toggle a:hover {
          text-decoration: underline;
        }
        #admPopupError {
          background: rgba(255, 180, 171, 0.1);
          color: #ffb4ab;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          text-align: center;
          margin-top: 16px;
          display: none;
        }
      `;
      document.head.appendChild(styleTag);

      overlay.innerHTML = `
        <div id="adminAuthModalContainer">
          <div style="display:flex;justify-content:flex-end;">
            <button id="adminAuthCloseBtn" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;line-height:1;padding:0;">&times;</button>
          </div>
          
          <!-- Login Panel -->
          <div id="admPopupLoginPanel">
            <h3 class="adm-popup-title">Admin Sign In</h3>
            <p class="adm-popup-subtitle">Manage your event portal</p>
            
            <div class="adm-popup-group">
              <label class="adm-popup-label">Admin ID</label>
              <input type="text" id="admPopupLoginId" class="adm-popup-input" placeholder="e.g. admin">
            </div>
            <div class="adm-popup-group">
              <label class="adm-popup-label">Admin Password</label>
              <input type="password" id="admPopupLoginPass" class="adm-popup-input" placeholder="Enter your password">
            </div>
            
            <button type="button" id="admPopupLoginBtn" class="adm-popup-btn">Sign In</button>
            <p class="adm-popup-toggle">
              Don't have an admin account? <a href="#" id="admPopupShowSignup">Register</a>
            </p>
          </div>

          <!-- Signup Panel -->
          <div id="admPopupSignupPanel" style="display:none;">
            <h3 class="adm-popup-title">Registration</h3>
            <p class="adm-popup-subtitle">Create your account</p>
            
            <div class="adm-popup-group">
              <label class="adm-popup-label">Register As</label>
              <select id="admPopupSignupRole" class="adm-popup-input" style="background:var(--surface-container-low, #1e1b21);color:#fff;cursor:pointer;">
                <option value="user">User</option>
                <option value="admin" selected>Admin</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            <div id="admPopupStandardFields" style="display:none;flex-direction:column;gap:16px;">
              <div class="adm-popup-group">
                <label class="adm-popup-label">Full Name</label>
                <input type="text" id="admPopupSignupName" class="adm-popup-input" placeholder="John Doe">
              </div>
              <div class="adm-popup-group">
                <label class="adm-popup-label">Email</label>
                <input type="email" id="admPopupSignupEmail" class="adm-popup-input" placeholder="you@example.com">
              </div>
              <div class="adm-popup-group">
                <label class="adm-popup-label">Password</label>
                <input type="password" id="admPopupSignupPassword" class="adm-popup-input" placeholder="Min. 6 characters">
              </div>
            </div>

            <div id="admPopupAdminFields" style="display:flex;flex-direction:column;gap:16px;">
              <div class="adm-popup-group">
                <label class="adm-popup-label">Admin User</label>
                <input type="text" id="admPopupSignupUser" class="adm-popup-input" placeholder="e.g. Rehan Admin">
              </div>
              <div class="adm-popup-group">
                <label class="adm-popup-label">Admin ID</label>
                <input type="text" id="admPopupSignupId" class="adm-popup-input" placeholder="Must be 'admin'">
              </div>
              <div class="adm-popup-group">
                <label class="adm-popup-label">Admin Password</label>
                <input type="password" id="admPopupSignupPass" class="adm-popup-input" placeholder="Must be 'admin123'">
              </div>
              <div class="adm-popup-group">
                <label class="adm-popup-label">Admin Photo (Optional)</label>
                <input type="file" id="admPopupSignupPhoto" class="adm-popup-input" accept="image/*" style="padding:6px;">
              </div>
            </div>
            
            <button type="button" id="admPopupSignupBtn" class="adm-popup-btn">Create Account</button>
            <p class="adm-popup-toggle">
              Already have an admin account? <a href="#" id="admPopupShowLogin">Sign In</a>
            </p>
          </div>

          <div id="admPopupError"></div>
        </div>
      `;
      
      document.body.appendChild(overlay);

      // Setup Event Handlers inside modal
      var closeBtn = document.getElementById("adminAuthCloseBtn");
      var showSignup = document.getElementById("admPopupShowSignup");
      var showLogin = document.getElementById("admPopupShowLogin");
      
      var loginPanel = document.getElementById("admPopupLoginPanel");
      var signupPanel = document.getElementById("admPopupSignupPanel");
      var errorDiv = document.getElementById("admPopupError");

      var popupRoleSelect = document.getElementById("admPopupSignupRole");
      var popupStandardFields = document.getElementById("admPopupStandardFields");
      var popupAdminFields = document.getElementById("admPopupAdminFields");
      
      if (popupRoleSelect) {
        popupRoleSelect.onchange = function() {
          if (popupRoleSelect.value === "admin") {
            popupStandardFields.style.display = "none";
            popupAdminFields.style.display = "flex";
          } else {
            popupStandardFields.style.display = "flex";
            popupAdminFields.style.display = "none";
          }
        };
      }

      function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = "block";
      }

      function hideError() {
        errorDiv.style.display = "none";
      }

      closeBtn.onclick = function() {
        overlay.style.opacity = "0";
        document.getElementById("adminAuthModalContainer").style.transform = "scale(0.9)";
        setTimeout(function() { overlay.style.display = "none"; }, 300);
      };

      showSignup.onclick = function(e) {
        e.preventDefault();
        hideError();
        loginPanel.style.display = "none";
        signupPanel.style.display = "block";
      };

      showLogin.onclick = function(e) {
        e.preventDefault();
        hideError();
        loginPanel.style.display = "block";
        signupPanel.style.display = "none";
      };

      // Sign In Action
      document.getElementById("admPopupLoginBtn").onclick = async function() {
        hideError();
        var id = document.getElementById("admPopupLoginId").value.trim();
        var pass = document.getElementById("admPopupLoginPass").value;

        if (!id || !pass) {
          showError("Please fill in all fields.");
          return;
        }

        // Auto-create default admin account if not registered yet
        if (id === "admin" && pass === "admin123") {
          var adminExists = Storage.getUsers().find(u => u.email === "admin");
          if (!adminExists) {
            await Storage.addUser({
              name: "Admin User",
              email: "admin",
              password: "admin123",
              role: "admin",
              photo: null
            });
          }
        }

        var user = await Storage.authenticate(id, pass);
        if (!user || user.role !== "admin") {
          showError("Invalid Admin ID or Password.");
          return;
        }

        sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
        window.location.href = "admin.html";
      };

      // Sign Up Action
      document.getElementById("admPopupSignupBtn").onclick = async function() {
        hideError();
        var role = popupRoleSelect ? popupRoleSelect.value : "admin";

        if (role === "admin") {
          var userVal = document.getElementById("admPopupSignupUser").value.trim();
          var idVal = document.getElementById("admPopupSignupId").value.trim();
          var passVal = document.getElementById("admPopupSignupPass").value;
          var photoInput = document.getElementById("admPopupSignupPhoto");

          if (!userVal || !idVal || !passVal) {
            showError("Please fill in all fields.");
            return;
          }
          if (idVal !== "admin") {
            showError("Admin ID must be 'admin' only.");
            return;
          }
          if (passVal !== "admin123") {
            showError("Admin Password must be 'admin123' only.");
            return;
          }

          var proceedRegisterPopup = async function(photoBase64) {
            var user = await Storage.addUser({
              name: userVal,
              email: "admin",
              password: "admin123",
              role: "admin",
              photo: photoBase64 || null
            });
            if (!user) {
              showError("Admin account could not be registered.");
              return;
            }
            sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
            window.location.href = "admin.html";
          };

          if (photoInput && photoInput.files && photoInput.files[0]) {
            var reader = new FileReader();
            reader.onload = async function(e) {
              await proceedRegisterPopup(e.target.result);
            };
            reader.readAsDataURL(photoInput.files[0]);
          } else {
            await proceedRegisterPopup(null);
          }
        } else {
          // User / Partner signup
          var name = document.getElementById("admPopupSignupName").value.trim();
          var email = document.getElementById("admPopupSignupEmail").value.trim();
          var password = document.getElementById("admPopupSignupPassword").value;
          
          if (!name || !email || !password) {
            showError("Please fill in all fields.");
            return;
          }
          if (password.length < 6) {
            showError("Password must be at least 6 characters.");
            return;
          }
          var user = await Storage.addUser({ name: name, email: email, password: password, role: role });
          if (!user) {
            showError("An account with this email already exists.");
            return;
          }
          sessionStorage.setItem("eventpulse_user", JSON.stringify(user));
          window.location.href = "index.html";
        }
      };
    }

    // Show modal
    overlay.style.display = "flex";
    setTimeout(function() {
      overlay.style.opacity = "1";
      document.getElementById("adminAuthModalContainer").style.transform = "scale(1)";
    }, 10);
  }

  function initClickInterception() {
    document.addEventListener("click", function(e) {
      var target = e.target.closest("a");
      if (target && target.href && (target.href.indexOf("admin.html") !== -1)) {
        // Check if already logged in as Admin
        var session = sessionStorage.getItem("eventpulse_user");
        var isAdmin = false;
        if (session) {
          try {
            var user = JSON.parse(session);
            if (user.role === "admin" || user.email === "admin") {
              isAdmin = true;
            }
          } catch(err) {}
        }
        
        if (!isAdmin) {
          showAdminPopup(e);
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initClickInterception);
  } else {
    initClickInterception();
  }
})();
