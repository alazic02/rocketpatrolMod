class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload () {
        // load images/tile sprites
        this.load.image('clam', './assets/clam.png'); //clam
        this.load.image('squid', './assets/squid.png'); //spaceships
        this.load.image('ocean', './assets/ocean.png'); //starfield bg
       
        this.load.spritesheet('bubbleBurst', './assets/bubbleBurst.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9}); //explosion animation; {} part = frame configuration object: tells Phaser number of frames (here 0-9), pixel height+width

    }

    create () {
        // place tile sprite bg
        this.ocean = this.add.tileSprite(0, 0, 620, 480, 'ocean').setOrigin(0, 0);

        //rectangle borders
        this.add.rectangle(0, 0, 40, 480, 0xAFF8FF, {alpha: 0.75}).setOrigin(0, 0); //left
        this.add.rectangle(600, 0, 40, 480, 0xAFF8FF, {alpha: 0.75}).setOrigin(0, 0); //right
        //UI bg
        this.add.rectangle(40, 44, 560, 64, 0xC57FFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Clam(this, game.config.width/2, 460, 'clam', 0).setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceships (x3)
        this.ship01 = new Squid(this, game.config.width + 192, 132, 'squid', 0, 30).setOrigin(0, 0);
        this.ship02 = new Squid(this, game.config.width + 96, 196, 'squid', 0, 20).setOrigin(0, 0);
        this.ship03 = new Squid(this, game.config.width, 268, 'squid', 0, 10).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation configuration
        this.anims.create( {
            key: 'bubbleBurst',
            frames: this.anims.generateFrameNumbers('bubbleBurst', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;

        //text display
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '28px',
            backgroundColor: '#E1EBEB',
            color: '#326085',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        //score display
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        //game over flag
        this.gameOver = false;

        //timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //calls function after delay; time in milliseconds
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true; //turns on game over
        },
        null, //callback
        this, //callback context; here means Play scene
        );

        //countdown
        this.time.addEvent (
            {loop: true, callback: this.countdown,
            callbackScope: this,
            delay: 1000}
        )
        //time display
        this.timeLeft = game.settings.gameTimer/1000;
        this.timeLeftDisp = this.add.text(464, 54, "Time: " + this.timeLeft, scoreConfig);
    }

    update () {
        //key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        //key input for return to menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // scroll tile sprite
        this.ocean.tilePositionX -= 1.75;

        //allows rocket/ship movement only when NOT game over
        if (!this.gameOver) {
            //update rocket
            this.p1Rocket.update();

            //update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        //check collision + reset
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(clam, squid) {
        //simple AABB checking
        if( clam.x < squid.x + squid.width &&
            clam.x + clam.width > squid.x &&
            clam.y < squid.y + squid.height &&
            clam.height + clam.y > squid.y) {
                return true;
        }
        else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0; //temporarily hide ship (opacity set to 0)

        //create explosion animation at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'bubbleBurst').setOrigin(0, 0);
            boom.anims.play('bubbleBurst'); // play explode animation: calls key
            boom.on('animationcomplete', () => { //callback after animation completes
                ship.reset(); //reset ship position
                ship.alpha = 1; //make ship visible again
                boom.destroy(); //remove explosion sprite
            }
        );

        //increment score
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        //explosion sound
        //choose random SFX
        this.randSFX = Phaser.Math.Between(0, 3);
        switch (this.randSFX) {
            case 0: this.sound.play("sfx_burst");
            break;
            case 1: this.sound.play("sfx_burst2");
            break;
            case 2: this.sound.play("sfx_burst3");
            break;
            case 3: this.sound.play("sfx_burst4");
            break;
            default: break;
        }
    }

    //time countdown
    countdown() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        }
        this.timeLeftDisp.text = "Time: " + this.timeLeft;
        //speed increase
        if (this.timeLeft == 30) {
            game.settings.spaceshipSpeed = (game.settings.spaceshipSpeed + 2);
        }
    }
}