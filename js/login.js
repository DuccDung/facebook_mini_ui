// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form[data-testid="royal_login_form"]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('pass').value;
            
            // Simple validation
            if (email && password) {
                // In a real app, you would validate credentials here
                // For demo purposes, just redirect to home
                window.location.href = 'home.html';
            } else {
                alert('Vui lòng nhập email và mật khẩu');
            }
        });
    }
    
    // Handle "Create new account" button
    const registerBtn = document.querySelector('a[data-testid="open-registration-form-button"]');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Register.html';
        });
    }
    
    // Handle "Forgot password" link
    const forgotPasswordLink = document.querySelector('a[href*="recover"]');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'forgotpass.html';
        });
    }
});
