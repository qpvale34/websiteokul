
document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
});

function initAdminPanel() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Set first tab as active initially
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add('text-sky-800');
        tabContents[0].classList.remove('hidden');
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('text-sky-800'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to current tab
            this.classList.add('text-sky-800');
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
        });
    });
    
    // Logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.reload();
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Check stored credentials or use default
            const storedUsername = localStorage.getItem('adminUsername') || 'admin';
            const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
            
            if (username === storedUsername && password === storedPassword) {
                // Login successful
                document.getElementById('loginScreen').classList.add('hidden');
                document.getElementById('adminHeader').classList.remove('hidden');
                document.getElementById('adminContent').classList.remove('hidden');
                
                // Store login state in session
                sessionStorage.setItem('adminLoggedIn', 'true');
            } else {
                // Login failed
                const loginError = document.getElementById('loginError');
                if (loginError) {
                    loginError.classList.remove('hidden');
                }
            }
        });
    }
    
    // Password change form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
            const passwordMessage = document.getElementById('passwordMessage');
            
            if (currentPassword !== storedPassword) {
                passwordMessage.textContent = 'Mevcut şifre hatalı!';
                passwordMessage.className = 'mt-4 text-center text-red-500';
                passwordMessage.classList.remove('hidden');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                passwordMessage.textContent = 'Yeni şifreler eşleşmiyor!';
                passwordMessage.className = 'mt-4 text-center text-red-500';
                passwordMessage.classList.remove('hidden');
                return;
            }
            
            // Save new password
            localStorage.setItem('adminPassword', newPassword);
            
            passwordMessage.textContent = 'Şifre başarıyla güncellendi!';
            passwordMessage.className = 'mt-4 text-center text-green-500';
            passwordMessage.classList.remove('hidden');
            
            // Clear form
            passwordForm.reset();
        });
    }
    
    // Initialize forms
    initAnnouncementForm();
    initNewsForm();
    initSliderForm();
    initSchoolInfoForm();
    initGalleryForm();
    initContactForm();
    initSuccessForm();
    initProjectsForm();
    
    // Load existing content
    loadAnnouncements();
    loadNews();
    loadSlides();
    loadGalleryImages();
    loadRegistrations();
    loadPageContents();
}

// Announcement functionality
function initAnnouncementForm() {
    const announcementForm = document.getElementById('announcementForm');
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('announcementTitle').value;
            const description = document.getElementById('announcementDescription').value;
            const date = document.getElementById('announcementDate').value;
            
            // Get existing announcements or create empty array
            const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            
            // Add new announcement
            announcements.push({
                title: title,
                description: description,
                date: date
            });
            
            // Save announcements
            localStorage.setItem('announcements', JSON.stringify(announcements));
            
            // Reload announcements list
            loadAnnouncements();
            
            // Clear form
            announcementForm.reset();
        });
    }
}

function loadAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    if (announcementsList) {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        
        if (announcements.length > 0) {
            announcementsList.innerHTML = '';
            
            announcements.forEach((announcement, index) => {
                const date = announcement.date ? new Date(announcement.date).toLocaleDateString('tr-TR') : '';
                
                const announcementElement = document.createElement('div');
                announcementElement.className = 'p-4 bg-gray-50 rounded border border-gray-200';
                announcementElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-lg">${announcement.title || ''}</h3>
                            <p class="text-gray-600">${announcement.description || ''}</p>
                            <p class="text-sm text-gray-500 mt-2">${date}</p>
                        </div>
                        <button class="delete-announcement text-red-500 hover:text-red-700" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                `;
                
                announcementsList.appendChild(announcementElement);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-announcement').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    
                    if (confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
                        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
                        announcements.splice(index, 1);
                        localStorage.setItem('announcements', JSON.stringify(announcements));
                        
                        loadAnnouncements();
                    }
                });
            });
        } else {
            announcementsList.innerHTML = '<p class="text-gray-500">Henüz duyuru bulunmamaktadır.</p>';
        }
    }
}

// News functionality
function initNewsForm() {
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('newsTitle').value;
            const description = document.getElementById('newsDescription').value;
            const date = document.getElementById('newsDate').value;
            
            // Get existing news or create empty array
            const news = JSON.parse(localStorage.getItem('news') || '[]');
            
            // Add new news item
            news.push({
                title: title,
                description: description,
                date: date
            });
            
            // Save news
            localStorage.setItem('news', JSON.stringify(news));
            
            // Reload news list
            loadNews();
            
            // Clear form
            newsForm.reset();
        });
    }
}

function loadNews() {
    const newsListAdmin = document.getElementById('newsListAdmin');
    if (newsListAdmin) {
        const news = JSON.parse(localStorage.getItem('news') || '[]');
        
        if (news.length > 0) {
            newsListAdmin.innerHTML = '';
            
            news.forEach((newsItem, index) => {
                const date = newsItem.date ? new Date(newsItem.date).toLocaleDateString('tr-TR') : '';
                
                const newsElement = document.createElement('div');
                newsElement.className = 'p-4 bg-gray-50 rounded border border-gray-200';
                newsElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-lg">${newsItem.title || ''}</h3>
                            <p class="text-gray-600">${newsItem.description || ''}</p>
                            <p class="text-sm text-gray-500 mt-2">${date}</p>
                        </div>
                        <button class="delete-news text-red-500 hover:text-red-700" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                `;
                
                newsListAdmin.appendChild(newsElement);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-news').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    
                    if (confirm('Bu haberi silmek istediğinize emin misiniz?')) {
                        const news = JSON.parse(localStorage.getItem('news') || '[]');
                        news.splice(index, 1);
                        localStorage.setItem('news', JSON.stringify(news));
                        
                        loadNews();
                    }
                });
            });
        } else {
            newsListAdmin.innerHTML = '<p class="text-gray-500">Henüz haber bulunmamaktadır.</p>';
        }
    }
}

