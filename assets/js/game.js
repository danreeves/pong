
// Boiletplate

var game = new Phaser.Game(480, 640, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload () {
    game.load.image('bat', 'assets/img/bat.gif');
    game.load.image('ball', 'assets/img/ball.gif');
    game.load.image('background', 'assets/img/space.jpg');
}

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.tileSprite(-100, -150, 2880, 1800, 'background');

    // Add objects
    playerBat = createBat(game.world.centerX, 600);
    computerBat = createBat(game.world.centerX, 30);
    ball = createBall(game.world.centerX, game.world.centerY);

    playerScoreText = this.game.add.text(
        5, 620, '', { font: '16px Arial', fill: '#ffffff' }
    );
    computerScoreText = this.game.add.text(
        5, 5, '', { font: '16px Arial', fill: '#ffffff' }
    );

    game.input.onDown.add(releaseBall, this);

}

function update () {
    // Control playerBat
    playerBat.x = game.input.x;

    var playerBatHalfWidth = playerBat.width / 2;

    if (playerBat.x < playerBatHalfWidth) {
        playerBat.x = playerBatHalfWidth;
    }
    if (playerBat.x > game.width - playerBatHalfWidth) {
        playerBat.x = game.width - playerBatHalfWidth;
    }

    // Control computerBat
    if (computerBat.x - ball.x < -15) {
        computerBat.body.velocity.x = computerBatSpeed;
    } else if (computerBat.x - ball.x > 15) {
        computerBat.body.velocity.x = -computerBatSpeed;
    } else {
        computerBat.body.velocity.x = 0;
    }

    // Ball/Bat collisions
    game.physics.arcade.collide(ball, playerBat, ballHitsBat, null);
    game.physics.arcade.collide(ball, computerBat, ballHitsBat, null);

    checkGoal();
    playerScoreText.setText('Score: ' + playerScore);
    computerScoreText.setText('Score: ' + computerScore);
}

// Logic

var playerBat;
var computerBat;
var ball;

var computerBatSpeed = 250;
var ballSpeed = 250;
var ballReleased = false;

var playerScore = 0;
var computerScore = 0;

function createBat (x, y) {
    var bat = game.add.sprite(x, y, 'bat');
    game.physics.arcade.enable(bat);
    bat.anchor.setTo(0.5, 0.5);
    bat.body.collideWorldBounds = true;
    bat.body.bounce.setTo(1, 1);
    bat.body.immovable = true;

    return bat;
}

function createBall (x, y) {
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    game.physics.arcade.enable(ball);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    return ball;
}

function releaseBall () {
    if (!ballReleased) {
        ball.body.velocity.x = (Math.random()<.5) ? ballSpeed : -ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballReleased = true;
    }
}

function ballHitsBat (ball, bat) {
    var diff = 0;

    if (ball.x < bat.x) {
        diff = (bat.x - ball.x) * -1;
    } else if (ball.x > bat.x) {
        diff = (ball.x - bat.x) * 1;
    } else {
        diff = (Math.random() * 50) - 25;
    }
    ball.body.velocity.x = diff * 15;
}

function checkGoal () {
    if (ball.y < 20) {
        playerScore++;
        setBall();
    }
    if (ball.y > 630) {
        computerScore++;
        setBall();
    }
}

function setBall () {
    if (ballReleased) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ballReleased = false;
    }
}
