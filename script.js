document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const container = document.querySelector('.presentation-container');
    const totalSlides = slides.length;
    let currentSlide = 0;

    // --- Resizing Logic to keep 16:9 aspect ratio ---
    function resizePresentation() {
        const baseWidth = 1440;
        const baseHeight = 810;
        
        const scaleX = window.innerWidth / baseWidth;
        const scaleY = window.innerHeight / baseHeight;
        
        const scale = Math.min(scaleX, scaleY);
        
        container.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', resizePresentation);
    resizePresentation(); // Initial call

    // --- Core Navigation Logic ---
    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateSlides();
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function previousSlide() {
        goToSlide(currentSlide - 1);
    }

    // --- Interactive Element Check ---
    function isInteractiveElement(target) {
        return target.closest('button, a, input, textarea, select, video, audio, iframe, [contenteditable], [role="button"], [role="link"]');
    }

    // --- Full-Screen Click Navigation ---
    let ignoreNextClick = false;

    document.addEventListener('click', (e) => {
        if (ignoreNextClick) {
            ignoreNextClick = false;
            return;
        }

        if (isInteractiveElement(e.target)) {
            return;
        }

        const clickX = e.clientX;
        const screenWidth = window.innerWidth;

        if (clickX < screenWidth / 2) {
            previousSlide();
        } else {
            nextSlide();
        }
    });

    // --- Cursor Feedback (Desktop) ---
    document.addEventListener('mousemove', (e) => {
        if (isInteractiveElement(e.target)) {
            document.body.style.cursor = 'auto';
            return;
        }

        if (e.clientX < window.innerWidth / 2) {
            document.body.style.cursor = 'w-resize';
        } else {
            document.body.style.cursor = 'e-resize';
        }
    });

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea, select, [contenteditable]')) {
            return;
        }

        let handled = false;

        switch(e.key) {
            case 'ArrowRight':
            case 'PageDown':
                nextSlide();
                handled = true;
                break;
            case 'ArrowLeft':
            case 'PageUp':
                previousSlide();
                handled = true;
                break;
            case ' ':
                if (e.shiftKey) {
                    previousSlide();
                } else {
                    nextSlide();
                }
                handled = true;
                break;
            case 'Home':
                goToSlide(0);
                handled = true;
                break;
            case 'End':
                goToSlide(totalSlides - 1);
                handled = true;
                break;
            case 'f':
            case 'F':
                toggleFullScreen();
                handled = true;
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                    handled = true;
                }
                break;
        }

        if (handled) {
            e.preventDefault();
        }
    });

    // --- Swipe Navigation ---
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;

        let touchCurrentX = e.changedTouches[0].screenX;
        let touchCurrentY = e.changedTouches[0].screenY;

        let diffX = touchStartX - touchCurrentX;
        let diffY = touchStartY - touchCurrentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (isInteractiveElement(e.target)) return;

        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });

    function handleSwipe(startX, startY, endX, endY) {
        const threshold = 50;
        
        let diffX = startX - endX;
        let diffY = startY - endY;

        if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY)) {
            ignoreNextClick = true; 
            setTimeout(() => { ignoreNextClick = false; }, 300);

            if (diffX > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
    }

    // --- Trackpad / Wheel Navigation ---
    let isWheeling = false;
    let wheelTimeout;

    document.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
            if (e.cancelable) {
                e.preventDefault(); 
            }

            if (!isWheeling) {
                isWheeling = true;
                if (e.deltaX > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                isWheeling = false;
            }, 500); 
        }
    }, { passive: false });

    // --- Fullscreen Handling ---
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    updateSlides();
});
