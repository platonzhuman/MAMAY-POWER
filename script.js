// script.js - Основная логика сайта

document.addEventListener('DOMContentLoaded', function() {
    // 1. Мобильное меню с гамбургером
    const mobileHamburger = document.getElementById('mobileHamburger');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const sidebar = document.querySelector('.glass-sidebar');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileHamburger) {
        mobileHamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // Блокируем скролл при открытом меню
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на оверлей
        mobileMenuOverlay.addEventListener('click', function() {
            mobileHamburger.classList.remove('active');
            sidebar.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    mobileHamburger.classList.remove('active');
                    sidebar.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Закрытие меню при ресайзе (если перешли на десктоп)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                mobileHamburger.classList.remove('active');
                sidebar.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    // В конце функции DOMContentLoaded добавьте:
initDatePicker();
    }

    // 2. Слайдер галереи
    const sliderWrapper = document.getElementById('sliderWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    // Инициализация слайдера
    function initSlider() {
        updateSlider();
        
        // Автоматическое перелистывание
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Обработчики для кнопок
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Обработчики для точек
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
        
        // Пауза при наведении
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderWrapper.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            dots[index].classList.remove('active');
            
            if (index === currentSlide) {
                slide.classList.add('active');
                dots[index].classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    // 3. Календарь бронирования (исправленная версия)
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const checkinDateEl = document.getElementById('checkinDate');
const checkoutDateEl = document.getElementById('checkoutDate');
const nightsCountEl = document.getElementById('nightsCount');
const accommodationPriceEl = document.getElementById('accommodationPrice');
const discountAmountEl = document.getElementById('discountAmount');
const depositAmountEl = document.getElementById('depositAmount');
const bookNowBtn = document.getElementById('bookNowBtn');
const priceSummary = document.getElementById('priceSummary');

let currentDate = new Date();
let selectedCheckin = null;
let selectedCheckout = null;

// Цены и скидки
const PRICE_PER_NIGHT = 8500;
const DISCOUNTS = {
    week: 0.3,  // 30% за неделю
    month: 0.4  // 40% за месяц
};
const DEPOSIT_PERCENTAGE = 0.4;

// Занятые даты (для примера)
const bookedDates = [
    '2024-12-20', '2024-12-21', '2024-12-22',
    '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31',
    '2025-01-01', '2025-01-02', '2025-01-03',
    '2025-01-10', '2025-01-11'
];

// Инициализация календаря
function initCalendar() {
    renderCalendar(currentDate);
    
    // Обработчики для кнопок бонусов
    document.querySelectorAll('[data-promo]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const promo = this.getAttribute('data-promo');
            highlightPromoDates(promo);
        });
    });
}

// Рендер календаря
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Заголовок месяца
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    // Очищаем календарь
    calendarGrid.innerHTML = '';
    
    // Заголовки дней недели
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Пустые ячейки в начале
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Дни месяца
    for (let day = 1; day <= totalDays; day++) {
        const currentDateObj = new Date(year, month, day);
        const dateString = formatDate(currentDateObj);
        
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        dayCell.dataset.date = dateString;
        
        // Проверяем, занята ли дата
        if (bookedDates.includes(dateString)) {
            dayCell.classList.add('booked');
        } else {
            dayCell.classList.add('available');
            
            // Проверяем, входит ли дата в выбранный интервал
            if (selectedCheckin && selectedCheckout) {
                if (currentDateObj >= selectedCheckin && currentDateObj <= selectedCheckout) {
                    dayCell.classList.add('selected');
                }
            } else if (selectedCheckin && formatDate(selectedCheckin) === dateString) {
                dayCell.classList.add('selected');
            }
            
            // Обработчик клика
            dayCell.addEventListener('click', () => selectDate(currentDateObj));
        }
        
        // Проверяем прошедшие даты
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (currentDateObj < today) {
            dayCell.classList.add('booked');
            dayCell.title = 'Прошедшая дата';
        }
        
        calendarGrid.appendChild(dayCell);
    }
    
    // После отрисовки, обновляем стили для диапазона
    highlightDateRange();
}

// Функция для выделения всего диапазона дат
function highlightDateRange() {
    if (!selectedCheckin || !selectedCheckout) return;
    
    // Получаем все ячейки календаря
    const dayCells = document.querySelectorAll('.day-cell:not(.empty)');
    
    dayCells.forEach(cell => {
        const dateString = cell.dataset.date;
        if (!dateString) return;
        
        // Преобразуем строку даты обратно в объект Date
        const [year, month, day] = dateString.split('-').map(Number);
        const cellDate = new Date(year, month - 1, day);
        
        // Проверяем, входит ли дата в диапазон
        if (cellDate >= selectedCheckin && cellDate <= selectedCheckout) {
            // Не перезаписываем стили для занятых дат
            if (!cell.classList.contains('booked')) {
                cell.classList.add('selected');
            }
        }
    });
}

// Выбор даты
function selectDate(date) {
    // Если нет выбранной даты заезда или выбраны обе даты
    if (!selectedCheckin || (selectedCheckin && selectedCheckout)) {
        // Выбор даты заезда (или сброс, если выбраны обе даты)
        selectedCheckin = date;
        selectedCheckout = null;
        checkinDateEl.textContent = formatDate(date, true);
        checkoutDateEl.textContent = '--.--.----';
        nightsCountEl.textContent = '0';
        priceSummary.style.display = 'none';
        bookNowBtn.disabled = true;
    } 
    // Если есть дата заезда, но нет даты выезда
    else if (selectedCheckin && !selectedCheckout) {
        // Проверяем, кликнули ли на ту же дату заезда
        if (formatDate(date) === formatDate(selectedCheckin)) {
            // Если кликнули на ту же дату заезда - отменяем выбор
            selectedCheckin = null;
            checkinDateEl.textContent = '--.--.----';
            checkoutDateEl.textContent = '--.--.----';
            nightsCountEl.textContent = '0';
            priceSummary.style.display = 'none';
            bookNowBtn.disabled = true;
        }
        // Если выбрана более ранняя дата - меняем дату заезда
        else if (date < selectedCheckin) {
            selectedCheckin = date;
            checkinDateEl.textContent = formatDate(date, true);
            checkoutDateEl.textContent = '--.--.----';
            nightsCountEl.textContent = '0';
            priceSummary.style.display = 'none';
            bookNowBtn.disabled = true;
        }
        // Если выбрана более поздняя дата - устанавливаем дату выезда
        else {
            // Проверяем минимальное количество ночей
            const nights = Math.ceil((date - selectedCheckin) / (1000 * 60 * 60 * 24));
            if (nights < 1) {
                alert('Минимальный срок проживания - 1 ночи');
                return;
            }
            
            selectedCheckout = date;
            checkoutDateEl.textContent = formatDate(date, true);
            
            // Расчет стоимости
            calculatePrice();
            
            // Выделяем весь диапазон дат
            highlightDateRange();
        }
    }
    
    // Перерисовываем календарь для обновления выделения
    renderCalendar(currentDate);
}

// Расчет стоимости
function calculatePrice() {
    if (!selectedCheckin || !selectedCheckout) return;
    
    const nights = Math.ceil((selectedCheckout - selectedCheckin) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * PRICE_PER_NIGHT;
    
    // Применяем скидки
    let discount = 0;
    let discountType = '';
    
    if (nights >= 30) {
        discount = totalPrice * DISCOUNTS.month;
        discountType = 'month';
    } else if (nights >= 7) {
        discount = totalPrice * DISCOUNTS.week;
        discountType = 'week';
    }
    
    const finalPrice = totalPrice - discount;
    const deposit = finalPrice * DEPOSIT_PERCENTAGE;
    
    // Обновляем интерфейс
    nightsCountEl.textContent = nights;
    accommodationPriceEl.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    discountAmountEl.textContent = `-${discount.toLocaleString('ru-RU')} ₽`;
    depositAmountEl.textContent = `${Math.round(deposit).toLocaleString('ru-RU')} ₽`;
    
    // Показываем блок с ценами
    priceSummary.style.display = 'block';
    
    // Активируем кнопку
    bookNowBtn.disabled = false;
    bookNowBtn.innerHTML = `<i class="fas fa-lock"></i> Оплатить предоплату ${Math.round(deposit).toLocaleString('ru-RU')} ₽`;
}

// Подсветка дат для промо-акций
function highlightPromoDates(promoType) {
    const nightsNeeded = promoType === 'week' ? 7 : 30;
    
    // Находим подходящие даты для промо-акции
    const availableDates = findAvailableDatesForPromo(nightsNeeded);
    
    if (availableDates.length > 0) {
        // Выбираем первый доступный диапазон
        const range = availableDates[0];
        selectedCheckin = range.start;
        selectedCheckout = range.end;
        
        // Обновляем интерфейс
        checkinDateEl.textContent = formatDate(selectedCheckin, true);
        checkoutDateEl.textContent = formatDate(selectedCheckout, true);
        
        // Прокручиваем к календарю
        setTimeout(() => {
            document.getElementById('calendar').scrollIntoView({ behavior: 'smooth' });
            calculatePrice();
            renderCalendar(selectedCheckin);
        }, 500);
    } else {
        alert(`К сожалению, нет доступных дат для бронирования на ${nightsNeeded} ночей подряд.`);
    }
}

// Поиск доступных диапазонов ТОЧНОЙ длины для промо-акций
function findAvailableDatesForPromo(nightsNeeded) {
    const ranges = [];
    
    // Получаем все доступные даты
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Проверяем даты на 6 месяцев вперед
    for (let i = 0; i < 180; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = formatDate(date);
        
        if (!bookedDates.includes(dateString)) {
            availableDates.push({
                date: date,
                dateString: dateString
            });
        }
    }
    
    // Ищем диапазоны РОВНО nightsNeeded ночей
    for (let i = 0; i <= availableDates.length - nightsNeeded; i++) {
        let validRange = true;
        
        // Проверяем, что все дни в диапазоне доступны подряд
        for (let j = 0; j < nightsNeeded; j++) {
            const currentDate = new Date(availableDates[i].date);
            currentDate.setDate(availableDates[i].date.getDate() + j);
            const currentDateString = formatDate(currentDate);
            
            // Проверяем, доступна ли эта дата
            const isAvailable = availableDates.some(d => d.dateString === currentDateString);
            
            if (!isAvailable) {
                validRange = false;
                break;
            }
        }
        
        if (validRange) {
            const startDate = availableDates[i].date;
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + nightsNeeded);
            
            ranges.push({
                start: startDate,
                end: endDate,
                nights: nightsNeeded
            });
        }
    }
    
    return ranges;
}

// Поиск доступных диапазонов (старая функция - оставляем для других целей)
function findAvailableRanges(minNights) {
    const ranges = [];
    let currentRange = null;
    
    // Получаем все доступные даты из календаря
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Проверяем даты на 6 месяцев вперед
    for (let i = 0; i < 180; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = formatDate(date);
        
        if (!bookedDates.includes(dateString)) {
            availableDates.push(date);
        }
    }
    
    // Ищем подходящие диапазоны
    for (let i = 0; i < availableDates.length; i++) {
        if (!currentRange) {
            currentRange = { start: availableDates[i], end: availableDates[i] };
        } else {
            const prevDate = new Date(currentRange.end);
            prevDate.setDate(prevDate.getDate() + 1);
            
            if (formatDate(prevDate) === formatDate(availableDates[i])) {
                currentRange.end = availableDates[i];
            } else {
                const rangeNights = Math.ceil((currentRange.end - currentRange.start) / (1000 * 60 * 60 * 24));
                if (rangeNights >= minNights) {
                    ranges.push(currentRange);
                }
                currentRange = { start: availableDates[i], end: availableDates[i] };
            }
        }
    }
    
    // Проверяем последний диапазон
    if (currentRange) {
        const rangeNights = Math.ceil((currentRange.end - currentRange.start) / (1000 * 60 * 60 * 24));
        if (rangeNights >= minNights) {
            ranges.push(currentRange);
        }
    }
    
    return ranges;
}

// Поиск доступных диапазонов
function findAvailableRanges(minNights) {
    const ranges = [];
    let currentRange = null;
    
    // Получаем все доступные даты из календаря
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Проверяем даты на 6 месяцев вперед
    for (let i = 0; i < 180; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = formatDate(date);
        
        if (!bookedDates.includes(dateString)) {
            availableDates.push(date);
        }
    }
    
    // Ищем подходящие диапазоны
    for (let i = 0; i < availableDates.length; i++) {
        if (!currentRange) {
            currentRange = { start: availableDates[i], end: availableDates[i] };
        } else {
            const prevDate = new Date(currentRange.end);
            prevDate.setDate(prevDate.getDate() + 1);
            
            if (formatDate(prevDate) === formatDate(availableDates[i])) {
                currentRange.end = availableDates[i];
            } else {
                const rangeNights = Math.ceil((currentRange.end - currentRange.start) / (1000 * 60 * 60 * 24));
                if (rangeNights >= minNights) {
                    ranges.push(currentRange);
                }
                currentRange = { start: availableDates[i], end: availableDates[i] };
        }
        }
    }
    
    // Проверяем последний диапазон
    if (currentRange) {
        const rangeNights = Math.ceil((currentRange.end - currentRange.start) / (1000 * 60 * 60 * 24));
        if (rangeNights >= minNights) {
            ranges.push(currentRange);
        }
    }
    
    return ranges;
}

// Форматирование даты
function formatDate(date, withYear = false) {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return withYear ? `${day}.${month}.${year}` : `${year}-${month}-${day}`;
}

// Обработчики навигации по месяцам
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
}

if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
}

