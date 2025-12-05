// Verde Vista - Art Page JavaScript

document.addEventListener('DOMContentLoaded', async function() {
    const hamburger = document.getElementById('hamburger');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const masonryGrid = document.getElementById('masonryGrid');

    let artData = {};
    let currentCategory = 'loves';
    let lightbox = null;

    // Load art data from JSON
    async function loadArtData() {
        try {
            const response = await fetch('data/art.json');
            artData = await response.json();
            displayCategory(currentCategory);
        } catch (error) {
            console.error('Error loading art data:', error);
        }
    }

    // Display images for a category
    function displayCategory(category) {
        masonryGrid.innerHTML = '';
        const items = artData[category] || [];

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'masonry-item';
            itemDiv.innerHTML = `
                <a href="${item.image}"
                   class="glightbox"
                   data-gallery="gallery-${category}"
                   data-description="<a href='${item.url}' target='_blank' rel='noopener'>${item.alt}</a>">
                    <img src="${item.image}" alt="${item.alt}" loading="lazy">
                </a>
            `;
            masonryGrid.appendChild(itemDiv);
        });

        // Initialize or refresh GLightbox
        if (lightbox) {
            lightbox.destroy();
        }
        lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: false
        });
    }

    // Category button switching
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            displayCategory(currentCategory);
        });
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
    await loadArtData();
});
