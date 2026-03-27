// Official Spotify Track IDs
const tracks = [
    "1q9696vI396906uS9Y0Y67", // Pigstep
    "7m6S667YxV9R8fP37Jt0S0", // Otherside
    "3f7m667YxV9R8fP37Jt0S0"  // Music Disc 5
];

let currentTrackIndex = 0;

function changeTrack(direction) {
    currentTrackIndex += direction;
    if (currentTrackIndex >= tracks.length) currentTrackIndex = 0;
    if (currentTrackIndex < 0) currentTrackIndex = tracks.length - 1;
    
    const widget = document.getElementById('spotify-widget');
    const newId = tracks[currentTrackIndex];
    widget.src = `https://open.spotify.com/embed/track/${newId}?utm_source=generator&theme=0`;
}

function showSection(id) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    document.getElementById(id + '-section').style.display = 'block';
    if(id === 'categories') document.getElementById('ranking-view').style.display = 'none';
    
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + id).classList.add('active');
}

async function loadCategory(name) {
    const rv = document.getElementById('ranking-view');
    document.getElementById('categories-section').style.display = 'none';
    rv.style.display = 'block';
    
    // Placeholder loading state
    rv.innerHTML = `
        <button onclick="showSection('categories')" class="add-run-btn" style="width:120px; margin-bottom:20px;">← Back</button>
        <h1>${name.replace('-', ' ').toUpperCase()} Leaderboard</h1>
        <p>Loading world records...</p>
    `;

    try {
        const response = await fetch(`data/${name}.json`);
        const data = await response.json();
        const sorted = data.runs.sort((a, b) => a.time.localeCompare(b.time));
        
        let html = `<button onclick="showSection('categories')" class="add-run-btn" style="width:120px; margin-bottom:20px;">← Back</button>
                    <h1>${data.categoryName}</h1>`;
        
        sorted.forEach((run, i) => {
            const rank = i + 1;
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank + ".";
            html += `
                <div class="rank-row" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-top:10px; border-radius:8px; border-left: 4px solid ${rank <= 3 ? '#7ca352' : 'transparent'}">
                    <span style="width:40px; font-weight:bold;">${medal}</span>
                    <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:15px; border-radius:4px;">
                    <strong style="flex-grow:1;">${run.name}</strong>
                    <span style="color:#58a6ff; font-weight:bold;">${run.time}</span>
                </div>`;
        });
        rv.innerHTML = html;
    } catch (e) {
        rv.innerHTML += `<p style="color:red;">Error loading leaderboard data.</p>`;
    }
}

function openModal() { document.getElementById('addModal').style.display = 'flex'; }
function closeModal() { document.getElementById('addModal').style.display = 'none'; }
