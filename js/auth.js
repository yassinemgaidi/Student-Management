// Check if user is already logged in
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
        window.location.href = 'dashboard.html';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Check credentials
    if (username === 'user' && password === '123456') {
        sessionStorage.setItem('isAuthenticated', 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorMessage.classList.remove('hidden');
    }
});

function logout() {
    sessionStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
}

// Run auth check when page loads
checkAuth();