/* =====================================================
   EventPulse - Chat Widget UI (chatWidget.js)
   -------------------------------------------------------
   Handles all DOM interaction for the chat interface.
   Response logic lives in ChatBot (chatbot.js) — no DOM there.
   ===================================================== */

const ChatWidget = {

  /* ---- Cached DOM references ---- */
  els: {},

  /* ---- Persistent suggestion chips (always visible above input) ---- */
  suggestions: [
    "Upcoming Events",
    "Tech Events",
    "Music",
    "Workshops",
    "Hackathon",
    "Sports",
    "Registration",
    "Free Events"
  ],

  /* ---- Initialise: cache elements, bind events, render welcome ---- */
  init() {
    this.els = {
      window:   document.getElementById("chatWindow"),
      messages: document.getElementById("chatMessages"),
      chipsBar: document.getElementById("chatChipsBar"),
      input:    document.getElementById("chatInput"),
      sendBtn:  document.getElementById("chatSendBtn"),
      clearBtn: document.getElementById("chatClearBtn"),
      fab:      document.querySelector(".chat-fab"),
      badge:    document.querySelector(".chat-fab-badge"),
      tooltip:  document.getElementById("chatTooltip")
    };

    if (!this.els.messages || !this.els.input || !this.els.sendBtn) return;

    this._buildChipsBar();
    this._bindEvents();
    this._showWelcome();
  },

  /* ---- Build persistent chips bar (rendered once, stays forever) ---- */
  _buildChipsBar() {
    if (!this.els.chipsBar) return;
    this.els.chipsBar.innerHTML = "";

    this.suggestions.forEach(label => {
      const chip = document.createElement("button");
      chip.className = "chat-chip";
      chip.textContent = label;
      chip.addEventListener("click", () => this._handleSuggestion(label));
      this.els.chipsBar.appendChild(chip);
    });
  },

  /* ---- Bind all event listeners ---- */
  _bindEvents() {
    this.els.sendBtn.addEventListener("click", () => this._handleSend());

    this.els.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); this._handleSend(); }
    });

    if (this.els.clearBtn) {
      this.els.clearBtn.addEventListener("click", () => this._clearChat());
    }

    /* FAB tooltip */
    if (this.els.fab) {
      this.els.fab.addEventListener("mouseenter", () => {
        if (this.els.tooltip) this.els.tooltip.style.opacity = "1";
      });
      this.els.fab.addEventListener("mouseleave", () => {
        if (this.els.tooltip) this.els.tooltip.style.opacity = "0";
      });
    }
  },

  /* ---- Handle user typing and clicking send ---- */
  _handleSend() {
    const text = this.els.input.value.trim();
    if (!text) {
      this.els.input.classList.add("chat-input-shake");
      setTimeout(() => this.els.input.classList.remove("chat-input-shake"), 400);
      this.els.input.focus();
      return;
    }
    this.els.input.value = "";
    this.addMessage(text, "user");
    this._respondAfterDelay(text);
  },

  /* ---- Handle chip click — does NOT remove the chip bar ---- */
  _handleSuggestion(text) {
    this.addMessage(text, "user");
    this._respondAfterDelay(text);
  },

  /* ---- Show typing dots, then render bot reply ---- */
  _respondAfterDelay(userText) {
    const typingEl = this._showTyping();
    setTimeout(() => {
      this._removeTyping(typingEl);
      const response = ChatBot.respond(userText);
      if (response) this.addMessage(response, "bot");
    }, 750);
  },

  /* ---- Core: add a bubble + timestamp to the messages area ---- */
  addMessage(text, sender) {
    const wrap = document.createElement("div");
    wrap.className = `chat-bubble-wrap ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = `chat-msg ${sender}`;
    bubble.innerHTML = this._escapeAndFormat(text);

    const ts = document.createElement("span");
    ts.className = "chat-timestamp";
    ts.textContent = this.getCurrentTime();

    wrap.appendChild(bubble);
    wrap.appendChild(ts);
    this.els.messages.appendChild(wrap);
    this._scrollToBottom();

    /* Hide badge after user starts chatting */
    if (sender === "user" && this.els.badge) {
      this.els.badge.style.display = "none";
    }
  },

  /* ---- Welcome message shown on first open / after clear ---- */
  _showWelcome() {
    this.els.messages.innerHTML = "";
    this.addMessage(
      "Welcome to EventPulse! I'm your event assistant. Ask me about our events, categories, upcoming shows, or how to register.",
      "bot"
    );
  },

  /* ---- Animated typing indicator ---- */
  _showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap bot";

    const bubble = document.createElement("div");
    bubble.className = "chat-msg bot chat-typing";
    bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

    wrap.appendChild(bubble);
    this.els.messages.appendChild(wrap);
    this._scrollToBottom();
    return wrap;
  },

  _removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  },

  /* ---- Clear chat and re-show welcome ---- */
  _clearChat() {
    this.els.messages.innerHTML = "";
    this._showWelcome();
  },

  _scrollToBottom() {
    this.els.messages.scrollTop = this.els.messages.scrollHeight;
  },

  getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  },

  /* ---- Safely escape user text, then convert \n → <br> ---- */
  _escapeAndFormat(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br>");
  }
};

/* ---- Global toggleChat() — called by FAB onclick in HTML ---- */
function toggleChat() {
  const win = document.getElementById("chatWindow");
  if (!win) return;
  const opening = !win.classList.contains("active");
  win.classList.toggle("active");

  if (opening) {
    if (!ChatWidget.els.input) {
      ChatWidget.init();
    }
    /* Focus input after transition */
    setTimeout(() => {
      if (ChatWidget.els.input) ChatWidget.els.input.focus();
    }, 260);
  }
}
