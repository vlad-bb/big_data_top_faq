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
    // Bug 3 fix: clear active level so DOM state accurately reflects level-cards view
    document.querySelectorAll('.question-list').forEach(list => list.classList.remove('active'));
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').style.display = 'none';
}

// Bug 2 fix: correct Ukrainian pluralization using mod10/mod100 rules
function pluralize(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return 'питань';
    if (mod10 === 1) return 'питання';
    if (mod10 >= 2 && mod10 <= 4) return 'питання';
    return 'питань';
}

// Bug 1 fix: XSS-safe highlight using TreeWalker to operate only on text nodes
function highlightNode(container, query) {
    if (!query) return;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!regex.test(text)) return;
        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            const mark = document.createElement('mark');
            mark.textContent = match[1];
            fragment.appendChild(mark);
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

function runSearch(query) {
    const levelCards = document.getElementById('level-cards');
    const questionsContainer = document.getElementById('questions-container');
    const searchResults = document.getElementById('search-results');
    const resultsList = document.getElementById('search-results-list');
    const countEl = document.getElementById('search-count');

    if (!query) {
        searchResults.style.display = 'none';
        // Bug 3 fix: derive which view to restore from DOM state (active question-list)
        // instead of relying on a cached dataset flag that can desync across navigation.
        if (document.querySelector('.question-list.active')) {
            questionsContainer.style.display = 'block';
        } else {
            levelCards.style.display = 'grid';
        }
        return;
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
            const questionText = questionEl.textContent;
            const answerText = answerEl.textContent;

            if (
                questionText.toLowerCase().includes(lowerQuery) ||
                answerText.toLowerCase().includes(lowerQuery)
            ) {
                count++;

                const clone = item.cloneNode(true);
                clone.classList.remove('active');

                // Inject level badge into question button
                const btn = clone.querySelector('.faq-question');
                const rawText = questionEl.childNodes[0].textContent.trim();
                btn.innerHTML = '';

                const badge = document.createElement('span');
                badge.className = 'level-badge';
                badge.textContent = levelLabels[level];

                const textSpan = document.createElement('span');
                textSpan.textContent = rawText;
                textSpan.style.flex = '1';

                const newIcon = document.createElement('span');
                newIcon.className = 'toggle-icon';
                newIcon.textContent = '+';

                btn.appendChild(badge);
                btn.appendChild(textSpan);
                btn.appendChild(newIcon);

                // Bug 1 fix: highlight text nodes only, never touch HTML attributes or tags
                highlightNode(textSpan, query);
                const answerContent = clone.querySelector('.answer-content');
                highlightNode(answerContent, query);

                // Accordion for the clone
                btn.addEventListener('click', () => {
                    clone.classList.toggle('active');
                });

                resultsList.appendChild(clone);
            }
        });
    });

    // Bug 2 fix: use correct Ukrainian pluralization
    countEl.textContent = count === 0
        ? 'Нічого не знайдено'
        : `Знайдено: ${count} ${pluralize(count)}`;
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
