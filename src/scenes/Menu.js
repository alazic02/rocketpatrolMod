class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }

    preload() {
        //load audio
        this.load.audio('sfx_select','./assets/select.wav');
        this.load.audio('sfx_clam', './assets/clamFire.wav');
        //4x explosion SFX
        this.load.audio('sfx_burst', './assets/burst.wav');
        this.load.audio('sfx_burst2', './assets/nooo.wav');
        this.load.audio('sfx_burst3', './assets/wahwahwah.wav');
        this.load.audio('sfx_burst4', './assets/whoops.wav');
    }

    create() {
        //text display
        let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '28px',
            backgroundColor: '#E1EBEB',
            color: '#326085',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        //title and directions
        this.add.text(centerX, centerY - textSpacer, 'REVENGE ON THE SQUIDS', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use ⇆ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        //text+bg color
        menuConfig.backgroundColor = '#C57FFF';
        menuConfig.color = '#542085'
        //mode selection
        this.add.text(centerX, centerY + textSpacer, 'Press ← for Easy for → for Hard', menuConfig).setOrigin(0.5);

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }

}