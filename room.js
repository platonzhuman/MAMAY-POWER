// room.js - Логика для страницы коттеджа с исправлениями для iOS

// =================== ИСПРАВЛЕНИЯ ДЛЯ IOS ===================
(function initIOSFixes() {
    // Проверяем, является ли устройство iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        console.log('iOS устройство обнаружено, применяем исправления...');
        
        // 1. Исправление для фона - гарантируем его отображение
        document.addEventListener('DOMContentLoaded', function() {
            // Удаляем возможные дублирующие фоновые элементы
            const extraBackgrounds = document.querySelectorAll('.room-background-image');
            extraBackgrounds.forEach(bg => bg.remove());
            
            // Гарантируем что основной фон виден
            const mainBg = document.querySelector('.background-image');
            if (mainBg) {
                mainBg.style.opacity = '0.3';
                mainBg.style.zIndex = '-1';
                mainBg.style.display = 'block';
                mainBg.style.animation = 'none';
            }
            
            // Улучшаем контрастность стеклянных элементов для iOS
            const glassElements = document.querySelectorAll('.glass-container, .glass-card');
            glassElements.forEach(el => {
                el.style.backgroundColor = 'rgba(13, 27, 42, 0.9)';
                el.style.backdropFilter = 'none';
                el.style.webkitBackdropFilter = 'none';
            });
        });
        
        // 2. Исправление для страницы - добавляем класс для iOS
        document.documentElement.classList.add('ios-device');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация страницы коттеджа...');
    
    // 1. Инициализация слайдера комнаты
    initRoomSlider();
    
    // 2. Инициализация слайдера отзывов
    initReviewsSlider();
    
    // 3. Эффекты для страницы
    initRoomEffects();
    
    // 4. Обработка параметров URL
    initRoomParameters();
    
    // 5. Добавляем наблюдатель за скроллом для анимации появления секций
    initScrollAnimations();
});

