const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "red"
};

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "yellow",
    score: 0
};

let aiPaddle = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "yellow",
    score: 0
};

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player: " + playerPaddle.score, 20, 30);
    ctx.fillText("AI: " + aiPaddle.score, canvas.width - 100, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(playerPaddle);
    drawPaddle(aiPaddle);
    drawScore();
}

canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
});

function aiMove() {
    let paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    if (paddleCenter < ball.y) {
        aiPaddle.y += 4; // Move down
    } else {
        aiPaddle.y -= 4; // Move up
    }
}

function collisionDetect(paddle, ball) {
    if (ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius > paddle.x && ball.y - ball.radius < paddle.y + paddle.height && ball.y + ball.radius > paddle.y) {
        return true;
    }
    return false;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = Math.random() > 0.5 ? 7 : -7;
}

function ballMove() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x - ball.radius < 0) {
        aiPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerPaddle.score++;
        resetBall();
    }

    let player = (ball.x < canvas.width / 2) ? playerPaddle : aiPaddle;
    if (collisionDetect(player, ball)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }
}

function update() {
    aiMove();
    ballMove();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
