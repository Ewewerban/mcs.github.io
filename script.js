// Główna funkcja przełączania sekcji (Speedruns / Players / Staff)
function showSection(sectionId) {
    // Ukrywamy wszystkie widoki
    document.querySelectorAll('.content-view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Pokazujemy wybraną sekcję
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Resetujemy widok rankingu, jeśli wracamy do kategorii
    if (sectionId === 'categories') {
        document.getElementById('ranking-view').style.display = 'none';
    }

    // Jeśli kliknięto Staff, ładujemy dane
    if (sectionId === 'staff') {
        loadStaff();
    }
}

// Ładowanie i automatyczne sortowanie rankingu
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        
        // SORTOWANIE: Od najniższego czasu do najwyższego
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        const rankingView = document.getElementById('ranking-view');
        const categoriesSection = document.getElementById('categories-section');

        // Przełączanie widoku na ranking
        categoriesSection.style.display = 'none';
        rankingView.style.display = 'block';

        let html = `
            <div class="header-row">
                <button onclick="goBack()" class="back-btn">← Powrót</button>
                <h1>Best of ${data.categoryName}</h1>
                <img src="${data.icon}" class="category-icon-large">
            </div>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            // Nadawanie klas dla podium (Top 1, 2, 3)
            let rankClass = "";
            if (rank === 1) rankClass = "top-1";
            else if (rank === 2) rankClass = "top-2";
            else if (rank === 3) rankClass = "top-3";

            html += `
                <div class="rank-row ${rankClass}">
                    <span class="rank-num">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head">
                    <strong class="p-name">${run.name}</strong>
                    <span class="p-platform" title="${run.platform}">
                        ${run.platform === 'Java' ? '☕' : '📱'}
                    </span>
                    <span class="p-time">${run.time}</span>
                </div>
            `;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (error) {
        console.error("Błąd ładowania:", error);
        alert("Nie udało się załadować kategorii. Sprawdź plik JSON.");
    }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// Sekcja Staff (na podstawie Twojego rysunku)
function loadStaff() {
    const staffData = [
        { name: "Ewewerban", role: "Owner, CEO", flag: "🇵🇱" },
        { name: "2nec", role: "Helper", flag: "🇵🇱" },
        { name: "kaktus_1", role: "Helper", flag: "🇵🇱" }
    ];

    let html = "";
    staffData.forEach(member => {
        html += `
            <div class="staff-card">
                <img src="https://mc-heads.net/avatar/${member.name}" class="p-head">
                <div class="staff-info">
                    <strong>${member.name}</strong>
                    <span>${member.role}</span>
                </div>
                <span class="staff-flag">${member.flag}</span>
            </div>
        `;
    });
    document.getElementById('staff-container').innerHTML = html;
}

// Obsługa okna "Dodaj Speedrun"
function openModal() { document.getElementById('addModal').style.display = "block"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }

// Zamknij modal po kliknięciu poza nim
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target == modal) { closeModal(); }
}
