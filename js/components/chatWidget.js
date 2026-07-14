function ChatWidget() {
  return `
    <div class="chat-widget" id="chatWidget">
      <div class="chat-header">
        <span>Event Assistant</span>
        <button class="chat-toggle" id="chatToggle">&times;</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="msg bot">
          Hi! Ask me about events, categories, or upcoming activities.
          <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off">
        <button id="chatSend">Send</button>
      </div>
    </div>
  `;
}
