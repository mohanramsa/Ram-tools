// ============================================
// RAM AI Widget — ramtools.in
// Full EE Expert · Maths · Drives · Testing
// Powered by Groq (Free API)
// ============================================

(function () {

  // ── 1. INJECT FONTS ──
  if (!document.querySelector('#ramai-fonts')) {
    const f = document.createElement('link');
    f.id = 'ramai-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }

  // ── 2. INJECT CSS ──
  if (!document.querySelector('#ramai-styles')) {
    const s = document.createElement('style');
    s.id = 'ramai-styles';
    s.textContent = `
      #ramai-bubble {
        position: fixed; bottom: 28px; right: 28px;
        width: 68px; height: 68px; border-radius: 50%;
        background: linear-gradient(135deg, #0088cc, #00d4ff);
        box-shadow: 0 4px 24px rgba(0,212,255,0.5);
        cursor: pointer; z-index: 9998; border: none;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #ramai-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(0,212,255,0.7); }
      #ramai-bubble svg { width: 28px; height: 28px; fill: #fff; }
      #ramai-bubble .notif {
        position: absolute; top: 2px; right: 2px;
        width: 13px; height: 13px; border-radius: 50%;
        background: #ff4466; border: 2px solid #fff;
      }
      #ramai-window {
        position: fixed;
        bottom: 90px; right: 16px;
        top: 70px;
        width: 480px;
        max-height: calc(100vh - 160px);
        background: #111827;
        border: 1px solid rgba(0,212,255,0.3); border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        z-index: 9999; display: flex; flex-direction: column; overflow: hidden;
        transform: scale(0.85) translateY(20px); opacity: 0; pointer-events: none;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
      }
      #ramai-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
      .ramai-header {
        background: #0a1628; padding: 16px 18px;
        display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid rgba(0,212,255,0.15); flex-shrink: 0;
      }
      .ramai-avatar {
        width: 44px; height: 44px; border-radius: 14px;
        background: linear-gradient(135deg, #0066aa, #00d4ff);
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: #fff;
      }
      .ramai-name { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #00d4ff; }
      .ramai-status { font-size: 11px; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
      .ramai-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 6px #00ff88; }
      .ramai-hdr-btn {
        width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.06);
        border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 14px;
        display: flex; align-items: center; justify-content: center;
      }
      .ramai-hdr-btn:hover { background: rgba(255,60,60,0.15); color: #ff6666; }

      .ramai-msgs {
        flex: 1; overflow-y: auto; padding: 14px 12px;
        display: flex; flex-direction: column; gap: 10px; min-height: 0; background: #111827;
      }
      .ramai-msgs::-webkit-scrollbar { width: 3px; }
      .ramai-msgs::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 99px; }
      .ramai-row { display: flex; gap: 8px; animation: rmIn 0.2s ease; }
      .ramai-row.user { flex-direction: row-reverse; }
      @keyframes rmIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .ramai-av {
        width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0; margin-top: 2px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      }
      .ramai-row.ai .ramai-av { background: linear-gradient(135deg,#0055aa,#00d4ff); color:#fff; }
      .ramai-row.user .ramai-av { background: rgba(255,255,255,0.1); color:rgba(255,255,255,0.6); font-size:14px; }
      .ramai-bub {
        max-width: 83%; padding: 10px 14px; border-radius: 14px;
        font-size: 15px; line-height: 1.75; font-family: 'Outfit', sans-serif;
      }
      .ramai-row.ai .ramai-bub {
        background: #1e3a5f; color: #ffffff;
        border: 2px solid #00aadd; border-top-left-radius: 4px;
      }
      .ramai-row.ai .ramai-bub strong { color: #00ffcc; }
      .ramai-row.user .ramai-bub {
        background: linear-gradient(135deg,#0055cc,#0099ff);
        color: #fff; font-weight: 600; border-top-right-radius: 4px;
      }
      .ramai-formula {
        font-family: 'JetBrains Mono', monospace; background: #001830;
        color: #00ffcc; border: 2px solid #00ffcc; border-left: 5px solid #00ffcc;
        border-radius: 8px; padding: 10px 14px; margin: 8px 0;
        font-size: 16px; font-weight: 700; display: block; letter-spacing: 0.5px;
      }
      .ramai-dots { display:flex; gap:4px; padding:4px 2px; align-items:center; }
      .ramai-dots span {
        width:5px; height:5px; border-radius:50%; background:#00d4ff; opacity:0.4;
        animation: rdot 1.2s infinite;
      }
      .ramai-dots span:nth-child(2){animation-delay:0.2s}
      .ramai-dots span:nth-child(3){animation-delay:0.4s}
      @keyframes rdot{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-4px);opacity:1}}
      .ramai-inputbar {
        padding: 10px 12px 12px; border-top: 1px solid rgba(0,212,255,0.15);
        display: flex; gap: 8px; align-items: center; flex-shrink: 0; background: #0d1525;
      }
      .ramai-inputwrap {
        flex:1; background:#111827; border:1.5px solid rgba(0,212,255,0.4);
        border-radius:12px; display:flex; align-items:center; padding:0 12px; transition:border-color 0.15s;
      }
      .ramai-inputwrap:focus-within { border-color:#00d4ff; }
      .ramai-inputwrap input {
        flex:1; background:transparent; border:none; outline:none;
        font-family:'Outfit',sans-serif; font-size:15px; color:#fff; padding:13px 0; caret-color:#00d4ff;
      }
      .ramai-inputwrap input::placeholder { color:rgba(255,255,255,0.35); }
      .ramai-sendbtn {
        width:46px; height:46px; border-radius:12px;
        background:linear-gradient(135deg,#0066aa,#00d4ff);
        border:none; color:#fff; font-size:18px; cursor:pointer;
        display:flex; align-items:center; justify-content:center; transition:all 0.15s;
      }
      .ramai-sendbtn:hover { filter:brightness(1.2); transform:scale(1.05); }
      .ramai-sendbtn:disabled { opacity:0.3; cursor:not-allowed; transform:none; }
      .ramai-footer {
        text-align:center; font-size:10px; color:rgba(255,255,255,0.25);
        padding:4px 0 10px; font-family:'JetBrains Mono',monospace; background:#0d1525;
      }
      .ramai-footer span { color:rgba(0,212,255,0.4); }
      /* Key Panel */
      #ramai-keypanel {
        position:absolute; inset:0; background:#111827; border-radius:20px; z-index:20;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        padding:28px 24px; text-align:center;
      }
      #ramai-keypanel.hidden { display:none; }
      .rk-icon { font-size:38px; margin-bottom:12px; }
      .rk-title { font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:700; color:#00d4ff; margin-bottom:8px; }
      .rk-desc { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.7; margin-bottom:18px; }
      .rk-desc a { color:#00d4ff; }
      .rk-wrap {
        width:100%; background:#1a2540; border:2px solid rgba(0,212,255,0.3);
        border-radius:12px; display:flex; align-items:center; padding:0 12px;
        margin-bottom:8px; transition:border-color 0.15s;
      }
      .rk-wrap:focus-within { border-color:#00d4ff; }
      .rk-wrap input {
        flex:1; background:transparent; border:none; outline:none;
        font-family:'JetBrains Mono',monospace; font-size:12px; color:#fff; padding:12px 0; caret-color:#00d4ff;
      }
      .rk-wrap input::placeholder { color:rgba(255,255,255,0.25); font-size:11px; }
      .rk-eye { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.3); font-size:14px; padding:4px; }
      .rk-eye:hover { color:#00d4ff; }
      .rk-error { color:#ff4466; font-size:12px; margin-bottom:8px; min-height:18px; }
      .rk-save {
        width:100%; background:linear-gradient(135deg,#0066aa,#00d4ff); color:#fff;
        font-family:'Outfit',sans-serif; font-weight:600; font-size:14px;
        border:none; border-radius:12px; padding:13px; cursor:pointer; margin-bottom:16px;
      }
      .rk-save:hover { filter:brightness(1.1); }
      .rk-steps { font-size:12px; color:rgba(255,255,255,0.35); line-height:2; text-align:left; width:100%; border-top:1px solid rgba(255,255,255,0.07); padding-top:14px; }
      .rk-steps b { color:#00d4ff; }
      @media(max-width:440px){
        #ramai-window{width:calc(100vw - 12px);right:6px;bottom:80px;top:70px;max-height:calc(100vh - 150px);}
        #ramai-bubble{bottom:18px;right:18px;}
      }
    `;
    document.head.appendChild(s);
  }

  // ── 3. BUILD AND INIT ──
  function init() {
    if (document.getElementById('ramai-root')) return;

    const root = document.createElement('div');
    root.id = 'ramai-root';
    root.innerHTML = `
      <button id="ramai-bubble" title="Ask RAM AI">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <div class="notif"></div>
      </button>
      <div id="ramai-window">
        <div id="ramai-keypanel" class="hidden">
          <div class="rk-icon">🔑</div>
          <div class="rk-title">Enter Groq API Key</div>
          <div class="rk-desc">Get a <strong style="color:#00d4ff">100% free</strong> key from<br><a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a><br>Sign up &rarr; Create API Key &rarr; Paste here</div>
          <div class="rk-wrap"><input type="password" id="ramai-keyinput" placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"/><button class="rk-eye" id="ramai-eye">👁</button></div>
          <div class="rk-error" id="ramai-keyerror"></div>
          <button class="rk-save" id="ramai-keysave">Save &amp; Start Chatting ⚡</button>
          <div class="rk-steps"><b>Step 1</b> &rarr; console.groq.com/keys<br><b>Step 2</b> &rarr; Sign up free (Google OK)<br><b>Step 3</b> &rarr; Click "Create API Key"<br><b>Step 4</b> &rarr; Copy &amp; paste gsk_... key above ✅</div>
        </div>
        <div class="ramai-header">
          <div class="ramai-avatar">R&Sigma;</div>
          <div style="flex:1">
            <div class="ramai-name">RAM AI</div>
            <div class="ramai-status"><div class="ramai-dot"></div> Full EE Expert · Maths · Drives · Testing</div>
          </div>

          <button class="ramai-hdr-btn" id="ramai-close">✕</button>
        </div>

        <div class="ramai-msgs" id="ramai-msgs">
          <div class="ramai-row ai">
            <div class="ramai-av">R&Sigma;</div>
            <div class="ramai-bub">👋 Hi! I'm <strong>RAM AI</strong> — your complete Electrical Engineering &amp; Mathematics expert!<br><br>Ask me anything:<br>⚡ Motor &amp; Transformer design<br>🎛️ VFD, Soft Starter, Drives<br>🏭 Substation testing &amp; commissioning<br>🔌 Megger, protection, relay settings<br>📐 Lap/Wave winding calculations<br>📊 Mathematics — all topics<br><br>Give me poles &amp; voltage → I'll design the full winding!</div>
          </div>
        </div>
        <div class="ramai-inputbar">
          <div class="ramai-inputwrap">
            <input type="text" id="ramai-input" placeholder="Ask any EE, maths, VFD, motor winding…" autocomplete="off"/>
          </div>
          <button class="ramai-sendbtn" id="ramai-send" disabled>↑</button>
        </div>
        <div class="ramai-footer">Powered by <span>RAM AI · ramtools.in</span></div>
      </div>
    `;
    document.body.appendChild(root);

    // References
    let isOpen = false;
    let GROQ_KEY = localStorage.getItem('ramai_groq_key') || '';
    const chatHistory = [];

    const win      = document.getElementById('ramai-window');
    const bubble   = document.getElementById('ramai-bubble');
    const msgs     = document.getElementById('ramai-msgs');
    const input    = document.getElementById('ramai-input');
    const sendBtn  = document.getElementById('ramai-send');
    const keyPanel = document.getElementById('ramai-keypanel');
    const keyInput = document.getElementById('ramai-keyinput');
    const keyError = document.getElementById('ramai-keyerror');
    const keySave  = document.getElementById('ramai-keysave');
    const keyEye   = document.getElementById('ramai-eye');

    // Open / close widget
    bubble.addEventListener('click', () => {
      isOpen = !isOpen;
      win.classList.toggle('open', isOpen);
      if (isOpen) {
        bubble.querySelector('.notif') && bubble.querySelector('.notif').remove();
        GROQ_KEY = localStorage.getItem('ramai_groq_key') || '';
        if (!GROQ_KEY) {
          keyPanel.classList.remove('hidden');
          setTimeout(() => keyInput.focus(), 300);
        } else {
          keyPanel.classList.add('hidden');
          setTimeout(() => input.focus(), 300);
        }
      }
    });

    document.getElementById('ramai-close').addEventListener('click', () => { isOpen = false; win.classList.remove('open'); });

    // Secret: double-click avatar to change API key (hidden from users)
    document.querySelector('.ramai-avatar').addEventListener('dblclick', () => {
      keyPanel.classList.remove('hidden');
      setTimeout(() => keyInput.focus(), 100);
    });


    // Eye toggle
    keyEye.addEventListener('click', () => {
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
      keyEye.textContent = keyInput.type === 'password' ? '👁' : '🙈';
    });

    // Save key
    function saveKey() {
      const k = keyInput.value.trim();
      if (!k || !k.startsWith('gsk_') || k.length < 20) {
        keyError.textContent = '⚠️ Must start with gsk_ and be valid';
        setTimeout(() => { keyError.textContent = ''; }, 3000);
        return;
      }
      GROQ_KEY = k;
      localStorage.setItem('ramai_groq_key', k);
      keyPanel.classList.add('hidden');
      keyError.textContent = '';
      input.focus();
      addMsg('✅ Key saved! Ask me any EE formula or concept ⚡', 'ai');
    }
    keySave.addEventListener('click', saveKey);
    keyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveKey(); });



    // Input
    input.addEventListener('input', () => { sendBtn.disabled = !input.value.trim(); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
    sendBtn.addEventListener('click', sendMsg);

    function scrollDown() { requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; }); }

    function addMsg(html, role) {
      const row = document.createElement('div');
      row.className = 'ramai-row ' + role;
      row.innerHTML = '<div class="ramai-av">' + (role === 'ai' ? 'R&Sigma;' : '👤') + '</div><div class="ramai-bub">' + html + '</div>';
      msgs.appendChild(row);
      scrollDown();
    }

    function showTyping() {
      const row = document.createElement('div');
      row.className = 'ramai-row ai'; row.id = 'ramai-typing';
      row.innerHTML = '<div class="ramai-av">R&Sigma;</div><div class="ramai-bub"><div class="ramai-dots"><span></span><span></span><span></span></div></div>';
      msgs.appendChild(row); scrollDown();
    }
    function hideTyping() { const t = document.getElementById('ramai-typing'); if (t) t.remove(); }

    function fmt(text) {
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/([A-Za-z_Δφω]+\s*=\s*[^\n<]{3,60})/g, '<span class="ramai-formula">$1</span>');
      text = text.replace(/\n/g, '<br>');
      return text;
    }

    async function sendMsg() {
      const msg = input.value.trim();
      if (!msg) return;

      GROQ_KEY = localStorage.getItem('ramai_groq_key') || '';
      if (!GROQ_KEY) { keyPanel.classList.remove('hidden'); return; }

      input.value = '';
      sendBtn.disabled = true;
      addMsg(msg, 'user');
      showTyping();
      chatHistory.push({ role: 'user', content: msg });

      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 2000,
            messages: [
              { role: 'system', content: `You are RAM AI, a world-class Electrical Engineering expert and mathematics assistant on ramtools.in. You have complete mastery of ALL electrical engineering subjects and mathematics.

ELECTRICAL ENGINEERING — Full Coverage:
1. BASIC EE: Ohms Law, KVL, KCL, circuit analysis, AC/DC theory, phasors, impedance, power factor
2. MACHINES: DC motors (lap/wave winding design from poles & voltage), AC induction motors, synchronous motors/generators, transformers (full design: core, windings, turns ratio, efficiency, regulation), alternators, servo motors, stepper motors
3. WINDING DESIGN: Given poles and voltage → calculate lap winding, wave winding, coil pitch, back EMF, flux, armature resistance, commutator segments, winding factor
4. POWER SYSTEMS: Generation, transmission, distribution, load flow, fault analysis, protection, switchgear, substation design, bus-bar sizing, cable sizing
5. SUBSTATION: HV/MV/LV switchgear, CT/PT selection, relay coordination, protection schemes, earthing design, testing & commissioning procedures step by step
6. DRIVES & CONTROLS: VFD (Variable Frequency Drive) - working, parameter setting, troubleshooting, selection, harmonics; Soft Starters - working, setting, bypass; PLC basics, SCADA, automation
7. TESTING & COMMISSIONING: Megger testing (insulation resistance), hi-pot testing, tan delta, transformer oil testing, CB testing, relay testing, motor testing, cable testing, earthing testing - all procedures step by step
8. PROTECTION: Overcurrent, differential, distance, earth fault relays, relay settings, coordination, IDMT curves
9. POWER ELECTRONICS: Rectifiers, inverters, converters, choppers, MOSFET/IGBT, thyristors, PWM
10. ELECTRICAL DESIGN: Motor selection, cable sizing, panel design, earthing system, lighting design, load calculation, DG sizing, UPS sizing, capacitor bank design
11. STANDARDS & CODES: IS, IEC, IEEE standards for all above
12. MATHEMATICS: Algebra, trigonometry, calculus, differential equations, Laplace transforms, Fourier series, complex numbers, matrices, probability — all with step by step solutions

RESPONSE FORMAT:
- Show ALL formulas clearly on their own line (e.g. V = I × R)
- For winding design: show complete step-by-step calculation
- For testing: show step-by-step procedure
- Use ** for bold key terms
- Give numerical examples wherever possible
- Never use LaTeX
- Be thorough and complete — do not cut answers short
- If given poles (P) and voltage (V), always calculate: winding type, coil pitch, turns, current, flux density, full design
` },
              ...chatHistory
            ]
          })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const reply = data.choices[0].message.content;
        chatHistory.push({ role: 'assistant', content: reply });
        hideTyping();
        addMsg(fmt(reply), 'ai');

      } catch (err) {
        hideTyping();
        chatHistory.pop();
        addMsg('<span style="color:#ff6666">⚠️ ' + (err.message || 'Check your API key and try again') + '</span>', 'ai');
      }

      sendBtn.disabled = false;
      input.focus();
      setTimeout(scrollDown, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
