// const API_URL = '/api/kickstarter';
const API_URL = 'https://corsproxy.io/?https://www.kickstarter.com/projects/postal2redux/postal-2-redux/stats.json';
const CONFIG_URL = 'stretchgoals.json';

async function fetchPledged() {
  const res = await fetch(API_URL);
  const data = await res.json();
  return parseFloat(data.project.pledged);
}

async function fetchGoals() {
  const res = await fetch(CONFIG_URL);
  return await res.json();
}

function formatMoney(amount) {
  return '$' + amount.toLocaleString('en-US', {minimumFractionDigits: 0});
}

function renderGoals(goals, maxGoal, pledged) {
  const bar = document.getElementById('kickstarter-progress-bar');
  // Remove old goal markers and indicators
  bar.querySelectorAll('.kickstarter-goal, .kickstarter-goal-indicator').forEach(e => e.remove());
  goals.forEach((goal, i) => {
    let percent = Math.min(100, (goal.amount / maxGoal) * 100);
    // If this is the last goal, offset it to the left for more room
    if (i === goals.length - 1) {
      percent = Math.max(0, percent - 6); // shift left by 6% for room
    }
    // Indicator line/dot
    const indicator = document.createElement('div');
    let indicatorClass = 'kickstarter-goal-indicator';
    if (pledged >= goal.amount) {
      indicatorClass += ' passed';
    }
    indicator.className = indicatorClass;
    indicator.style.left = percent + '%';
    bar.appendChild(indicator);
    // Alternate label position to avoid overlap
    const marker = document.createElement('div');
    let classes = 'kickstarter-goal ' + (i % 2 === 0 ? 'bottom' : 'top');
    if (i === goals.length - 1) {
      classes += ' last';
    }
    if (pledged >= goal.amount) {
      classes += ' passed';
    }
    marker.className = classes;
    marker.style.left = percent + '%';
    marker.innerText = `${goal.label}`;
    bar.appendChild(marker);
  });
}

async function update() {
  try {
    const [pledged, goals] = await Promise.all([
      fetchPledged(),
      fetchGoals()
    ]);
    const maxGoal = goals.length ? goals[goals.length-1].amount : pledged;
    document.getElementById('kickstarter-pledged').innerText = `Raised: ${formatMoney(pledged)}`;
    const percent = Math.min(100, (pledged / maxGoal) * 100);
    document.getElementById('kickstarter-progress').style.width = percent + '%';
  renderGoals(goals, maxGoal, pledged);
  } catch (e) {
    document.getElementById('kickstarter-pledged').innerText = 'Error loading data';
  }
}

update();
setInterval(update, 5000); // update every 5 seconds
