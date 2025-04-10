const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

gravity = 0.3; 
let keys = {};

const player = {
    x: 100,
    y: 300,
    width: 30,
    height: 40,
    color: '#ff7700',
    velX: 0,
    velY: 0,
    speed: 3,
    jumpForce: -10,
    grounded: false
};

const platform = {
    x: 0,
    y: 550,
    width: canvas.width,
    height: 50,
    color: '#444',
};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function update() {
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velX = -player.speed;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velX = player.speed;
    } else {
        player.velX = 0;
    }

    if ((keys["ArrowUp"] || keys["Space"] || keys["KeyW"]) && player.grounded) {
        player.velY = player.jumpForce;
        player.grounded = false;
    }

    player.velY += gravity;

    player.x += player.velX;
    player.y += player.velY;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velY = 0;
        player.grounded = true;
    }

    if (
        player.y + player.height > platform.y &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width
      ) {
        player.y = platform.y - player.height;
        player.velY = 0;
        player.velX = 0;
        player.grounded = true;
    }


    draw()
    requestAnimationFrame(update)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

update()