/**
 * Proposal Website JavaScript
 * ===========================
 * Handles all interactions: NO button escape, YES button submission,
 * animations, and backend communication.
 */

// ============================================
// Configuration
// ============================================

// Backend API URL - Change this to your deployed backend URL
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://your-backend-url.onrender.com'; // Change to your backend URL

// Minimum distance (in pixels) the NO button must stay from touch point
const MIN_ESCAPE_DISTANCE = 100;

// Maximum NO tap attempts before special message
const MAX_NO_ATTEMPTS = 1;

// ============================================
// State Management
// ============================================

const state = {
    noAttempts: parseInt(sessionStorage.getItem('noAttempts')) || 0,
    isSubmitting: false,
    hasSaidYes: false,
    isMobile: window.matchMedia('(pointer: coarse)').matches
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    modalOverlay: document.getElementById('modalOverlay'),
    heartsContainer: document.getElementById('heartsContainer'),
    confettiContainer: document.getElementById('confettiContainer'),
    buttonsContainer: document.querySelector('.buttons-container')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initYesButton();
    initNoButton();
    checkNoAttempts();
});

// ============================================
// Floating Hearts Background
// ============================================

function initFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘', '💞'];
    const container = elements.heartsContainer;
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        createFloatingHeart(hearts, container, true);
    }
    
    // Continuously add new hearts
    setInterval(() => {
        createFloatingHeart(hearts, container, false);
    }, 800);
}

function createFloatingHeart(hearts, container, randomY = false) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Random position and animation properties
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 6; // 4-10 seconds
    const delay = randomY ? Math.random() * 5 : 0;
    const size = 1 + Math.random() * 1.5; // 1-2.5rem
    
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.fontSize = `${size}rem`;
    
    if (randomY) {
        heart.style.top = `${Math.random() * 100}%`;
    }
    
    container.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

// ============================================
// YES Button Handler
// ============================================

function initYesButton() {
    elements.btnYes.addEventListener('click', handleYesClick);
}

async function handleYesClick() {
    // Prevent double submissions
    if (state.isSubmitting || state.hasSaidYes) {
        return;
    }
    
    state.isSubmitting = true;
    elements.btnYes.disabled = true;
    
    try {
        // Send backend request
        await sendYesResponse();
        
        // Mark as completed
        state.hasSaidYes = true;
        
        // Show success modal
        showSuccessModal();
        
        // Trigger confetti
        createConfetti();
        
        // Clear NO attempts (they made the right choice!)
        sessionStorage.removeItem('noAttempts');
        
    } catch (error) {
        console.error('Error:', error);
        // Still show success even if backend fails
        showSuccessModal();
        createConfetti();
    }
}

async function sendYesResponse() {
    const response = await fetch(`${API_BASE_URL}/yes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: "Your Billota is ready to marry you 💍"
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to record response');
    }
    
    return response.json();
}

function showSuccessModal() {
    elements.modalOverlay.classList.add('active');
    
    // Auto-close modal on click outside
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            elements.modalOverlay.classList.remove('active');
        }
    });
}

function createConfetti() {
    const colors = ['#ff6b9d', '#ff4785', '#ffc2d1', '#ffe4ec', '#ff85a1', '#ffd700'];
    const container = elements.confettiContainer;
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = `${2 + Math.random() * 3}s`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            container.appendChild(confetti);
            
            // Clean up
            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// ============================================
// NO Button Handler (Mobile-First Escape)
// ============================================

function initNoButton() {
    const btnNo = elements.btnNo;
    
    // Check if it's a touch device
    if (state.isMobile) {
        // Mobile: Use touch events for immediate response
        btnNo.addEventListener('touchstart', handleNoTouch, { passive: false });
        btnNo.addEventListener('pointerdown', handleNoTouch, { passive: false });
        
        // Also prevent click on mobile (backup)
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNoTouch(e);
        });
    } else {
        // Desktop: Move on hover
        btnNo.addEventListener('mouseenter', moveNoButtonDesktop);
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            handleNoClick();
        });
    }
}

/**
 * Handle touch event on NO button - MOBILE ONLY
 * Instantly moves button to random position away from touch
 */
function handleNoTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches ? e.touches[0] : e;
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Move button away from touch point
    moveNoButtonAway(touchX, touchY);
}

/**
 * Move NO button to a random position away from given coordinates
 */
function moveNoButtonAway(fromX, fromY) {
    const btnNo = elements.btnNo;
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    
    // Get safe area (viewport minus padding)
    const padding = 20;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    
    let newX, newY, attempts = 0;
    
    // Find a position that's at least MIN_ESCAPE_DISTANCE away
    do {
        newX = padding + Math.random() * (maxX - padding);
        newY = padding + Math.random() * (maxY - padding);
        attempts++;
        
        // Safety break after 50 attempts
        if (attempts > 50) break;
        
    } while (getDistance(fromX, fromY, newX + btnWidth/2, newY + btnHeight/2) < MIN_ESCAPE_DISTANCE);
    
    // Apply new position with fixed positioning
    btnNo.classList.add('escaping');
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
}

/**
 * Calculate distance between two points
 */
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Desktop hover handler
 */
function moveNoButtonDesktop() {
    const btnNo = elements.btnNo;
    const container = elements.buttonsContainer;
    const containerRect = container.getBoundingClientRect();
    
    // Random position within container on desktop
    const maxMove = 150;
    const moveX = (Math.random() - 0.5) * maxMove * 2;
    const moveY = (Math.random() - 0.5) * maxMove;
    
    btnNo.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${Math.random() * 20 - 10}deg)`;
}

/**
 * Handle actual NO button click (if they somehow manage to tap it)
 */
function handleNoClick() {
    state.noAttempts++;
    sessionStorage.setItem('noAttempts', state.noAttempts);
    
    if (state.noAttempts === 1) {
        // First NO attempt
        alert('Think again 😏');
        window.location.reload();
    } else {
        // Second or more NO attempts
        alert('This is not an option, SARKARI RAO.');
        window.location.reload();
    }
}

/**
 * Check if user has previous NO attempts on page load
 */
function checkNoAttempts() {
    // If they refreshed after saying NO, show appropriate message
    if (state.noAttempts >= 2) {
        // Reset after showing the final warning
        setTimeout(() => {
            sessionStorage.removeItem('noAttempts');
            state.noAttempts = 0;
        }, 100);
    }
}

// ============================================
// Prevent context menu on NO button
// ============================================

elements.btnNo.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// ============================================
// Handle window resize
// ============================================

window.addEventListener('resize', () => {
    // Reset NO button position on resize
    if (!state.isMobile) {
        elements.btnNo.style.transform = '';
    } else {
        elements.btnNo.classList.remove('escaping');
        elements.btnNo.style.left = '';
        elements.btnNo.style.top = '';
    }
});

// Detect mobile on resize/orientation change
window.addEventListener('orientationchange', () => {
    state.isMobile = window.matchMedia('(pointer: coarse)').matches;
    setTimeout(() => {
        elements.btnNo.classList.remove('escaping');
        elements.btnNo.style.left = '';
        elements.btnNo.style.top = '';
        elements.btnNo.style.transform = '';
    }, 100);
});
