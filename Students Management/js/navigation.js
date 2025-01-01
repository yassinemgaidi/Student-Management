document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('nav a');
    
    navItems.forEach(item => {
        item.classList.remove('bg-blue-900');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('bg-blue-900');
        }
    });
});