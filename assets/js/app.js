// ─── INIT ────────────────────────────────────────────────
function init(){
  loadSessionData();
  buildWeekRow();
  updateLog();
  updatePips();
  renderTimer();
  renderLogs();

  todos = JSON.parse(localStorage.getItem('focusOS_todos') || '[]');
  renderTodos();

  const savedGoal = localStorage.getItem('focusOS_goal');
  if(savedGoal) document.getElementById('dailyGoal').value = savedGoal;

  const savedNotes = localStorage.getItem('focusOS_notes');
  if(savedNotes) document.getElementById('notesArea').value = savedNotes;

  const savedSpotify = localStorage.getItem('focusOS_spotify');
  if(savedSpotify){
    document.getElementById('spotifyUrl').value = savedSpotify;
    loadSpotify();
  }

  const savedYt1 = localStorage.getItem('focusOS_yt1');
  const savedYt2 = localStorage.getItem('focusOS_yt2');
  if(savedYt1 || savedYt2){
    if(savedYt1) document.getElementById('ytUrl1').value = savedYt1;
    if(savedYt2) document.getElementById('ytUrl2').value = savedYt2;
    loadYoutube();
  }

  if(sessionsToday >= 2){
    document.getElementById('streakMsg').classList.add('show');
  }
}

init();