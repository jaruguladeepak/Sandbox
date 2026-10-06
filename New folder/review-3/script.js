document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const container = document.querySelector('.presentation-container');
    const totalSlides = slides.length;
    let currentSlide = 0;

    if (window.location.hash && window.location.hash.startsWith('#slide-')) {
        const hashIndex = parseInt(window.location.hash.replace('#slide-', ''), 10);
        if (!isNaN(hashIndex) && hashIndex >= 0 && hashIndex < totalSlides) {
            currentSlide = hashIndex;
        }
    }

    function isPortraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    // --- Resizing Logic to keep 16:9 aspect ratio ---
    function resizePresentation() {
        const baseWidth = 1440;
        const baseHeight = 810;
        
        const isPortrait = isPortraitMode();

        if (isPortrait) {
            const scaleX = window.innerHeight / baseWidth;
            const scaleY = window.innerWidth / baseHeight;
            const scale = Math.min(scaleX, scaleY);
            
            container.style.transform = `rotate(90deg) scale(${scale})`;
        } else {
            const scaleX = window.innerWidth / baseWidth;
            const scaleY = window.innerHeight / baseHeight;
            const scale = Math.min(scaleX, scaleY);
            
            container.style.transform = `scale(${scale})`;
        }
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
            window.history.replaceState(null, null, `#slide-${index}`);
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

        const isPortrait = isPortraitMode();

        if (isPortrait) {
            if (e.clientY < window.innerHeight / 2) {
                previousSlide();
            } else {
                nextSlide();
            }
        } else {
            if (e.clientX < window.innerWidth / 2) {
                previousSlide();
            } else {
                nextSlide();
            }
        }
    });

    // --- Cursor Feedback (Desktop) ---
    document.addEventListener('mousemove', (e) => {
        if (isInteractiveElement(e.target)) {
            document.body.style.cursor = 'auto';
            return;
        }

        const isPortrait = isPortraitMode();

        if (isPortrait) {
            if (e.clientY < window.innerHeight / 2) {
                document.body.style.cursor = 'n-resize';
            } else {
                document.body.style.cursor = 's-resize';
            }
        } else {
            if (e.clientX < window.innerWidth / 2) {
                document.body.style.cursor = 'w-resize';
            } else {
                document.body.style.cursor = 'e-resize';
            }
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
            case 'ArrowDown':
            case 'PageDown':
                nextSlide();
                handled = true;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
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

        const isPortrait = isPortraitMode();

        if (isPortrait) {
            if (Math.abs(diffY) > Math.abs(diffX)) {
                if (e.cancelable) e.preventDefault();
            }
        } else {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (e.cancelable) e.preventDefault();
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

        const isPortrait = isPortraitMode();

        if (isPortrait) {
            if (Math.abs(diffY) > threshold && Math.abs(diffY) > Math.abs(diffX)) {
                ignoreNextClick = true; 
                setTimeout(() => { ignoreNextClick = false; }, 300);

                if (diffY > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        } else {
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
    }

    // --- Trackpad / Wheel Navigation ---
    let isWheeling = false;
    let wheelTimeout;

    document.addEventListener('wheel', (e) => {
        const isPortrait = isPortraitMode();
        
        let targetDelta = isPortrait ? e.deltaY : e.deltaX;
        let crossDelta = isPortrait ? e.deltaX : e.deltaY;

        if (Math.abs(targetDelta) > Math.abs(crossDelta) && Math.abs(targetDelta) > 20) {
            if (e.cancelable) {
                e.preventDefault(); 
            }

            if (!isWheeling) {
                isWheeling = true;
                if (targetDelta > 0) {
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
