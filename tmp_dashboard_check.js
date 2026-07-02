
const token = localStorage.getItem('mm_token');
if (!token) {
  window.location.href = 'index.html';
}

const currentUser = JSON.parse(localStorage.getItem('mm_user') || '{}');
const profile = currentUser.profile || {};
const state = {
  sleep: profile.sleep ?? 0,
  study: profile.study ?? 0,
  exercise: profile.exercise ?? 0,
  screen: profile.screen ?? 0,
  cgpa: profile.cgpa ?? 0,
  strong: profile.strong || [],
  weak: profile.weak || [],
  hobby: profile.hobby || [],
  have: profile.have || [],
  want: profile.want || [],
  shortGoal: profile.shortGoal || '',
  longGoal: profile.longGoal || '',
  dreamCareer: profile.dreamCareer || ''
};

function init() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning ✦' : h < 17 ? 'Good afternoon ✦' : 'Good evening ✦';
  document.getElementById('greeting').textContent = greet;
  document.getElementById('sidebarName').textContent = currentUser.name || 'User';
  document.getElementById('sidebarEmail').textContent = currentUser.email || '';
  document.getElementById('sidebarAvatar').textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
  document.getElementById('dashTitle').textContent = `Welcome, ${(currentUser.name || 'User').split(' ')[0]}.`;

  if (state.sleep !== null) {
    setSlider('sl-sleep', state.sleep, 'rv-sleep', 'h');
    setSlider('sl-study', state.study, 'rv-study', 'h');
    setSlider('sl-exercise', state.exercise, 'rv-exercise', 'd');
    setSlider('sl-screen', state.screen, 'rv-screen', 'h');
    setSliderDecimal('sl-cgpa', state.cgpa, 'rv-cgpa');
  }

  document.getElementById('inp-shortGoal').value = state.shortGoal;
  document.getElementById('inp-longGoal').value = state.longGoal;
  document.getElementById('inp-career').value = state.dreamCareer;

  updateProductivity(0, 0);
  refreshDashboard();
}

function setSlider(id, val, rvId, suffix) {
  const el = document.getElementById(id);
  if (el) {
    el.value = val;
    document.getElementById(rvId).textContent = `${val}${suffix}`;
  }
}

function setSliderDecimal(id, val, rvId) {
  const el = document.getElementById(id);
  if (el) {
    el.value = val;
    document.getElementById(rvId).textContent = parseFloat(val || 0).toFixed(1);
  }
}

function restoreTags(containerId, arr) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.tag').forEach(tag => {
    const val = tag.getAttribute('data-value');
    if (val && arr.includes(val)) tag.classList.add('selected');
  });
}

function goPage(id) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const selectedPage = document.getElementById('page-' + id);
  if (selectedPage) selectedPage.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick') === `goPage('${id}')`);
  });
}

function switchTab(i) {
  document.querySelectorAll('.tab-panel').forEach((p, idx) => p.hidden = idx !== i);
  document.querySelectorAll('.tab').forEach((t, idx) => t.classList.toggle('active', idx === i));
}

function rv(id, rvId, suffix) {
  const v = document.getElementById(id).value;
  document.getElementById(rvId).textContent = `${v}${suffix}`;
  state[id.replace('sl-', '')] = parseFloat(v);
  refreshDashboard();
}

function rvd(id, rvId) {
  const v = parseFloat(document.getElementById(id).value).toFixed(1);
  document.getElementById(rvId).textContent = v;
  state.cgpa = parseFloat(v);
  refreshDashboard();
}

function toggleTag(el, group, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!state[group].includes(val)) state[group].push(val);
  } else {
    state[group] = state[group].filter(x => x !== val);
  }
}

function computeScores() {
  const sleepScore = state.sleep >= 7 ? 100 : state.sleep >= 6 ? 75 : state.sleep >= 5 ? 50 : 25;
  const studyScore = Math.min(100, Math.round((state.study / 8) * 100));
  const exerciseScore = Math.min(100, Math.round((state.exercise / 5) * 100));
  const screenScore = state.screen <= 2 ? 100 : state.screen <= 4 ? 70 : state.screen <= 6 ? 40 : 15;
  const academicScore = Math.round((state.cgpa / 10) * 100);
  const overall = Math.round((sleepScore + studyScore + exerciseScore + screenScore + academicScore) / 5);
  return { sleepScore, studyScore, exerciseScore, screenScore, academicScore, overall };
}

function updateProductivity(completed, total) {
  const score = total === 0 ? 0 : Math.round((completed / total) * 100);
  document.getElementById('productivity-num').textContent = `${score}%`;
  document.getElementById('productivity-fill').style.width = `${score}%`;
  document.getElementById('productivity-text').textContent = `${completed}/${total} Tasks Completed`;
}

