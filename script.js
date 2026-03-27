// --- 1. PLAYLISTA ---
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

function loadTrack(index) {
    const track = playlist[index];
    if (audio) { audio.src = track.file; audio.load(); }
    if (discImg) discImg.src = track.img;
    if (trackNameDisplay) trackNameDisplay.innerText = track.name;
    if (trackAuthorDisplay) trackAuthorDisplay.innerText = track.author;
}

function toggleMusic() {
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        if (discImg) discImg.style.animationPlayState = 'paused';
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playBtn.innerText = '⏸';
            if (discImg) discImg.style.animationPlayState = 'running';
            isPlaying = true;
        }).catch(e => {
            console.log("Autoplay blocked. User needs to interact first.");
        });
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play().catch(() => {});
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play().catch(() => {});
}

// --- 2. NAWIGACJA I KATEGORIE ---
function showSection(id) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(id + '-section');
    if (target) target.style.display = 'block';
    
    if(id === 'categories') {
        const rv = document.getElementById('ranking-view');
        if (rv) rv.style.display = 'none';
    }
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + id);
    if (activeNav) activeNav.classList.add('active');
}

async function loadCategory(name) {
    const rv = document.getElementById('ranking-view');
    const catSection = document.getElementById('categories-section');
    if (catSection) catSection.style.display = 'none';
    if (rv) {
        rv.style.display = 'block';
        rv.innerHTML = `<button onclick="showSection('categories')" class="add-run-btn">← Back</button><h1>Loading...</h1>`;
    }
    try {
        const response = await fetch(`data/${name}.json`);
        const data = await response.json();
        const sorted = data.runs.sort((a, b) => a.time.localeCompare(b.time));
        let html = `<button onclick="showSection('categories')" class="add-run-btn">← Back</button><h1>${data.categoryName}</h1>`;
        sorted.forEach((run, i) => {
            const rank = i + 1;
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank + ".";
            html += `<div class="rank-row"><span>${medal}</span><strong>${run.name}</strong><span>${run.time}</span></div>`;
        });
        if (rv) rv.innerHTML = html;
    } catch (e) { console.error(e); }
}

// Inicjalizacja
if (audio) {
    audio.onended = nextTrack;
    loadTrack(currentTrackIndex);
}
