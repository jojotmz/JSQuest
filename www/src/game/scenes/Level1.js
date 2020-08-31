import Level from './Level';

export default class Level1 extends Level {
    constructor() { //key that will identidy the scene
        super({
            key:"level1",
            preload: ()=>{

            },
            create: ()=>{
                this.scene.run('UI'); // will put the GUI scene running
                var map = this.make.tilemap({key:"map1"}); //creates the map
                var tileset = map.addTilesetImage("0x72_DungeonTilesetII_v1.3","Dungeon"); //load the tilesets used on Tiled
                var tileset2 = map.addTilesetImage("tiles","Tiles");
                var tileset3 = map.addTilesetImage("tileset_16x16_final_1","Tiles2");
                var tileset4 = map.addTilesetImage("Houses","Houses");
                //creates the Layers used in Tiled
                var groundLayer = map.createStaticLayer("Ground", [tileset,tileset2,tileset3,tileset4], 0, 0);
                this.wallsLayer = map.createStaticLayer("Walls", [tileset,tileset2,tileset3,tileset4], 0, 0);
                this.pathLayer = map.createStaticLayer("Path", [tileset,tileset2,tileset3,tileset4], 0, 0);
                this.houseLayer = map.createStaticLayer("Houses", [tileset,tileset2,tileset3,tileset4], 0, 0);
                this.endLayer = map.createStaticLayer("End", [tileset,tileset2,tileset3,tileset4], 0, 0);


                // We only handle collisions on the server side
                //this.createColl();

                //debug
                //this.debugs();

                //Creates the animations to use
                

                //Creates the player and adds the collisions to the layers
                this.keyDoor = 0;
                this.chestO=0;

                const chestLayer = map.getObjectLayer('Bau');
                chestLayer.objects.forEach(chestObj=>{
                    this.chests.get(chestObj.x+chestObj.width*0.5,chestObj.y-chestObj.height*0.5,'chest');
                })

                //controls
                this.controls = this.input.keyboard.createCursorKeys();
            },
            update:()=>{

            }
        });
    }

    endLevel(){
        if(this.keyDoor){
            //make next level
            //change this after
        }
        else{
            sceneEvents.emit('no-Key',"Get the key first! "); //notifies that the player cant advance to next level
        }

    }

    handleChestCollision(obj1,obj2){ //Function that will handle the collision between player and Chest
        let counter =0;
        obj2.anims.play("open-chest");
        this.chests.children.each((chest,idx )=>{
           if(obj2==chest){
               if(counter==0){
                   sceneEvents.emit('got-Key',null); // got the key to the dor
                   this.keyDoor=1;
               }
               else{
                   if(this.chestO==0) {
                       sceneEvents.emit("more-health", null);
                       this.player.health += 1;
                       this.chestO = 1;
                   }
               }
           }
           counter+=1;
        });

    }

    handleCollisionWeaponWall(obj1,obj2){
        this.player.destroyKnife(obj1); //knife hit the wall
    }

    handleCollisionWeapon(obj1,obj2){//knife hit enemies, destroys it and takes 1 hp from the enemies
        this.player.destroyKnife(obj1);
        obj2.hitKnive();
    }

    hanndleCollision(obj1,obj2){ //collision betwen player and enemy
        //changes position and health
        const dx =  this.player.x - obj2.x;
        const dy =  this.player.y - obj2.y;
        const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200);
        this.player.handleDamage(dir);
        sceneEvents.emit('player-health-changed',this.player.health);

    }

    createColl(){ //collisions of layers
        this.wallsLayer.setCollisionByProperty({collides: true});
        this.houseLayer.setCollisionByProperty({collides: true});
        this.endLayer.setCollisionByProperty({collides: true});
        this.pathLayer.setCollisionByProperty({collides:true})
    }

    debugs(){
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255),
        })
        this.houseLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255),
        })
        this.endLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234,48,255),
            faceColor: new Phaser.Display.Color(40,39,37,255),
        })
    }
}