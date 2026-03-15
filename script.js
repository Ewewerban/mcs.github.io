async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        
        const rankingView = document.getElementById('ranking-view');
        document.getElementById('categories-section').style.display = 'none';
        rankingView.style.display = 'block';

        // Sortowanie rekordów
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        let html = `
            <button onclick="goBack()" class="back-btn" style="margin-bottom:20px; padding:8px 15px; cursor:pointer; background:#30363d; color:white; border:none; border-radius:5px;">← Powrót</button>
            <h1 style="margin-bottom:30px;">${data.categoryName}</h1>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            
            // Kolory dla TOP 3
            let rankStyle = "";
            let medal = "";
            if (rank === 1) { rankStyle = "border-left: 4px solid #ffd700; background: rgba(255, 215, 0, 0.05);"; medal = "🥇 "; }
            if (rank === 2) { rankStyle = "border-left: 4px solid #c0c0c0; background: rgba(192, 192, 192, 0.05);"; medal = "🥈 "; }
            if (rank === 3) { rankStyle = "border-left: 4px solid #cd7f32; background: rgba(205, 127, 50, 0.05);"; medal = "🥉 "; }

            html += `
                <div class="rank-row" style="display:flex; align-items:center; background:#1c2128; padding:15px; margin-bottom:8px; border-radius:8px; ${rankStyle}">
                    <span style="width:40px; font-weight:bold; color:#8b949e;">${medal}${rank}.</span>
                    
                    <img src="https://mc-heads.net/avatar/${run.name}/32" 
                         style="width:32px; height:32px; border-radius:4px; margin-right:15px; image-rendering: pixelated;" 
                         alt="${run.name}">
                    
                    <strong style="flex-grow:1; font-size:1.1rem;">${run.name}</strong>
                    
                    <span style="margin-right:20px; opacity:0.7;">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    
                    <span style="color:#58a6ff; font-family:monospace; font-weight:bold; font-size:1.1rem;">${run.time}</span>
                </div>`;
        });

        rankingView.innerHTML = html + "</div>";
    } catch (e) { 
        console.error("Błąd ładowania:", e); 
        alert("Nie udało się załadować rankingu. Sprawdź czy plik JSON jest w folderze data.");
    }
}
