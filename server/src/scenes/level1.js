class Level1 extends Level {
    constructor() { //key that will identidy the scene
        super({
          key: "level1",
          // We will call these main Phaser Functions in Level's 
          // create, update, preload functions
          preload:()=>{
          },
          create: ()=>{
            const self = this;
            self.map = self.make.tilemap({key:"map1"}); //creates the map
            self.tileset = self.map.addTilesetImage("0x72_DungeonTilesetII_v1.3","Dungeon"); //load the tilesets used on Tiled
            self.tileset2 = self.map.addTilesetImage("tiles","Tiles");
            self.tileset3 = self.map.addTilesetImage("tileset_16x16_final_1","Tiles2");
            self.tileset4 = self.map.addTilesetImage("Houses","Houses");

            //creates the Layers used in Tiled
            self.groundLayer = self.map.createStaticLayer("Ground", [self.tileset,self.tileset2,self.tileset3,self.tileset4], 0, 0);
            self.wallsLayer = self.map.createStaticLayer("Walls", [self.tileset,self.tileset2,self.tileset3,self.tileset4], 0, 0);
            self.pathLayer = self.map.createStaticLayer("Path", [self.tileset,self.tileset2,self.tileset3,self.tileset4], 0, 0);
            self.houseLayer = self.map.createStaticLayer("Houses", [self.tileset,self.tileset2,self.tileset3,self.tileset4], 0, 0);
            self.endLayer = self.map.createStaticLayer("End", [self.tileset,self.tileset2,self.tileset3,self.tileset4], 0, 0);

            //Creates the Collisions
            self.createColl();

            const enemyLayer = self.map.getObjectLayer("Inimigos"); // will get the object layer from the Tiled Json
            let uid = 0;
            enemyLayer.objects.forEach(eneObj=>{
              const l=self.enemies.get(eneObj.x+eneObj.width*0.5,eneObj.y-eneObj.height*0.5,'lizard');
              l.id = uid;
              self.enemyIndex[uid] = l;
              uid+= 1;
            })

            //collision for the lizards
            this.physics.add.collider(self.enemies,self.wallsLayer);
            this.physics.add.collider(self.enemies,self.houseLayer);
            this.physics.add.collider(self.enemies,self.players,self.hanndleCollision,null, this);
            this.physics.add.collider(self.enemies,this.wallsLayer, self.handleCollisionWeaponWall,null,this);
            this.physics.add.collider(self.enemies,this.houseLayer, self.handleCollisionWeaponWall,null,this);
            this.physics.add.collider(self.knives,self.enemies,self.handleCollisionWeapon,null,this);

            //controls
            this.physics.add.collider(this.players,this.wallsLayer);
            this.physics.add.collider(this.players,this.houseLayer);
            this.physics.add.collider(this.players,this.endLayer,this.endLevel,null,this);
            self.physics.world.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
          },
          preload: ()=>{

          },
          update: ()=>{

          }
        });
        
    }

    endLevel(){
      const self = this;
      if(self.keyDoor){
          //make next level
          //change this after
      }
      else{
          //sceneEvents.emit('no-Key',"Get the key first! "); //notifies that the player cant advance to next level
      }
    }

    handleChestCollision(obj1,obj2){ //Function that will handle the collision between player and Chest
      const self = this;
      let counter =0;
      obj2.anims.play("open-chest");
      self.chests.children.each((chest,idx )=>{
          if(obj2==chest){
              if(counter==0){
                  sceneEvents.emit('got-Key',null); // got the key to the dor
                  self.keyDoor=1;
              }
              else{
                  if(self.chestO==0) {
                      sceneEvents.emit("more-health", null);
                      self.player.health += 1;
                      self.chestO = 1;
                  }
              }
          }
          counter+=1;
      });

    }

    handleCollisionWeaponWall(obj1,obj2){
      const self = this;
      self.player.destroyKnife(obj1); //knife hit the wall
    }

    handleCollisionWeapon(obj1,obj2){//knife hit enemies, destroys it and takes 1 hp from the enemies
      const self = this;
      obj1.destroy();
      obj2.hitKnive();
    }

    hanndleCollision(obj1,obj2){ //collision between player and enemy
      const self = this;
      //changes position and health
      const dx =  obj1.x - obj2.x;
      const dy =  obj1.y - obj2.y;
      const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200);
      if(obj1.handleDamage){
        obj1.handleDamage(dir);
      }
      if(obj2.handleDamage){
        obj2.handleDamage(dir);
      }
    }

    createColl(){ //collisions of layers
      const self = this;
      self.wallsLayer.setCollisionByProperty({collides: true});
      self.houseLayer.setCollisionByProperty({collides: true});
      self.endLayer.setCollisionByProperty({collides: true});
      self.pathLayer.setCollisionByProperty({collides:true})
    }
}