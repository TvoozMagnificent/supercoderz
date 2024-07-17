// Get the SVG element
let svg = document.getElementById('mySvg');

// Array to hold the ghost references
let ghosts = [];
let colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "black", "purple", "orange"];

// Function to draw a ghost
function drawGhost(x, y, color) {
    const ghostWidth = 60;
    const ghostHeight = 40;
    const headRadius = ghostWidth / 2;
    const tailRadius = ghostWidth / 6;

    // Create the ghost group
    let ghostGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Create the ghost head (a full circle)
    let head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', x);
    head.setAttribute('cy', y);
    head.setAttribute('r', headRadius);
    head.setAttribute('fill', color);
    ghostGroup.appendChild(head);

    // Create the ghost body (a rectangle)
    let body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', x - headRadius);
    body.setAttribute('y', y);
    body.setAttribute('width', ghostWidth);
    body.setAttribute('height', ghostHeight);
    body.setAttribute('fill', color);
    ghostGroup.appendChild(body);

    // Create the ghost tail (three semicircles)
    for (let i = 0; i < 3; i++) {
        let tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tail.setAttribute('cx', x - ghostWidth/2 + tailRadius + (tailRadius * 2 * i));
        tail.setAttribute('cy', y + ghostHeight);
        tail.setAttribute('r', tailRadius);
        tail.setAttribute('fill', color);
        ghostGroup.appendChild(tail);
    }

    // Create the eyes
    let eyeLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eyeLeft.setAttribute('cx', x - headRadius / 2);
    eyeLeft.setAttribute('cy', y - headRadius / 3);
    eyeLeft.setAttribute('r', headRadius / 6);
    eyeLeft.setAttribute('fill', 'white');
    ghostGroup.appendChild(eyeLeft);

    let eyeRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eyeRight.setAttribute('cx', x + headRadius / 2);
    eyeRight.setAttribute('cy', y - headRadius / 3);
    eyeRight.setAttribute('r', headRadius / 6);
    eyeRight.setAttribute('fill', 'white');
    ghostGroup.appendChild(eyeRight);

    // Create the pupils
    let pupilLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pupilLeft.setAttribute('cx', x - headRadius / 2);
    pupilLeft.setAttribute('cy', y - headRadius / 3);
    pupilLeft.setAttribute('r', headRadius / 12);
    pupilLeft.setAttribute('fill', 'blue');
    ghostGroup.appendChild(pupilLeft);

    let pupilRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pupilRight.setAttribute('cx', x + headRadius / 2);
    pupilRight.setAttribute('cy', y - headRadius / 3);
    pupilRight.setAttribute('r', headRadius / 12);
    pupilRight.setAttribute('fill', 'blue');
    ghostGroup.appendChild(pupilRight);

    // Add the ghost group to the SVG
    svg.appendChild(ghostGroup);

    // Return the ghost object with references to its components
    return {
        group: ghostGroup,
        eyeLeft: eyeLeft,
        eyeRight: eyeRight,
        pupilLeft: pupilLeft,
        pupilRight: pupilRight
    };
}

// Update eyes function based on mouse position
function updateEyes(mouseX, mouseY) {
    ghosts.forEach(ghost => {
        // Get ghost position
        const bbox = ghost.group.getBBox();
        const ghostX = bbox.x + bbox.width / 2;
        const ghostY = bbox.y + bbox.height / 4;

        // Calculate angle towards mouse
        const dxLeft = mouseX - (ghostX - bbox.width / 4);
        const dyLeft = mouseY - ghostY;
        const angleLeft = Math.atan2(dyLeft, dxLeft);

        const dxRight = mouseX - (ghostX + bbox.width / 4);
        const dyRight = mouseY - ghostY;
        const angleRight = Math.atan2(dyRight, dxRight);

        // Calculate pupil offset (limited to eye bounds)
        const eyeRadius = bbox.width / 12;
        const maxPupilOffset = eyeRadius/2; // Maximum distance from center of eye
        const offsetLeft = Math.min(Math.sqrt(dxLeft * dxLeft + dyLeft * dyLeft), maxPupilOffset);
        const offsetRight = Math.min(Math.sqrt(dxRight * dxRight + dyRight * dyRight), maxPupilOffset);

        // Update pupils position based on angle (normalized to eye bounds)
        ghost.pupilLeft.setAttribute('cx', ghostX - bbox.width / 4 + Math.cos(angleLeft) * offsetLeft);
        ghost.pupilLeft.setAttribute('cy', ghostY + Math.sin(angleLeft) * offsetLeft);

        ghost.pupilRight.setAttribute('cx', ghostX + bbox.width / 4 + Math.cos(angleRight) * offsetRight);
        ghost.pupilRight.setAttribute('cy', ghostY + Math.sin(angleRight) * offsetRight);
    });
}

// Mousemove event listener
svg.addEventListener('mousemove', (event) => {
    // Update eyes position based on mouse coordinates
    updateEyes(event.clientX, event.clientY);
});

// Click event listener to draw ghosts
svg.addEventListener('click', (event) => {
    // Get click position relative to the SVG
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Generate random color for the ghost
    const color = colors[Math.floor(9 * Math.random())];

    // Draw the ghost at the click location and store its reference
    const ghost = drawGhost(x, y, color);
    ghosts.push(ghost);
});
