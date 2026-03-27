const playlist = [
    { 
        name: "Pigstep", 
        author: "Lena Raine", 
        // To jest bezpośredni link do czystego pliku audio
        file: "https://minecraft.wiki/images/Music_Disc_Pigstep.ogg?20200417210419", 
        img: "https://minecraft.wiki/images/Music_Disc_Pigstep_JE1_BE1.png" 
    },
    { 
        name: "Otherside", 
        author: "Lena Raine", 
        file: "https://minecraft.wiki/images/Music_Disc_Otherside.ogg?20211020173000", 
        img: "https://minecraft.wiki/images/Music_Disc_Otherside_JE2_BE2.png" 
    },
    { 
        name: "5", 
        author: "Samuel Åberg", 
        file: "https://minecraft.wiki/images/Music_Disc_5.ogg?20220519170000", 
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
    audio.src = track.file;
    // Ważne: Image source stays as is, but index.html MUST have the meta tag
    discImg.src = track.img;
    trackNameDisplay.innerText = track.name;
    trackAuthorDisplay.innerText = track.author;
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        discImg.style.animationPlayState = 'paused';
    } else {
        // We use a promise to handle browsers blocking auto-play
        audio.play().then(() => {
            playBtn.innerText = '⏸';
            discImg.style.animationPlayState = 'running';
        }).catch(e => alert("Please click anywhere on the page first to enable audio!"));
        
    }
    isPlaying = !isPlaying;
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

// Auto-play next track
audio.onended = nextTrack;

// Initial Load
loadTrack(currentTrackIndex);

// --- NAVIGATION & LEADERBOARDS ---

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
        rv.innerHTML = html;
    } catch (e) {
        console.error("Error loading JSON:", e);
    }
}

function openModal() { document.getElementById('addModal').style.display = 'flex'; }
function closeModal() { document.getElementById('addModal').style.display = 'none'; }
