import {sceneEvents} from "../controllers/EventCenter.js"

export default class UI extends Phaser.Scene{ //Scene for the GUI during the game
    constructor() {
        super({key:"UI"});
        this.hearts= Phaser.GameObjects.Group;
    }
    create(){
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })
        this.hearts.createMultiple({
                key: 'full',
                setXY:{
                    x:20,
                    y:15,
                    stepX: 32
                },
                quantity:5
            },)
        this.lastHearth = (32)*5;
        this.n=8;

        this.add.sprite(780,70,"weapon",67).setScrollFactor(0).setScale(0.5);
        this.texts =this.add.text(720,25,"8x",{font:"Times"}).setFontSize(30);

        //when receives messages from other scenes will do the function of the message
        sceneEvents.on('player-health-changed', this.changeHealth,this);
        sceneEvents.on('more-health', this.addHealth,this);
        sceneEvents.on('no-Key', this.noKey,this);
        sceneEvents.on('got-Key', this.putKey,this);
        sceneEvents.on('lost', this.lost,this);
        sceneEvents.on('used', this.weapon,this);
        sceneEvents.on('ammo', this.addweapon,this);
    }

    lost(){
        this.scene.stop();
    }

    noKey(str){
        const text = this.add.text(200, 100, str,{fontFamily: 'font1'}).setFontSize(30);
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                text.destroy();
            }
        });
    }

    addweapon(n){
        this.n+=n;
        this.texts.setText(this.n+"x");
    }

    weapon(n){
        this.n=n;
        this.texts.setText(n+"x");
    }

    putKey(){
        this.physics.add.staticSprite(50,70,'key',1).setScrollFactor(0).setScale(2);
    }
    addHealth(){
        this.hearts.get(this.lastHearth+20,15,'full');
    }

    changeHealth(health){
        this.lastHearth-=32;
        this.hearts.children.each((go,idx)=>{
            const hearth = go;
            if (idx<health){
                hearth.setTexture('full')
            }
            else{
                hearth.setTexture('empty')
            }
        })
    }
}