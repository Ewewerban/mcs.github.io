function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    if (sectionId === 'categories') document.getElementById('ranking-view').style.display = 'none';
    if (sectionId === 'staff') loadStaff();
}

async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        // Automatyczne sortowanie czasu
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        let html = `
            <div class="header-row">
                <button onclick="goBack()" class="back-btn">← Powrót</button>
                <h1>Best of ${data.categoryName}</h1>
            </div>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            // Kolorowe paski dla podium
            let rankClass = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";

            html += `
                <div class="rank-row ${rankClass}">
                    <span class="rank-num">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head">
                    <strong class="p-name">${run.name}</strong>
                    <span class="p-platform">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span class="p-time">${run.time}</span>
                </div>
            `;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (e) { console.error("Błąd ładowania danych:", e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function loadStaff() {
    const staffData = [
        { name: "Ewewerban", role: "Owner, CEO", flag: "🇵🇱" },
        { name: "2nec", role: "Helper", flag: "🇵🇱" },
        { name: "kaktus_1", role: "Helper", flag: "🇵🇱" }
    ];
    let html = "";
    staffData.forEach(m => {
        html += `<div class="staff-card"><img src="https://mc-heads.net/avatar/${m.name}" class="p-head"><div class="staff-info"><strong>${m.name}</strong><span>${m.role}</span></div><span class="staff-flag">${m.flag}</span></div>`;
    });
    document.getElementById('staff-container').innerHTML = html;
}

function openModal() { document.getElementById('addModal').style.display = "block"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
