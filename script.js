// --- 1. PLAYLISTA (Stabilne linki MP3) ---
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
        img: "https://minecraft.wiki/w/Music_Disc_otherside#/media/File:Music_Disc_otherside_JE1_BE1.png" 
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

// --- 2. FUNKCJE ODTWARZACZA ---

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
        // Próba odtworzenia z obsługą blokady przeglądarki
        audio.play().then(() => {
            playBtn.innerText = '⏸';
            if (discImg) discImg.style.animationPlayState = 'running';
            isPlaying = true;
        }).catch(error => {
            console.log("Blokada autoplay. Kliknij coś na stronie najpierw.");
            // Nie zmieniamy ikony, czekamy na interakcję
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

// --- 3. LOGIKA STRONY I KATEGORII (Tego brakowało!) ---

function showSection(id) {
    // Ukryj wszystkie sekcje
    document.querySelectorAll('.content-view').forEach(v => v.style.display = 'none');
    
    // Pokaż wybraną sekcję
    const target = document.getElementById(id + '-section');
    if (target) target.style.display = 'block';
    
    // Ukryj widok rankingu jeśli wracamy do wyboru kategorii
    if(id === 'categories') {
        const rv = document.getElementById('ranking-view');
        if (rv) rv.style.display = 'none';
    }

    // Zmień aktywny przycisk w menu
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
        rv.innerHTML = `<button onclick="showSection('categories')" class="add-run-btn" style="width:100px; margin-bottom:20px;">← Back</button><h1>Loading...</h1>`;
    }

    try {
        // Upewnij się, że pliki .json są w folderze /data/
        const response = await
