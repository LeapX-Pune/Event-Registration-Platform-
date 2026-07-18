/* =====================================================
   EventPulse - ChatBot Logic (chatbot.js)
   -------------------------------------------------------
   Pure logic layer — no DOM access here.
   ChatBot.respond(userMessage) returns a plain string.
   UI rendering is handled by ChatWidget (chatWidget.js).
   ===================================================== */

const ChatBot = {

  /* ---- Keyword → category / intent map ---- */
  keywordMap: [
    { keywords: ["tech", "technology", "coding", "developer", "software", "programming", "it"], category: "Technology", label: "tech" },
    { keywords: ["music", "concert", "band", "song", "live music", "gig"], category: "Music", label: "music" },
    { keywords: ["art", "design", "gallery", "photography", "creative", "drawing", "painting"], category: "Art", label: "art" },
    { keywords: ["sport", "sports", "fitness", "run", "marathon", "yoga", "basketball", "football", "gym"], category: "Sports", label: "sports" },
    { keywords: ["festival", "fest", "outdoor", "fair", "celebration", "carnival"], category: "Festival", label: "festival" },
    { keywords: ["workshop", "training", "learn", "course", "class", "bootcamp", "seminar"], category: "Workshop", label: "workshop" },
    { keywords: ["hackathon", "hack", "hackfest", "build"], category: "Technology", label: "hackathon", titleKeyword: "hackathon" }
  ],

  /* ---- Static intent responses ---- */
  staticResponses: [
    {
      keywords: ["hello", "hi", "hey", "howdy", "greetings", "sup"],
      response: "Hey there! 👋 I'm Pulse AI. Ask me about tech, music, sports, art, festivals, or workshops — or just say \"upcoming events\" to see what's on!"
    },
    {
      keywords: ["help", "what can you do", "commands", "options"],
      response: "Here's what I can help with:\n• Browse by category (tech, music, sports, art, festival, workshop)\n• Find upcoming or weekend events\n• Explain registration\n• Share venue info\n\nJust type what you're looking for!"
    },
    {
      keywords: ["registration", "register", "sign up", "how to register", "book", "booking", "ticket"],
      response: "To register for an event, click on the event card to open its detail page, then hit the 'Register' button. Spots fill up fast — grab yours early! 🎟️"
    },
    {
      keywords: ["venue", "location", "where", "address", "place", "held", "happening"],
      response: "Each event listing shows its full venue and address. Click any event card for exact location details, including maps and directions."
    },
    {
      keywords: ["upcoming", "next", "soon", "future", "latest", "new events", "what's on", "whats on", "schedule"],
      intent: "upcoming"
    },
    {
      keywords: ["weekend", "this weekend", "saturday", "sunday"],
      intent: "weekend"
    },
    {
      keywords: ["all events", "every event", "show all", "list all", "total"],
      intent: "all"
    },
    {
      keywords: ["free", "no cost", "no fee", "no charge", "zero cost"],
      intent: "free"
    },
    {
      keywords: ["price", "cost", "fee", "how much", "paid", "charge", "expensive"],
      response: "Event prices vary — from free community events to premium conferences. Each event card displays the price upfront so you know before you click."
    },
    {
      keywords: ["cancel", "cancellation", "refund"],
      response: "Cancellation policies differ per event. Check the event detail page for refund and cancellation terms, or contact the event organizer directly."
    },
    {
      keywords: ["bye", "goodbye", "see you", "later", "ciao", "thanks", "thank you", "cheers"],
      response: "Happy to help! Enjoy the events! 🎉 Come back anytime."
    }
  ],

  /* ---- Main respond function ---- */
  respond(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    if (!msg) return null;

    /* Always read from Storage so chatbot reflects the live event data —
       including any adds, edits, or deletes made via the Admin panel.
       Storage.load() returns localStorage data if present, else DEFAULT_EVENTS. */
    const events = (typeof Storage !== "undefined" && Storage.load)
      ? Storage.load()
      : (typeof DEFAULT_EVENTS !== "undefined" ? DEFAULT_EVENTS : []);

    /* 1. Check static intent responses first */
    for (const rule of this.staticResponses) {
      if (rule.keywords.some(k => msg.includes(k))) {
        if (rule.intent) {
          return this._handleIntent(rule.intent, msg, events);
        }
        return rule.response;
      }
    }

    /* 2. Match category keywords */
    for (const map of this.keywordMap) {
      if (map.keywords.some(k => msg.includes(k))) {
        /* Narrow to a title keyword if defined (e.g. hackathon) */
        const filtered = map.titleKeyword
          ? events.filter(e =>
              e.category === map.category &&
              (e.title.toLowerCase().includes(map.titleKeyword) ||
               (e.tags && e.tags.some(t => t.includes(map.titleKeyword))))
            )
          : events.filter(e => e.category === map.category);

        return this._buildEventListResponse(filtered, map.label);
      }
    }

    /* 3. Search by event title */
    const byTitle = events.filter(e => e.title.toLowerCase().includes(msg));
    if (byTitle.length > 0) {
      return this._buildEventListResponse(byTitle, `"${userMessage}"`);
    }

    /* 4. Fallback */
    return "Hmm, I didn't catch that. 🤔 Try asking about \"tech events\", \"music concerts\", \"upcoming workshops\", or type \"help\" to see what I can do!";
  },

  /* ---- Intent handlers ---- */
  _handleIntent(intent, msg, events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (intent === "upcoming") {
      const upcoming = events
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      if (!upcoming.length) return "No upcoming events found right now. Check back soon!";
      return "Here are the next upcoming events:\n" + this._formatList(upcoming);
    }

    if (intent === "weekend") {
      const weekendDates = this._getWeekendDates();
      const matches = events.filter(e => weekendDates.includes(e.date));
      if (!matches.length) return "No events scheduled this weekend. Check back closer to the date — new events are added regularly!";
      return "This weekend's events:\n" + this._formatList(matches);
    }

    if (intent === "all") {
      return `There are ${events.length} events on EventPulse. Browse them using the category filters on the homepage, or ask me about a specific category!`;
    }

    if (intent === "free") {
      const free = events.filter(e => e.price && e.price.toLowerCase() === "free");
      if (!free.length) return "No free events found at the moment, but check back — new events are added regularly!";
      return "Here are the free events 🎉:\n" + this._formatList(free);
    }

    return null;
  },

  /* ---- Build a friendly list response ---- */
  _buildEventListResponse(events, label) {
    if (!events.length) {
      return `No ${label} events found right now. New events are added regularly — check back soon!`;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const list = upcoming.length ? upcoming : events;
    const shown = list.slice(0, 4);
    let reply = `Found ${list.length} ${label} event${list.length !== 1 ? "s" : ""}:\n` + this._formatList(shown);
    if (list.length > 4) {
      reply += `\n…and ${list.length - 4} more. Use the filters on the homepage to see all!`;
    }
    return reply;
  },

  /* ---- Format an array of events into readable text ---- */
  _formatList(events) {
    return events.map(e => {
      const dateStr = this._formatDate(e.date);
      const price = e.price ? ` · ${e.price}` : "";
      return `• ${e.title} — ${dateStr}, ${e.location}${price}`;
    }).join("\n");
  },

  /* ---- Date helpers ---- */
  _formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  },

  _getWeekendDates() {
    const today = new Date();
    const day = today.getDay(); // 0=Sun 6=Sat
    const sat = new Date(today);
    sat.setDate(today.getDate() + (6 - day));
    const sun = new Date(today);
    sun.setDate(today.getDate() + (7 - day));
    return [
      sat.toISOString().split("T")[0],
      sun.toISOString().split("T")[0]
    ];
  }
};
