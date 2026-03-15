// --- DANE ---
const playersDatabase = [
    { name: "Marlowww", runs: 0, rank: "Holy Cheater" },
    { name: "Ewewerban", runs: 1, rank: "Owner" },
    { name: "2rec", runs: 0, rank: "Player" },
    { name: "kaktus_1", runs: 0, rank: "Player" }
];

let skinViewer; // Zmienna dla modelu 3D

// --- NAWIGACJA ---
function showSection(sectionId) {
    // Ukryj wszystko
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';

    // Pokaż wybraną sekcję
    document.getElementById(sectionId + '-section').style.display = 'block';

    // Aktywuj link w menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    // Inicjalizacja specyficznych widoków
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
    if (sectionId === 'editor') {
        setTimeout(initSkinViewer, 100); // Małe opóźnienie, żeby canvas się wyrenderował
    }
}

// --- SKIN PREVIEWER 3D ---
function initSkinViewer() {
    if (skinViewer) return; // Nie twórz ponownie, jeśli już istnieje

    skinViewer = new skinview3d.SkinViewer({
        canvas: document.getElementById("skin-container"),
        width: 300,
        height: 400,
        skin: "https://mc-heads.net/skin/Steve"
    });

    // Dodaj animację chodzenia
    skinViewer.animations.add(skinview3d.WalkingAnimation);
    skinViewer.controls.enableRotate = true;
    skinViewer.controls.enableZoom = false;
}

function changeSkin() {
    const nick = document.getElementById("skinNickname").value;
    if (nick && skinViewer) {
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
    }
}

// --- RANKINGI ---
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        let html = `
            <button onclick="goBack()" style="margin-bottom:20px; padding:10px; cursor:pointer;">← Powrót</button>
            <h1>Best of ${data.categoryName}</h1>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            let rankClass = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
            html += `
                <div class="rank-row ${rankClass}" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-bottom:10px; border-radius:10px;">
                    <span style="width:30px;">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" style="width:32px; margin: 0 15px;">
                    <strong style="flex-grow:1;">${run.name}</strong>
                    <span style="margin-right:15px;">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span style="color:#58a6ff; font-weight:bold;">${run.time}</span>
                </div>
            `;
        });
        rankingView.innerHTML = html + "</div>";
    } catch (e) { console.error(e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// --- PLAYERS & STAFF ---
function renderPlayers(players) {
    const container = document.getElementById('players-container');
    container.innerHTML = players.map(p => `
        <div class="player-card" style="background:#21262d; padding:15px; border-radius:10px; text-align:center;">
            <img src="https://mc-heads.net/avatar/${p.name}" style="width:48px; image-rendering: pixelated;">
            <p style="margin:10px 0 5px 0;"><strong>${p.name}</strong></p>
            <small style="color:#7ca352;">${p.rank}</small>
        </div>
    `).join('');
}

function filterPlayers() {
    const val = document.getElementById('playerSearch').value.toLowerCase();
    const filtered = playersDatabase.filter(p => p.name.toLowerCase().includes(val));
    renderPlayers(filtered);
}

function loadStaff() {
    const staff = [
        {name: "Ewewerban", role: "Owner"},
        {name: "2nec", role: "Helper"}
    ];
    document.getElementById('staff-container').innerHTML = staff.map(s => `
        <div class="rank-row" style="background:#1c2128; padding:15px; margin-bottom:10px; border-radius:10px; display:flex; align-items:center;">
            <img src="https://mc-heads.net/avatar/${s.name}" style="width:32px; margin-right:15px;">
            <strong>${s.name}</strong> <span style="margin-left:10px; color:#8b949e;">- ${s.role}</span>
        </div>
    `).join('');
}

// --- MODAL ---
function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
