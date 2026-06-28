// ─── STATE ───────────────────────────────────────────────
let timerInterval = null;
let isRunning = false;
let isFocus = true;
let timeLeft = 25 * 60;
let sessionsToday = 0;
let focusSecondsToday = 0;
let timerTick = 0;
let autoContinue = localStorage.getItem('focusOS_auto') === 'true';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('autoContinue').checked = autoContinue;
});

function toggleAutoContinue() {
  autoContinue = document.getElementById('autoContinue').checked;
  localStorage.setItem('focusOS_auto', autoContinue);
}
