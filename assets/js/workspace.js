// ─── TODO ────────────────────────────────────────────────
let todos = [];

function saveTodos(){
  localStorage.setItem('focusOS_todos', JSON.stringify(todos));
}

function renderTodos(){
  const list = document.getElementById('todoList');
  const empty = document.getElementById('todoEmpty');
  list.innerHTML = '';
  if(todos.length === 0){
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }
  todos.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (t.done ? ' done' : '');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.onchange = () => toggleTodo(i);
    const span = document.createElement('span');
    span.style.flex = '1';
    
    let prioTag = '';
    if(t.prio === 'high') prioTag = '<span style="font-size:8px; font-weight:bold;">[HIGH]</span> ';
    else if(t.prio === 'med') prioTag = '<span style="font-size:8px; font-weight:bold;">[MED]</span> ';
    else if(t.prio === 'low') prioTag = '<span style="font-size:8px; font-weight:bold;">[LOW]</span> ';
    
    span.innerHTML = prioTag + t.text;
    const del = document.createElement('button');
    del.className = 'todo-del';
    del.textContent = '×';
    del.onclick = () => deleteTodo(i);
    item.appendChild(cb);
    item.appendChild(span);
    item.appendChild(del);
    list.appendChild(item);
  });
}

function addTodo(){
  const input = document.getElementById('todoInput');
  const prioSelect = document.getElementById('todoPrio');
  const text = input.value.trim();
  if(!text) return;
  todos.unshift({text, done: false, prio: prioSelect.value});
  saveTodos();
  renderTodos();
  input.value = '';
  prioSelect.value = '';
}

function toggleTodo(i){
  todos[i].done = !todos[i].done;
  saveTodos();
  renderTodos();
}

function deleteTodo(i){
  todos.splice(i, 1);
  saveTodos();
  renderTodos();
}

// ─── NOTES ───────────────────────────────────────────────
let stickyNotes = [];

function loadNotes() {
  const savedArray = localStorage.getItem('focusOS_notes_array');
  if (savedArray) {
    stickyNotes = JSON.parse(savedArray);
  } else {
    const oldNotes = localStorage.getItem('focusOS_notes');
    if (oldNotes && oldNotes.trim() !== "") {
      stickyNotes.push({
        id: Date.now(),
        text: oldNotes,
        date: new Date().toLocaleDateString()
      });
      localStorage.removeItem('focusOS_notes');
      saveNotes();
    }
  }
}

function saveNotes(){
  localStorage.setItem('focusOS_notes_array', JSON.stringify(stickyNotes));
}

function renderNotes() {
  const container = document.getElementById('notesContainer');
  if (!container) return;
  container.innerHTML = '';
  
  if (stickyNotes.length === 0) {
    container.innerHTML = '<div class="todo-empty" style="display:block;">NO STICKY NOTES YET</div>';
    return;
  }
  
  stickyNotes.forEach((note, index) => {
    const card = document.createElement('div');
    card.className = 'sticky-note';
    
    const header = document.createElement('div');
    header.className = 'sticky-header';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'sticky-date';
    dateSpan.textContent = note.date;
    
    const delBtn = document.createElement('button');
    delBtn.className = 'sticky-del';
    delBtn.textContent = '×';
    delBtn.onclick = () => deleteNote(index);
    
    header.appendChild(dateSpan);
    header.appendChild(delBtn);
    
    const body = document.createElement('textarea');
    body.className = 'sticky-body';
    body.value = note.text;
    body.placeholder = 'Ketik di sini...';
    body.oninput = (e) => {
      stickyNotes[index].text = e.target.value;
      saveNotes();
    };
    
    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });
}

function addStickyNote() {
  stickyNotes.unshift({
    id: Date.now(),
    text: '',
    date: new Date().toLocaleDateString()
  });
  saveNotes();
  renderNotes();
}

function deleteNote(index) {
  stickyNotes.splice(index, 1);
  saveNotes();
  renderNotes();
}

// ─── LOG HISTORY & BACKUP ────────────────────────────────
let sessionLogs = JSON.parse(localStorage.getItem('focusOS_history') || '[]');

function addLogEntry(type, minutes) {
  const now = new Date();
  sessionLogs.unshift({
    time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    date: now.toLocaleDateString(),
    type: type,
    minutes: minutes
  });
  if(sessionLogs.length > 50) sessionLogs.pop();
  localStorage.setItem('focusOS_history', JSON.stringify(sessionLogs));
  renderLogs();
}

function renderLogs() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  if(!list) return;
  list.innerHTML = '';
  if(sessionLogs.length === 0) {
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }
  sessionLogs.forEach(log => {
    const el = document.createElement('div');
    el.style.borderBottom = '1px solid var(--border-color)';
    el.style.paddingBottom = '4px';
    el.style.marginBottom = '4px';
    const icon = log.type === 'focus' ? '🎯' : '☕';
    el.innerHTML = `<span>${log.date} ${log.time}</span> <strong style="float:right">${icon} ${log.minutes}m</strong>`;
    list.appendChild(el);
  });
}

function exportData() {
  const data = {
    sessions: localStorage.getItem('focusOS_sessions'),
    todos: localStorage.getItem('focusOS_todos'),
    notes: localStorage.getItem('focusOS_notes'),
    goal: localStorage.getItem('focusOS_goal'),
    history: localStorage.getItem('focusOS_history')
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'focusos_backup.json';
  a.click();
  showToast('💾 BACKUP EXPORTED!');
}

function importData() {
  document.getElementById('importFile').click();
}

function handleImport(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if(data.sessions) localStorage.setItem('focusOS_sessions', data.sessions);
      if(data.todos) localStorage.setItem('focusOS_todos', data.todos);
      if(data.notes) localStorage.setItem('focusOS_notes', data.notes);
      if(data.goal) localStorage.setItem('focusOS_goal', data.goal);
      if(data.history) localStorage.setItem('focusOS_history', data.history);
      showToast('🔄 BACKUP RESTORED! Mereload...');
      setTimeout(() => location.reload(), 1500);
    } catch(err) {
      showToast('⚠ FILE CORRUPT!');
    }
  };
  reader.readAsText(file);
}
