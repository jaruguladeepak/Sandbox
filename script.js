document.addEventListener('DOMContentLoaded', () => {
    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Only trigger if we aren't typing in an input field (just in case)
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case '1':
                window.location.href = 'review-1/index.html';
                break;
            case '2':
                window.location.href = 'review-2/index.html';
                break;
            case '3':
                window.location.href = 'review-3/index.html';
                break;
            case '4':
                window.location.href = 'simulation/index.html';
                break;
            case 'f':
                toggleFullScreen();
                break;
        }
    });

    // Fullscreen Toggle
    const fullscreenToggleBtn = document.getElementById('fullscreenToggle');
    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.addEventListener('click', toggleFullScreen);
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            if (fullscreenToggleBtn) fullscreenToggleBtn.textContent = 'Exit Fullscreen (Esc)';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                if (fullscreenToggleBtn) fullscreenToggleBtn.textContent = 'Fullscreen (F)';
            }
        }
    }

    // Listen to fullscreen changes to update button text
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            if (fullscreenToggleBtn) fullscreenToggleBtn.textContent = 'Fullscreen (F)';
        }
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    let isDarkMode = true; // Default is dark based on CSS
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.body.classList.remove('light-mode');
                themeToggleBtn.textContent = 'Light Mode';
            } else {
                document.body.classList.add('light-mode');
                themeToggleBtn.textContent = 'Dark Mode';
            }
        });
        
        // Initial text
        themeToggleBtn.textContent = 'Light Mode';
    }
});
