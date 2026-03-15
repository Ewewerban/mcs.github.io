// --- NAVIGATION ---
function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    
    const target = document.getElementById(sectionId + '-section');
    if (target) target.style.display = 'block';

    const rankingView = document.getElementById('ranking-view');
    if (rankingView) rankingView.style.display = 'none';
}

// --- LEADERBOARD LOGIC ---
async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        // Sorting: fastest time first
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        let html = `
            <button onclick="goBack()" class="action-btn" style="margin-bottom:20px;">← Back</button>
            <h1>${data.categoryName}</h1>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            
            // Podium Styling
            let medal = "";
            let rowStyle = "";
            if (rank === 1) { medal = "🥇"; rowStyle = "border-left: 4px solid #ffd700; background: rgba(255, 215, 0, 0.05);"; }
            if (rank === 2) { medal = "🥈"; rowStyle = "border-left: 4px solid #c0c0c0; background: rgba(192, 192, 192, 0.05);"; }
            if (rank === 3) { medal = "🥉"; rowStyle = "border-left: 4px solid #cd7f32; background: rgba(205, 127, 50, 0.05);"; }

            html += `
                <div class="rank-row" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px; ${rowStyle}">
                    <span style="width:40px; font-weight:bold; color:#8b949e;">${medal || rank + '.'}</span>
                    <img src="https://mc-heads.net/avatar/${run.name}/32" style="width:32px; height:32px; border-radius:4px; margin-right:15px;">
                    <strong style="flex-grow:1;">${run.name}</strong>
                    <span style="color:#58a6ff; font-family:monospace; font-weight:bold;">${run.time}</span>
                </div>`;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (e) { 
        console.error("Error loading category:", e); 
    }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

// --- MODAL FUNCTIONS ---
function openModal() { document.getElementById('addModal').style.display = "flex"; }
function closeModal() { document.getElementById('addModal').style.display = "none"; }
