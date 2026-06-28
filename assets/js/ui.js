// ─── AUDIO & NOTIF ───────────────────────────────────────
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

function notifyUser(msg) {
  if (Notification.permission === 'granted') {
    new Notification("FOCUS OS", { body: msg, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>' });
  }
}

// ─── CLOCK ───────────────────────────────────────────────
function pad(n){ return String(n).padStart(2,'0') }

function updateClock(){
  const n = new Date();
  document.getElementById('osTime').textContent =
    pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds());
  document.getElementById('osDate').textContent =
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][n.getDay()]+' '+
    n.getDate()+'/'+(n.getMonth()+1)+'/'+n.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

// ─── TOAST ───────────────────────────────────────────────
function showToast(msg, duration=3000){
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), duration);
}

// ─── TABS ────────────────────────────────────────────────
function switchTab(tab, btnEl){
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.note-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  btnEl.classList.add('active');
}
