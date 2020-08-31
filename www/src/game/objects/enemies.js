import {sceneEvents} from "../controllers/EventCenter.js";

const UP=0;
const DOWN=1;
const LEFT=2;
const RIGHT=3;

export default class Enemies extends Phaser.Physics.Arcade.Sprite { // Enemie Sprite Function
    constructor(scene,x,y,texture,frame,player) {
        super(scene,x,y,texture,frame);
        this.scene = scene; // scene where enemy is located
        this.anims.play('lizard-idle');
        this.direction = RIGHT;
        this.setScale(2);//change size
        this.life = 2; //life of enemy
    }

    update({x, y, direction, life, hit}){
        const self = this;
        self.direction = direction;
        self.setPosition(x, y);
        self.life = life;
        
        if(hit){
            hitKnive();
        }
    }

    hitKnive(){ //when hit by weapon
        this.setTint(0xff0000);
        if(this.life==0){
            this.destroy();
        }
        else {
            this.timeEvent = this.scene.time.addEvent({
                delay: 150,
                callback: () => {
                    this.clearTint();
                }
            });
        }
    }

    destroy(fromScene) { //deletes the sprite
        super.destroy(fromScene);
        if(this.timeEvent) {
            this.timeEvent.destroy();
        }
    }
}