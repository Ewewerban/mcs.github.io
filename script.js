function showPage(pageId) {
    // Ukryj wszystkie sekcje
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    // Odznacz wszystkie przyciski
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Pokaż wybraną sekcję
    document.getElementById(pageId).style.display = 'block';
    // Aktywuj kliknięty przycisk
    event.currentTarget.classList.add('active');
}
