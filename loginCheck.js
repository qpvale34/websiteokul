
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is already logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        const loginScreen = document.getElementById('loginScreen');
        const adminHeader = document.getElementById('adminHeader');
        const adminContent = document.getElementById('adminContent');
        
        if (loginScreen && adminHeader && adminContent) {
            loginScreen.classList.add('hidden');
            adminHeader.classList.remove('hidden');
            adminContent.classList.remove('hidden');
        }
    }
    
    // Handle Login Form
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
                    
                    // Hide error message after 3 seconds
                    setTimeout(function() {
                        loginError.classList.add('hidden');
                    }, 3000);
                }
            }
        });
    }
});
