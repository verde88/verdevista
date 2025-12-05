// Verde Vista - Main JavaScript (for splash page)

document.addEventListener('DOMContentLoaded', function() {
    const splashLogo = document.getElementById('splashLogo');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    // Open menu when clicking "Verde Vista" text
    if (splashLogo) {
        splashLogo.addEventListener('click', function() {
            menuOverlay.classList.add('active');
        });
    }

    // Close menu when clicking the × button
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            menuOverlay.classList.remove('active');
        });
    }

    // Close menu when clicking outside the menu content
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
        }
    });
});
