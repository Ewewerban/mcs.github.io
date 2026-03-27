// --- MUSIC PLAYER LOGIC ---
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
    if (audio) {
        audio.src = track.file;
        audio.load();
    }
    if (discImg) discImg.src = track.img;
    if (trackNameDisplay) trackNameDisplay.innerText = track.name;
    if (trackAuthorDisplay) trackAuthorDisplay.innerText = track.author;
}

function toggleMusic() {
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
        }).catch(error => {
            console.log("Autoplay blocked. Click the page first.");
            playBtn.innerText = '▶';
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

// --- NAVIGATION & SIDEBAR LOGIC (Tego brakowało!) ---

function showSection(id) {
    // Ukrywa wszystkie widoki
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    
    // Pokazuje wybrany widok
    const target = document.getElementById(id + '-section');
    if (target) target.style.display = 'block';
    
    // Jeśli wracamy do kategorii, ukrywamy widok rankingu
    if(id === 'categories') {
        const rv = document.getElementById('ranking-view');
        if (rv) rv.style.display = 'none';
    }

    // Aktualizacja aktywnej klasy w menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + id);
    if (activeNav) activeNav.classList.add('active');
}

// Inicjalizacja
loadTrack(currentTrackIndex);
