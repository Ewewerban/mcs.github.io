const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" }
];

let skinViewer;

function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    if(document.getElementById('ranking-view')) document.getElementById('ranking-view').style.display = 'none';
    
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + sectionId);
    if (navBtn) navBtn.classList.add('active');

    // Inicjalizacja skina z małym opóźnieniem, żeby canvas był gotowy
    if (sectionId === 'editor') {
        setTimeout(initSkinViewer, 50);
    }
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

function initSkinViewer() {
    const canvas = document.getElementById("skin_container");
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
    }
}

function updateViewerSkin() {
    const nick = document.getElementById("skinNickname").value;
    console.log("Szukam skina dla:", nick); // Sprawdź w F12 czy to widzisz
    
    if (nick && skinViewer) {
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
    } else if (!skinViewer) {
        // Jeśli skinViewer nie wstał, spróbuj go odpalić i wtedy załadować
        initSkinViewer();
        setTimeout(() => skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`), 100);
    }
}

// RESZTA FUNKCJI (Zostaw te co masz lub wklej te)
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const rv = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rv.style.display = 'block';
        let html = `<button onclick="goBack()" class="action-btn">← Powrót</button><h1>${data.categoryName}</h1>`;
        data.runs.forEach((run, i) => {
            html += `<div class="rank-row" style="display:flex; background:#1c2128; padding:10px; margin-bottom:5px; border-radius:8px; align-items:center;">
                <span style="width:30px;">${i+1}.</span>
                <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:10px;">
                <strong style="flex-grow:1;">${run.name}</strong>
                <span>${run.time}</span>
            </div>`;
        });
        rv.innerHTML = html;
    } catch (e) { console.log(e); }
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
            <small>${p.rank}</small>
        </div>
    `).join('');
}

function loadStaff() {
    const staff = [{name: "Ewewerban", role: "Owner"}, {name: "2nec", role: "Helper"}];
    document.getElementById('staff-container').innerHTML = staff.map(s => `
        <div style="background:#1c2128; padding:10px; margin-bottom:5px; border-radius:10px; display:flex; align-items:center;">
            <img src="https://mc-heads.net/avatar/${s.name}/32" style="margin-right:10px;">
            <strong>${s.name}</strong> - ${s.role}
        </div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
