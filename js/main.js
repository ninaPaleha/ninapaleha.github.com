// Обработчик карусели участников
class ParticipantsCarousel {
    constructor() {
        this.carousel = document.querySelector('.participants-carousel');
        this.track = document.querySelector('.carousel-track');
        this.cards = Array.from(document.querySelectorAll('.participant-card'));
        this.prevBtn = document.querySelectorAll('.control-btn--prev');
        this.nextBtn = document.querySelectorAll('.control-btn--next');
        this.counter = document.querySelector('.participants-counter');
        this.counterMobile = document.querySelector('.participants-counter-mobile');
        
        this.currentIndex = 0; 
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.totalOriginalCards = 0;

        this.init();
    }
    
    init() {
        this.totalOriginalCards = this.cards.length;
        this.createDuplicateCards();
        this.setupEventListeners();
        this.updateCarousel(true);
        this.startAutoPlay();
    }
    
    createDuplicateCards() {
        this.cards.forEach(card => {
            const clone = card.cloneNode(true);
            this.track.appendChild(clone);
        });
        this.cards = document.querySelectorAll('.participant-card');
    }
    
    getCardWidth() {
        const card = this.cards[0];
        const style = window.getComputedStyle(this.track);
        const gap = parseInt(style.gap) || 0;
        return card.offsetWidth + gap;
    }
    
    setupEventListeners() {
        this.prevBtn.forEach(btn => {
            btn.addEventListener('click', () => this.prev());
        });
        
        this.nextBtn.forEach(btn => {
            btn.addEventListener('click', () => this.next());
        });
        
        window.addEventListener('resize', () => this.handleResize());
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    handleResize() {
        this.updateCarousel(true);
    }
    
    updateCarousel(instant = false) {
        if (this.isAnimating) return;

        const cardWidth = this.getCardWidth();
        const translateX = -this.currentIndex * cardWidth;

        if (instant) {
            this.track.style.transition = 'none';
        } else {
            this.track.style.transition = 'transform 0.5s ease';
            this.isAnimating = true;
        }

        this.track.style.transform = `translateX(${translateX}px)`;
        this.updateCounter();

        if (!instant) {
            setTimeout(() => {
                this.isAnimating = false;
                this.checkBoundaries();
            }, 500);
        }

        this.updateButtons();
    }
    
    checkBoundaries() {
        if (this.currentIndex >= this.totalOriginalCards) {
            this.currentIndex = 0; // Перейти к первой карточке
            this.updateCarousel(true); // Обновить мгновенно
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.totalOriginalCards - 1; // Перейти к последней карточке
            this.updateCarousel(true); // Обновить мгновенно
        }
    }
    
    updateCounter() {
        const displayIndex = (this.currentIndex % this.totalOriginalCards) + 1;
        this.counter.textContent = `${displayIndex} / ${this.totalOriginalCards}`;
        this.counterMobile.textContent = `${displayIndex} / ${this.totalOriginalCards}`;
    }
    
    next() {
        if (this.isAnimating) return;
        this.currentIndex++;
        this.updateCarousel();
    }
    
    prev() {
        if (this.isAnimating) return;
        this.currentIndex--;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    updateButtons() {
        const isFirstCard = this.currentIndex === 0;
        
        this.prevBtn.forEach(btn => {
            btn.disabled = isFirstCard;
        });
        
        this.nextBtn.forEach(btn => {
            btn.disabled = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticipantsCarousel();
});


// Обработчик карусели этапов
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.stages-carousel');
    const slides = document.querySelectorAll('.stage-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const airplane = document.querySelector('.stage-airplane-mobile');
    
    if (!carousel) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Функция обновления карусели
    function updateCarousel() {
        carousel.scrollTo({
            left: slides[currentSlide].offsetLeft,
            behavior: 'smooth'
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slideCount - 1;
        
        // Анимация самолета - улетает при переходе с первой карточки
        if (airplane) {
            if (currentSlide === 0) {
                airplane.classList.remove('airplane-fly-away');
            } else {
                airplane.classList.add('airplane-fly-away');
            }
        }
    }
    
    // Переход к конкретному слайду
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Следующий слайд
    function nextSlide() {
        if (currentSlide < slideCount - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Предыдущий слайд
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Swipe для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    let isScrolling = false;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        isScrolling = false;
    });
    
    carousel.addEventListener('touchmove', function() {
        isScrolling = true;
    });
    
    carousel.addEventListener('touchend', function(e) {
        if (!isScrolling) return;
        
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Свайп влево
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Свайп вправо
        }
    }
    
    // Обработчик скролла для синхронизации
    carousel.addEventListener('scroll', function() {
        const scrollPos = carousel.scrollLeft;
        const slideWidth = carousel.offsetWidth;
        const newSlide = Math.round(scrollPos / slideWidth);
        
        if (newSlide !== currentSlide) {
            currentSlide = newSlide;
            
            // Обновляем UI без анимации скролла
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slideCount - 1;
            
            // Анимация самолета
            if (airplane) {
                if (currentSlide === 0) {
                    airplane.classList.remove('airplane-fly-away');
                } else {
                    airplane.classList.add('airplane-fly-away');
                }
            }
        }
    });
    
    // Инициализация
    updateCarousel();
    
    // Ресайз для пересчета позиций
    window.addEventListener('resize', function() {
        updateCarousel();
    });
});
