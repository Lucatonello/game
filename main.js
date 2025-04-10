const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

gravity = 0.3; 
let keys = {};
let projectiles = [];

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
    grounded: false,
    weapon: {
        x: 0,
        y: 0,
        width: 20,
        height: 5,
        damage: 15,
        color: '#a80f0f'
    },
};


let enemyHeight = Math.floor(Math.random() * (70 - 25 + 1)) + 25;

const enemy = {
    x: Math.floor(Math.random() * (730 - 0 + 1)) + 30,
    y: 0,
    width: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
    height: enemyHeight,
    color: '#6b2991',
    velX: 0,
    velY: 0,
    speed: 3,
    jumpForce: -10,
    hp: enemyHeight < 40 ? 50 : enemyHeight < 55 ? 75 : 100,
}

const platform = {
    x: 0,
    y: 550,
    width: canvas.width,
    height: 50,
    color: '#444',
};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if (e.code === 'KeyF' || e.code === 'LeftClick') {
        projectiles.push({
            x: player.weapon.x,
            y: player.weapon.y,
            width: 20,
            height: 5,
            color: '#ff0000',
            speed: 7
        })
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function update() {

    //pleyer movement

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


    //player and enemies gravity
    
    player.velY += gravity;
    enemy.velY += gravity;

    player.x += player.velX;
    player.y += player.velY;
    enemy.y += enemy.velY;


    player.weapon.x = player.x + player.width;
    player.weapon.y = player.y + (player.height / 2);


    //prevent player from falling down platform

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

    
    //prevent enemies from falling down platform

    if (enemy.x < 0) enemy.x = 0;
    if (enemy.x + enemy.width > canvas.width) enemy.x = canvas.width - enemy.width;

    if (enemy.y + enemy.height > canvas.height) {
        enemy.y = canvas.height - enemy.height;
        enemy.velY = 0;
        enemy.grounded = true;
    } else if (
        enemy.y + enemy.height > platform.y &&
        enemy.x + enemy.width > platform.x &&
        enemy.x < platform.x + platform.width
    ) {
        enemy.y = platform.y - enemy.height;
        enemy.velY = 0;
        enemy.grounded = true;
    } else {
        enemy.grounded = false;
    }


    //move projectiles

    for (let i = 0; i < projectiles.length; i++) {
        const proj = projectiles[i];
        proj.x += proj.speed;

        if (
            proj.x < enemy.x + enemy.width &&
            proj.x + proj.width > enemy.x &&
            proj.y < enemy.y + enemy.height &&
            proj.y + proj.height > enemy.y
        ) {
            enemy.hp -= player.weapon.damage;
            projectiles.splice(i, 1);
            i--
        } else if (proj.x > canvas.width) {
            projectiles.splice(i, 1);
            i--
        }
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

    ctx.fillStyle = player.weapon.color;
    ctx.fillRect(player.weapon.x, player.weapon.y, player.weapon.width, player.weapon.height);

    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    for (const proj of projectiles) {
        ctx.fillStyle = proj.color;
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
    }
    const hpBarWidth = enemy.width;
    const hpPercent = enemy.hp / (enemyHeight < 40 ? 50 : enemyHeight < 55 ? 75 : 100);
    ctx.fillStyle = "#000";
    ctx.fillRect(enemy.x, enemy.y - 10, hpBarWidth, 5);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(enemy.x, enemy.y - 10, hpBarWidth * hpPercent, 5);
}

update()