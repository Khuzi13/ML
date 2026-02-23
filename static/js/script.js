/* ============================================================
   UNIVERSAL ML PROJECT TEMPLATE - STANDALONE JAVASCRIPT
   (Config and API dependencies removed)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTemplate();
});

// Remove Preloader after all resources are loaded (plus minimal delay for animations to be visible if cached)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Delay slightly so users see the cool animation before it vanishes instantly
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500); // Wait for transition to finish before removing from DOM
        }, 2200); // 2.2 seconds allows the SVG animations to mostly finish
    }
});

function initTemplate() {
    setupEventListeners();
    setupCharts();
    createParticles();
    document.getElementById('year').textContent = new Date().getFullYear();
    updateActiveLink(); // Set initial active link
}

// -------- EVENT LISTENERS --------
function setupEventListeners() {
    // Form submit simulation
    const form = document.getElementById('prediction-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('predict-btn');
            btn.classList.add('loading');
            btn.disabled = true;

            // Simulate loading state
            setTimeout(() => {
                showToast('Prediction generated successfully!', 'success');
                
                // Show Result Card contents
                const placeholder = document.getElementById('result-placeholder');
                const content = document.getElementById('result-content');
                if (placeholder && content) {
                    placeholder.classList.add('hidden');
                    content.classList.remove('hidden');
                }
                
                // Set dummy result
                const resultVal = document.getElementById('result-value');
                if (resultVal) resultVal.textContent = "1200 Units";
                
                // Setup confidence bar
                const confSection = document.getElementById('confidence-section');
                const confFill = document.getElementById('confidence-fill');
                const confText = document.getElementById('confidence-text');
                if (confSection) confSection.classList.remove('hidden');
                if (confFill && confText) {
                    setTimeout(() => {
                        confFill.style.width = '85%';
                        confText.textContent = '85%';
                    }, 100);
                }

                btn.classList.remove('loading');
                btn.disabled = false;
            }, 1000);
        });
    }

    // Navbar toggle
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveLink(); // Update active link styling while scrolling
    });

    // Close mobile nav on link click & handle smooth scrolling
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
            
            const href = this.getAttribute('href');
            if (!href) return;
            
            const currentPath = window.location.pathname;
            
            // 1. Prevent reload if clicking the exact link of the page we are already on (e.g., clicking 'Home' while on Home)
            // Or if clicking Home mapping ('/') while currently on '/home/'
            const isHomeEquivalent = (href === '/' || href === '/home' || href === '/home/') && 
                                     (currentPath === '/' || currentPath === '/home' || currentPath === '/home/');
                                     
            if (!href.includes('#') && (href === currentPath || href + '/' === currentPath || isHomeEquivalent)) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Just scroll to top smoothly
                return;
            }

            // 2. Handle smooth scrolling and prevent page reload for same-page anchors
            if (href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Check if the link's path matches our current path roughly
                    // Only prevent default if we're actually on the home page (where predict/visualize live)
                    const currentPath = window.location.pathname;
                    const isHomePage = currentPath === '/' || currentPath === '/home' || currentPath === '/home/';
                    
                    if (isHomePage) {
                        e.preventDefault(); // Prevent default navigation/reload
                        
                        // Close mobile nav on link click
                        const navLinks = document.querySelector('.nav-links');
                        if (navLinks) {
                            navLinks.classList.remove('active');
                        }
                        
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        history.pushState(null, null, '#' + targetId);
                    }
                }
            }
        });
    });

    // Clear history button
    const clearBtn = document.getElementById('clear-history');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            showToast('History cleared (placeholder)', 'info');
        });
    }
}

// -------- ACTIVE LINK TRACKING --------
function updateActiveLink() {
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath === '/home' || currentPath === '/home/';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentId = '';

    if (isHomePage) {
        // Find which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Offset for navbar
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        // Force 'home' as active if at the top
        if (window.scrollY < 100) {
            currentId = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Check if link matches the current view
            if (currentId && href.includes('#' + currentId)) {
                link.classList.add('active');
            } else if (currentId === 'home' && (href === '/' || href.includes('/home') && !href.includes('#'))) {
                link.classList.add('active'); 
            }
        });
    } else {
        // On other pages (like /about-us/)
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (currentPath.includes(href) || href.includes(currentPath)) {
                // Ignore home links on other pages unless exact match
                if (href !== '/' && !href.includes('#')) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// -------- CHARTS (STATIC MOCKS) --------
function setupCharts() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#b8b8d4';
    Chart.defaults.borderColor = 'rgba(42, 42, 90, 0.5)';
    Chart.defaults.font.family = "'Poppins', sans-serif";

    // Chart 1
    const ctx1 = document.getElementById('chart1');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
                datasets: [{
                    label: 'Feature Importance',
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#6c5ce780', '#a29bfe80', '#00cec980', '#00b89480'],
                    borderColor: ['#6c5ce7', '#a29bfe', '#00cec9', '#00b894'],
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Chart 2
    const ctx2 = document.getElementById('chart2');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Model 1', 'Model 2', 'Model 3'],
                datasets: [{
                    label: 'Performance',
                    data: [95, 88, 75],
                    backgroundColor: ['#00b89480', '#6c5ce780', '#e74c3c80'],
                    borderColor: ['#00b894', '#6c5ce7', '#e74c3c'],
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Chart 3
    const ctx3 = document.getElementById('chart3');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: ['Category X', 'Category Y', 'Category Z'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: ['#6c5ce7', '#00cec9', '#00b894'],
                    borderColor: ['#6c5ce7', '#00cec9', '#00b894'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { padding: 15, usePointStyle: true }
                    }
                }
            }
        });
    }

    // Chart 4
    const ctx4 = document.getElementById('chart4');
    if (ctx4) {
        new Chart(ctx4, {
            type: 'line',
            data: {
                labels: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5'],
                datasets: [{
                    label: 'Prediction Trends',
                    data: [120, 130, 125, 140, 135],
                    borderColor: '#6c5ce7',
                    backgroundColor: '#6c5ce720',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

// -------- PARTICLES --------
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// -------- TOAST NOTIFICATIONS --------
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300);">
        <i class="fas fa-times"></i>
      </button>`;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}