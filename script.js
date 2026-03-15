const playersDatabase = [
    { name: "Marlowww", runs: ?, rank: "Cheater" },
    { name: "Ewewerban", runs: 1, rank: "Owner" },
    { name: "2rec", runs: 0, rank: "Player" },
    { name: "kaktus__1", runs: ?, rank: "Player" }
];

let skinViewer;

function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';

    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    if (sectionId === 'editor') {
        setTimeout(initSkinViewer, 50);
    }
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

function initSkinViewer() {
    const canvas = document.getElementById("skin-container");
    if (!canvas) return;

    if (!skinViewer) {
        skinViewer = new skinview3d.SkinViewer({
            canvas: canvas,
            width: 300,
            height: 400,
            skin: "https://mc-heads.net/skin/Steve"
        });
        skinViewer.animations.add(skinview3d.WalkingAnimation);
        skinViewer.controls.enableRotate = true;
        skinViewer.controls.enableZoom = true;
    }
}

function changeSkin() {
    const nick = document.getElementById("skinNickname").value;
    if (nick && skinViewer) {
        // Używamy bezpośredniego API do skinów
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
        console.log("Ładowanie skina dla: " + nick);
    } else {
        alert("Wpisz nick gracza!");
    }
}

// Reszta Twoich funkcji (loadCategory, renderPlayers itd.) zostaje bez zmian
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
            html += `<div class="rank-row"><span>${index+1}.</span><strong>${run.name}</strong><span>${run.time}</span></div>`;
        });
        rankingView.innerHTML = html;
    } catch (e) { console.log(e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function renderPlayers(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = players.map(p => `
        <div class="player-card">
            <img src="https://mc-heads.net/avatar/${p.name}">
            <strong>${p.name}</strong>
            <small>${p.rank}</small>
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
        <div class="rank-row"><strong>${s.name}</strong> - ${s.role}</div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
