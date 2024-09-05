document.addEventListener('DOMContentLoaded', () => {
    const slides = document.getElementById('slides');
    const nextButton = document.getElementById('nextButton');
    const getStartedButton = document.getElementById('getStartedButton');
    const indicators = document.querySelectorAll('.indicator');

    let currentIndex = 0;

    const updateSlider = () => {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;

       

         // Update the lightbox indicators
         indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('bg-gray-900');
                indicator.classList.remove('bg-gray-400');
            } else {
                indicator.classList.remove('bg-gray-900');
                indicator.classList.add('bg-gray-400');
            }
        });
        

        // Show/hide buttons based on the current slide
        if (currentIndex === 2) { // Last slide
            nextButton.classList.add('hidden');
            getStartedButton.classList.remove('hidden');
        }
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < 2) {
            currentIndex++;
            updateSlider();
        }
    });

    getStartedButton.addEventListener('click', () => {
        window.location.href = '/signup.html';
    });

    // Initialize slider
    updateSlider();
});
