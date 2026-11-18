/* Hami Systems — pop-up chat widget.
   One script tag puts Hami on any site:
   <script src="https://kn33r0s3.vercel.app/hami-systems.js"></script>
   All surfaces connect to the ONE Hami gate:
   POST https://hami-sigma.vercel.app/api/hami/chat
   No external services, no CDN, no external fonts, no API key.
   Every path passes through a gate. No dormant code. */
(function () {
  "use strict";

  var HAMI_URL = "https://hami-sigma.vercel.app/api/hami/chat";
  var MAX_HISTORY = 10;

  if (document.querySelector(".hs-btn")) { return; }

  var CSS = [
    ".hs-btn{position:fixed;right:1rem;bottom:1rem;z-index:2147483647;font-family:'Roboto Mono',ui-monospace,'SF Mono',Menlo,monospace;font-size:.8rem;letter-spacing:.08em;color:#0c0b0a;background:#f2a33a;border:1px solid #f2a33a;border-radius:.25rem;padding:.55rem .8rem;cursor:pointer;}",
    ".hs-btn:hover{background:#f5deb3;}",
    ".hs-btn:focus-visible,.hs-close:focus-visible,.hs-send:focus-visible{outline:2px solid #f5deb3;outline-offset:2px;}",
    ".hs-panel{position:fixed;right:1rem;bottom:4.25rem;z-index:2147483647;width:min(22rem,calc(100vw - 2rem));max-height:min(30rem,calc(100dvh - 6rem));display:flex;flex-direction:column;font-family:'Roboto Mono',ui-monospace,'SF Mono',Menlo,monospace;font-size:.9rem;line-height:1.6;color:#f4efe6;background:#15130f;border:1px solid #3a2e1a;border-radius:.375rem;overflow:hidden;}",
    ".hs-panel[hidden]{display:none;}",
    ".hs-header{display:flex;align-items:center;gap:.5rem;padding:.55rem .75rem;background:#0c0b0a;border-bottom:1px solid #3a2e1a;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:#f2a33a;}",
    ".hs-header .hs-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    ".hs-close{font-family:inherit;font-size:1rem;line-height:1;color:#bdb29f;background:transparent;border:1px solid #3a2e1a;border-radius:.25rem;width:1.6rem;height:1.6rem;flex:none;cursor:pointer;}",
    ".hs-close:hover{color:#f4efe6;border-color:#f2a33a;}",
    ".hs-gatebar{height:2px;width:100%;background:#3a2e1a;overflow:hidden;position:relative;flex:none;}",
    ".hs-gatebar::after{content:'';position:absolute;top:0;left:-30%;width:30%;height:100%;background:#f2a33a;}",
    ".hs-gatebar--sweep::after{animation:hs-sweep .6s linear;}",
    "@keyframes hs-sweep{from{left:-30%;}to{left:100%;}}",
    ".hs-msgs{flex:1;min-height:8rem;overflow-y:auto;padding:.75rem .9rem;white-space:pre-wrap;word-break:break-word;}",
    ".hs-line{margin:.2rem 0;}",
    ".hs-gate{color:#bdb29f;font-size:.85rem;}",
    ".hs-gate .hs-open{color:#72d38f;}",
    ".hs-gate .hs-closed{color:#f2a33a;}",
    ".hs-user{color:#f4efe6;}",
    ".hs-user::before{content:'$ ';color:#f2a33a;}",
    ".hs-hami{color:#f4efe6;}",
    ".hs-hami::before{content:'hami: ';color:#72d38f;}",
    ".hs-muted{color:#bdb29f;}",
    ".hs-input-row{display:flex;align-items:center;gap:.5rem;border-top:1px solid #3a2e1a;padding:.55rem .75rem;}",
    ".hs-prompt{color:#f2a33a;flex:none;}",
    ".hs-input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:#f4efe6;font-family:inherit;font-size:.9rem;line-height:1.6;padding:0;}",
    ".hs-input::placeholder{color:#bdb29f;}",
    ".hs-input:disabled{color:#bdb29f;}",
    ".hs-send{font-family:inherit;font-size:.8rem;color:#0c0b0a;background:#f2a33a;border:none;border-radius:.25rem;padding:.35rem .6rem;flex:none;cursor:pointer;}",
    ".hs-send:hover{background:#f5deb3;}",
    ".hs-send:disabled{opacity:.5;cursor:default;}"
  ].join("\n");

  var history = [];
  var busy = false;
  var greeted = false;

  function injectCSS() {
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null) { n.textContent = text; }
    return n;
  }

  var btn = el("button", "hs-btn", "HAMI SYSTEMS");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open Hami Systems chat");
  var panel = el("div", "hs-panel");
  panel.setAttribute("hidden", "");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Hami Systems chat");
  var header = el("div", "hs-header");
  var title = el("span", "hs-title", "HAMI SYSTEMS");
  var closeBtn = el("button", "hs-close", "\u00D7");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close Hami Systems chat");
  header.appendChild(title);
  header.appendChild(closeBtn);
  var gateBar = el("div", "hs-gatebar");
  gateBar.setAttribute("aria-hidden", "true");
  var msgs = el("div", "hs-msgs");
  msgs.setAttribute("aria-live", "polite");
  var inputRow = el("div", "hs-input-row");
  var prompt = el("span", "hs-prompt", "$");
  prompt.setAttribute("aria-hidden", "true");
  var input = el("input", "hs-input");
  input.type = "text";
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("placeholder", "ask Hami\u2026");
  input.setAttribute("aria-label", "Message Hami Systems");
  var sendBtn = el("button", "hs-send", "send");
  sendBtn.type = "button";
  inputRow.appendChild(prompt);
  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  panel.appendChild(header);
  panel.appendChild(gateBar);
  panel.appendChild(msgs);
  panel.appendChild(inputRow);

  function scrollMsgs() { msgs.scrollTop = msgs.scrollHeight; }

  function printLine(text, cls) {
    msgs.appendChild(el("div", cls || "hs-line", text));
    scrollMsgs();
  }

  function printGate(open, detail) {
    var row = el("div", "hs-line hs-gate", "");
    row.appendChild(document.createTextNode("gate: "));
    row.appendChild(el("span", open ? "hs-open" : "hs-closed", open ? "OPEN" : "CLOSED"));
    row.appendChild(document.createTextNode(" \u2014 " + detail));
    msgs.appendChild(row);
    scrollMsgs();
  }

  function printEcho(text) {
    msgs.appendChild(el("div", "hs-line hs-user", text));
    scrollMsgs();
  }

  function sweep() {
    gateBar.classList.remove("hs-gatebar--sweep");
    void gateBar.offsetWidth;
    gateBar.classList.add("hs-gatebar--sweep");
  }

  function openPanel() {
    panel.removeAttribute("hidden");
    btn.setAttribute("hidden", "");
    sweep();
    if (!greeted) {
      greeted = true;
      printLine("Hami Systems \u2014 ask me anything. Every message passes through the Hami gate.", "hs-line hs-muted");
    }
    input.focus();
  }

  function closePanel() {
    panel.setAttribute("hidden", "");
    btn.removeAttribute("hidden");
    btn.focus();
  }

  function togglePanel() {
    if (panel.hasAttribute("hidden")) { openPanel(); } else { closePanel(); }
  }

  function sendMessage() {
    if (busy) { return; }
    var text = input.value.trim();
    if (!text) { return; }
    input.value = "";
    busy = true;
    input.disabled = true;
    sendBtn.disabled = true;
    printEcho(text);
    sweep();
    printGate(true, "evidence: hami engine \u00B7 authorization: public chat");
    printLine("\u2026 hami is thinking (via the Hami engine)", "hs-line hs-muted");
    var ctrl = null;
    var timer = null;
    if (typeof AbortController !== "undefined") {
      ctrl = new AbortController();
      timer = setTimeout(function () { ctrl.abort(); }, 90000);
    }
    var payload = { message: text, history: history.slice(-MAX_HISTORY) };
    fetch(HAMI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) { return res.json(); }).then(function (data) {
      if (timer) { clearTimeout(timer); }
      var reply = data && (data.reply || data.detail || data.message);
      if (reply) {
        printLine(String(reply), "hs-line hs-hami");
        history.push({ role: "user", content: text }, { role: "assistant", content: String(reply) });
        history = history.slice(-MAX_HISTORY);
      } else {
        printGate(false, "hami engine returned no reply");
        printLine("hami is unreachable \u2014 the Mac tunnel may be down. That is the next subgate: the tunnel. Try again in a moment.", "hs-line hs-muted");
      }
    }).catch(function () {
      if (timer) { clearTimeout(timer); }
      printGate(false, "hami engine unreachable");
      printLine("hami is unreachable \u2014 the Mac tunnel may be down. That is the next subgate: the tunnel. Try again in a moment.", "hs-line hs-muted");
    }).then(function () {
      busy = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    });
  }

  btn.addEventListener("click", togglePanel);
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { sendMessage(); }
    else if (e.key === "Escape") { closePanel(); }
  });

  injectCSS();
  document.body.appendChild(btn);
  document.body.appendChild(panel);
})();
