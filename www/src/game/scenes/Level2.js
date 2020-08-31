import Enemies from "../objects/enemies.js";
import Player from "../objects/Player.js";
import {sceneEvents} from "../controllers/EventCenter.js"

export default class Level2 extends Phaser.Scene {
    constructor() {
        super({key: "level2"});//key da scene
    }
    preload(){
    }
    create() {
        this.scene.run('UI');
        var map = this.make.tilemap({key: "map2"});
        var tileset = map.addTilesetImage("0x72_DungeonTilesetII_v1.3", "Dungeon");
        var tileset2 = map.addTilesetImage("0x72_16x16DungeonTileset.v4", "Dungeon2");
        var groundLayer = map.createStaticLayer("Ground", [tileset,tileset2], 0, 0);
        this.wallsLayer = map.createStaticLayer("Walls", [tileset,tileset2], 0, 0);
        this.endLayer = map.createStaticLayer("End", [tileset,tileset2], 0, 0);


        //Player
        this.player = new Player(this, 15 * 16, 90 * 16, "faune");
        this.player.setCollideWorldBounds(true);
        this.player.depth = 20; // makes the player be rendered on top of all other layers
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.houseLayer);
        this.physics.add.collider(this.player,this.endLayer,this.endLevel2,null,this);
        this.chestO = 0;

        //controls
        this.controls = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //animations
        this.anim();

        //debug
        //this.debugs();

