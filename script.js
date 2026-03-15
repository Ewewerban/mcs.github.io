const playersDatabase = [
    { name: "Marlowww", runs: 12, rank: "Cheater" },
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "2rec", runs: 8, rank: "Player" },
    { name: "kaktus__1", runs: 3, rank: "Player" }
];

function showSection(sectionId) {
    // Ukrywanie sekcji
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';

    // Pokazywanie wybranej
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    // Menu active
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const currentNav = document.getElementById('nav-' + sectionId);
    if (currentNav) currentNav.classList.add('active');

    // Akcje
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));
        
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        let html = `<button onclick="goBack()" class="back-btn">← Powrót</button><h1>${data.categoryName}</h1>`;
        sortedRuns.forEach((run, index) => {
            html += `
                <div class="rank-row">
                    <span>${index+1}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" style="width:32px;">
                    <strong style="flex-grow:1; margin-left:15px;">${run.name}</strong>
                    <span>${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span style="color:#58a6ff; font-weight:bold; margin-left:20px;">${run.time}</span>
                </div>`;
        });
        rankingView.innerHTML = html;
    } catch (e) { console.error(e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function renderPlayers(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = players.map(p => `
        <div class="player-card">
            <img src="https://mc-heads.net/avatar/${p.name}" style="width:48px;">
            <p><strong>${p.name}</strong></p>
            <small style="color:#7ca352;">${p.rank}</small>
        </div>
    `).join('');
}

function filterPlayers() {
    const val = document.getElementById('playerSearch').value.toLowerCase();
    renderPlayers(playersDatabase.filter(p => p.name.toLowerCase().includes(val)));
}

function loadStaff() {
    const staff = [{name: "Ewewerban", role: "Owner"}, {name: "2nec", role: "Helper"}];
    document.getElementById('staff-container').innerHTML = staff.map(s => `
        <div class="rank-row">
            <img src="https://mc-heads.net/avatar/${s.name}" style="width:32px; margin-right:15px;">
            <strong>${s.name}</strong><span style="margin-left:10px; color:#8b949e;">- ${s.role}</span>
        </div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
