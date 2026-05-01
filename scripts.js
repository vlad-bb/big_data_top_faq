function selectLevel(level) {
    clearSearch();
    document.getElementById('level-cards').style.display = 'none';
    document.getElementById('questions-container').style.display = 'block';

    const lists = document.querySelectorAll('.question-list');
    lists.forEach(list => list.classList.remove('active'));
    document.getElementById(level + '-questions').classList.add('active');

    const titles = {
        'junior': '🎓 Junior',
        'middle': '🎩 Middle',
        'senior': '👑 Senior'
    };
    document.getElementById('current-level-title').innerText = titles[level];
}

function goBack() {
    clearSearch();
    document.getElementById('level-cards').style.display = 'grid';
    document.getElementById('questions-container').style.display = 'none';
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').style.display = 'none';
}

function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function runSearch(query) {
    const levelCards = document.getElementById('level-cards');
    const questionsContainer = document.getElementById('questions-container');
    const searchResults = document.getElementById('search-results');
    const resultsList = document.getElementById('search-results-list');
    const countEl = document.getElementById('search-count');

    if (!query) {
        searchResults.style.display = 'none';
        // Restore whichever view was active before search
        if (questionsContainer.dataset.wasVisible === 'true') {
            questionsContainer.style.display = 'block';
        } else {
            levelCards.style.display = 'grid';
        }
        return;
    }

    // Remember which view to restore when search is cleared
    if (searchResults.style.display === 'none') {
        questionsContainer.dataset.wasVisible = questionsContainer.style.display === 'block' ? 'true' : 'false';
    }

    levelCards.style.display = 'none';
    questionsContainer.style.display = 'none';
    searchResults.style.display = 'block';

    const levelLabels = { junior: 'Junior', middle: 'Middle', senior: 'Senior' };
    const lowerQuery = query.toLowerCase();

    resultsList.innerHTML = '';
    let count = 0;

    ['junior', 'middle', 'senior'].forEach(level => {
        const items = document.querySelectorAll(`#${level}-questions .faq-item`);
        items.forEach(item => {
            const questionEl = item.querySelector('.faq-question');
            const answerEl = item.querySelector('.answer-content');
            const questionText = questionEl.innerText;
            const answerText = answerEl.innerText;

            if (
                questionText.toLowerCase().includes(lowerQuery) ||
                answerText.toLowerCase().includes(lowerQuery)
            ) {
                count++;

                const clone = item.cloneNode(true);
                clone.classList.remove('active');

                // Inject level badge into question button
                const btn = clone.querySelector('.faq-question');
                const icon = btn.querySelector('.toggle-icon');
                const rawText = questionEl.childNodes[0].textContent.trim();
                btn.innerHTML = '';

                const badge = document.createElement('span');
                badge.className = 'level-badge';
                badge.textContent = levelLabels[level];

                const textSpan = document.createElement('span');
                textSpan.innerHTML = highlight(rawText, query);
                textSpan.style.flex = '1';

                const newIcon = document.createElement('span');
                newIcon.className = 'toggle-icon';
                newIcon.textContent = '+';

                btn.appendChild(badge);
                btn.appendChild(textSpan);
                btn.appendChild(newIcon);

                // Highlight answer
                const answerContent = clone.querySelector('.answer-content');
                answerContent.innerHTML = highlight(answerContent.innerHTML, query);

                // Accordion for the clone
                btn.addEventListener('click', () => {
                    const isActive = clone.classList.contains('active');
                    clone.classList.toggle('active', !isActive);
                });

                resultsList.appendChild(clone);
            }
        });
    });

    countEl.textContent = count === 0
        ? 'Нічого не знайдено'
        : `Знайдено: ${count} ${count === 1 ? 'питання' : count < 5 ? 'питання' : 'питань'}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Accordion for main question lists
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => runSearch(searchInput.value.trim()), 200);
    });
});
