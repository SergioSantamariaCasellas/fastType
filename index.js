const languageBtns = document.querySelectorAll('.language-btn');

languageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedLang = btn.dataset.lang;
        window.location.href = `game.html?lang=${selectedLang}`;
    });
});
