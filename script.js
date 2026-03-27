const playlist = [
    { 
        name: "Pigstep", 
        author: "Lena Raine", 
        file: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3", // Testowy plik MP3 (podmień na swój jeśli masz na dysku)
        img: "https://minecraft.wiki/images/Music_Disc_Pigstep_JE1_BE1.png" 
    },
    { 
        name: "Otherside", 
        author: "Lena Raine", 
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Testowy plik MP3
        img: "https://minecraft.wiki/images/Music_Disc_Otherside_JE2_BE2.png" 
    },
    { 
        name: "5", 
        author: "Samuel Åberg", 
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Testowy plik MP3
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
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        discImg.style.animationPlayState = 'paused';
    } else {
        audio.play().catch(e => console.log("Click the page first!"));
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

// Inicjalizacja
loadTrack(currentTrackIndex);
