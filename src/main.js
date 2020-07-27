//create game configuration object
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    backgroundColor: "#30A3AD",
    scene: [ Menu, Play ],
}

//create main game object
let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard bindings
let keyF, keyLEFT, keyRIGHT;


//POINTS BREAKDOWN
//10pts --> 30sec speed increase
//10pts --> allow player control after fired
//15pts --> 4x random explosion SFX
//15pts --> display time
//50pts --> art + UI redesign