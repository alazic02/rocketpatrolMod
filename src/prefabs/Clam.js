// Rocket prefab
class Clam extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        //rocket sound
        this.sfxRocket = scene.sound.add('sfx_clam', {volume: 0.5});
    }

    update() {
        // left/right movement
        // isDown registers input every frame
        if(keyLEFT.isDown && this.x >= 47) {
            this.x -= 2.5;
        }
        else if (keyRIGHT.isDown && this.x <= 578) {
            this.x += 2.5;
        }

        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            //justDown registers individual clicks
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        // if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.y -= 2.5;
        }
        //reset on miss
        if(this.y <= 108) {
            this.isFiring = false;
            this.y = 460;
        }
    }

    //reset rocket to screen bottom
    reset() {
        this.isFiring = false;
        this.y = 460;
    }
}