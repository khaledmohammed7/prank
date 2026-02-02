// DOM Elements
const proposalSection = document.getElementById('proposalSection');
const celebrationSection = document.getElementById('celebrationSection');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttonContainer = document.querySelector('.button-container');
const gifContainer = document.querySelector('.gif-container');

// Playful "No" button messages
const noMessages = [
    "NO",
    "Nope! 😝",
    "Too slow! 🏃‍♂️",
    "Try again! 😉",
    "Not happening! 😜",
    "Catch me! 🎯",
    "Oops! 😄",
    "Nice try! 💨",
    "Almost! 😅",
    "You wish! 🙈"
];

let noClickCount = 0;
let isNoBtnInitialized = false;

// Function to get distance between cursor and button
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to get random position AT LEAST 200px away from current position
function getRandomScreenPosition(minDistance = 200) {
    const button = noBtn.getBoundingClientRect();
    const currentX = button.left + button.width / 2;
    const currentY = button.top + button.height / 2;
    
    let randomX, randomY, distance;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
        // Get viewport dimensions
        const maxX = window.innerWidth - button.width - 20;
        const maxY = window.innerHeight - button.height - 20;
        
        // Generate random positions across ENTIRE screen
        randomX = Math.random() * Math.max(0, maxX);
        randomY = Math.random() * Math.max(0, maxY);
        
        // Calculate distance from current position
        distance = getDistance(currentX, currentY, randomX + button.width / 2, randomY + button.height / 2);
        
        attempts++;
    } while (distance < minDistance && attempts < maxAttempts);
    
    return { x: randomX, y: randomY };
}

// Function to move "No" button to random screen position
function moveNoButton() {
    const pos = getRandomScreenPosition(200); // Minimum 200px away
    noBtn.style.left = `${pos.x}px`;
    noBtn.style.top = `${pos.y}px`;
}

// Track mouse movement to detect proximity
document.addEventListener('mousemove', (e) => {
    if (!isNoBtnInitialized) return;
    
    const buttonRect = noBtn.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate distance from cursor to button center
    const distance = getDistance(e.clientX, e.clientY, buttonCenterX, buttonCenterY);
    
    // If cursor is within 100px of the button, ESCAPE!
    if (distance < 100) {
        moveNoButton();
    }
});

// "No" button click event - if they somehow catch it!
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add shake animation
    noBtn.classList.add('shake');
    setTimeout(() => {
        noBtn.classList.remove('shake');
    }, 300);
    
    // Change button text to playful message
    noClickCount++;
    const messageIndex = noClickCount % noMessages.length;
    noBtn.textContent = noMessages[messageIndex];
    
    // ESCAPE IMMEDIATELY to new position
    moveNoButton();
});

// "Yes" button click event
yesBtn.addEventListener('click', async () => {
    // Hide proposal section
    proposalSection.classList.add('hidden');
    
    // Show celebration section
    celebrationSection.classList.remove('hidden');
    
    // Change page title
    document.title = "She said YES! 💕";
    
    // Fire confetti celebration
    fireConfetti();
    
    // Optional: Play celebration sound (commented out - add audio file if desired)
    // const audio = new Audio('celebration.mp3');
    // audio.play();
});

// Confetti animation function
function fireConfetti() {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Burst from left
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff6b8b', '#ff4d6d', '#d63384', '#ffafbd', '#ffc3a0']
        });

        // Burst from right
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff6b8b', '#ff4d6d', '#d63384', '#ffafbd', '#ffc3a0']
        });
    }, 250);

    // Final big burst after 1 second
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 180,
            origin: { y: 0.6 },
            colors: ['#ff6b8b', '#ff4d6d', '#d63384', '#ffafbd', '#ffc3a0'],
            shapes: ['circle', 'square'],
            gravity: 1.2,
            scalar: 1.2
        });
    }, 1000);

    // Hearts confetti
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ff6b8b', '#ff4d6d'],
            shapes: ['circle'],
            gravity: 0.8,
            scalar: 2
        });
    }, 1500);
}

// GIF click effect
gifContainer.addEventListener('click', () => {
    gifContainer.style.transform = 'scale(1.05)';
    setTimeout(() => {
        gifContainer.style.transform = 'scale(1)';
    }, 200);
});

// Initialize "No" button position next to YES button
window.addEventListener('load', () => {
    // Start with NO button in normal flow (same level as YES)
    noBtn.classList.add('initial-position');
    
    // FORCE layout calculation while button is still in normal flow
    // This ensures it appears correctly next to YES button
    const yesRect = yesBtn.getBoundingClientRect();
    const buttonContainerRect = buttonContainer.getBoundingClientRect();
    
    // After a longer delay to ensure user sees the buttons together
    setTimeout(() => {
        // Get the current position of NO button while it's still in flow
        const noRect = noBtn.getBoundingClientRect();
        
        // Calculate where NO button should be positioned
        // Position it exactly next to YES button
        const leftPosition = noRect.left;
        const topPosition = buttonContainerRect.top + (buttonContainerRect.height / 2) - (noRect.height / 2);
        
        // Remove the initial-position class and switch to fixed positioning
        noBtn.classList.remove('initial-position');
        
        // Set its position to exactly where it was
        noBtn.style.left = `${leftPosition}px`;
        noBtn.style.top = `${topPosition}px`;
        noBtn.style.transform = 'translateY(0)'; // Reset any transform
        
        // Now it's ready to escape!
        isNoBtnInitialized = true;
        
        console.log("NO button initialized at:", leftPosition, topPosition);
    }, 1000); // Increased delay to 1 second
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Temporarily disable escape during resize
        isNoBtnInitialized = false;
        
        // Reset to initial position in flow
        noBtn.classList.add('initial-position');
        noBtn.style.left = '';
        noBtn.style.top = '';
        
        // Re-initialize after resize settles
        setTimeout(() => {
            const noRect = noBtn.getBoundingClientRect();
            noBtn.classList.remove('initial-position');
            noBtn.style.left = `${noRect.left}px`;
            noBtn.style.top = `${noRect.top}px`;
            isNoBtnInitialized = true;
        }, 100);
    }, 250);
});

// Prevent "No" button from being selected/focused via keyboard
noBtn.addEventListener('focus', () => {
    noBtn.blur();
    if (isNoBtnInitialized) {
        moveNoButton();
    }
});

// Add touch support for mobile - ESCAPE ON TOUCH START
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    if (!isNoBtnInitialized) return;
    
    // INSTANT ESCAPE
    moveNoButton();
    
    // Change button text
    noClickCount++;
    const messageIndex = noClickCount % noMessages.length;
    noBtn.textContent = noMessages[messageIndex];
    
    // Add shake
    noBtn.classList.add('shake');
    setTimeout(() => {ش
        noBtn.classList.remove('shake');
    }, 300);
});

// Create extra floating hearts on "Yes" click
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${Math.random() * 3 + 10}s`;
    heart.style.animationDelay = '0s';
    document.querySelector('.hearts-container').appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 15000);
}

// Add more hearts when "Yes" is clicked
yesBtn.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createFloatingHeart(), i * 100);
    }
});