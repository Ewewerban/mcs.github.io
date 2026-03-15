// --- DANE ---
const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" }
];

let skinViewer = null;

// --- GŁÓWNA NAWIGACJA ---
function showSection(sectionId) {
    // Ukrywamy wszystko
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    const rankingView = document.getElementById('ranking-view');
    if (rankingView) rankingView.style.display = 'none';
    
    // Pokazujemy wybraną sekcję
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    // Aktualizujemy menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + sectionId);
    if (navBtn) navBtn.classList.add('active');

    // Specjalne akcje
    if (sectionId === 'editor') {
        // Dajemy przeglądarce 100ms na wyrenderowanie canvasa zanim go użyjemy
        setTimeout(initSkinViewer, 100);
    }
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

// --- LOGIKA PODGLĄDU 3D ---
function initSkinViewer() {
    const canvas = document.getElementById("skin_container");
    if (!canvas) {
        console.error("BŁĄD: Nie znaleziono elementu o id 'skin_container'!");
        return;
    }

    if (!skinViewer) {
        try {
            skinViewer = new skinview3d.SkinViewer({
                canvas: canvas,
                width: 300,
                height: 400,
                skin: "https://mc-heads.net/skin/Steve"
            });
            skinViewer.animations.add(skinview3d.WalkingAnimation);
            skinViewer.controls.enableRotate = true;
            console.log("SkinViewer zainicjowany pomyślnie.");
        } catch (e) {
            console.error("Błąd biblioteki skinview3d:", e);
        }
    }
}

function updateViewerSkin() {
    const nickInput = document.getElementById("skinNickname");
    if (!nickInput) return;
    
    const nick = nickInput.value.trim();
    if (!nick) {
        alert("Wpisz nick gracza!");
        return;
    }

    if (skinViewer) {
        skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
        console.log("Ładowanie skina dla:", nick);
    } else {
        // Jeśli viewer nie działa, spróbuj go naprawić i załadować skin
        initSkinViewer();
        setTimeout(() => {
            if(skinViewer) skinViewer.loadSkin(`https://mc-heads.net/skin/${nick}`);
        }, 200);
    }
}

// --- RANKINGI, GRACZE, STAFF (BEZ ZMIAN) ---
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const rv = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rv.style.display = 'block';
        
        let html = `<button onclick="goBack()" class="add-run-btn" style="margin-bottom:20px; width:auto; padding:10px 20px;">← Powrót</button><h1>${data.categoryName}</h1>`;
        data.runs.forEach((run, i) => {
            html += `<div style="display:flex; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px; align-items:center;">
                <span style="width:40px; font-weight:bold;">${i+1}.</span>
                <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:15px; border-radius:4px;">
                <strong style="flex-grow:1;">${run.name}</strong>
                <span style="color:#58a6ff; font-weight:bold;">${run.time}</span>
            </div>`;
        });
        rv.innerHTML = html;
    } catch (e) { console.error("Błąd ładowania JSON:", e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function renderPlayers(players) {
    const container = document.getElementById('players-container');
    if(!container) return;
    container.innerHTML = players.map(p => `
        <div style="background:#21262d; padding:15px; border-radius:10px; text-align:center; border:1px solid #30363d;">
            <img src="https://mc-heads.net/avatar/${p.name}/48">
            <p><strong>${p.name}</strong></p>
            <small style="color:#7ca352;">${p.rank}</small>
        </div>
    `).join('');
}

function loadStaff() {
    const staff = [{name: "Ewewerban", role: "Owner"}, {name: "2nec", role: "Helper"}];
    const container = document.getElementById('staff-container');
    if(!container) return;
    container.innerHTML = staff.map(s => `
        <div style="background:#1c2128; padding:15px; margin-bottom:10px; border-radius:10px; display:flex; align-items:center;">
            <img src="https://mc-heads.net/avatar/${s.name}/32" style="margin-right:15px; border-radius:4px;">
            <strong>${s.name}</strong><span style="margin-left:10px; color:#8b949e;">- ${s.role}</span>
        </div>
    `).join('');
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
