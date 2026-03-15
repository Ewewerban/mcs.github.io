const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" },
    { name: "kaktus_1", runs: 3, rank: "Helper" }
];

function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';
    
    document.getElementById(sectionId + '-section').style.display = 'block';

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    if (sectionId === 'editor') initPixelEditor();
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

// LOGIKA MALOWANIA
function initPixelEditor() {
    const grid = document.getElementById('pixel-grid');
    if (grid.children.length > 0) return;

    for (let i = 0; i < 1024; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        
        pixel.addEventListener('mousedown', () => {
            pixel.style.backgroundColor = document.getElementById('colorPicker').value;
        });

        pixel.addEventListener('mouseover', (e) => {
            if (e.buttons === 1) {
                pixel.style.backgroundColor = document.getElementById('colorPicker').value;
            }
        });

        grid.appendChild(pixel);
    }
}

function clearCanvas() {
    document.querySelectorAll('.pixel').forEach(p => p.style.backgroundColor = 'transparent');
}

// RANKINGI
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        let html = `<button onclick="goBack()" style="padding:10px; cursor:pointer;">← Powrót</button><h1>${data.categoryName}</h1>`;
        data.runs.sort((a,b) => a.time.localeCompare(b.time)).forEach((run, i) => {
            html += `<div style="display:flex; padding:15px; background:#1c2128; margin-bottom:5px; border-radius:8px;">
                        <span style="width:30px;">${i+1}.</span>
                        <strong style="flex-grow:1;">${run.name}</strong>
                        <span style="color:#58a6ff;">${run.time}</span>
                     </div>`;
        });
        rankingView.innerHTML = html;
    } catch (e) { console.error(e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// PLAYERS
function renderPlayers(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = players.map(p => `
        <div class="player-card" style="background:#21262d; padding:15px; border-radius:10px; text-align:center; border:1px solid #30363d;">
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
        <div style="padding:15px; background:#1c2128; margin-bottom:10px; border-radius:10px; display:flex; align-items:center;">
            <img src="https://mc-heads.net/avatar/${s.name}" style="width:32px; margin-right:15px;">
            <strong>${s.name}</strong> - ${s.role}
        </div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
