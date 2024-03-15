const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
let leftScore = 0;
let rightScore = 0;

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Right paddle

    // Draw ball
    ctx.fillStyle = 'red';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight ||
        ballX >= canvas.width - paddleWidth - ballSize && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed after hitting a paddle
    }

    // Scoring
    if (ballX <= 0) {
        rightScore++;
        resetBall();
    } else if (ballX >= canvas.width) {
        leftScore++;
        resetBall();
    }

    // Simple AI for right paddle
    if (rightPaddleY + paddleHeight / 2 < ballY) {
        rightPaddleY += Math.random() > 0.3 ? 2 : 0; // Move down with some probability of error
    } else {
        rightPaddleY -= Math.random() > 0.3 ? 2 : 0; // Move up with some probability of error
    }

    // Display scores
    ctx.font = '20px Arial';
    ctx.fillText(leftScore, 100, 50);
    ctx.fillText(rightScore, canvas.width - 100, 50);

    requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 2;
    ballSpeedY = 2;
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    leftPaddleY = event.clientY - rect.top - paddleHeight / 2;
});

draw();
