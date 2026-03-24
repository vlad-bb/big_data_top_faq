function selectLevel(level) {
    // Hide the cards
    document.getElementById('level-cards').style.display = 'none';
    
    // Show the questions container
    document.getElementById('questions-container').style.display = 'block';
    
    // Hide all question lists
    const lists = document.querySelectorAll('.question-list');
    lists.forEach(list => list.classList.remove('active'));
    
    // Show the selected level's question list
    document.getElementById(level + '-questions').classList.add('active');
    
    // Update the title
    const titles = {
        'junior': '🎓 Junior',
        'middle': '🎩 Middle',
        'senior': '👑 Senior'
    };
    document.getElementById('current-level-title').innerText = titles[level];
}

function goBack() {
    // Show cards
    document.getElementById('level-cards').style.display = 'grid';
    
    // Hide questions container
    document.getElementById('questions-container').style.display = 'none';
    
    // Close any open accordions
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const isCurrentlyActive = currentItem.classList.contains('active');
            
            // Toggle the active state for the clicked item
            if (isCurrentlyActive) {
                currentItem.classList.remove('active');
            } else {
                currentItem.classList.add('active');
            }
        });
    });
});
