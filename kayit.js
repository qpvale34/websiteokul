
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                studentName: document.getElementById('studentName').value,
                fatherName: document.getElementById('fatherName').value,
                fatherJob: document.getElementById('fatherJob').value,
                motherName: document.getElementById('motherName').value,
                motherJob: document.getElementById('motherJob').value,
                address: document.getElementById('address').value,
                district: document.getElementById('district').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                school: document.getElementById('school').value,
                notes: document.getElementById('notes').value,
                submitDate: new Date().toISOString()
            };
            
            // Get existing registrations or create empty array
            const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
            
            // Add new registration
            registrations.push(formData);
            
            // Save registrations
            localStorage.setItem('registrations', JSON.stringify(registrations));
            
            // Show success message
            registrationForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Reset form
            registrationForm.reset();
        });
    }
});
