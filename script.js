const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" },
    { name: "kaktus_1", runs: 3, rank: "Helper" }
];

let skinViewer;

function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';
    
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    if (sectionId === 'editor') initSkinViewer();
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

// PODGLĄD 3D
function initSkinViewer() {
    const canvas = document.getElementById("skin-container");
    if (!canvas || skinViewer) return;

    skinViewer = new skinview3d.SkinViewer({
        canvas: canvas,
        width: 300,
        height: 400,
        skin: "https://mc-heads.net/skin/Steve"
    });

    skinViewer.animations.add(skinview3d.WalkingAnimation);
    skinViewer.controls.enableRotate = true;
}

function updateViewerSkin() {
    const nick = document.getElementById("skinNickname").value;
    if (nick && skinViewer) {
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
    }
}

// RANKINGI
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        let html = `<button onclick="goBack()" style="margin-bottom:20px; cursor:pointer;">← Powrót</button><h1>${data.categoryName}</h1>`;
        data.runs.sort((a,b) => a.time.localeCompare(b.time)).forEach((run, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
            html += `
                <div style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px;">
                    <span style="width:40px;">${medal}${i+1}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:15px;">
                    <strong style="flex-grow:1;">${run.name}</strong>
                    <span style="color:#58a6ff; font-weight:bold;">${run.time}</span>
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
        <div style="background:#21262d; padding:15px; border-radius:10px; text-align:center;">
            <img src="https://mc-heads.net/avatar/${p.name}/48">
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
        <div style="background:#1c2128; padding:15px; margin-bottom:10px; border-radius:10px; display:flex; align-items:center;">
            <img src="https://mc-heads.net/avatar/${s.name}/32" style="margin-right:15px;">
            <strong>${s.name}</strong> - ${s.role}
        </div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
