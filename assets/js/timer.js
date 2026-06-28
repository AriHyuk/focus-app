// ─── SHORTCUTS ───────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  // Abaikan jika sedang mengetik di input/textarea
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  if (e.code === 'Space') {
    e.preventDefault();
    toggleTimer();
  } else if (e.code === 'KeyR') {
    e.preventDefault();
    resetTimer();
  } else if (e.code === 'KeyS') {
    e.preventDefault();
    skipPhase();
  }
});

// ─── TIMER ───────────────────────────────────────────────
function getFocusDur(){ return (parseInt(document.getElementById('focusDur').value)||25)*60 }
function getBreakDur(){ return (parseInt(document.getElementById('breakDur').value)||5)*60 }

function onDurChange(){
  if(!isRunning){
    timeLeft = isFocus ? getFocusDur() : getBreakDur();
    renderTimer();
  }
}

function renderTimer(){
  const m = Math.floor(timeLeft/60);
  const s = timeLeft % 60;
  const el = document.getElementById('timerDisplay');
  el.textContent = pad(m)+':'+pad(s);
  el.className = 'timer-display';
  if(!isFocus) el.classList.add('break-mode');
  else if(timeLeft <= 60 && isRunning) el.classList.add('urgent');
  document.title = pad(m)+':'+pad(s)+' — FOCUS OS';
}

function toggleTimer(){
  if(isRunning){
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById('startBtn').textContent = 'RESUME';
    document.getElementById('timerStatus').textContent = 'PAUSED';
  } else {
    if (Notification.permission === 'default') Notification.requestPermission();
    isRunning = true;
    document.getElementById('startBtn').textContent = 'PAUSE';
    document.getElementById('timerStatus').textContent = isFocus ? 'FOCUS MODE' : 'BREAK TIME';
    timerInterval = setInterval(()=>{
      timeLeft--;
      if(isFocus) focusSecondsToday++;
      renderTimer();
      updateLog();
      if(timeLeft <= 0){
        clearInterval(timerInterval);
        isRunning = false;
        playChime();
        let notifMsg = "";
        
        if(isFocus){
          sessionsToday++;
          saveSessionData();
          checkStreakUnlock();
          addLogEntry('focus', getFocusDur());
          notifMsg = '✓ SESI SELESAI! ' + sessionsToday + ' sesi hari ini 🔥';
        } else {
          addLogEntry('break', getBreakDur());
          notifMsg = '⏱ BREAK SELESAI! Siap fokus lagi?';
        }
        
        showToast(notifMsg);
        notifyUser(notifMsg);
        
        isFocus = !isFocus;
        timeLeft = isFocus ? getFocusDur() : getBreakDur();
        
        if (autoContinue) {
          document.getElementById('timerStatus').textContent = isFocus ? 'FOCUS MODE' : 'BREAK TIME';
          document.getElementById('phaseLabel').textContent = isFocus ? '🎯 FOCUS' : '☕ BREAK';
          renderTimer();
          updateLog();
          toggleTimer();
        } else {
          document.getElementById('startBtn').textContent = 'START';
          document.getElementById('timerStatus').textContent = isFocus ? 'SIAP FOKUS!' : 'BREAK TIME — REST!';
          document.getElementById('phaseLabel').textContent = isFocus ? '🎯 FOCUS' : '☕ BREAK';
          renderTimer();
          updateLog();
        }
      }
    }, 1000);
  }
}

function resetTimer(){
  clearInterval(timerInterval);
  isRunning = false;
  isFocus = true;
  timeLeft = getFocusDur();
  document.getElementById('startBtn').textContent = 'START';
  document.getElementById('timerStatus').textContent = 'FOCUS MODE';
  document.getElementById('phaseLabel').textContent = '🎯 FOCUS';
  renderTimer();
}

function skipPhase(){
  clearInterval(timerInterval);
  isRunning = false;
  if(isFocus){
    sessionsToday++;
    saveSessionData();
    checkStreakUnlock();
    addLogEntry('focus', getFocusDur());
    showToast('⏭ SKIP! SESI KE-'+sessionsToday+' DIHITUNG');
  } else {
    addLogEntry('break', getBreakDur());
  }
  isFocus = !isFocus;
  timeLeft = isFocus ? getFocusDur() : getBreakDur();
  document.getElementById('startBtn').textContent = 'START';
  document.getElementById('timerStatus').textContent = isFocus ? 'FOCUS MODE' : 'BREAK TIME';
  document.getElementById('phaseLabel').textContent = isFocus ? '🎯 FOCUS' : '☕ BREAK';
  renderTimer();
  updateLog();
}
