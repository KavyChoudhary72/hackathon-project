/*!
 * FoodLink Chat Widget — chat-widget.js
 * Embeddable Food-Rescue Chatbot matching FoodLink Design System.
 */

(function () {
  "use strict";

  // Dynamic origin fallback
  let defaultBackend = "http://localhost:8001";
  if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin.startsWith("http")) {
    defaultBackend = window.location.origin;
  }

  // ─── Config ────────────────────────────────────────────────────────────────
  const CFG = Object.assign(
    {
      backendUrl:  defaultBackend,
      defaultRole: "donor",
      lang:        "en",
      autoOpen:    false,
    },
    window.ANNASETUCHAT_CONFIG || {}
  );

  // Inject CSS if not present
  if (!document.getElementById("foodlink-chat-css")) {
    const link = document.createElement("link");
    link.id   = "foodlink-chat-css";
    link.rel  = "stylesheet";
    link.href = CFG.backendUrl + "/widget/chat-widget.css";
    document.head.appendChild(link);
  }

  // ─── State ─────────────────────────────────────────────────────────────────
  const state = {
    open:       false,
    role:       CFG.defaultRole,
    sessionId:  null,
    entityId:   null,
    sending:    false,
    unread:     0,
  };

  const ROLES = [
    { id: "donor",   label: "🍱 Donor",   emoji: "🍱" },
    { id: "shelter", label: "🏠 Shelter",  emoji: "🏠" },
    { id: "driver",  label: "🚴 Driver",   emoji: "🚴" },
    { id: "buyer",   label: "🛒 Buyer",    emoji: "🛒" },
  ];

  const WELCOME_MESSAGES = {
    donor:   "👋 Hi! I'm your FoodLink assistant.\nI can help you **post surplus food**, **track matching status**, or **view your impact**.\n\nWhat would you like to do?",
    shelter: "👋 Hi! Welcome to FoodLink. I can show you **pending food matches**, help you **accept or decline**, or **update capacity**.\n\nWhat do you need?",
    driver:  "👋 Hi! Welcome to FoodLink. View your **assigned pickup tasks** and verify **pickup/delivery OTPs**.\n\nReady to coordinate!",
    buyer:   "👋 Hi! Looking for affordable meals? I can show **Rescue Deals near you** (≤ ₹30/meal) or help you **claim a deal**.\n\nWhat are you looking for?",
  };

  // ─── FoodLink Brand SVGs ───────────────────────────────────────────────────
  const FOODLINK_LOGO_SVG = `
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 18C20 10.268 13.732 4 6 4C6 11.732 12.268 18 20 18Z" fill="#10B981"/>
      <path d="M22 20C22 27.732 28.268 34 36 34C36 26.268 29.732 20 22 20Z" fill="#144234"/>
      <path d="M22 18C22 10.268 28.268 4 36 4C28.268 4 22 10.268 22 18Z" fill="#F97316"/>
      <path d="M20 20C20 27.732 13.732 34 6 34C13.732 34 20 27.732 20 20Z" fill="#FBBF24"/>
    </svg>
  `;

  const BOT_AVATAR_SVG = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#144234" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9a9 9 0 0 1 9-9z"/>
      <path d="M12 8v8"/>
      <path d="M8 12h8"/>
    </svg>
  `;

  const USER_AVATAR_SVG = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `;

  // ─── DOM helpers ────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls)  e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };

  // Structured Markdown -> Safe HTML without broken line breaks
  function md(text) {
    if (!text) return "";
    let s = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g,     "<em>$1</em>")
      .replace(/`(.+?)`/g,       "<code>$1</code>");

    const lines = s.split("\n");
    const out = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (/^[-•*]\s(.+)$/.test(trimmed)) {
        if (!inList) { out.push("<ul class='as-list'>"); inList = true; }
        out.push(`<li>${trimmed.replace(/^[-•*]\s/, "")}</li>`);
      } else if (/^\d+\.\s(.+)$/.test(trimmed)) {
        if (!inList) { out.push("<ol class='as-list'>"); inList = true; }
        out.push(`<li>${trimmed.replace(/^\d+\.\s/, "")}</li>`);
      } else {
        if (inList) { out.push("</ul>"); inList = false; }
        if (trimmed === "") {
          out.push("<div class='as-spacer'></div>");
        } else {
          out.push(`<div class='as-line'>${line}</div>`);
        }
      }
    }
    if (inList) out.push("</ul>");
    return out.join("");
  }

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ─── Build DOM ──────────────────────────────────────────────────────────────
  function buildDOM() {
    const root = el("div");
    root.id = "annasetuchat-root";

    root.innerHTML = `
      <!-- FAB -->
      <button id="annasetuchat-fab" aria-label="Open FoodLink chat">
        <div class="as-fab-pulse"></div>
        <span id="annasetuchat-badge">1</span>

        <!-- FoodLink Chat icon -->
        <svg class="as-fab-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>

        <!-- Close icon -->
        <svg class="as-fab-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6"  y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Widget panel -->
      <div id="annasetuchat-panel" role="dialog" aria-label="FoodLink assistant">

        <!-- Header -->
        <div id="as-header">
          <div class="as-header-brand">
            <div class="as-header-avatar">${FOODLINK_LOGO_SVG}</div>
            <div class="as-header-info">
              <div class="as-header-title">FoodLink Assistant</div>
              <div class="as-header-subtitle">
                <span class="as-online-dot"></span>
                <span id="as-status-text">Online · Food Rescue AI</span>
              </div>
            </div>
          </div>
          <button id="as-header-close" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Role selector -->
        <div id="as-role-bar" role="tablist" aria-label="Select your role">
          ${ROLES.map(r => `
            <button class="as-role-btn${r.id === state.role ? " as-active" : ""}"
                    role="tab" data-role="${r.id}" aria-label="${r.label}">
              ${r.label}
            </button>
          `).join("")}
        </div>

        <!-- Messages scroll container -->
        <div id="as-messages" role="log" aria-live="polite"></div>

        <!-- Quick reply suggestions -->
        <div id="as-quick-replies" role="group" aria-label="Suggested responses"></div>

        <!-- Input bar -->
        <div id="as-input-bar">
          <textarea
            id="as-input"
            rows="1"
            placeholder="Type a message or donation details..."
            aria-label="Message text"
          ></textarea>
          <button id="as-send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <!-- FoodLink Footer -->
        <div id="as-footer">
          Powered by <span class="as-foot-brand">FoodLink</span> · FSSAI Food Rescue
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  // ─── Message rendering ──────────────────────────────────────────────────────
  function appendMessage(sender, text, opts = {}) {
    const msgs = $("as-messages");
    const wrap = el("div", `as-msg as-${sender}`);

    const avatar = el("div", "as-msg-avatar");
    avatar.innerHTML = sender === "bot" ? BOT_AVATAR_SVG : USER_AVATAR_SVG;

    const content = el("div", "as-msg-content");
    const bubble  = el("div", "as-bubble");
    bubble.innerHTML = md(text);

    const time = el("div", "as-bubble-time", nowTime());
    content.appendChild(bubble);
    content.appendChild(time);

    wrap.appendChild(avatar);
    wrap.appendChild(content);
    msgs.appendChild(wrap);
    scrollBottom();

    if (sender === "bot" && !state.open) {
      state.unread++;
      showBadge(state.unread);
    }
  }

  function showTyping() {
    removeTyping();
    const msgs = $("as-messages");
    const wrap  = el("div", "as-typing as-bot");
    wrap.id = "as-typing-indicator";

    const avatar = el("div", "as-msg-avatar");
    avatar.innerHTML = BOT_AVATAR_SVG;

    const content = el("div", "as-msg-content");
    const dots = el("div", "as-typing-dots");
    dots.innerHTML = '<div class="as-dot"></div><div class="as-dot"></div><div class="as-dot"></div>';

    content.appendChild(dots);
    wrap.appendChild(avatar);
    wrap.appendChild(content);
    msgs.appendChild(wrap);
    scrollBottom();
  }

  function removeTyping() {
    const t = $("as-typing-indicator");
    if (t) t.remove();
  }

  function setQuickReplies(qrs) {
    const bar = $("as-quick-replies");
    bar.innerHTML = "";
    (qrs || []).forEach(qr => {
      const btn = el("button", "as-qr-btn");
      btn.textContent = qr;
      btn.addEventListener("click", () => {
        bar.innerHTML = "";
        sendMessage(qr);
      });
      bar.appendChild(btn);
    });
  }

  function scrollBottom() {
    const msgs = $("as-messages");
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ─── Network / Messaging ────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (state.sending || !text.trim()) return;
    state.sending = true;

    $("as-send-btn").disabled = true;
    $("as-input").disabled    = true;

    appendMessage("user", text);
    setQuickReplies([]);
    showTyping();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(`${CFG.backendUrl}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          session_id: state.sessionId,
          role:       state.role,
          entity_id:  state.entityId,
          text:       text,
          lang:       CFG.lang,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      state.sessionId = data.session_id;

      removeTyping();
      appendMessage("bot", data.reply);
      setQuickReplies(data.quick_replies);
    } catch (err) {
      clearTimeout(timeoutId);
      removeTyping();
      console.warn("[FoodLink Chat] API error, using safe fallback:", err);

      // Safe deterministic fallback so user always gets a reply
      appendMessage("bot", _fallback(text));
      setQuickReplies(_fallbackQR());
    } finally {
      state.sending = false;
      $("as-send-btn").disabled = false;
      $("as-input").disabled    = false;
      $("as-input").focus();
    }
  }

  // ─── Scripted fallbacks (safe offline & out-of-scope handler) ───────────────
  function _fallback(text) {
    const lower = text.toLowerCase().trim();

    if (/^(hi|hello|namaste|hey|start)/i.test(lower)) {
      return WELCOME_MESSAGES[state.role];
    }
    if (/^(help|madad|menu)/i.test(lower)) {
      return "FoodLink Platform Actions:\n• Post surplus food donation\n• Track matching status (type 'status')\n• View impact report (type 'impact')\n• Confirm with HAAN or cancel with NAHI";
    }
    if (/^(status|track)/i.test(lower)) {
      return "📋 Active Status: No open active dispatch. Post a donation to begin matching!";
    }
    if (/^(impact|stats)/i.test(lower)) {
      return "📊 FoodLink Impact:\n• 1,240 Meals rescued\n• 496 kg diverted from landfill\n• 1,240 kg CO₂e saved";
    }
    if (/^(haan|yes|confirm)/i.test(lower)) {
      return "✅ Confirmed! Finding the best verified shelter nearby in Jaipur.";
    }
    if (/^(nahi|no|cancel)/i.test(lower)) {
      return "❌ Action cancelled. How else can FoodLink help you today?";
    }

    // Donation pattern recognition
    if (/\d+/.test(lower) && /(plate|meal|thali|kg|bache|khana|sabzi|roti)/i.test(lower)) {
      return "🍱 Got your surplus food details! Please provide pickup locality in Jaipur (e.g. Malviya Nagar) and expiry time.";
    }

    return "I am the FoodLink food-rescue assistant. I can only help you post surplus food donations, view shelter matches, verify OTPs, or find Rescue Deals.";
  }

  function _fallbackQR() {
    if (state.role === "donor")   return ["Post donation", "Check status", "View impact", "Help"];
    if (state.role === "shelter") return ["Pending offers", "Update capacity", "Status", "Help"];
    if (state.role === "driver")  return ["Assigned tasks", "Verify OTP", "Pahuch gaya", "Help"];
    return ["Deals near me", "Claim deal", "Status", "Help"];
  }

  // ─── Badge ──────────────────────────────────────────────────────────────────
  function showBadge(num) {
    const b = $("annasetuchat-badge");
    b.textContent = num > 9 ? "9+" : num;
    b.classList.add("as-visible");
  }

  function clearBadge() {
    state.unread = 0;
    $("annasetuchat-badge").classList.remove("as-visible");
  }

  // ─── Open / Close ───────────────────────────────────────────────────────────
  function open() {
    state.open = true;
    $("annasetuchat-panel").classList.add("as-open");
    $("annasetuchat-fab").classList.add("as-open");
    clearBadge();
    setTimeout(() => $("as-input").focus(), 350);
  }

  function close() {
    state.open = false;
    $("annasetuchat-panel").classList.remove("as-open");
    $("annasetuchat-fab").classList.remove("as-open");
  }

  // ─── Role switch ────────────────────────────────────────────────────────────
  function switchRole(newRole) {
    state.role      = newRole;
    state.sessionId = null;
    state.entityId  = null;

    document.querySelectorAll(".as-role-btn").forEach(btn => {
      btn.classList.toggle("as-active", btn.dataset.role === newRole);
    });

    $("as-messages").innerHTML = "";
    setQuickReplies([]);

    const roleObj = ROLES.find(r => r.id === newRole);
    $("as-status-text").textContent = `Online · ${roleObj ? roleObj.label : "Food Rescue AI"}`;

    setTimeout(() => {
      appendMessage("bot", WELCOME_MESSAGES[newRole]);
      setQuickReplies(_fallbackQR());
    }, 100);
  }

  // ─── Auto-resize textarea ───────────────────────────────────────────────────
  function autoResize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 90) + "px";
  }

  // ─── Init ───────────────────────────────────────────────────────────────────
  function init() {
    buildDOM();

    $("annasetuchat-fab").addEventListener("click", () => {
      state.open ? close() : open();
    });

    $("as-header-close").addEventListener("click", close);

    document.querySelectorAll(".as-role-btn").forEach(btn => {
      btn.addEventListener("click", () => switchRole(btn.dataset.role));
    });

    $("as-send-btn").addEventListener("click", () => {
      const txt = $("as-input").value.trim();
      if (txt) { $("as-input").value = ""; autoResize($("as-input")); sendMessage(txt); }
    });

    $("as-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const txt = $("as-input").value.trim();
        if (txt) { $("as-input").value = ""; autoResize($("as-input")); sendMessage(txt); }
      }
    });

    $("as-input").addEventListener("input", () => autoResize($("as-input")));

    if (CFG.autoOpen) {
      setTimeout(open, 150);
    }

    setTimeout(() => {
      appendMessage("bot", WELCOME_MESSAGES[state.role]);
      setQuickReplies(_fallbackQR());
      setTimeout(() => { if (!state.open) showBadge(1); }, 3000);
    }, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
