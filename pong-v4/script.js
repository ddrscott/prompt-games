const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "RED"
};

let player = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    score: 0,
    color: "YELLOW"
};

let ai = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    score: 0,
    color: "YELLOW"
};

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let playerOrAi = (ball.x < canvas.width / 2) ? player : ai;
    if(collision(ball, playerOrAi)){
        let collidePoint = (ball.y - (playerOrAi.y + playerOrAi.height / 2));
        collidePoint = collidePoint / (playerOrAi.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    if(ball.x - ball.radius < 0){
        ai.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        player.score++;
        resetBall();
    }

    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.1;
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    ctx.fillStyle = "WHITE";
    ctx.font = "35px Arial";
    ctx.fillText(player.score, canvas.width / 4, canvas.height / 5);
    ctx.fillText(ai.score, 3 * canvas.width / 4, canvas.height / 5);
}

function game(){
    update();
    render();
}

let framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
