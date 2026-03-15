const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" }
];

let skinViewer = null;

function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    const rv = document.getElementById('ranking-view');
    if (rv) rv.style.display = 'none';
    
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + sectionId);
    if (navBtn) navBtn.classList.add('active');

    // Inicjalizacja podglądu 3D
    if (sectionId === 'editor') {
        setTimeout(() => {
            if (typeof skinview3d !== 'undefined') {
                initSkinViewer();
            } else {
                console.error("Biblioteka 3D jeszcze się ładuje...");
            }
        }, 150);
    }
    
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

function initSkinViewer() {
    const canvas = document.getElementById("skin_container");
    if (!canvas || skinViewer) return;

    try {
        skinViewer = new skinview3d.SkinViewer({
            canvas: canvas,
            width: 300,
            height: 400,
            skin: "https://mc-heads.net/skin/Steve"
        });
        skinViewer.animations.add(skinview3d.WalkingAnimation);
        skinViewer.controls.enableRotate = true;
    } catch (e) {
        console.error("Nie udało się uruchomić podglądu 3D:", e);
    }
}

function updateViewerSkin() {
    const nick = document.getElementById("skinNickname").value.trim();
    if (!nick) {
        alert("Wpisz nick gracza!");
        return;
    }

    if (skinViewer) {
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
    } else {
        // Jeśli viewer nie był gotowy, spróbuj go stworzyć teraz
        initSkinViewer();
        if (skinViewer) skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
    }
}

// --- POZOSTAŁE FUNKCJE (Działające) ---
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const rv = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rv.style.display = 'block';
        
        let html = `<button onclick="goBack()" class="action-btn">← Powrót</button><h1>${data.categoryName}</h1>`;
        data.runs.sort((a,b) => a.time.localeCompare(b.time)).forEach((run, i) => {
            html += `<div class="rank-row" style="display:flex; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px; align-items:center;">
                <span style="width:30px;">${i+1}.</span>
                <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:15px; border-radius:4px;">
                <strong style="flex-grow:1;">${run.name}</strong>
                <span style="color:#58a6ff; font-weight:bold;">${run.time}</span>
            </div>`;
        });
        rv.innerHTML = html;
    } catch (e) { console.log("Błąd rankingu:", e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function renderPlayers(players) {
    const container = document.getElementById('players-container');
    if (!container) return;
    container.innerHTML = players.map(p => `
        <div class="player-card" style="background:#21262d; padding:15px; border-radius:10px; text-align:center;">
            <img src="https://mc-heads.net/avatar/${p.name}/48">
            <p><strong>${p.name}</strong></p>
            <small style="color:#7ca352;">${p.rank}</small>
        </div>
    `).join('');
}

function loadStaff() {
    const staff = [{name: "Ewewerban", role: "Owner"}, {name: "2nec", role: "Helper"}];
    const container = document.getElementById('staff-container');
    if (container) {
        container.innerHTML = staff.map(s => `
            <div class="rank-row" style="background:#1c2128; padding:15px; border-radius:10px; display:flex; align-items:center; margin-bottom:10px;">
                <img src="https://mc-heads.net/avatar/${s.name}/32" style="margin-right:15px;">
                <strong>${s.name}</strong><span style="margin-left:10px; color:#8b949e;">- ${s.role}</span>
            </div>
        `).join('');
    }
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
