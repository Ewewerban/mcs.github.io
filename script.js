function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(view => view.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    
    // Resetuj aktywne klasy w menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');

    if (sectionId === 'categories') document.getElementById('ranking-view').style.display = 'none';
    if (sectionId === 'staff') loadStaff();
}

async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        let html = `
            <div style="margin-bottom: 20px;">
                <button onclick="goBack()" style="background:#30363d; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">← Powrót</button>
                <h1 style="display:inline; margin-left:20px;">Best of ${data.categoryName}</h1>
            </div>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            let rankClass = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
            html += `
                <div class="rank-row ${rankClass}">
                    <span style="width:25px;">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head">
                    <strong class="p-name">${run.name}</strong>
                    <span>${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span class="p-time">${run.time}</span>
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

function loadStaff() {
    const staff = [
        { name: "Ewewerban", role: "Owner" },
        { name: "2nec", role: "Helper" },
        { name: "kaktus_1", role: "Helper" }
    ];
    let html = '<div style="display:grid; gap:10px;">';
    staff.forEach(s => {
        html += `<div class="rank-row"><img src="https://mc-heads.net/avatar/${s.name}" class="p-head"><strong>${s.name}</strong> - ${s.role}</div>`;
    });
    document.getElementById('staff-container').innerHTML = html + '</div>';
}

function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
