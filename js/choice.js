// Choice Page - Verde Vista

document.addEventListener('DOMContentLoaded', function() {
    // Color mapping for item types
    const typeColors = {
        name: '#dcd6ce',   // warm cream
        book: '#b4c4d4',   // cool blue
        music: '#b4b4bc'   // cool gray with slight blue tint
    };

    // Calculate column split
    // Rules:
    // - 4 or fewer items: single column
    // - More than 4: two columns where first is longer or equal,
    //   first column length is never a multiple of 3, minimum 3
    function calculateSplit(total) {
        if (total <= 4) {
            return { col1: total, col2: 0 };
        }

        // Start with roughly even split, first column longer
        let col1 = Math.ceil(total / 2);
        let col2 = total - col1;

        // Ensure col1 is at least 3
        if (col1 < 3) {
            col1 = 3;
            col2 = total - col1;
        }

        // Ensure col1 is not a multiple of 3
        while (col1 % 3 === 0 && col1 < total - 1) {
            col1++;
            col2 = total - col1;
        }

        return { col1, col2 };
    }

    // Load and render choice data
    async function loadChoiceData() {
        try {
            const response = await fetch('data/choice.json');
            const data = await response.json();
            renderChoiceList(data);
        } catch (error) {
            console.error('Error loading choice data:', error);
        }
    }

    // Create a choice item link element
    function createChoiceItem(item) {
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'choice-item';
        link.textContent = item.text;
        link.style.color = typeColors[item.type] || '#e8e4df';
        return link;
    }

    // Render the choice list with two-column layout
    function renderChoiceList(items) {
        const container = document.getElementById('choiceList');
        const { col1, col2 } = calculateSplit(items.length);

        // Create first column
        const column1 = document.createElement('div');
        column1.className = 'choice-column';

        for (let i = 0; i < col1; i++) {
            column1.appendChild(createChoiceItem(items[i]));
        }

        container.appendChild(column1);

        // Create second column if needed
        if (col2 > 0) {
            const column2 = document.createElement('div');
            column2.className = 'choice-column';

            for (let i = col1; i < items.length; i++) {
                column2.appendChild(createChoiceItem(items[i]));
            }

            container.appendChild(column2);
        }
    }

    // Menu functionality
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    hamburger.addEventListener('click', function() {
        menuOverlay.classList.add('active');
    });

    closeMenu.addEventListener('click', function() {
        menuOverlay.classList.remove('active');
    });

    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });

    // Initialize
    loadChoiceData();
});