// Обработчик кнопки бронирования
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
        if (!selectedCheckin || !selectedCheckout) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        // Сохраняем данные бронирования
        const bookingData = {
            checkin: formatDate(selectedCheckin, true),
            checkout: formatDate(selectedCheckout, true),
            nights: parseInt(nightsCountEl.textContent),
            deposit: parseInt(depositAmountEl.textContent.replace(/\D/g, '')),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('mamayBooking', JSON.stringify(bookingData));
        
        // Имитация перехода на страницу оплаты
        bookNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Перенаправление...';
        bookNowBtn.disabled = true;
        
        setTimeout(() => {
            alert(`В реальной системе вы были бы перенаправлены на защищенную страницу оплаты предоплаты в размере ${bookingData.deposit.toLocaleString('ru-RU')} ₽\n\nДаты: с ${bookingData.checkin} по ${bookingData.checkout}\nКоличество ночей: ${bookingData.nights}`);
            
            // В реальном проекте здесь будет redirect на платежный шлюз
            // window.location.href = 'https://payment-gateway.com/pay?amount=' + bookingData.deposit;
            
            bookNowBtn.innerHTML = `<i class="fas fa-lock"></i> Оплатить предоплату ${bookingData.deposit.toLocaleString('ru-RU')} ₽`;
            bookNowBtn.disabled = false;
        }, 2000);
    });
}
    
    // 4. Форма бронирования
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                cottage: document.getElementById('cottage').value,
                message: document.getElementById('message').value,
                dates: selectedCheckin && selectedCheckout ? 
                       `${formatDate(selectedCheckin, true)} - ${formatDate(selectedCheckout, true)}` : 'Не выбраны'
            };
            
            // Имитация отправки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(`Заявка отправлена успешно!\n\nМы свяжемся с вами в течение 15 минут для подтверждения бронирования.`);
                
                // Сброс формы
                bookingForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Прокрутка вверх
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });
    }
    
    // 5. Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрываем меню на мобильных
                if (window.innerWidth <= 992) {
                    if (mobileHamburger) {
                        mobileHamburger.classList.remove('active');
                        sidebar.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });
    
    // 6. Активное меню при скролле
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // 7. Инициализация всех компонентов
    initSlider();
    initCalendar();
    
    // 8. Обновление года в футере
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('#currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});


// 8. Инициализация календаря для выбора дат
function initDatePicker() {
    const calendarTrigger = document.getElementById('calendarTrigger');
    const miniCalendar = document.getElementById('miniCalendar');
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthEl = document.querySelector('.current-month');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const clearDatesBtn = document.querySelector('.clear-dates');
    const applyDatesBtn = document.querySelector('.apply-dates');
    const selectedRangeEl = document.getElementById('selectedRange');
    const datesInput = document.getElementById('dates');
    const dateInfoEl = document.getElementById('dateInfo');
    
    if (!calendarTrigger) return;
    
    let currentDate = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;
    let isCalendarOpen = false;
    
    // Список занятых дат (для примера)
    const bookedDates = [
        '2024-12-20', '2024-12-21', '2024-12-22',
        '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31',
        '2025-01-01', '2025-01-02', '2025-01-03',
        '2025-01-10', '2025-01-11'
    ];
    
    // Открытие/закрытие календаря
    calendarTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCalendar();
    });
    
    // Функция переключения календаря
    function toggleCalendar() {
        if (!isCalendarOpen) {
            openCalendar();
        } else {
            closeCalendar();
        }
    }
    
    // Открыть календарь
    function openCalendar() {
        miniCalendar.classList.add('show');
        isCalendarOpen = true;
        renderCalendar(currentDate);
        
        // Добавляем эффект замерзания
        miniCalendar.classList.add('freeze-crack-effect');
        setTimeout(() => {
            miniCalendar.classList.add('freezing');
            setTimeout(() => {
                miniCalendar.classList.remove('freezing');
            }, 1000);
        }, 100);
    }
    
    // Закрыть календарь
    function closeCalendar() {
        miniCalendar.classList.remove('show');
        isCalendarOpen = false;
    }
    
    // Закрытие календаря при клике вне его (но не при первом клике на триггер)
    document.addEventListener('click', function(e) {
        // Если календарь открыт И клик был вне календаря И не на триггере
        if (isCalendarOpen && 
            !miniCalendar.contains(e.target) && 
            e.target !== calendarTrigger && 
            !calendarTrigger.contains(e.target)) {
            closeCalendar();
        }
    });
    
    // Рендер календаря
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Обновляем заголовок
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        
        // Очищаем контейнер дней
        calendarDays.innerHTML = '';
        
        // Первый день месяца
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        // Последний день месяца
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        
        // Сегодняшняя дата
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Пустые ячейки в начале
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarDays.appendChild(emptyCell);
        }
        
        // Дни месяца
        for (let day = 1; day <= totalDays; day++) {
            const currentDateObj = new Date(year, month, day);
            const dateString = formatDate(currentDateObj);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;
            dayCell.dataset.date = dateString;
            
            // Проверяем, занята ли дата
            if (bookedDates.includes(dateString)) {
                dayCell.classList.add('disabled');
                dayCell.title = 'Дата занята';
            } else {
                // Проверяем, сегодня ли это
                if (currentDateObj.getTime() === today.getTime()) {
                    dayCell.classList.add('today');
                }
                
                // Проверяем, входит ли дата в выбранный диапазон
                if (selectedStartDate && selectedEndDate) {
                    if (currentDateObj >= selectedStartDate && currentDateObj <= selectedEndDate) {
                        dayCell.classList.add('in-range');
                        
                        // Если это первый или последний день диапазона
                        if (formatDate(currentDateObj) === formatDate(selectedStartDate) || 
                            formatDate(currentDateObj) === formatDate(selectedEndDate)) {
                            // Убираем in-range для выбранных дат
                            dayCell.classList.remove('in-range');
                        }
                    }
                }
                
                // Проверяем, выбрана ли дата как начало или конец
                if (selectedStartDate && formatDate(selectedStartDate) === dateString) {
                    dayCell.classList.add('selected');
                }
                if (selectedEndDate && formatDate(selectedEndDate) === dateString) {
                    dayCell.classList.add('selected');
                }
                
                // Обработчик клика
                dayCell.addEventListener('click', function(e) {
                    e.stopPropagation(); // Предотвращаем всплытие
                    selectDate(currentDateObj);
                });
                
                // Эффект при наведении
                dayCell.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('disabled')) {
                        this.style.transform = 'scale(1.1)';
                    }
                });
                
                dayCell.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            }
            
            // Проверяем прошедшие даты
            if (currentDateObj < today) {
                dayCell.classList.add('disabled');
                dayCell.title = 'Прошедшая дата';
            }
            
            calendarDays.appendChild(dayCell);
        }
        
        // Обновляем информацию о выбранных датах
        updateSelectedDatesInfo();
    }
    
    // Выбор даты
    function selectDate(date) {
        // Если нет выбранной начальной даты или выбраны обе даты
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Выбор начальной даты (или сброс, если выбраны обе даты)
            selectedStartDate = date;
            selectedEndDate = null;
            dateInfoEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Теперь выберите дату выезда</span>';
            dateInfoEl.style.color = '';
        } 
        // Если есть начальная дата, но нет конечной
        else if (selectedStartDate && !selectedEndDate) {
            // Если выбрана та же дата - отменяем выбор
            if (formatDate(date) === formatDate(selectedStartDate)) {
                selectedStartDate = null;
                dateInfoEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Выберите дату заезда и выезда</span>';
            }
            // Если выбрана более ранняя дата - меняем начальную дату
            else if (date < selectedStartDate) {
                selectedStartDate = date;
                dateInfoEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Теперь выберите дату выезда</span>';
            }
            // Если выбрана более поздняя дата - устанавливаем конечную дату
            else {
                // Проверяем минимальное количество ночей
                const nights = Math.ceil((date - selectedStartDate) / (1000 * 60 * 60 * 24));
                if (nights < 1) {
                    showDateNotification('Минимальный срок проживания - 1 ночь');
                    return;
                }
                
                selectedEndDate = date;
                dateInfoEl.innerHTML = `<i class="fas fa-check-circle"></i><span>Выбрано ${nights} ночей</span>`;
                dateInfoEl.style.color = 'var(--accent-color)';
            }
        }
        
        // Перерисовываем календарь
        renderCalendar(currentDate);
    }
    
    // Обновление информации о выбранных датах
    function updateSelectedDatesInfo() {
        if (selectedStartDate && selectedEndDate) {
            const nights = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
            selectedRangeEl.textContent = `${formatDate(selectedStartDate, true)} - ${formatDate(selectedEndDate, true)} (${nights} ночей)`;
        } else if (selectedStartDate) {
            selectedRangeEl.textContent = `С ${formatDate(selectedStartDate, true)} - выберите дату выезда`;
        } else {
            selectedRangeEl.textContent = 'Выберите даты заезда и выезда';
        }
    }
    
    // Форматирование даты
    function formatDate(date, withYear = false) {
        if (!date) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return withYear ? `${day}.${month}.${year}` : `${year}-${month}-${day}`;
    }
    
    // Показать уведомление
    function showDateNotification(message) {
        // Удаляем старые уведомления
        const oldNotifications = document.querySelectorAll('.date-notification');
        oldNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        const notification = document.createElement('div');
        notification.className = 'date-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Навигация по месяцам
    prevMonthBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
    
    // Очистка выбранных дат
    clearDatesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        selectedStartDate = null;
        selectedEndDate = null;
        datesInput.value = '';
        dateInfoEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Выберите дату заезда и выезда</span>';
        dateInfoEl.style.color = '';
        renderCalendar(currentDate);
    });
    
    // Применение выбранных дат
    applyDatesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (selectedStartDate && selectedEndDate) {
            const nights = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
            datesInput.value = `${formatDate(selectedStartDate, true)} - ${formatDate(selectedEndDate, true)} (${nights} ночей)`;
            
            // Эффект подтверждения
            datesInput.style.animation = 'none';
            setTimeout(() => {
                datesInput.style.animation = 'dateConfirmed 0.5s ease';
            }, 10);
            
            // Закрываем календарь
            setTimeout(() => {
                closeCalendar();
            }, 300);
        } else {
            showDateNotification('Пожалуйста, выберите даты заезда и выезда');
        }
    });
    
    // Предотвращаем закрытие календаря при клике внутри него
    miniCalendar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}