// Get the SVG element
let svg = document.getElementById('gameBoard');

// Constants for Pacman
const PACMAN_RADIUS = 20;
const PACMAN_MOUTH_OPEN_ANGLE = 45; // in degrees
const PACMAN_SPEED = 3; // pixels per frame

// Constants for pellets
const PELLET_RADIUS = 5;
const NUM_PELLETS = 30; // Number of pellets to generate

// Constants for ghosts
const GHOST_RADIUS = 15;
const GHOST_SPEED = 2;
const NUM_GHOSTS = 4;

// Pacman position, direction, and score
let pacmanX = 100;
let pacmanY = 200;
let pacmanDirection = 'right';
let score = 0;

// Array to hold pellets and ghosts
let pellets = [];
let ghosts = [];

// Function to draw Pacman
function drawPacman() {
    // Clear previous Pacman
    svg.innerHTML = '';

    // Draw Pacman
    let pacman = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pacmanMouthAngle = PACMAN_MOUTH_OPEN_ANGLE * Math.PI / 180; // Convert to radians
    let pacmanMouthDirection = (pacmanDirection === 'right') ? 0 : Math.PI; // Right or left facing

    // Calculate mouth path based on direction
    let mouthX = pacmanX + PACMAN_RADIUS * Math.cos(pacmanMouthAngle / 2);
    let mouthY = pacmanY - PACMAN_RADIUS * Math.sin(pacmanMouthAngle / 2);

    // Pacman body
    let pacmanBody = `M ${pacmanX},${pacmanY} A ${PACMAN_RADIUS},${PACMAN_RADIUS} 0 1,${(pacmanDirection === 'right') ? 1 : 0} ${mouthX},${mouthY} L ${pacmanX},${pacmanY} Z`;

    pacman.setAttribute('d', pacmanBody);
    pacman.setAttribute('fill', 'yellow');
    svg.appendChild(pacman);
}

// Function to draw pellets
function drawPellets() {
    for (let i = 0; i < NUM_PELLETS; i++) {
        let pelletX = Math.random() * (svg.clientWidth - 2 * PELLET_RADIUS) + PELLET_RADIUS;
        let pelletY = Math.random() * (svg.clientHeight - 2 * PELLET_RADIUS) + PELLET_RADIUS;

        let pellet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pellet.setAttribute('cx', pelletX);
        pellet.setAttribute('cy', pelletY);
        pellet.setAttribute('r', PELLET_RADIUS);
        pellet.setAttribute('fill', 'white');
        svg.appendChild(pellet);
        pellets.push(pellet);
    }
}

// Function to draw ghosts
function drawGhosts() {
    for (let i = 0; i < NUM_GHOSTS; i++) {
        let ghostX = Math.random() * (svg.clientWidth - 2 * GHOST_RADIUS) + GHOST_RADIUS;
        let ghostY = Math.random() * (svg.clientHeight - 2 * GHOST_RADIUS) + GHOST_RADIUS;

        let ghost = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ghost.setAttribute('cx', ghostX);
        ghost.setAttribute('cy', ghostY);
        ghost.setAttribute('r', GHOST_RADIUS);
        ghost.setAttribute('fill', 'red');
        svg.appendChild(ghost);
        ghosts.push({ element: ghost, x: ghostX, y: ghostY });
    }
}

// Function to move Pacman
function movePacman() {
    switch (pacmanDirection) {
        case 'right':
            pacmanX += PACMAN_SPEED;
            break;
        case 'left':
            pacmanX -= PACMAN_SPEED;
            break;
        case 'up':
            pacmanY -= PACMAN_SPEED;
            break;
        case 'down':
            pacmanY += PACMAN_SPEED;
            break;
    }

    // Check if Pacman goes out of bounds
    if (pacmanX < PACMAN_RADIUS) {
        pacmanX = PACMAN_RADIUS;
    } else if (pacmanX > svg.clientWidth - PACMAN_RADIUS) {
        pacmanX = svg.clientWidth - PACMAN_RADIUS;
    }

    if (pacmanY < PACMAN_RADIUS) {
        pacmanY = PACMAN_RADIUS;
    } else if (pacmanY > svg.clientHeight - PACMAN_RADIUS) {
        pacmanY = svg.clientHeight - PACMAN_RADIUS;
    }

    // Update Pacman's position
    drawPacman();
}

// Function to move ghosts towards Pacman
function moveGhosts() {
    ghosts.forEach(ghost => {
        let dx = pacmanX - ghost.x;
        let dy = pacmanY - ghost.y;
        let angle = Math.atan2(dy, dx);
        ghost.x += GHOST_SPEED * Math.cos(angle);
        ghost.y += GHOST_SPEED * Math.sin(angle);

        // Update ghost's position
        ghost.element.setAttribute('cx', ghost.x);
        ghost.element.setAttribute('cy', ghost.y);

        // Check collision with Pacman
        if (Math.sqrt(dx * dx + dy * dy) < PACMAN_RADIUS + GHOST_RADIUS) {
            gameOver();
        }
    });
}

// Function to check collision with pellets
function checkCollision() {
    pellets.forEach((pellet, index) => {
        let pelletX = parseFloat(pellet.getAttribute('cx'));
        let pelletY = parseFloat(pellet.getAttribute('cy'));

        // Check collision with Pacman
        let distance = Math.sqrt((pelletX - pacmanX) ** 2 + (pelletY - pacmanY) ** 2);
        if (distance < PACMAN_RADIUS + PELLET_RADIUS) {
            // Remove the pellet from the SVG and from the pellets array
            svg.removeChild(pellet);
            pellets.splice(index, 1);
            score += 10;
            document.getElementById('score').textContent = `Score: ${score}`;

            // Check if all pellets are eaten
            if (pellets.length === 0) {
                nextLevel();
            }
        }
    });
}

// Function to handle game over
function gameOver() {
    alert(`Game Over! Your final score is: ${score}`);
    location.reload(); // Reload the page to restart the game
}

// Function to proceed to the next level
function nextLevel() {
    alert(`Congratulations! Proceeding to the next level.`);
    // Increase difficulty or add more features for next level
    // For simplicity, just reset pellets for now
    resetGame();
}

// Function to reset game state
function resetGame() {
    pacmanX = 100;
    pacmanY = 200;
    score = 0;
    pellets = [];
    ghosts = [];

    // Clear SVG
    svg.innerHTML = '';
    
    // Draw initial game elements
    drawPacman();
    drawPellets();
    drawGhosts();

    // Update score display
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Event listener for arrow key presses to change Pacman's direction
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            pacmanDirection = 'up';
            break;
        case 'ArrowDown':
            pacmanDirection = 'down';
            break;
        case 'ArrowLeft':
            pacmanDirection = 'left';
            break;
        case 'ArrowRight':
            pacmanDirection = 'right';
            break;
    }
});

// Draw initial game elements
drawPacman();
drawPellets();
drawGhosts();

// Game loop
setInterval(() => {
    movePacman();
    moveGhosts();
    checkCollision();
}, 50);
