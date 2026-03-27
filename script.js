// STABLE PLAYLIST
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
    audio.src = track.file;
    discImg.src = track.img;
    trackNameDisplay.innerText = track.name;
    trackAuthorDisplay.innerText = track.author;
    audio.load(); // Wymuszamy załadowanie nowego źródła
}

// TA FUNKCJA MUSI ZADZIAŁAĆ
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        if (discImg) discImg.style.animationPlayState = 'paused';
        isPlaying = false;
    } else {
        // Próba odtworzenia
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.innerText = '⏸';
                if (discImg) discImg.style.animationPlayState = 'running';
                isPlaying = true;
            }).catch(error => {
                console.log("Autoplay blocked. Try clicking a menu item first.");
                // Nie zmieniamy ikonki na wyciszenie, zostawiamy Play
                playBtn.innerText = '▶';
                isPlaying = false;
            });
        }
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    // Jeśli grało wcześniej, próbujemy odpalić nową piosenkę
    if (isPlaying) {
        audio.play().catch(() => isPlaying = false);
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(() => isPlaying = false);
    }
}

// Initial load
loadTrack(currentTrackIndex);
