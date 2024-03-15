const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let ballSpeedX = 2;
let ballSpeedY = 2;

let playerScore = 0;
let aiScore = 0;

const playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'yellow'
};

const aiPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'yellow'
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    color: 'red'
};

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    playerPaddle.y = event.clientY - rect.top - paddleHeight / 2;
}

function aiMove() {
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    if (paddleCenter < ball.y - 35) {
        aiPaddle.y += 1.5;
    } else if (paddleCenter > ball.y + 35) {
        aiPaddle.y -= 1.5;
    }
}

function moveBall() {
    ball.x += ballSpeedX;
    ball.y += ballSpeedY;

    // Collision with top and bottom
    if (ball.y <= 0 || ball.y >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision with paddles
    if (ball.x <= playerPaddle.width && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height ||
        ball.x >= canvas.width - aiPaddle.width - ball.size && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ballSpeedX = -ballSpeedX * 1.1; // Increase speed
    }

    // Scoring
    if (ball.x <= 0) {
        aiScore++;
        resetBall();
    } else if (ball.x >= canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ballSpeedX = 2;
    ballSpeedY = 2;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = playerPaddle.color;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

    ctx.fillStyle = aiPaddle.color;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw scores
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);

    moveBall();
    aiMove();
}

canvas.addEventListener('mousemove', movePaddle);

setInterval(draw, 10);
