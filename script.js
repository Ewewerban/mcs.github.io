async function loadCategory(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();

        // Sortowanie czasu
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        // PRZEŁĄCZANIE WIDOKU
        document.getElementById('category-section').style.display = 'none';
        const display = document.getElementById('ranking-display');
        display.style.display = 'block';
        
        // Czyścimy poprzednią treść i budujemy nową
        let html = `
            <div class="ranking-header">
                <button class="back-btn" onclick="goBack()">← Powrót</button>
                <h1>Best of ${data.categoryName}</h1>
                <img src="${data.icon}" class="category-icon-large">
            </div>
            <div class="ranking-list">
        `;

        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            let rankClass = "";
            if (rank === 1) rankClass = "top-1";
            else if (rank === 2) rankClass = "top-2";
            else if (rank === 3) rankClass = "top-3";

            html += `
                <div class="rank-row ${rankClass}">
                    <span class="rank-num">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head">
                    <strong class="p-name">${run.name}</strong>
                    <span class="p-platform">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span class="p-time">${run.time}</span>
                </div>
            `;
        });

        html += `</div>`;
        display.innerHTML = html;

    } catch (error) {
        console.error("Błąd:", error);
        alert("Błąd ładowania kategorii. Sprawdź czy plik data/" + fileName + ".json istnieje.");
    }
}

// Funkcja powrotu do kafelków
function goBack() {
    document.getElementById('ranking-display').style.display = 'none';
    document.getElementById('category-section').style.display = 'block';
}
