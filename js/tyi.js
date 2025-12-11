// Verde Vista - TYI Page JavaScript

document.addEventListener('DOMContentLoaded', async function() {
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const tyiCard = document.getElementById('tyiCard');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseIcon = document.getElementById('pauseIcon');
    const tyiDots = document.getElementById('tyiDots');

    let tyiData = {};
    let currentCategory = 'asked';
    let currentIndex = 0;
    let isPlaying = true;
    let autoplayInterval = null;

    // Load TYI data from JSON
    async function loadTyiData() {
        try {
            const response = await fetch('data/tyi.json');
            tyiData = await response.json();
            displayItem();
            createDots();
            startAutoplay();
        } catch (error) {
            console.error('Error loading TYI data:', error);
        }
    }

    // Display current item
    function displayItem() {
        const items = tyiData[currentCategory] || [];
        if (items.length > 0) {
            const item = items[currentIndex];
            tyiCard.textContent = item.text;
        }
        updateDots();
    }

    // Create progress dots
    function createDots() {
        tyiDots.innerHTML = '';
        const items = tyiData[currentCategory] || [];
        items.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentIndex = index;
                displayItem();
                resetAutoplay();
            });
            tyiDots.appendChild(dot);
        });
    }

    // Update active dot
    function updateDots() {
        const dots = tyiDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Navigate to previous item
    function prevItem() {
        const items = tyiData[currentCategory] || [];
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        displayItem();
        resetAutoplay();
    }

    // Navigate to next item
    function nextItem() {
        const items = tyiData[currentCategory] || [];
        currentIndex = (currentIndex + 1) % items.length;
        displayItem();
        resetAutoplay();
    }

    // Start autoplay
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        autoplayInterval = setInterval(() => {
            if (isPlaying) {
                nextItem();
            }
        }, 6000); // 6 seconds
    }

    // Reset autoplay timer
    function resetAutoplay() {
        if (isPlaying) {
            startAutoplay();
        }
    }

    // Toggle play/pause
    function togglePause() {
        isPlaying = !isPlaying;
        pauseIcon.textContent = isPlaying ? '❚❚' : '▶';
        if (!isPlaying) {
            clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    }

    // Category button switching
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentIndex = 0;
            displayItem();
            createDots();
            resetAutoplay();
        });
    });

    // Control buttons
    prevBtn.addEventListener('click', prevItem);
    nextBtn.addEventListener('click', nextItem);
    pauseBtn.addEventListener('click', togglePause);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!menuOverlay.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevItem();
            } else if (e.key === 'ArrowRight') {
                nextItem();
            } else if (e.key === ' ') {
                e.preventDefault();
                togglePause();
            }
        }
    });

    // Hamburger menu toggle
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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
        }
    });

    // Initialize
    await loadTyiData();
});
