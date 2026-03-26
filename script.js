// --- PLAYLISTA ---
const playlist = [
    { name: "Pigstep", author: "Lena Raine", file: "music/pigstep.mp3", img: "https://minecraft.wiki/images/Music_Disc_Pigstep_JE1_BE1.png" },
    { name: "Otherside", author: "Lena Raine", file: "music/otherside.mp3", img: "https://minecraft.wiki/images/Music_Disc_Otherside_JE2_BE2.png" },
    { name: "5", author: "Samuel Åberg", file: "music/5.mp3", img: "https://minecraft.wiki/images/Music_Disc_5_JE1_BE1.png" }
];

let currentTrackIndex = 0;
let isPlaying = false;

const audio = document.getElementById('bg-music');
const discImg = document.getElementById('disc-img');
const playBtn = document.getElementById('play-btn');
const trackName = document.querySelector('.track-name');
const trackAuthor = document.querySelector('.track-author');

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.file;
    discImg.src = track.img;
    trackName.innerText = track.name;
    trackAuthor.innerText = track.author;
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        discImg.style.animationPlayState = 'paused';
    } else {
        audio.play().catch(e => console.log("Kliknij na stronę najpierw"));
        playBtn.innerText = '⏸';
        discImg.style.animationPlayState = 'running';
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

audio.onended = nextTrack;
loadTrack(currentTrackIndex);

// --- NAWIGACJA ---
function showSection(sectionId) {
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    if(document.getElementById('ranking-view')) document.getElementById('ranking-view').style.display = 'none';
    
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');
}

async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        const rv = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rv.style.display = 'block';

        const sorted = data.runs.sort((a, b) => a.time.localeCompare(b.time));
        let html = `<button onclick="goBack()" class="action-btn">← Back</button><h1>${data.categoryName}</h1>`;
        
        sorted.forEach((run, i) => {
            const rank = i + 1;
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank + ".";
            html += `
                <div class="rank-row" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-top:10px; border-radius:8px; border-left: 4px solid ${rank <= 3 ? '#7ca352' : 'transparent'}">
                    <span style="width:40px; font-weight:bold;">${medal}</span>
                    <img src="https://mc-heads.net/avatar/${run.name}/32" style="margin-right:15px;">
                    <strong style="flex-grow:1;">${run.name}</strong>
                    <span style="color:#58a6ff;">${run.time}</span>
                </div>`;
        });
        rv.innerHTML = html;
    } catch (e) { console.error(e); }
}

function goBack() {
    document.getElementById('ranking-view').style.display = 'none';
    document.getElementById('categories-section').style.display = 'block';
}

function openModal() { document.getElementById('addModal').style.display = 'flex'; }
function closeModal() { document.getElementById('addModal').style.display = 'none'; }
