document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateSlides();
        } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
        }
    });
    
    // Initial setup
    updateSlides();
});