// =================== СЛАЙДЕР КОМНАТЫ ===================
function initRoomSlider() {
    const sliderWrapper = document.getElementById('roomSliderWrapper');
    const thumbnailsContainer = document.getElementById('roomThumbnails');
    const prevBtn = document.getElementById('roomPrevBtn');
    const nextBtn = document.getElementById('roomNextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    if (!sliderWrapper) {
        console.warn('Элементы слайдера не найдены');
        return;
    }
    
    // Фотографии для коттеджа
    const roomImages = [
        './image/house-uli-two.jpg',
        './image/krot-reka.jpg',
        './image/photo-scklon-mamay.jpg',
        './image/kuzy-mamay.jpg',
        './image/krot-reka-two.jpg',
        './image/photo-reka-two.jpg',
        './image/photo-reka-mamay.jpg'
    ];
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    // Создаем слайды
    function createSlides() {
        sliderWrapper.innerHTML = '';
        thumbnailsContainer.innerHTML = '';
        
        roomImages.forEach((image, index) => {
            // Основной слайд
            const slide = document.createElement('div');
            slide.className = `room-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <div class="image-glow">
                    <img src="${image}" alt="Коттедж - фото ${index + 1}" loading="lazy" 
                         onerror="this.src='./image/placeholder.jpg'">
                </div>
            `;
            sliderWrapper.appendChild(slide);
            
            // Миниатюра
            const thumbnail = document.createElement('div');
            thumbnail.className = `room-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.dataset.index = index;
            thumbnail.innerHTML = `<img src="${image}" alt="Миниатюра ${index + 1}" loading="lazy">`;
            thumbnailsContainer.appendChild(thumbnail);
            
            // Обработчик клика на миниатюру
            thumbnail.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Обновляем счетчик слайдов
        if (totalSlidesEl) totalSlidesEl.textContent = roomImages.length;
        if (currentSlideEl) currentSlideEl.textContent = currentSlideIndex + 1;
    }
    
    // Функция перехода к слайду
    function goToSlide(index) {
        if (index < 0 || index >= roomImages.length) return;
        
        currentSlideIndex = index;
        
        // Обновляем основной слайдер
        sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Обновляем активный слайд
        document.querySelectorAll('.room-slide').forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlideIndex);
        });
        
        // Обновляем активную миниатюру
        document.querySelectorAll('.room-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentSlideIndex);
        });
        
        // Обновляем счетчик
        if (currentSlideEl) currentSlideEl.textContent = currentSlideIndex + 1;
        
        // Сбрасываем автопрокрутку
        resetAutoSlide();
    }
    
    // Следующий слайд
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % roomImages.length;
        goToSlide(currentSlideIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + roomImages.length) % roomImages.length;
        goToSlide(currentSlideIndex);
    }
    
    // Автопрокрутка слайдов
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    // Сброс автопрокрутки
    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    
    // Обработчики кнопок
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    // Пауза при наведении
    sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderWrapper.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Сенсорные события для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
            resetAutoSlide();
        }
    }
    
    // Инициализация
    createSlides();
    startAutoSlide();
}

// =================== СЛАЙДЕР ОТЗЫВОВ ===================
function initReviewsSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewDots = document.querySelectorAll('.review-dot');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    
    if (reviewCards.length === 0) return;
    
    let currentReviewIndex = 0;
    let reviewInterval;
    
    // Функция показа отзыва
    function showReview(index) {
        // Проверяем границы
        if (index < 0) index = reviewCards.length - 1;
        if (index >= reviewCards.length) index = 0;
        
        // Скрываем все отзывы
        reviewCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Показываем выбранный отзыв
        reviewCards[index].classList.add('active');
        
        // Обновляем точки
        reviewDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentReviewIndex = index;
    }
    
    // Следующий отзыв
    function nextReview() {
        let nextIndex = (currentReviewIndex + 1) % reviewCards.length;
        showReview(nextIndex);
    }
    
    // Предыдущий отзыв
    function prevReview() {
        let prevIndex = (currentReviewIndex - 1 + reviewCards.length) % reviewCards.length;
        showReview(prevIndex);
    }
    
    // Обработчики кнопок
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevReview();
        resetReviewInterval();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextReview();
        resetReviewInterval();
    });
    
    // Обработчики точек
    reviewDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showReview(index);
            resetReviewInterval();
        });
    });
    
    // Автоматическая смена отзывов
    function startReviewInterval() {
        reviewInterval = setInterval(nextReview, 8000);
    }
    
    function resetReviewInterval() {
        clearInterval(reviewInterval);
        startReviewInterval();
    }
    
    // Инициализация
    showReview(0);
    startReviewInterval();
}

// =================== ЭФФЕКТЫ ДЛЯ СТРАНИЦЫ ===================
function initRoomEffects() {
    // Эффект замерзания для стеклянных элементов
    const freezeElements = document.querySelectorAll('.glass-container, .room-tag, .service-card, .freeze-crack-effect');
    
    freezeElements.forEach(element => {
        element.classList.add('freeze-crack-effect');
        
        // Добавляем обработчики для эффектов
        element.addEventListener('mouseenter', () => {
            if (Math.random() < 0.3) {
                triggerFreezeEffect(element);
            }
        });
        
        // Случайный эффект замерзания
        const randomTime = Math.random() * 40000 + 40000; // 40-80 секунд
        
        setTimeout(() => {
            triggerRandomFreeze(element);
        }, randomTime);
    });
    
    // Функция случайного замерзания
    function triggerRandomFreeze(element) {
        if (Math.random() < 0.4 && !element.classList.contains('freezing')) {
            element.classList.add('freezing');
            
            // Создаем звуковой эффект (только на десктопе)
            if (!/iPad|iPhone|iPod|Android/.test(navigator.userAgent)) {
                createCrackSound();
            }
            
            // Создаем визуальные частицы
            createIceParticles(element);
            
            // Убираем эффект через 1.5 секунды
            setTimeout(() => {
                element.classList.remove('freezing');
            }, 1500);
        }
        
        // Планируем следующий эффект
        const nextRandomTime = Math.random() * 60000 + 60000; // 60-120 секунд
        setTimeout(() => {
            triggerRandomFreeze(element);
        }, nextRandomTime);
    }
    
    // Функция замерзания при клике
    function triggerFreezeEffect(element) {
        if (element.classList.contains('freezing')) return;
        
        element.classList.add('freezing');
        
        // Создаем визуальные частицы
        createIceParticles(element);
        
        // Убираем эффект через 2 секунды
        setTimeout(() => {
            element.classList.remove('freezing');
        }, 2000);
    }
    
    // Создание частиц льда
    function createIceParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'ice-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
                top: ${Math.random() * rect.height}px;
                left: ${Math.random() * rect.width}px;
                transform-origin: center;
            `;
            
            element.appendChild(particle);
            
            // Анимация частицы
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20 + 10;
            const duration = Math.random() * 1000 + 500;
            
            const animation = particle.animate([
                { 
                    transform: 'scale(0) rotate(0deg)',
                    opacity: 1
                },
                { 
                    transform: `scale(1) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            // Удаляем частицу после анимации
            animation.onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }
    
    // Создание звука треска (только для десктопа)
    function createCrackSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
            
            // Закрываем контекст после использования
            setTimeout(() => {
                if (audioContext.state !== 'closed') {
                    audioContext.close();
                }
            }, 1000);
        } catch (e) {
            console.log('Web Audio API не доступен или заблокирован');
        }
    }
    
    // Кнопка 360° тура (если есть)
    const tourBtn = document.getElementById('show360Tour');
    if (tourBtn) {
        tourBtn.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('В реальной версии здесь будет запущен интерактивный 360° тур по коттеджу с возможностью осмотра всех помещений.');
                
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 1500);
        });
    }
}

// =================== ОБРАБОТКА ПАРАМЕТРОВ URL ===================
function initRoomParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    
    // Если указан ID комнаты, меняем контент в зависимости от него
    if (roomId) {
        updateRoomContent(roomId);
    }
}

// Обновление контента в зависимости от выбранного коттеджа
function updateRoomContent(roomId) {
    const roomData = {
        alpine: {
            name: 'Коттедж "Альпийский"',
            title: 'Коттедж <span class="highlight">"Альпийский"</span>',
            guests: 'до 4 гостей',
            bedrooms: '2 спальни',
            area: '120 м²',
            price: '8 500 ₽',
            description: 'Уютный альпийский коттедж с панорамными окнами и видом на заснеженные горы. Идеально подходит для семьи или компании до 4 человек. Наслаждайтесь уединением и комфортом в окружении зимней сказки.',
            background: './image/krot-reka.jpg'
        },
        premium: {
            name: 'Коттедж "Премиум"',
            title: 'Коттедж <span class="highlight">"Премиум"</span>',
            guests: 'до 6 гостей',
            bedrooms: '3 спальни',
            area: '180 м²',
            price: '12 500 ₽',
            description: 'Просторный премиальный коттедж с двумя каминами, бильярдной и частной террасой с джакузи. Идеален для компании друзей или большой семьи. Насладитесь роскошью в окружении горных пейзажей.',
            background: './image/house-uli-two.jpg'
        },
        luxury: {
            name: 'Коттедж "Люкс"',
            title: 'Коттедж <span class="highlight">"Люкс"</span>',
            guests: 'до 8 гостей',
            bedrooms: '4 спальни',
            area: '250 м²',
            price: '18 500 ₽',
            description: 'Роскошный коттедж с тремя спальнями, кинотеатром, баром и приватным склоном. Максимальный комфорт и приватность для самого взыскательного отдыха. Ваш личный горный курорт.',
            background: './image/kuzy-mamay.jpg'
        }
    };
    
    const room = roomData[roomId] || roomData.alpine;
    
    // Обновляем элементы страницы
    const roomNameEl = document.getElementById('roomName');
    const roomTitleEl = document.getElementById('roomTitle');
    
    if (roomNameEl) roomNameEl.textContent = room.name;
    if (roomTitleEl) roomTitleEl.innerHTML = room.title;
    
    // Обновляем теги
    const roomTags = document.querySelector('.room-tags');
    if (roomTags) {
        let tagsHTML = `
            <span class="room-tag"><i class="fas fa-user-friends"></i> ${room.guests}</span>
            <span class="room-tag"><i class="fas fa-bed"></i> ${room.bedrooms}</span>
            <span class="room-tag"><i class="fas fa-ruler-combined"></i> ${room.area}</span>
            <span class="room-tag"><i class="fas fa-fire"></i> камин</span>
        `;
        
        if (roomId === 'premium' || roomId === 'luxury') {
            tagsHTML += '<span class="room-tag"><i class="fas fa-hot-tub"></i> джакузи</span>';
        } else {
            tagsHTML += '<span class="room-tag"><i class="fas fa-hot-tub"></i> сауна</span>';
        }
        
        if (roomId === 'luxury') {
            tagsHTML += '<span class="room-tag"><i class="fas fa-film"></i> кинотеатр</span>';
        }
        
        roomTags.innerHTML = tagsHTML;
    }
    
    // Обновляем описание
    const roomDescription = document.querySelector('.room-description');
    if (roomDescription) roomDescription.textContent = room.description;
    
    // Обновляем активную ссылку в футере
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `room.html?id=${roomId}`) {
            link.classList.add('active');
        }
    });
}

// =================== АНИМАЦИИ ПРИ СКРОЛЛЕ ===================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Добавляем задержку для дочерних элементов
                const children = entry.target.querySelectorAll('.reveal-section');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми секциями
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal-section');
        observer.observe(section);
    });
}

// =================== ДОБАВЛЕНИЕ CSS ДЛЯ ЭФФЕКТОВ ===================
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Анимация для слайдов */
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .room-slide.active {
        animation: slideIn 0.8s ease;
    }
    
    /* Эффект парения для ценника */
    @keyframes gentleFloat {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        33% {
            transform: translateY(-5px) rotate(1deg);
        }
        66% {
            transform: translateY(5px) rotate(-1deg);
        }
    }
    
    .room-price-badge {
        animation: gentleFloat 6s ease-in-out infinite;
    }
    
    /* Эффект свечения для активных элементов */
    .room-thumbnail.active {
        box-shadow: 0 0 20px rgba(46, 196, 182, 0.5);
    }
    
    /* Эффект для тегов при наведении */
    .room-tag:hover {
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
    }
    
    /* Эффект появления для секций */
    .reveal-section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .reveal-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Стили для частиц льда */
    .ice-particle {
        pointer-events: none;
        z-index: 1000;
    }
    
    /* Исправления для iOS */
    .ios-device .glass-container,
    .ios-device .glass-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background-color: rgba(13, 27, 42, 0.9) !important;
    }
    
    .ios-device .background-image {
        opacity: 0.3 !important;
        animation: none !important;
    }
    
    /* Адаптивные стили для мобильных */
    @media (max-width: 768px) {
        .room-main-slider {
            height: 300px;
        }
        
        .room-slider-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
        
        .room-thumbnails-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    
    @media (max-width: 480px) {
        .room-main-slider {
            height: 250px;
        }
        
        .room-thumbnails-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .room-hero-container {
            padding: 20px !important;
        }
    }
    
    /* Оптимизация для Safari */
    @supports (-webkit-touch-callout: none) {
        .room-slide img {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    }
</style>
`);

// =================== ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ===================
document.addEventListener('DOMContentLoaded', function() {
    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Не удалось загрузить изображение:', this.src);
            this.src = './image/placeholder.jpg';
        });
    });
});

// =================== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ===================
if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
        // Отложенная инициализация второстепенных элементов
        initLazyElements();
    });
} else {
    setTimeout(initLazyElements, 1000);
}

function initLazyElements() {
    // Инициализация лениво загружаемых элементов
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
        if (img.complete) return;
        
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

// =================== ОБРАБОТКА СОБЫТИЙ КЛАВИАТУРЫ ===================
document.addEventListener('keydown', function(e) {
    // Управление слайдером с клавиатуры
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('roomPrevBtn');
        if (prevBtn) prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('roomNextBtn');
        if (nextBtn) nextBtn.click();
    }
});

// Экспорт функций для отладки (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRoomSlider,
        initReviewsSlider,
        initRoomEffects,
        initRoomParameters,
        updateRoomContent
    };
}