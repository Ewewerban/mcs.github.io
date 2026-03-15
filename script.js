// --- BAZA DANYCH GRACZY ---
const playersDatabase = [
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "Marlowww", runs: 12, rank: "Pro" },
    { name: "2nec", runs: 8, rank: "Helper" },
    { name: "kaktus_1", runs: 3, rank: "Helper" }
];

// --- NAWIGACJA ---
function showSection(sectionId) {
    console.log("Przełączam na sekcję:", sectionId);

    // 1. Ukryj wszystkie widoki treści
    const views = document.querySelectorAll('.content-view');
    views.forEach(view => view.style.display = 'none');

    // 2. Ukryj widok rankingu (jeśli jest otwarty)
    const rankingView = document.getElementById('ranking-view');
    if (rankingView) rankingView.style.display = 'none';

    // 3. Pokaż wybraną sekcję
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // 4. Zmień aktywny przycisk w menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeBtn = document.getElementById('nav-' + sectionId);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // 5. Inicjalizacja specyficznych funkcji
    if (sectionId === 'editor') initPixelEditor();
    if (sectionId === 'players') renderPlayers(playersDatabase);
    if (sectionId === 'staff') loadStaff();
}

// --- RANKINGI (SPEEDRUNS) ---
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        // Sortowanie: najkrótszy czas na górze
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        let html = `
            <button onclick="goBack()" class="back-btn" style="margin-bottom:20px; padding:8px 15px; cursor:pointer; background:#30363d; color:white; border:none; border-radius:5px;">← Powrót</button>
            <h1 style="margin-bottom:30px;">${data.categoryName}</h1>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            
            // Kolory podium (Złoto, Srebro, Brąz)
            let rankStyle = "";
            let medal = "";
            if (rank === 1) { rankStyle = "border-left: 4px solid #ffd700; background: rgba(255, 215, 0, 0.05);"; medal = "🥇 "; }
            if (rank === 2) { rankStyle = "border-left: 4px solid #c0c0c0; background: rgba(192, 192, 192, 0.05);"; medal = "🥈 "; }
            if (rank === 3) { rankStyle = "border-left: 4px solid #cd7f32; background: rgba(205, 127, 50, 0.05);"; medal = "🥉 "; }

            html += `
                <div class="rank-row" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px; ${rankStyle}">
                    <span style="width:45px; font-weight:bold; color:#8b949e;">${medal}${rank}.</span>
                    
                    <img src="https://mc-heads.net/avatar/${run.name}/32" 
                         style="width:32px; height:32px; border-radius:4px; margin-right:15px; image-rendering: pixelated;">
                    
                    <strong style="flex-grow:1; font-size:1.1rem;">${run.name}</strong>
                    
                    <span style="margin-right:20px; opacity:0.7;">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    
                    <span style="color:#58a6ff; font-family:monospace; font-weight:bold; font-size:1.1rem;">${run.time}</span>
                </div>`;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (e) { 
        console.error("Błąd ładowania kategorii:", e); 
    }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// --- AUTORSKI SKIN CREATOR (PIXEL ART) ---
function initPixelEditor() {
    const grid = document.getElementById('pixel-grid');
    if (!grid || grid.children.length > 0) return;

    // Tworzymy siatkę 32x32 (1024 pixele)
    for (let i = 0; i < 1024; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        
        // Malowanie pojedynczym kliknięciem
        pixel.addEventListener('mousedown', () => {
            pixel.style.backgroundColor = document.getElementById('colorPicker').value;
        });

        // Malowanie przez przeciąganie (hold and drag)
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

// --- PLAYERS SECTION ---
function renderPlayers(players) {
    const container = document.getElementById('players-container');
    if (!container) return;

    container.innerHTML = players.map(p => `
        <div class="player-card" style="background:#21262d; padding:15px; border-radius:10px; text-align:center; border:1px solid #30363d;">
            <img src="https://mc-heads.net/avatar/${p.name}" style="width:48px; border-radius:4px;">
            <p style="margin: 10px 0 5px 0;"><strong>${p.name}</strong></p>
            <small style="color:#7ca352; font-weight:bold; text-transform:uppercase;">${p.rank}</small>
        </div>
    `).join('');
}

function filterPlayers() {
    const val = document.getElementById('playerSearch').value.toLowerCase();
    const filtered = playersDatabase.filter(p => p.name.toLowerCase().includes(val));
    renderPlayers(filtered);
}

// --- STAFF SECTION ---
function loadStaff() {
    const staff = [
        { name: "Ewewerban", role: "Owner" },
        { name: "2nec", role: "Helper" },
        { name: "kaktus_1", role: "Helper" }
    ];
    const container = document.getElementById('staff-container');
    if (container) {
        container.innerHTML = staff.map(s => `
            <div class="rank-row" style="padding:15px; background:#1c2128; margin-bottom:10px; border-radius:10px; display:flex; align-items:center;">
                <img src="https://mc-heads.net/avatar/${s.name}" style="width:32px; margin-right:15px;">
                <strong>${s.name}</strong><span style="margin-left:10px; color:#8b949e;">- ${s.role}</span>
            </div>
        `).join('');
    }
}

// --- MODAL DODAWANIA ---
function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
