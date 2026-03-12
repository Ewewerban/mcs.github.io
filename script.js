async function loadCategory(fileName) {
    try {
        // 1. Pobieranie pliku z folderu data/
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();

        // 2. Automatyczne sortowanie po czasie (rosnąco)
        const sortedRuns = data.runs.sort((a, b) => a.time.localeCompare(b.time));

        // 3. Ukrywamy kafelki wyboru
        document.getElementById('category-section').style.display = 'none';

        // 4. Przygotowanie miejsca na ranking
        const display = document.getElementById('ranking-display');
        
        let html = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                <button onclick="location.reload()" style="background: none; border: 1px solid #555; color: white; cursor: pointer; padding: 5px 10px; border-radius: 5px;">← Powrót</button>
                <h1>Best of ${data.categoryName}</h1>
                <img src="${data.icon}" width="40">
            </div>
            <div class="ranking-list">
        `;

        // 5. Budowanie wierszy dla każdego gracza
        sortedRuns.forEach((run, index) => {
            const rank = index + 1;
            let rankClass = "";
            if (rank === 1) rankClass = "top-1";
            else if (rank === 2) rankClass = "top-2";
            else if (rank === 3) rankClass = "top-3";

            html += `
                <div class="rank-row ${rankClass}">
                    <span style="width: 25px; font-weight: bold;">${rank}.</span>
                    <img src="https://mc-heads.net/avatar/${run.name}" class="p-head">
                    <strong style="flex-grow: 1;">${run.name}</strong>
                    <span title="${run.platform}">${run.platform === 'Java' ? '☕' : '📱'}</span>
                    <span class="p-time">${run.time}</span>
                </div>
            `;
        });

        html += `</div>`;
        display.innerHTML = html;

    } catch (error) {
        console.error("Błąd ładowania:", error);
        alert("Nie znaleziono pliku: data/" + fileName + ".json");
    }
}