function scoreLevel(s) {
  if (s >= 85) return ['Peak Form', '#4ade80'];
  if (s >= 70) return ['Growth Mode', '#a78bfa'];
  if (s >= 55) return ['Building Up', '#fbbf24'];
  return ['Needs Focus', '#f97066'];
}

function generateSchedule() {
  const tasks = ['task1', 'task2', 'task3', 'task4', 'task5'].map(id => document.getElementById(id).value).filter(Boolean);
  localStorage.setItem(`${currentUser.email || 'user'}_tasks`, JSON.stringify(tasks));
  alert('Tasks saved successfully!');
}

function refreshDashboard() {
  const s = computeScores();
  const [level] = scoreLevel(s.overall);
  document.getElementById('productivity-num').textContent = `${s.overall}%`;
  document.getElementById('productivity-fill').style.width = `${s.overall}%`;
  document.getElementById('productivity-text').textContent = `${level} · ${s.overall}% overall`;
}

async function analyzeProfile() {
  state.shortGoal = document.getElementById('inp-shortGoal').value.trim();
  state.longGoal = document.getElementById('inp-longGoal').value.trim();
  state.dreamCareer = document.getElementById('inp-career').value;
  const btn = document.getElementById('analyze-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('loading');
  }
  goPage('insights');
  try {
    const response = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) });
    const aiResult = await response.json();
    if (aiResult.error) throw new Error(aiResult.error);
    localStorage.setItem(`${currentUser.email || 'user'}_ai_result`, JSON.stringify(aiResult));
    renderInsights(aiResult);
    renderCareer(aiResult);
    renderRoadmap(aiResult);
    renderSchedule(aiResult);
    document.getElementById('daily-motivation').textContent = aiResult.dailyMotivation || 'Keep going — your next step starts now.';
  } catch (err) {
    document.getElementById('insights-content').innerHTML = '<div class="ai-box"><div class="ai-text ai-failure">AI analysis failed.</div></div>';
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }
}

function renderInsights(r) {
  const habits = Array.isArray(r.habits) ? r.habits : [];
  document.getElementById('insights-content').innerHTML = `
    <div class="ai-box gap">
      <div class="ai-label"><div class="ai-dot"></div> Personalized Analysis</div>
      <div class="ai-text">${r.summary || 'Your AI summary will appear here.'}</div>
    </div>
    <div class="card gap">
      <div class="card-title">Habit Score Breakdown</div>
      ${habits.map(h => `<div class="prog-row"><div class="prog-name">${h.area || 'Habit'}</div><div class="prog-bar"><div class="prog-fill" style="width:${h.score || 0}%;background:${h.color || '#a78bfa'}"></div></div><div class="prog-pct" style="color:${h.color || '#a78bfa'}">${h.score || 0}</div></div><div class="empty-note" style="padding-left:110px">${h.tip || ''}</div>`).join('')}
    </div>`;
}

function renderSchedule(r) {
  const schedule = Array.isArray(r.dailySchedule) ? r.dailySchedule : [];
  document.getElementById('schedule-content').innerHTML = schedule.map(item => `
    <div class="card schedule-card">
      <h3>${item.time || ''}</h3>
      <label><input type="checkbox"> ${item.task || ''}</label>
    </div>`).join('');
}

function renderCareer(r) {
  const careers = Array.isArray(r.careers) ? r.careers : [];
  document.getElementById('career-results').innerHTML = careers.map(c => `
    <div class="career-card">
      <div class="career-header">
        <div class="career-emoji">${c.emoji || '✨'}</div>
        <div class="career-name">${c.title || 'Career Path'}</div>
        <div class="match-badge ${c.match >= 80 ? 'match-high' : 'match-mid'}">${c.match || 0}% match</div>
      </div>
      <div class="career-why">${c.why || ''}</div>
      <div class="skill-pills">${(c.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
    </div>`).join('');
}

function renderRoadmap(r) {
  const roadmap = Array.isArray(r.roadmap) ? r.roadmap : [];
  document.getElementById('roadmap-content').innerHTML = `
    <div class="roadmap-wrap">${roadmap.map(s => `
      <div class="rm-step">
        <div class="rm-node ${s.type === 'near' ? 'rm-near' : s.type === 'far' ? 'rm-far' : 'rm-now'}">${s.type === 'near' ? '2' : s.type === 'far' ? '3' : '1'}</div>
        <div class="rm-content">
          <div class="rm-phase">${s.phase || ''}</div>
          <div class="rm-title">${s.title || ''}</div>
          <ul class="rm-items">${(s.steps || []).map(st => `<li>${st}</li>`).join('')}</ul>
        </div>
      </div>`).join('')}</div>`;
}

async function handleLogout() {
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch (e) {}
  localStorage.removeItem('mm_token');
  localStorage.removeItem('mm_user');
  localStorage.removeItem(`${currentUser.email || 'user'}_ai_result`);
  window.location.href = '/';
}

init();
goPage('dashboard');
