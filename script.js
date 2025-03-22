document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar && sidebarClose) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
        });

        sidebarClose.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
        });
    }

    // Carousel/Slider Functionality
    setupCarousel();

    // Load Content
    loadAnnouncements();
    loadNews();
    loadSchoolInfo();
    loadGalleryContent(); // Added gallery loading
});

// Carousel Setup and Control
function setupCarousel() {
    const carouselItems = document.getElementById('carouselItems');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carouselItems || !prevBtn || !nextBtn) return;

    // Default slides if none exist in localStorage
    const defaultSlides = [
        {
            imageURL: 'images/school-1.jpg',
            title: 'Hoş Geldiniz',
            description: 'Eğitimde Mükemmelliği Hedefliyoruz'
        },
        {
            imageURL: 'images/school-2.jpg',
            title: 'Başarılarımız',
            description: 'Öğrencilerimizin Akademik ve Sosyal Başarıları'
        },
        {
            imageURL: 'images/school-3.jpg',
            title: 'Modern Eğitim',
            description: 'Teknoloji ile Entegre Eğitim Sistemimiz'
        }
    ];

    const slides = JSON.parse(localStorage.getItem('slides') || JSON.stringify(defaultSlides));
    let currentSlide = 0;
    let isTransitioning = false;

    if (slides.length > 0) {
        carouselItems.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `carousel-item absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center items-center text-center p-8 ${
                index === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`;
            slideElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${slide.imageURL}')`;
            slideElement.style.backgroundSize = 'cover';
            slideElement.style.backgroundPosition = 'center';

            slideElement.innerHTML = `
                <div class="transform transition-transform duration-700 scale-90 opacity-90 hover:scale-100 hover:opacity-100">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white text-shadow-lg">${slide.title}</h2>
                    <p class="text-xl md:text-2xl text-white text-shadow-md max-w-3xl mx-auto">${slide.description}</p>
                </div>
            `;

            carouselItems.appendChild(slideElement);
        });
    }

    const slideElements = carouselItems.querySelectorAll('.carousel-item');
    if (slideElements.length <= 1) return;

    function showSlide(n, direction = 'right') {
        if (isTransitioning) return;
        isTransitioning = true;

        const current = slideElements[currentSlide];
        const next = slideElements[n];
        
        // Direction based translations
        const outTransform = direction === 'right' ? '-translate-x-full' : 'translate-x-full';
        const inTransform = direction === 'right' ? 'translate-x-full' : '-translate-x-full';

        // Set initial position for incoming slide
        next.classList.remove('opacity-0', '-translate-x-full', 'translate-x-full');
        next.classList.add(inTransform);

        // Trigger reflow
        void next.offsetWidth;

        // Animate both slides
        current.classList.add('opacity-0', outTransform);
        next.classList.remove(inTransform);
        next.classList.add('opacity-100');

        setTimeout(() => {
            isTransitioning = false;
            currentSlide = n;
        }, 700);
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slideElements.length;
        showSlide(next, 'right');
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slideElements.length) % slideElements.length;
        showSlide(prev, 'left');
    }

    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Add swipe support for touch devices
    let touchStartX = 0;
    carouselItems.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carouselItems.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    });

    // Auto-advance slides every 6 seconds if no interaction
    let autoplayInterval = setInterval(nextSlide, 6000);

    // Pause autoplay on hover
    carouselItems.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselItems.addEventListener('mouseleave', () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 6000);
    });
}

// Load Announcements
function loadAnnouncements() {
    const announcementsContainer = document.getElementById('announcements');
    if (!announcementsContainer) return;

    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');

    if (announcements.length > 0) {
        announcementsContainer.innerHTML = '';

        announcements.slice(0, 3).forEach(announcement => {
            const date = announcement.date ? new Date(announcement.date).toLocaleDateString('tr-TR') : '';

            const announcementElement = document.createElement('div');
            announcementElement.className = 'bg-sky-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow';
            announcementElement.innerHTML = `
                <h3 class="font-bold text-xl text-sky-800 mb-2">${announcement.title || ''}</h3>
                <p class="text-gray-600 mb-4">${announcement.description || ''}</p>
                <p class="text-sm text-gray-500 font-medium">${date}</p>
            `;

            announcementsContainer.appendChild(announcementElement);
        });
    }
}

// Load News
function loadNews() {
    const newsContainer = document.getElementById('newsList');
    if (!newsContainer) return;

    const news = JSON.parse(localStorage.getItem('news') || '[]');

    if (news.length > 0) {
        newsContainer.innerHTML = '';

        news.slice(0, 3).forEach(newsItem => {
            const date = newsItem.date ? new Date(newsItem.date).toLocaleDateString('tr-TR') : '';

            const newsElement = document.createElement('div');
            newsElement.className = 'bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow';
            newsElement.innerHTML = `
                <h3 class="font-bold text-xl text-sky-800 mb-2">${newsItem.title || ''}</h3>
                <p class="text-gray-600 mb-4">${newsItem.description || ''}</p>
                <p class="text-sm text-gray-500 font-medium">${date}</p>
            `;

            newsContainer.appendChild(newsElement);
        });
    }
}

// Load School Info
function loadSchoolInfo() {
    // Get school info elements
    const schoolName = document.getElementById('schoolName');
    const schoolLogo = document.getElementById('schoolLogo');

    // Get school info from localStorage
    const schoolInfo = JSON.parse(localStorage.getItem('schoolInfo') || '{}');

    // Update school name if available
    if (schoolInfo.name && schoolName) {
        schoolName.innerHTML = schoolInfo.name.replace(/\n/g, '<br/>');
    }

    // Update school logo if available
    if (schoolInfo.logoURL && schoolLogo) {
        schoolLogo.innerHTML = `<img src="${schoolInfo.logoURL}" alt="Okul Logosu" class="h-12 w-12 object-contain">`;
    }

    // Update banner background if available
    if (schoolInfo.bgURL) {
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundImage = `linear-gradient(rgba(0, 123, 192, 0.9), rgba(0, 123, 192, 0.9)), url('${schoolInfo.bgURL}')`;
            header.style.backgroundSize = 'cover';
            header.style.backgroundPosition = 'center';
        }
    }
}

// Load gallery content
function loadGalleryContent() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (galleryContainer) {
        const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');

        if (galleryImages.length > 0) {
            galleryContainer.innerHTML = '';

            galleryImages.forEach(image => {
                const imageElement = document.createElement('div');
                imageElement.className = 'rounded-lg shadow-sm overflow-hidden';
                imageElement.innerHTML = `
                    <div class="relative group">
                        <img src="${image.imageURL}" alt="${image.title}" class="w-full h-48 object-cover">
                        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <h3 class="text-white text-center px-4">${image.title}</h3>
                        </div>
                    </div>
                `;

                galleryContainer.appendChild(imageElement);
            });
        } else {
            galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-4">Henüz galeri resmi bulunmamaktadır.</p>';
        }
    }
}

// Load content for specific pages
function loadPageSpecificContent() {
    // Check current page and load specific content
    const path = window.location.pathname;

    if (path.includes('iletisim.html')) {
        // Load contact content
        loadContactContent();
    } else if (path.includes('basarilar.html')) {
        // Load success content
        loadSuccessContent();
    } else if (path.includes('projeler.html')) {
        // Load projects content
        loadProjectsContent();
    }
}