// kras.js - Специальные эффекты и анимации

class KrasEffects {
    constructor() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initSlider();
        this.initParallax();
        this.initFreezeEffects(); // Новая функция для эффекта замерзания
    }

    // 1. Эффект падающего снега (оставлен, но без кругов)
    initSnowEffect() {
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-effect';
        document.body.appendChild(snowContainer);

        const snowflakes = ['❄', '❅', '❆'];
        const snowflakeCount = 30; // Уменьшено количество

        for (let i = 0; i < snowflakeCount; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
                snowflake.style.left = `${Math.random() * 100}vw`;
                snowflake.style.fontSize = `${Math.random() * 8 + 8}px`;
                snowflake.style.opacity = Math.random() * 0.4 + 0.2;
                snowflake.style.animationDuration = `${Math.random() * 8 + 8}s`;
                snowflake.style.animationDelay = `${Math.random() * 5}s`;
                snowContainer.appendChild(snowflake);

                // Удаляем снежинку после анимации
                setTimeout(() => {
                    if (snowflake.parentNode) {
                        snowflake.parentNode.removeChild(snowflake);
                    }
                }, parseFloat(snowflake.style.animationDuration) * 1000);
            }, i * 300);
        }
    }

    // 2. Анимации при скролле
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Добавляем задержку для дочерних элементов
                    const children = entry.target.querySelectorAll('.reveal-on-scroll');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                        child.classList.add('visible');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за всеми секциями
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('reveal-on-scroll');
            observer.observe(section);
        });
    }

    // 3. НОВЫЙ ЭФФЕКТ: ЗАМЕРЗАНИЕ И ТРЕСКИ КАРТОЧЕК
    initFreezeEffects() {
        // Находим все карточки для эффекта замерзания
        const freezeCards = document.querySelectorAll('.glass-card, .bonus-card, .calendar-container, .booking-form-container');
        
        freezeCards.forEach(card => {
            // Добавляем класс для эффекта
            card.classList.add('freeze-crack-effect');
            
            // Эффект при наведении
            card.addEventListener('mouseenter', () => {
                this.triggerFreezeEffect(card);
            });
            
            // Эффект при клике
            card.addEventListener('click', (e) => {
                // Игнорируем клики по кнопкам и ссылкам внутри карточки
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT') {
                    return;
                }
                this.triggerFreezeEffect(card);
            });
            
            // Случайный эффект замерзания (каждые 30-60 секунд)
            const randomTime = Math.random() * 30000 + 30000; // 30-60 секунд
            setTimeout(() => {
                this.randomFreezeEffect(card);
            }, randomTime);
        });
    }
    
    triggerFreezeEffect(card) {
        if (card.classList.contains('freezing')) return;
        
        card.classList.add('freezing');
        
        // Создаем звуковой эффект (опционально)
        this.createCrackSound();
        
        // Добавляем частицы льда
        this.createIceParticles(card);
        
        // Убираем эффект через 2 секунды
        setTimeout(() => {
            card.classList.remove('freezing');
        }, 2000);
    }
    
    randomFreezeEffect(card) {
        // Случайно срабатывает в 30% случаев
        if (Math.random() < 0.3 && !card.classList.contains('freezing')) {
            this.triggerFreezeEffect(card);
        }
        
        // Планируем следующий случайный эффект
        const randomTime = Math.random() * 60000 + 60000; // 60-120 секунд
        setTimeout(() => {
            this.randomFreezeEffect(card);
        }, randomTime);
    }
    
    createIceParticles(card) {
        const rect = card.getBoundingClientRect();
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
            
            card.appendChild(particle);
            
            // Анимация частицы
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20 + 10;
            const duration = Math.random() * 1000 + 500;
            
            particle.animate([
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
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }
    
    createCrackSound() {
        // Создаем звуковой эффект треска (используем Web Audio API если доступно)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1500, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Если Web Audio API не доступен, ничего не делаем
            console.log('Web Audio API not available');
        }
    }

    // 4. Эффекты при наведении (без белых кругов)
    initHoverEffects() {
        // Эффект для стеклянных карточек
        const glassCards = document.querySelectorAll('.glass-card, .bonus-card');
        glassCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // 5. Слайдер галереи
    initSlider() {
        const sliderContainer = document.getElementById('sliderContainer');
        const dotsContainer = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!sliderContainer) return;
        
        const images = [
            './image/photo-reka-two.jpg',
            './image/photo-reka-mamay.jpg'
        ];
        
        let currentSlide = 0;
        
        // Создаем слайды
        images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="image-glow">
                    <img src="${img}" alt="Коттедж ${index + 1}" loading="lazy">
                </div>
            `;
            sliderContainer.appendChild(slide);
            
            // Создаем точки
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        // Функции слайдера
        const goToSlide = (index) => {
            currentSlide = index;
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Обновляем активную точку
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % images.length;
            goToSlide(currentSlide);
        };
        
        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            goToSlide(currentSlide);
        };
        
        // Автоматическая смена слайдов
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Обработчики событий
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Пауза при наведении
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // 6. Параллакс эффект
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Инициализация эффектов при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new KrasEffects();
    
    // Добавляем CSS для частиц льда
    const style = document.createElement('style');
    style.textContent = `
        @keyframes crackAppear {
            0% {
                background-position: 0 0, 0 0;
                opacity: 0;
                transform: scale(0.95);
            }
            20% {
                opacity: 0.3;
                transform: scale(0.97);
            }
            50% {
                background-position: 15px 15px, 20px 20px;
                opacity: 0.7;
                transform: scale(1);
            }
            80% {
                opacity: 0.4;
                transform: scale(1.02);
            }
            100% {
                background-position: 30px 30px, 40px 40px;
                opacity: 0.7;
                transform: scale(1);
            }
        }
        
        @keyframes frostSpread {
            0% {
                background: linear-gradient(
                    135deg,
                    rgba(173, 216, 230, 0) 0%,
                    rgba(173, 216, 230, 0) 50%,
                    rgba(173, 216, 230, 0) 100%
                );
                opacity: 0;
            }
            30% {
                background: linear-gradient(
                    135deg,
                    rgba(173, 216, 230, 0.2) 0%,
                    rgba(173, 216, 230, 0.1) 50%,
                    rgba(173, 216, 230, 0) 100%
                );
                opacity: 0.2;
            }
            70% {
                background: linear-gradient(
                    135deg,
                    rgba(173, 216, 230, 0.3) 0%,
                    rgba(173, 216, 230, 0.15) 50%,
                    rgba(173, 216, 230, 0.05) 100%
                );
                opacity: 0.4;
            }
            100% {
                background: linear-gradient(
                    135deg,
                    rgba(173, 216, 230, 0.2) 0%,
                    rgba(173, 216, 230, 0.1) 50%,
                    rgba(173, 216, 230, 0.05) 100%
                );
                opacity: 0.4;
            }
        }
        
        @keyframes shiver {
            0%, 100% {
                transform: translateX(0) rotate(0deg);
            }
            25% {
                transform: translateX(-1px) rotate(-0.2deg);
            }
            50% {
                transform: translateX(1px) rotate(0.2deg);
            }
            75% {
                transform: translateX(-0.5px) rotate(-0.1deg);
            }
        }
    `;
    document.head.appendChild(style);
});


