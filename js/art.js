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

    // Check if mobile viewport
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // Fisher-Yates shuffle
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Load art data from JSON
    async function loadArtData() {
        try {
            const response = await fetch('data/art.json');
            artData = await response.json();

            if (isMobile()) {
                displayMobileStream();
            } else {
                displayCategory(currentCategory);
            }
        } catch (error) {
            console.error('Error loading art data:', error);
        }
    }

    // Display shuffled stream for mobile
    function displayMobileStream() {
        masonryGrid.innerHTML = '';

        // Combine all items with category labels
        let allItems = [
            ...artData.loves.map(item => ({...item, category: 'Love'})),
            ...artData.crushes.map(item => ({...item, category: 'Crush'}))
        ];

        // Shuffle on every load
        allItems = shuffle(allItems);

        allItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'masonry-item';

            // Mobile lightbox description: link left, category right
            const description = `<div class='lightbox-desc-row'><span class='lightbox-desc-link'><a href='${item.url}' target='_blank' rel='noopener'>${item.alt}</a></span><span class='lightbox-category'>${item.category}</span></div>`;

            itemDiv.innerHTML = `
                <a href="${item.image}"
                   class="glightbox"
                   data-gallery="gallery-mobile"
                   data-description="${description}">
                    <img src="${item.image}" alt="${item.alt}" loading="lazy">
                </a>
            `;
            masonryGrid.appendChild(itemDiv);
        });

        initLightbox();
    }

    // Display images for a category (desktop)
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

        initLightbox();
    }

    // Initialize GLightbox
    function initLightbox() {
        if (lightbox) {
            lightbox.destroy();
        }
        lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: false,
            descPosition: 'bottom',
            moreLength: 0
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
