// ─── SESSION DATA ─────────────────────────────────────────
function getTodayKey(){ return new Date().toDateString() }

function saveSessionData(){
  const key = getTodayKey();
  let data = JSON.parse(localStorage.getItem('focusOS_sessions') || '{}');
  data[key] = (data[key] || 0) + 1;
  localStorage.setItem('focusOS_sessions', JSON.stringify(data));
  document.getElementById('sessionCount').textContent = 'SESSION '+(sessionsToday+1);
}

function loadSessionData(){
  window.currentDayKey = getTodayKey();
  const key = getTodayKey();
  let data = JSON.parse(localStorage.getItem('focusOS_sessions') || '{}');
  sessionsToday = data[key] || 0;
  document.getElementById('sessionCount').textContent = 'SESSION '+(sessionsToday+1);
}

function checkDayChange(){
  if(window.currentDayKey !== getTodayKey()){
    window.currentDayKey = getTodayKey();
    sessionsToday = 0;
    focusSecondsToday = 0;
    document.getElementById('streakMsg').classList.remove('show');
    loadSessionData();
    buildWeekRow();
    updatePips();
  }
}

// ─── DARK MODE ───────────────────────────────────────────
let isDarkMode = localStorage.getItem('focusOS_dark') === 'true';
if(isDarkMode) document.body.classList.add('dark-mode');

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  if(isDarkMode) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
  localStorage.setItem('focusOS_dark', isDarkMode);
}

// ─── STREAK & GOAL ───────────────────────────────────────
function getDailyGoal() {
  return parseInt(document.getElementById('dailyGoal').value) || 2;
}

function updateDailyGoal() {
  let goal = getDailyGoal();
  if(goal < 1) { goal = 1; document.getElementById('dailyGoal').value = 1; }
  localStorage.setItem('focusOS_goal', goal);
  checkStreakUnlock();
}

function calcStreak(){
  const data = JSON.parse(localStorage.getItem('focusOS_sessions') || '{}');
  let streak = 0;
  let d = new Date();
  const goal = parseInt(localStorage.getItem('focusOS_goal')) || 2;
  
  if((data[d.toDateString()] || 0) >= goal){
    streak++;
  }
  
  d.setDate(d.getDate()-1);
  while(true){
    const key = d.toDateString();
    if((data[key] || 0) >= goal){
      streak++;
      d.setDate(d.getDate()-1);
    } else break;
  }
  return streak;
}

function checkStreakUnlock(){
  updatePips();
  const goal = getDailyGoal();
  const fireIcon = document.getElementById('streakFireIcon');
  
  if(calcStreak() > 0){
    if(fireIcon) fireIcon.classList.add('active');
  } else {
    if(fireIcon) fireIcon.classList.remove('active');
  }

  if(sessionsToday >= goal){
    document.getElementById('streakMsg').classList.add('show');
    if(sessionsToday === goal){
      showToast('🔥 STREAK AKTIF!<br>TARGET HARI INI TERCAPAI!', 4000);
    }
  } else {
    document.getElementById('streakMsg').classList.remove('show');
  }
  buildWeekRow();
}

function updatePips(){
  const goal = getDailyGoal();
  const container = document.getElementById('streakPips');
  
  let char = '😩'; // Belum mulai
  if (sessionsToday > 0 && sessionsToday < goal) char = '😐'; // Progress
  else if (sessionsToday >= goal) char = '🤩'; // Selesai
  
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '4px';

  container.innerHTML = `
    <div style="font-size: 36px; filter: drop-shadow(0 0 2px var(--shadow-color)); transition: all 0.3s; line-height: 1;">${char}</div>
    <div style="font-family:'Press Start 2P', monospace; font-size: 8px; color: var(--text-color); margin-top: 4px;">
      ${sessionsToday} / ${goal} SESI
    </div>
  `;
}

function buildWeekRow(){
  const data = JSON.parse(localStorage.getItem('focusOS_sessions') || '{}');
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const today = new Date();
  const row = document.getElementById('weekRow');
  const chart = document.getElementById('weeklyChart');
  row.innerHTML = '';
  chart.innerHTML = '';
  
  const goal = getDailyGoal();
  let maxSessions = goal;
  for(let i = 6; i >= 0; i--){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const count = data[d.toDateString()] || 0;
    if(count > maxSessions) maxSessions = count;
  }

  for(let i = 6; i >= 0; i--){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toDateString();
    const count = data[key] || 0;
    const done = count >= goal;
    const isToday = i === 0;
    
    const el = document.createElement('div');
    el.className = 'day-box' + (done ? ' streaked' : '') + (isToday ? ' today' : '');
    el.innerHTML = days[d.getDay()] + '<br>' + (done ? '🔥' : '·');
    row.appendChild(el);
    
    const barWrap = document.createElement('div');
    barWrap.style.flex = '1';
    barWrap.style.display = 'flex';
    barWrap.style.flexDirection = 'column';
    barWrap.style.alignItems = 'center';
    barWrap.style.justifyContent = 'flex-end';
    barWrap.style.height = '100%';
    
    const bar = document.createElement('div');
    bar.style.width = '100%';
    bar.style.background = isToday ? 'var(--red)' : (done ? 'var(--yellow)' : '#888');
    const heightPercent = maxSessions === 0 ? 0 : (count / maxSessions) * 100;
    bar.style.height = heightPercent + '%';
    bar.style.minHeight = '2px';
    bar.title = `${count} sesi (${count * 25} menit)`;
    
    barWrap.appendChild(bar);
    chart.appendChild(barWrap);
  }
}

// ─── LOG BAR ─────────────────────────────────────────────
function updateLog(){
  checkDayChange();
  document.getElementById('logSessions').textContent = sessionsToday;
  document.getElementById('logMinutes').textContent = Math.floor(focusSecondsToday/60) + ' mnt';
  const streak = calcStreak();
  document.getElementById('logStreak').textContent = streak;
  document.getElementById('streakNum').textContent = streak;
  let status = 'READY TO GRIND';
  const goal = getDailyGoal();
  if(sessionsToday >= goal) status = '🔥 STREAK AKTIF!';
  else if(sessionsToday === goal - 1) status = '1 LAGI UNTUK STREAK!';
  else if(isRunning) status = '⏱ FOKUS SEKARANG...';
  document.getElementById('logStatus').textContent = status;
}

function confirmResetDay(){
  if(confirm('Reset data sesi hari ini? (streak tidak hilang, hanya counter hari ini)')){
    const key = getTodayKey();
    let data = JSON.parse(localStorage.getItem('focusOS_sessions') || '{}');
    delete data[key];
    localStorage.setItem('focusOS_sessions', JSON.stringify(data));
    sessionsToday = 0;
    focusSecondsToday = 0;
    document.getElementById('streakMsg').classList.remove('show');
    updateLog();
    updatePips();
    buildWeekRow();
    showToast('↺ DATA HARI INI DIRESET');
  }
}
