//Variables to be used as help

import {sceneEvents} from "../controllers/EventCenter.js"

const IDLE = 1;
const DAMAGE = 0;
var DEAD = 0;
const DOWN = 0;
const UP = 1;
const LEFT = 2;
const RIGHT = 3;

export default class Player extends Phaser.Physics.Arcade.Sprite { // Class for the Player
    constructor(scene,x,y,texture) {
        super(scene, x, y, texture);
        this.setScale(1.5); // Changes the size
        scene.add.existing(this);
        this.anims.play("idle-down"); //Animation of iddle
        this.scene = scene; //scene where the player is located
        this.healthStat = IDLE; // If player is taking dmg or not
        this.damageTime = 0; //How much time is the player on damage state
        this.health = 5; // health of player
        this.directionFacing = DOWN; // CHANGED THE NAME OF THIS FROM STATE position the player is located 
        this.kniveState=0;  // so player cant spam the space button
        this.swordState=0;  // so player cant spam the space button
        this.kniveCounter = 0; // how many knifes the player has throwned
        this.invulnerable = 0;
    }

    // Knives on the frontend don't actually do anything.
    // We throw them here, but they're just for show.
    // We handle the damage and effects of the knife on the server
    throwKnive(){
        //check position to wich throw the knive
        const vec = new Phaser.Math.Vector2(0,0);
        if(this.directionFacing==DOWN) {
            vec.y=1;
        }
        else if(this.directionFacing==UP) {
            vec.y=-1;
        }
        else if(this.directionFacing==LEFT) {
            vec.x=-1;
        }
        else if(this.directionFacing==RIGHT) {
            vec.x=1;
        }
        const angle = vec.angle();
        const knife= this.scene.knives.get(this.x,this.y, 'knife');
        knife.setRotation(angle);
        knife.setVelocity(vec.x*300,vec.y*300);
    }

    frontBlade(){
        const vec = new Phaser.Math.Vector2(0,0);
        let posx=5,posy=5;
        if(this.directionFacing==DOWN) {
            vec.y=1;
            posy=25;
        }
        else if(this.directionFacing==UP) {
            vec.y=-1;
            posy=-25;
        }
        else if(this.directionFacing==LEFT) {
            vec.x=-1;
            posx=-25;
        }
        else if(this.directionFacing==RIGHT) {
            vec.x=1;
            posx=25;
        }
        const angle = vec.angle();
        const knife=this.scene.knives.get(this.x+posx,this.y+posy, 'knife');
        knife.depth=0;
        knife.setScale(3,1);
        knife.setRotation(angle);
        if(this.directionFacing==DOWN || this.directionFacing==UP){
            knife.setSize(2,35);
        }
        this.scene.time.addEvent({
            delay: 150,
            callback: () => {
                knife.setVisible(false);
                this.swordState = 1;
            }
        });
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                knife.destroy();
                this.swordState = 1;
            }
        });
    }

    destroyKnife(knife){
        knife.destroy();
    }

    update(data) { //will check 1 every frame
        console.log(data);
        if(!data){
            return;
        }
        const {health, direction, idle, x, y, isDead, knife, kniveCounter, sword, healthStat, damageTime} = data;
        const self = this;

        self.directionFacing = direction;
        if(kniveCounter !== self.kniveCounter){
            sceneEvents.emit("used",kniveCounter);
        }
        if(health !== self.health){
            sceneEvents.emit('player-health-changed',health);
        }
        
        self.kniveCounter = kniveCounter;
        self.health = health;

        if(healthStat == DAMAGE) {
            if(damageTime>=250){
                this.clearTint();
            }
        }

        self.setPosition(x,y);
        self.setDepth(y);


        if(health<=0 || isDead){
            // DEAD
            return;
        }
        if(this.healthStat==DAMAGE || DEAD){ //player cant walk when damaged or dead
            return;
        }
        if(!idle){
            switch(direction){
                case RIGHT:
                    self.anims.play('run-side', true);
                    this.setFlipX(false);
                    break;
                case UP:
                    self.anims.play('run-up', true);
                    break;
                case LEFT:
                    self.anims.play('run-side', true);
                    this.setFlipX(true);
                    break;
                case DOWN:
                    self.anims.play('run-down', true);
                    break;
            }
        }else{
            // idle animations
            switch(direction){
                case DOWN:
                    this.anims.play('idle-down', true);
                    break
                case UP:
                    this.anims.play('idle-up', true);
                    break;
                case LEFT:
                    this.anims.play('idle-left', true);
                    break;
                case RIGHT:
                    this.anims.play('idle-right', true);
                    break;
            }
        }

        //Sword state on 0 means sword off
        if(sword && !self.swordState){
            this.frontBlade();
        }

        // KniveState on 0 means knive off
        if(knife && !self.kniveState){
            this.throwKnive();
        }

        self.kniveState = knife;
        self.swordState = sword;
    }

    handleDamage(dir){ //will handle the dmg
        if(this.health<=0){ //player died
            this.healthStat = DEAD;
            this.scene.scene.start("Menu");
            this.scene.scene.stop("UI");
            this.scene.scene.stop();
            DEAD = 0;
            return;
        }
        if(this.healthStat == DAMAGE || DEAD || this.invulnerable){
            return;
        }
        //throw player behind and make the blood effect
        this.setVelocity(dir.x,dir.y);
        this.setTint(0xff0000);
        this.healthStat = DAMAGE;
        this.damageTime = 0;

        this.health-=1;
        this.invulnerable = 1;
        this.scene.time.addEvent({
            delay:1000,
            callback:()=>{
                this.invulnerable=0;
            }
        })
        if(this.health==0){
            //DO DIE
            this.anims.play("faint",true);
            DEAD=1;
            this.setVelocity(0,0);
            this.scene.cameras.main.fadeOut(500);
            sceneEvents.emit('lost',null);
        }

    }
}