        //weapon
        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image
        })
        this.player.setKnives(this.knives);
        this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);


        //enemies
        const lizards = this.physics.add.group({
            classType:Enemies,
            createCallback:(go) =>{
                const lizGo = go;
                lizGo.body.onCollide = true;
                lizGo.setSize(15,18).setOffset(1,10);
            }
        });
        const enemies = map.getObjectLayer("Enemies");
        enemies.objects.forEach(eneObj=>{
            const l=lizards.get(eneObj.x+eneObj.width*0.5,eneObj.y-eneObj.height*0.5,'lizard');
            l.setPlayer(this.player);
        })
        this.physics.add.collider(lizards,this.wallsLayer);
        this.physics.add.collider(lizards,this.player,this.hanndleCollision,null, this);
        this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);
        this.physics.add.collider(this.knives,lizards,this.handleCollisionWeapon,null,this);


        //spikes
        this.spikes = this.physics.add.staticGroup();
        const spikeLayer = map.getObjectLayer('Trap');
        spikeLayer.objects.forEach(spikeObj=>{
            this.spikes.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
        })

        this.spikes1 = this.physics.add.staticGroup();
        const spikeLayer1 = map.getObjectLayer('Trap2');
        spikeLayer1.objects.forEach(spikeObj=>{
            this.spikes1.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
        })

        this.spikes2 = this.physics.add.staticGroup();
        const spikeLayer2 = map.getObjectLayer('Trap3');
        spikeLayer2.objects.forEach(spikeObj=>{
            this.spikes2.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
        })

        this.spikes3 = this.physics.add.staticGroup();
        const spikeLayer3 = map.getObjectLayer('Trap4');
        spikeLayer3.objects.forEach(spikeObj=>{
            this.spikes3.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
        })

        //collisions for the spikes
        this.collisionS1 = this.physics.add.collider(this.player,this.spikes,this.handleCollisionSpikes,null,this);
        this.collisionS2 = this.physics.add.collider(this.player,this.spikes1,this.handleCollisionSpikes,null,this);
        this.collisionS3 = this.physics.add.collider(this.player,this.spikes2,this.handleCollisionSpikes,null,this);
        this.collisionS4 = this.physics.add.collider(this.player,this.spikes3,this.handleCollisionSpikes,null,this);
        this.physics.add.collider(lizards,this.spikes);
        this.physics.add.collider(lizards,this.spikes1);
        this.physics.add.collider(lizards,this.spikes2);
        this.physics.add.collider(lizards,this.spikes3);


        //buttons
        this.buttons = this.physics.add.staticGroup();
        const buttonLayer = map.getObjectLayer('Button');
        buttonLayer.objects.forEach(spikeObj=>{
            this.buttons.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
        })
        this.buttons1 = this.physics.add.staticGroup();
        const buttonLayer1 = map.getObjectLayer('Button2');
        buttonLayer1.objects.forEach(spikeObj=>{
            this.buttons1.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
        })
        this.buttons2 = this.physics.add.staticGroup();
        const buttonLayer2 = map.getObjectLayer('Button3');
        buttonLayer2.objects.forEach(spikeObj=>{
            this.buttons2.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
        })
        this.buttons3 = this.physics.add.staticGroup();
        const buttonLayer3 = map.getObjectLayer('Button4');
        buttonLayer3.objects.forEach(spikeObj=>{
            this.buttons3.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
        })

        //checks if the button was pressed or not
        this.animsButton1 =0;
        this.animsButton2 =0;
        this.animsButton3 =0;
        this.animsButton4 =0;

        //checks if player and button overlap
        this.physics.add.overlap(this.player,this.buttons,this.handleCollisionButton,null,this);
        this.physics.add.overlap(this.player,this.buttons1,this.handleCollisionButton,null,this);
        this.physics.add.overlap(this.player,this.buttons2,this.handleCollisionButton,null,this);
        this.physics.add.overlap(this.player,this.buttons3,this.handleCollisionButton,null,this);


        //Creates Chests
        this.chests = this.physics.add.staticGroup();
        const chestLayer = map.getObjectLayer('Chest');
        chestLayer.objects.forEach(chestObj=>{
            this.chests.get(chestObj.x+chestObj.width*0.5,chestObj.y-chestObj.height*0.5,'chest');
        })
        this.physics.add.collider(this.player,this.chests,this.handleCollisionChest,null,this);


        //collisions
        this.createColl();

        //camera
        this.cameras.main.setBounds(0, 50 * 16, 25 * 16, 25 * 16);
        this.camerax = 0;
        this.cameray = 50 * 16;
    }

    endLevel2(){
        this.scene.start("Menu");
        this.scene.stop("UI");
        this.scene.stop();
    }

    handleCollisionChest(){
        if(this.chestO==0) {
            this.chests.playAnimation("open-chest");
            sceneEvents.emit("more-health", null);
            this.player.health += 1;
            this.chestO=1;
        }
    }

    handleCollisionButton(obj1,obj2){
        this.buttons.children.each((button,idx)=>{
            if(button==obj2){
                button.anims.play("buttons");
                if(this.animsButton1==0) {
                    this.spikes.playAnimation("spikes");
                    this.physics.world.removeCollider(this.collisionS1);
                    this.animsButton1 = 1;
                }
            }
        })
        this.buttons1.children.each((button,idx)=>{
            if(button==obj2){
                button.anims.play("buttons");
                if(this.animsButton2==0) {
                    this.spikes1.playAnimation("spikes");
                    this.physics.world.removeCollider(this.collisionS2);
                    this.animsButton2 = 1;
                }
            }
        })
        this.buttons2.children.each((button,idx)=>{
            if(button==obj2){
                button.anims.play("buttons");
                if(this.animsButton3==0) {
                    this.spikes2.playAnimation("spikes");
                    this.physics.world.removeCollider(this.collisionS3);
                    this.animsButton3=1;
                }
            }
        })
        this.buttons3.children.each((button,idx)=>{
            if(button==obj2){
                button.anims.play("buttons");
                if(this.animsButton4==0) {
                    this.spikes3.playAnimation("spikes");
                    this.physics.world.removeCollider(this.collisionS4);
                    this.animsButton4=1;
                }
            }
        })
    }

    handleCollisionSpikes(obj1,obj2){
        const dir = new Phaser.Math.Vector2(0,0);
        this.player.handleDamage(dir)
        sceneEvents.emit("player-health-changed",this.player.health);
    }

    handleCollisionWeaponWall(obj1,obj2){
        this.player.destroyKnife(obj1);
    }

    handleCollisionWeapon(obj1,obj2){
        this.player.destroyKnife(obj1);
        obj2.hitKnive();
    }

    hanndleCollision(obj1,obj2){
        const dx =  this.player.x - obj2.x;
        const dy =  this.player.y - obj2.y;
        const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200);
        this.player.handleDamage(dir);
        sceneEvents.emit('player-health-changed',this.player.health);

    }

    createColl(){
        this.wallsLayer.setCollisionByProperty({collides: true});
        this.endLayer.setCollisionByProperty({collides: true});
    }

    debugs(){
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255),
        })
        /*this.endLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255),
        })*/
    }

    anim(){
        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
        })

        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
        })

        this.anims.create({
            key: 'idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
        })

        this.anims.create({
            key: 'run-down',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'run-up',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'run-side',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.anims.create({
            key: 'faint',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
            frameRate: 15
        })

        this.anims.create({
            key: 'lizard-idle',
            frames: this.anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_idle_anim_f', suffix: '.png' }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'lizard-run',
            frames: this.anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png' }),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'open-chest',
            frames: this.anims.generateFrameNames('chest', { start: 0, end: 2, prefix: 'chest_empty_open_anim_f', suffix: '.png' }),
            frameRate: 10
        })

        this.anims.create({
            key:"spikes",
            frames: this.anims.generateFrameNames('spike', { start: 3, end: 0, prefix: 'spikes-', suffix: '.png' }),
            frameRate: 10
        })
        this.anims.create({
            key:"buttons",
            frames: this.anims.generateFrameNames('button', { start: 1, end: 0, prefix: 'b-', suffix: '.png' }),
            frameRate: 10
        })

    }

    changeCameras(){
        let flag = 0;
        if(this.player.x>=this.camerax + this.cameras.main.width ){
            this.cameras.main.setBounds(Math.round(this.player.x),this.cameray,25*16, 25*16);
            this.camerax = this.player.x;
            this.cameras.main.fadeIn(1000);
            flag = 1;
        }
        else if(this.player.y>=this.cameray + this.cameras.cameras[0].height ){
            this.cameras.main.setBounds(this.camerax,Math.round(this.player.y),25*16, 25*16);
            this.cameray = this.player.y;
            this.cameras.main.fadeIn(1000);
            flag = 1;
        }
        else if(this.player.y<=this.cameray){
            this.cameras.main.setBounds(this.camerax,Math.round(this.player.y)-50*16,25*16, 25*16);
            this.cameray = this.player.y-50*16;
            this.cameras.main.fadeIn(1000);
            flag = 1;
        }
        else if(this.player.x<=this.camerax){
            this.cameras.main.setBounds(Math.round(this.player.x)-50*16,this.cameray,25*16, 25*16);
            this.camerax = this.player.x-50*16;
            this.cameras.main.fadeIn(1000);
            flag = 1;
        }
        if(flag==1){
            this.player.invulnerable=1;
            this.time.addEvent({
                delay:2000,
                callback: ()=>{
                    this.player.invulnerable = 0;
                }
            });
        }
    }

    update() {
        this.changeCameras();
        this.player.update(this.controls);
    }

}