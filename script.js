// --- KONFIGURACJA I DANE ---

// Baza danych graczy dla sekcji "Players"
const playersDatabase = [
    { name: "Marlowww", runs: 12, rank: "Cheater" },
    { name: "Ewewerban", runs: 5, rank: "Owner" },
    { name: "2rec", runs: 8, rank: "Helper" },
    { name: "kaktus__1", runs: 3, rank: "Helper" },
    { name: "Milesek", runs: 2, rank: "Player" },
    { name: "Camman18YT", runs: 1, rank: "Player" }
];

// --- NAWIGACJA ---

function showSection(sectionId) {
    // Ukryj wszystkie sekcje i widok rankingu
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById('ranking-view').style.display = 'none';

    // Pokaż wybraną sekcję
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Zarządzanie klasą "active" w menu bocznym
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + sectionId);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    // Specyficzne akcje dla sekcji
    if (sectionId === 'staff') loadStaff();
    if (sectionId === 'players') renderPlayers(playersDatabase);
}

// --- RANKINGI (SPEEDRUNS) ---

async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        if (!response.ok) throw new Error('Nie znaleziono pliku JSON');
        
        const data = await response.json();

        // Automatyczne sortowanie rekordów (od najkrótszego czasu)
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        // Przewiń na górę (ważne na telefonach)
        window.scrollTo({ top: 0, behavior: 'smooth' });

        let html = `
            <div class="header-row" style="margin-bottom: 25px;">
                <button onclick="goBack()" class="back-btn" style="background:#30363d; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">← Powrót</button>
                <h1 style="display:inline-block; margin-left:20px;">Best of ${data.categoryName}</h1>
            </div>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            let rankClass = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
            
            // Wybór ikonki platformy
            const platformIcon = run.platform === 'Java' ? '☕' : '📱';

            html += `
                <div class="rank-row ${rankClass}">
                    <span class="rank-num" style="width:30px; font-weight:bold; color:var(--text-dim);">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head" style="width:32px; height:32px; border-radius:4px;">
                    <strong class="p-name" style="flex-grow:1; margin-left:10px;">${run.name}</strong>
                    <span class="p-platform" title="${run.platform}" style="margin-right:20px; font-size:1.2rem;">${platformIcon}</span>
                    <span class="p-time" style="font-family: monospace; font-weight:bold; color:#58a6ff; font-size:1.1rem;">${run.time}</span>
                </div>
            `;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (e) {
        console.error("Błąd ładowania kategorii:", e);
        alert("Wystąpił błąd podczas ładowania danych. Sprawdź konsolę (F12).");
    }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// --- SEKCJA PLAYERS (WYSZUKIWARKA) ---

function renderPlayers(players) {
    const container = document.getElementById('players-container') || document.getElementById('players-grid');
    if (!container) return;
    
    container.innerHTML = "";
    
    if (players.length === 0) {
        container.innerHTML = "<p style='color:var(--text-dim);'>Nie znaleziono takiego gracza...</p>";
        return;
    }

    players.forEach(player => {
        container.innerHTML += `
            <div class="player-card" style="background:var(--card-bg); padding:20px; border-radius:12px; text-align:center; border:1px solid #30363d;">
                <img src="https://mc-heads.net/avatar/${player.name}" style="width:64px; height:64px; margin-bottom:10px; image-rendering: pixelated;">
                <div style="display:flex; flex-direction:column;">
                    <strong style="font-size:1.1rem;">${player.name}</strong>
                    <span style="color:var(--accent-green); font-size:0.8rem; font-weight:bold; text-transform:uppercase;">${player.rank}</span>
                    <span style="color:var(--text-dim); font-size:0.9rem; margin-top:5px;">Rekordy: ${player.runs}</span>
                </div>
            </div>
        `;
    });
}

function filterPlayers() {
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    const filtered = playersDatabase.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderPlayers(filtered);
}

// --- SEKCJA STAFF ---

function loadStaff() {
    const staffData = [
        { name: "Ewewerban", role: "Owner, CEO", flag: "🇵🇱" },
        { name: "2nec", role: "Helper", flag: "🇵🇱" },
        { name: "kaktus_1", role: "Helper", flag: "🇵🇱" }
    ];

    const container = document.getElementById('staff-container');
    if (!container) return;

    let html = '<div style="display:grid; gap:15px; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">';
    staffData.forEach(member => {
        html += `
            <div class="rank-row" style="background:var(--side-bg); border:1px solid #30363d;">
                <img src="https://mc-heads.net/avatar/${member.name}" class="p-head" style="width:40px; height:40px;">
                <div style="display:flex; flex-direction:column; flex-grow:1; margin-left:15px;">
                    <strong>${member.name}</strong>
                    <span style="font-size:0.8rem; color:var(--text-dim);">${member.role}</span>
                </div>
                <span>${member.flag}</span>
            </div>
        `;
    });
    container.innerHTML = html + '</div>';
}

// --- MODAL (OKNO DODAWANIA) ---

function openModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = "none";
}

// Zamknij modal po kliknięciu poza nim
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target == modal) {
        closeModal();
    }
};