// Slider functionality
function initSliderForm() {
    const sliderForm = document.getElementById('sliderForm');
    if (sliderForm) {
        sliderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('sliderTitle').value;
            const description = document.getElementById('sliderDescription').value;
            const imageURL = document.getElementById('sliderImageURL').value;
            
            // Get existing slides or create empty array
            const slides = JSON.parse(localStorage.getItem('slides') || '[]');
            
            // Add new slide
            slides.push({
                title: title,
                description: description,
                imageURL: imageURL
            });
            
            // Save slides
            localStorage.setItem('slides', JSON.stringify(slides));
            
            // Reload slides list
            loadSlides();
            
            // Clear form
            sliderForm.reset();
        });
    }
}

function loadSlides() {
    const sliderListAdmin = document.getElementById('sliderListAdmin');
    if (sliderListAdmin) {
        const slides = JSON.parse(localStorage.getItem('slides') || '[]');
        
        if (slides.length > 0) {
            sliderListAdmin.innerHTML = '';
            
            slides.forEach((slide, index) => {
                const slideElement = document.createElement('div');
                slideElement.className = 'p-4 bg-gray-50 rounded border border-gray-200';
                slideElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex gap-4 items-center">
                            <img src="${slide.imageURL}" alt="${slide.title}" class="w-24 h-16 object-cover rounded">
                            <div>
                                <h3 class="font-bold text-lg">${slide.title || ''}</h3>
                                <p class="text-gray-600">${slide.description || ''}</p>
                            </div>
                        </div>
                        <button class="delete-slide text-red-500 hover:text-red-700" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                `;
                
                sliderListAdmin.appendChild(slideElement);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-slide').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    
                    if (confirm('Bu slider görselini silmek istediğinize emin misiniz?')) {
                        const slides = JSON.parse(localStorage.getItem('slides') || '[]');
                        slides.splice(index, 1);
                        localStorage.setItem('slides', JSON.stringify(slides));
                        
                        loadSlides();
                    }
                });
            });
        } else {
            sliderListAdmin.innerHTML = '<p class="text-gray-500">Henüz slider görseli bulunmamaktadır.</p>';
        }
    }
}

// School info functionality
function initSchoolInfoForm() {
    const schoolInfoForm = document.getElementById('schoolInfoForm');
    if (schoolInfoForm) {
        // Populate form with existing data
        const schoolInfo = JSON.parse(localStorage.getItem('schoolInfo') || '{}');
        
        const schoolNameInput = document.getElementById('schoolNameInput');
        const schoolLogoURL = document.getElementById('schoolLogoURL');
        const schoolBgURL = document.getElementById('schoolBgURL');
        
        if (schoolNameInput && schoolInfo.name) {
            schoolNameInput.value = schoolInfo.name;
        }
        
        if (schoolLogoURL && schoolInfo.logoURL) {
            schoolLogoURL.value = schoolInfo.logoURL;
        }
        
        if (schoolBgURL && schoolInfo.bgURL) {
            schoolBgURL.value = schoolInfo.bgURL;
        }
        
        // Form submission
        schoolInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = schoolNameInput.value;
            const logoURL = schoolLogoURL.value;
            const bgURL = schoolBgURL.value;
            
            // Save school info
            localStorage.setItem('schoolInfo', JSON.stringify({
                name: name,
                logoURL: logoURL,
                bgURL: bgURL
            }));
            
            alert('Okul bilgileri başarıyla güncellendi!');
        });
    }
}

// Registrations functionality
function loadRegistrations() {
    const registrationsTableBody = document.getElementById('registrationsTableBody');
    if (registrationsTableBody) {
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        
        if (registrations.length > 0) {
            registrationsTableBody.innerHTML = '';
            
            registrations.forEach((registration, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border-b border-gray-200">${registration.studentName || ''}</td>
                    <td class="py-2 px-4 border-b border-gray-200">${registration.fatherName || ''}</td>
                    <td class="py-2 px-4 border-b border-gray-200">${registration.district || ''}</td>
                    <td class="py-2 px-4 border-b border-gray-200">${registration.phone || ''}</td>
                    <td class="py-2 px-4 border-b border-gray-200">
                        <button class="view-registration text-sky-600 hover:text-sky-800" data-index="${index}">Detay</button>
                    </td>
                `;
                
                registrationsTableBody.appendChild(row);
            });
            
            // Add event listeners for view buttons
            document.querySelectorAll('.view-registration').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const registration = registrations[index];
                    
                    // Format registration details
                    let details = '';
                    for (const key in registration) {
                        if (registration.hasOwnProperty(key)) {
                            const label = formatFieldName(key);
                            details += `<p><strong>${label}:</strong> ${registration[key] || '-'}</p>`;
                        }
                    }
                    
                    // Create and show modal
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    modal.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-xl font-bold text-sky-800">Başvuru Detayı</h3>
                                <button class="close-modal text-gray-500 hover:text-gray-700">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="space-y-2">
                                ${details}
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    // Close modal on button click
                    modal.querySelector('.close-modal').addEventListener('click', function() {
                        document.body.removeChild(modal);
                    });
                    
                    // Close modal on outside click
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal) {
                            document.body.removeChild(modal);
                        }
                    });
                });
            });
        }
    }
}

