// room.js - Логика для страницы коттеджа

document.addEventListener('DOMContentLoaded', function() {
    // 1. Инициализация слайдера комнаты
    initRoomSlider();
    
    // 2. Инициализация планов этажей
    initFloorPlans();
    
    // 3. Инициализация слайдера отзывов
    initReviewsSlider();
    
    // 4. Эффекты для страницы
    initRoomEffects();
    
    // 5. Обработка параметров URL
    initRoomParameters();
});

// Инициализация слайдера комнаты
function initRoomSlider() {
    const sliderWrapper = document.getElementById('roomSliderWrapper');
    const thumbnailsContainer = document.getElementById('roomThumbnails');
    const prevBtn = document.getElementById('roomPrevBtn');
    const nextBtn = document.getElementById('roomNextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    // Фотографии для коттеджа (в реальном проекте должны быть разные фото для разных коттеджей)
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
    
    // Создаем слайды
    roomImages.forEach((image, index) => {
        // Основной слайд
        const slide = document.createElement('div');
        slide.className = `room-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <div class="image-glow">
                <img src="${image}" alt="Коттедж Альпийский - фото ${index + 1}" loading="lazy">
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
    totalSlidesEl.textContent = roomImages.length;
    
    // Функция перехода к слайду
    function goToSlide(index) {
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
        currentSlideEl.textContent = currentSlideIndex + 1;
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
    
    // Обработчики кнопок
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Автоматическая смена слайдов
    let slideInterval = setInterval(nextSlide, 6000);
    
    // Пауза при наведении
    sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderWrapper.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 6000);
    });
}

// Инициализация планов этажей
function initFloorPlans() {
    const floorTabs = document.querySelectorAll('.floor-tab');
    const floorImages = document.querySelectorAll('.floor-plan-image');
    
    floorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const floorId = this.dataset.floor;
            
            // Убираем активный класс со всех вкладок
            floorTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс на текущую вкладку
            this.classList.add('active');
            
            // Скрываем все планы этажей
            floorImages.forEach(image => {
                image.classList.remove('active');
            });
            
            // Показываем выбранный план
            document.getElementById(`floor${floorId}`).classList.add('active');
        });
    });
    
    // Эффекты при наведении на зоны
    const roomAreas = document.querySelectorAll('.room-area');
    roomAreas.forEach(area => {
        area.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        area.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Инициализация слайдера отзывов
function initReviewsSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewDots = document.querySelectorAll('.review-dot');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    
    let currentReviewIndex = 0;
    
    // Функция показа отзыва
    function showReview(index) {
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
    if (prevBtn) prevBtn.addEventListener('click', prevReview);
    if (nextBtn) nextBtn.addEventListener('click', nextReview);
    
    // Обработчики точек
    reviewDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showReview(index);
        });
    });
    
    // Автоматическая смена отзывов
    setInterval(nextReview, 8000);
}

// Эффекты для страницы комнаты
function initRoomEffects() {
    // Эффект замерзания для всех стеклянных элементов
    const freezeElements = document.querySelectorAll('.glass-container, .room-tag, .service-card');
    
    freezeElements.forEach(element => {
        element.classList.add('freeze-crack-effect');
        
        // Случайный эффект замерзания
        const randomTime = Math.random() * 40000 + 40000; // 40-80 секунд
        
        setTimeout(() => {
            triggerRandomFreeze(element);
        }, randomTime);
    });
    
    // Функция случайного замерзания
    function triggerRandomFreeze(element) {
        if (Math.random() < 0.4) {
            element.classList.add('freezing');
            
            // Создаем звуковой эффект
            createCrackSound();
            
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
    
    // Создание звука треска
    function createCrackSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        } catch (e) {
            console.log('Web Audio API not available');
        }
    }
    
    // Кнопка 360° тура
    const tourBtn = document.getElementById('show360Tour');
    if (tourBtn) {
        tourBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('В реальной версии здесь будет запущен интерактивный 360° тур по коттеджу с возможностью осмотра всех помещений.');
                
                this.innerHTML = '<i class="fas fa-vr-cardboard"></i> 360° тур';
                this.disabled = false;
            }, 1500);
        });
    }
}

// Обработка параметров URL для разных коттеджей
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
    document.getElementById('roomName').textContent = room.name;
    document.getElementById('roomTitle').innerHTML = room.title;
    
    // Обновляем теги
    const roomTags = document.querySelector('.room-tags');
    if (roomTags) {
        roomTags.innerHTML = `
            <span class="room-tag"><i class="fas fa-user-friends"></i> ${room.guests}</span>
            <span class="room-tag"><i class="fas fa-bed"></i> ${room.bedrooms}</span>
            <span class="room-tag"><i class="fas fa-ruler-combined"></i> ${room.area}</span>
            <span class="room-tag"><i class="fas fa-fire"></i> камин</span>
            ${roomId === 'premium' || roomId === 'luxury' ? '<span class="room-tag"><i class="fas fa-hot-tub"></i> джакузи</span>' : '<span class="room-tag"><i class="fas fa-hot-tub"></i> сауна</span>'}
            ${roomId === 'luxury' ? '<span class="room-tag"><i class="fas fa-film"></i> кинотеатр</span>' : ''}
        `;
    }
    
    // Обновляем цену
    const priceAmount = document.querySelector('.price-amount');
    if (priceAmount) priceAmount.textContent = room.price;
    
    // Обновляем описание
    const roomDescription = document.querySelector('.room-description');
    if (roomDescription) roomDescription.textContent = room.description;
    
    // Обновляем фон
    const background = document.getElementById('roomBackground');
    if (background) {
        background.style.backgroundImage = `url('${room.background}')`;
    }
    
    // Обновляем активную ссылку в футере
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `room.html?id=${roomId}`) {
            link.classList.add('active');
        }
    });
}

// Добавляем CSS для эффектов комнаты
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
    
    /* Эффект для кнопки 360° тура */
    #show360Tour {
        position: relative;
        overflow: hidden;
    }
    
    #show360Tour::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.7s;
    }
    
    #show360Tour:hover::before {
        left: 100%;
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
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .reveal-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);

// Добавляем наблюдатель за скроллом для анимации появления секций
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Наблюдаем за всеми секциями на странице комнаты
document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-section');
    observer.observe(section);
});