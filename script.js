// Database of tracks with stable MP3 links
const playlist = [
    { 
        name: "Pigstep", 
        author: "Lena Raine", 
        file: "https://vgmtreasurechest.com/soundtracks/minecraft-music-disc-pigstep/Pigstep.mp3", 
        img: "https://minecraft.wiki/images/Music_Disc_Pigstep_JE1_BE1.png" 
    },
    { 
        name: "Otherside", 
        author: "Lena Raine", 
        file: "https://vgmtreasurechest.com/soundtracks/minecraft-otherside/otherside.mp3", 
        img: "https://minecraft.wiki/images/Music_Disc_Otherside_JE2_BE2.png" 
    },
    { 
        name: "5", 
        author: "Samuel Åberg", 
        file: "https://vgmtreasurechest.com/soundtracks/minecraft-music-disc-5/5.mp3", 
        img: "https://minecraft.wiki/images/Music_Disc_5_JE1_BE1.png" 
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

const audio = document.getElementById('bg-music');
const discImg = document.getElementById('disc-img');
const playBtn = document.getElementById('play-btn');
const trackNameDisplay = document.querySelector('.track-name');
const trackAuthorDisplay = document.querySelector('.track-author');

// Initial load
function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.file;
    discImg.src = track.img;
    trackNameDisplay.innerText = track.name;
    trackAuthorDisplay.innerText = track.author;
}

// Fixed Toggle Function (No more annoying alerts!)
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        discImg.style.animationPlayState = 'paused';
        isPlaying = false;
    } else {
        // Obietnica (Play Promise)
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatyczne odtwarzanie wystartowało!
                playBtn.innerText = '⏸';
                discImg.style.animationPlayState = 'running';
                isPlaying = true;
            }).catch(error => {
                // Autoplay został zablokowany - to normalne
                console.log("Waiting for user interaction...");
                // Próbujemy jeszcze raz po krótkiej chwili lub zostajemy przy ikonie Play
                playBtn.innerText = '▶';
                isPlaying = false;
            });
        }
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

audio.onended = nextTrack;
loadTrack(currentTrackIndex);

// --- SIDEBAR & CONTENT LOGIC ---

function showSection(id) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    const targetSection = document.getElementById(id + '-section');
    if (targetSection) targetSection.style.display = 'block';
    
    if(id === 'categories') {
        const rankingView = document.getElementById('ranking-view');
        if (rankingView) rankingView.style.display = 'none';
    }

    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const navItem = document.getElementById('nav-' + id);
    if (navItem) navItem.classList.add('active');
}

async function loadCategory(name) {
    const rv = document.getElementById('ranking-view');
    const catSection = document.getElementById('categories-section');
    if (catSection) catSection.style.display = 'none';
    if (rv) {
        rv.style.display = 'block';
        rv.innerHTML = `<button onclick="showSection('categories')" class="add-run-btn" style="width:120px; margin-bottom:20px;">← Back</button>
                        <h1>Loading ${name.toUpperCase()}...</h1>`;
    }

    try {
        const response = await fetch(`data/${name}.json`);
        const data = await response.json();
        const sorted = data.runs.sort((a, b) => a.time.localeCompare(b.time));
        
        let html = `<button onclick="showSection('categories')" class="add-run-btn" style="width:100px; margin-bottom:20px;">← Back</button>
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
        if (rv) rv.innerHTML = html;
    } catch (e) {
        console.error("Failed to load leaderboard:", e);
    }
}

function openModal() { 
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'flex'; 
}

function closeModal() { 
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'none'; 
}