// Format field names for display
function formatFieldName(key) {
    const fieldNames = {
        'studentName': 'Öğrenci Adı',
        'fatherName': 'Baba Adı',
        'fatherJob': 'Baba Mesleği',
        'motherName': 'Anne Adı',
        'motherJob': 'Anne Mesleği',
        'address': 'Adres',
        'district': 'Semt',
        'phone': 'Telefon',
        'email': 'E-posta',
        'school': 'Şu anki Okul',
        'notes': 'Notlar'
    };
    
    return fieldNames[key] || key;
}

// Page content management
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactContent = document.getElementById('contactContent');
    
    if (contactForm && contactContent) {
        // Load existing content
        const content = localStorage.getItem('contactContent');
        if (content) {
            contactContent.value = content;
        }
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            localStorage.setItem('contactContent', contactContent.value);
            alert('İletişim sayfası içeriği başarıyla güncellendi!');
        });
    }
}

function initSuccessForm() {
    const successForm = document.getElementById('successForm');
    const successContent = document.getElementById('successContent');
    
    if (successForm && successContent) {
        // Load existing content
        const content = localStorage.getItem('successContent');
        if (content) {
            successContent.value = content;
        }
        
        // Form submission
        successForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            localStorage.setItem('successContent', successContent.value);
            alert('Başarılarımız sayfası içeriği başarıyla güncellendi!');
        });
    }
}

function initProjectsForm() {
    const projectsForm = document.getElementById('projectsForm');
    const projectsContent = document.getElementById('projectsContent');
    
    if (projectsForm && projectsContent) {
        // Load existing content
        const content = localStorage.getItem('projectsContent');
        if (content) {
            projectsContent.value = content;
        }
        
        // Form submission
        projectsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            localStorage.setItem('projectsContent', projectsContent.value);
            alert('Projelerimiz sayfası içeriği başarıyla güncellendi!');
        });
    }
}

// Gallery functionality
function initGalleryForm() {
    const galleryForm = document.getElementById('galleryForm');
    if (galleryForm) {
        galleryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('galleryImageTitle').value;
            const imageURL = document.getElementById('galleryImageURL').value;
            
            // Get existing images or create empty array
            const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            
            // Add new image
            galleryImages.push({
                title: title,
                imageURL: imageURL
            });
            
            // Save images
            localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
            
            // Reload gallery images list
            loadGalleryImages();
            
            // Clear form
            galleryForm.reset();
        });
    }
}

function loadGalleryImages() {
    const galleryListAdmin = document.getElementById('galleryListAdmin');
    if (galleryListAdmin) {
        const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        
        if (galleryImages.length > 0) {
            galleryListAdmin.innerHTML = '';
            
            galleryImages.forEach((image, index) => {
                const imageElement = document.createElement('div');
                imageElement.className = 'relative bg-gray-50 rounded border border-gray-200';
                imageElement.innerHTML = `
                    <img src="${image.imageURL}" alt="${image.title}" class="w-full h-48 object-cover rounded-t">
                    <div class="p-3">
                        <h3 class="font-medium text-gray-800">${image.title || ''}</h3>
                        <button class="delete-gallery-image absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                `;
                
                galleryListAdmin.appendChild(imageElement);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-gallery-image').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    
                    if (confirm('Bu galeri resmini silmek istediğinize emin misiniz?')) {
                        const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                        galleryImages.splice(index, 1);
                        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
                        
                        loadGalleryImages();
                    }
                });
            });
        } else {
            galleryListAdmin.innerHTML = '<p class="text-gray-500 col-span-3">Henüz galeri resmi bulunmamaktadır.</p>';
        }
    }
}

function loadPageContents() {
    // This function would load page contents into text areas if we're in the admin panel
    // This is already handled in the individual form init functions
}
