document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTIONS ---
    const startButton = document.getElementById('start-button');
    const splash = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const musicPlayer = document.getElementById('music-player');
    const anniversarySong = document.getElementById('anniversary-song');
    const envelopeContainer = document.getElementById('envelope-container');
    const envelopeMessage = document.getElementById('envelope-message');
    const videoPlayer = document.getElementById('videoPlayer'); // Idinagdag para sa video

    // --- SPLASH SCREEN -> MAIN CONTENT ---
    startButton.addEventListener('click', () => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            mainContent.classList.remove('hidden');
            musicPlayer.classList.remove('hidden');
            anniversarySong.play().catch(() => {});
        }, 1000);
    });

    // --- ENVELOPE CLICK ---
    let envelopeRevealed = false;
    envelopeContainer.addEventListener('click', () => {
        if (envelopeRevealed) return;
        envelopeRevealed = true;

        envelopeMessage.classList.remove('hidden');
        envelopeMessage.style.opacity = '0';
        setTimeout(() => {
            envelopeMessage.style.transition = 'opacity 0.8s ease';
            envelopeMessage.style.opacity = '1';
        }, 50);

        anniversarySong.play().catch(() => {});
    });

    // --- FULLSCREEN FALLING HEARTS ---
    const heartsContainer = document.querySelector('.fullscreen-hearts');
    if (heartsContainer) {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');

            const size = Math.random() * 30 + 10;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
            heart.style.opacity = Math.random();

            heartsContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 10000);
        };
        setInterval(createHeart, 300);
    }

    // --- TIMELINE SCROLL ANIMATION ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // --- SLIDESHOW SCRIPT ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.mySlides');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let slideshowInterval;
    const slideDuration = 4000;

    function showCurrentSlide() {
        if (slides.length === 0) return;
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        slides[slideIndex].style.display = 'block';
    }

    function startSlideshow() {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            slideIndex = (slideIndex + 1) % slides.length;
            showCurrentSlide();
        }, slideDuration);
    }

    if (slides.length > 0) {
        nextButton.addEventListener('click', () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showCurrentSlide();
            startSlideshow();
        });

        prevButton.addEventListener('click', () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showCurrentSlide();
            startSlideshow();
        });

        showCurrentSlide();
        startSlideshow();
    }

    // =================================================================
    // --- BAGONG DAGDAG: VIDEO & MUSIC FADE LOGIC ---
    // =================================================================
    let fadeOutInterval;
    let fadeInInterval;

    // Function para sa pag-fade out ng music
    const fadeOutMusic = () => {
        clearInterval(fadeInInterval); // Itigil ang anumang fade-in na nangyayari
        fadeOutInterval = setInterval(() => {
            if (anniversarySong.volume > 0.05) {
                anniversarySong.volume -= 0.05;
            } else {
                anniversarySong.volume = 0;
                anniversarySong.pause();
                clearInterval(fadeOutInterval);
            }
        }, 100);
    };

    // Function para sa pag-fade in ng music
    const fadeInMusic = () => {
        clearInterval(fadeOutInterval); // Itigil ang anumang fade-out na nangyayari
        anniversarySong.play().catch(() => {});
        fadeInInterval = setInterval(() => {
            if (anniversarySong.volume < 0.95) {
                anniversarySong.volume += 0.05;
            } else {
                anniversarySong.volume = 1;
                clearInterval(fadeInInterval);
            }
        }, 100);
    };

    // Kapag nag-play ang video, i-fade out ang music
    videoPlayer.addEventListener('play', () => {
        if (!anniversarySong.paused) {
            fadeOutMusic();
        }
    });

    // Kapag natapos ang video, i-fade in ang music
    videoPlayer.addEventListener('ended', () => {
        fadeInMusic();
    });

    // Kapag na-pause ang video, i-fade in din ang music
    videoPlayer.addEventListener('pause', () => {
        if (!videoPlayer.ended) {
            fadeInMusic();
        }
    });
});