import Enemies from "../objects/enemies.js";
import Player from "../objects/Player.js";
import {sceneEvents} from "../controllers/EventCenter.js"

export default class Level3 extends Phaser.Scene {
  constructor() { //key that will identify the scene
      super({key: "level3"});//key da scene
  }

  create() {
      this.scene.run('UI');
      var map = this.make.tilemap({key: "map3"});
      this.map = map;
      var tileset = map.addTilesetImage("0x72_DungeonTilesetII_v1.3", "Dungeon");
      var tileset2 = map.addTilesetImage("0x72_16x16DungeonTileset.v4", "Dungeon2");
      this.groundLayer = map.createStaticLayer("Ground", [tileset, tileset2], 0, 0);
      this.wallsLayer = map.createStaticLayer("Walls", [tileset, tileset2], 0, 0);
      this.killLayer = map.createStaticLayer("Dead", tileset, 0, 0);
      this.doorLayer = map.createStaticLayer("Door", tileset, 0, 0);

      //debug
      //this.debugs();

      //Player
      this.player = new Player(this, 15 * 16, 10 * 16, "faune");
      this.player.setCollideWorldBounds(true);
      this.player.depth = 20; // makes the player be rendered on top of all other layers
      this.physics.add.collider(this.player, this.wallsLayer);
      this.physics.add.collider(this.player, this.houseLayer);
      this.physics.add.collider(this.player,this.killLayer,this.die,this.checkDie,this);
      this.doorColl = this.physics.add.collider(this.player,this.doorLayer,this.checkKey,null,this);
      this.chestO = 0;
      this.chest1 = 0;
      this.keyDoor = 1;
      this.end = 0;

      this.controls = this.input.keyboard.createCursorKeys();
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      //weapon
      this.knives = this.physics.add.group({
          classType: Phaser.Physics.Arcade.Image
      })
      this.player.setKnives(this.knives);
      this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);

      //animations
      this.anim();

      //enemies
      const lizards = this.physics.add.group({
          classType:Enemies,
          createCallback:(go) =>{
              const lizGo = go;
              lizGo.body.onCollide = true;
              lizGo.setSize(15,18).setOffset(1,10);
          }
      });
      this.lizard1Counter = 8;
      this.lizards1 = this.physics.add.group({
          classType:Enemies,
          createCallback:(go) =>{
              const lizGo = go;
              lizGo.body.onCollide = true;
              lizGo.setSize(15,18).setOffset(1,10);
          }
      });
      this.lizard2Counter = 6;
      this.flag2 = 1;
      this.lizards2 = this.physics.add.group({
          classType:Enemies,
          createCallback:(go) =>{
              const lizGo = go;
              lizGo.body.onCollide = true;
              lizGo.setSize(15,18).setOffset(1,10);
          }
      });
      this.flag3 = 1;
      this.lizard3Counter = 8;
      this.lizards3 = this.physics.add.group({
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
      const spikeLayer = map.getObjectLayer('Spikes');
      spikeLayer.objects.forEach(spikeObj=>{
          this.spikes.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
      })

      this.spikes1 = this.physics.add.staticGroup();
      const spikeLayer1 = map.getObjectLayer('Spikes1');
      spikeLayer1.objects.forEach(spikeObj=>{
          this.spikes1.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
      })

      this.spikes2 = this.physics.add.staticGroup();
      const spikeLayer2 = map.getObjectLayer('Spikes2');
      spikeLayer2.objects.forEach(spikeObj=>{
          this.spikes2.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'spike',"spikes-3.png");
      })

      //collisions for the spikes
      this.collisionS1 = this.physics.add.collider(this.player,this.spikes,this.handleCollisionSpikes,null,this);
      this.collisionS2 = this.physics.add.collider(this.player,this.spikes1,this.handleCollisionSpikes,null,this);
      this.collisionS3 = this.physics.add.collider(this.player,this.spikes2,this.handleCollisionSpikes,null,this);
      this.physics.add.collider(lizards,this.spikes);
      this.physics.add.collider(lizards,this.spikes1);
      this.physics.add.collider(lizards,this.spikes2);

      //buttons
      this.buttons1 = this.physics.add.staticGroup();
      const buttonLayer = map.getObjectLayer('Button1');
      buttonLayer.objects.forEach(spikeObj=>{
          this.buttons1.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
      });
      this.buttons2 = this.physics.add.staticGroup();
      const buttonLayer1 = map.getObjectLayer('Button2');
      buttonLayer1.objects.forEach(spikeObj=>{
          this.buttons2.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
      });
      this.buttons3 = this.physics.add.staticGroup();
      const buttonLayer2 = map.getObjectLayer('Button3');
      buttonLayer2.objects.forEach(spikeObj=>{
          this.buttons3.get(spikeObj.x+spikeObj.width*0.5,spikeObj.y-spikeObj.height*0.5,'button');
      });
      //checks whether the button was pressed
      this.animsButton1 =0;
      this.animsButton2 =0;
      this.animsButton3 =0;

      //checks if player and button overlap
      this.physics.add.overlap(this.player,this.buttons1,this.handleCollisionButton,null,this);
      this.physics.add.overlap(this.player,this.buttons2,this.handleCollisionButton,null,this);
      this.physics.add.overlap(this.player,this.buttons3,this.handleCollisionButton,null,this);

      //blocks
      this.boxes = this.physics.add.group();
      const boxLayer = map.getObjectLayer('Boxes');
      boxLayer.objects.forEach(chestObj=>{
          this.boxes.get(chestObj.x+chestObj.width*0.5,chestObj.y-chestObj.height*0.5,'box');
      })
      this.physics.add.collider(this.player,this.boxes,this.handleCollisionBox,null,this);
      this.physics.add.collider(lizards,this.boxes);
      this.physics.add.collider(this.boxes,this.boxes,this.handleCollisionBox2,null,this);
      this.physics.add.collider(this.boxes,this.wallsLayer);
      this.physics.add.collider(this.knives,this.boxes, this.handleCollisionWeaponWall,null,this);

      //Creates Chests
      this.chests = this.physics.add.staticGroup();
      const chestLayer = map.getObjectLayer('Chest');
      chestLayer.objects.forEach(chestObj=>{
          this.chests.get(chestObj.x+chestObj.width*0.5,chestObj.y-chestObj.height*0.5,'chest');
      })
      this.physics.add.collider(this.player,this.chests,this.handleCollisionChest,null,this);

      //collisons
      this.createColl();

      //camera
      this.cameras.main.setBounds(0, 0, 25 * 16, 25 * 16);
      this.camerax = 0;
      this.cameray = 0;

      this.flagEnd = 0;
  }

  checkKey(obj1,obj2){
      if(this.keyDoor){
          this.physics.world.removeCollider(this.doorColl);
          this.end = 1;
          //anim door
          this.player.y-=70;
          this.player.state=1;
          this.physics.world.addCollider(this.doorColl);

      }
      else{
          sceneEvents.emit('no-Key',"Get the key first! "); //notifies that the player cant advance to next level
      }

  }

  checkDie(obj1,obj2){
      let x =Phaser.Math.Distance.Between(obj2.x*16, obj2.y*16, obj1.x, obj1.y);
      if(Phaser.Math.Distance.Between(obj2.x*16, obj2.y*16, obj1.x, obj1.y) <= 30){
          return true;
      }
      else {
          return false;
      }

  }

  die(){
      if(this.player.invulnerable==0) {
          this.player.invulnerable = 1;
          this.cameras.main.fadeIn(1000);
          this.player.health -= 1;
          this.player.x = 15 * 16;
          this.player.y = 10 * 16;
          this.cameras.main.setBounds(0, 0, 25 * 16, 25 * 16);
          this.camerax = 0;
          this.cameray = 0;
          sceneEvents.emit("player-health-changed",this.player.health);
          this.time.addEvent({
              delay:1000,
              callback:()=>{
                  this.player.invulnerable=0;
              }
          })
      }
  }

  createColl(){
      this.wallsLayer.setCollisionByProperty({collides: true});
      this.doorLayer.setCollisionByProperty({collides: true});
      this.killLayer.setCollisionByProperty({collides: true});
  }

  hanndleCollision(obj1,obj2){
      const dx =  this.player.x - obj2.x;
      const dy =  this.player.y - obj2.y;
      const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200);
      this.player.handleDamage(dir);
      sceneEvents.emit('player-health-changed',this.player.health);
  }

  handleCollisionWeapon(obj1,obj2){
      this.player.destroyKnife(obj1);
      this.lizards1.children.each((lizard)=>{
          if(obj2==lizard){
              if(obj2.life==1) {
                  this.lizard1Counter -= 1;
              }
          }
      });
      this.lizards2.children.each((lizard)=>{
          if(obj2==lizard){
              if(obj2.life==1) {
                  this.lizard2Counter -= 1;
              }
          }
      });
      this.lizards3.children.each((lizard)=>{
          if(obj2==lizard){
              if(obj2.life==1) {
                  this.lizard3Counter -= 1;
              }
          }
      });
      obj2.hitKnive();
  }

  handleCollisionChest(obj1,obj2){
      let counter =0;
      obj2.anims.play("open-chest");
      this.chests.children.each((chest,idx )=>{
          if(obj2==chest){
              if(counter==0){
                  sceneEvents.emit('got-Key',null); // got the key to the dor
                  this.keyDoor=1;
              }
              else if(counter==1){
                  if(this.chestO==0) {
                      sceneEvents.emit("more-health", null);
                      this.player.health += 1;
                      this.chestO = 1;
                  }
              }
              else{
                  if(this.chest1==0) {
                      sceneEvents.emit("ammo", 5);
                      this.player.kniveCounter += 5;
                      this.chest1= 1;
                  }
              }
          }
          counter+=1;
      });
  }

  handleCollisionSpikes(obj1,obj2){
      const dir = new Phaser.Math.Vector2(0,0);
      this.player.handleDamage(dir)
      sceneEvents.emit("player-health-changed",this.player.health);
  }

  handleCollisionButton(obj1,obj2){
      this.buttons1.children.each((button,idx)=>{
          if(button==obj2){
              button.anims.play("buttons");
              if(this.animsButton1==0) {
                  this.spikes2.playAnimation("spikes");
                  this.physics.world.removeCollider(this.collisionS3);
                  this.animsButton1 = 1;
              }
          }
      })
      this.buttons2.children.each((button,idx)=>{
          if(button==obj2){
              button.anims.play("buttons");
              if(this.animsButton2==0) {
                  this.spikes1.playAnimation("spikes");
                  this.physics.world.removeCollider(this.collisionS2);
                  this.animsButton2 = 1;
              }
          }
      })
      this.buttons3.children.each((button,idx)=>{
          if(button==obj2){
              button.anims.play("buttons");
              if(this.animsButton3==0) {
                  this.spikes.playAnimation("spikes");
                  this.physics.world.removeCollider(this.collisionS1);
                  this.animsButton3=1;
              }
          }
      })
  }

  handleCollisionBox(obj1,obj2){
      this.time.addEvent({
          delay: 250,
          callback:()=>{
              obj2.setVelocity(0,0);
          }
      })

  }

  handleCollisionBox2(obj1,obj2){
      this.player.setVelocity(0,0);
      obj1.setVelocity(0,0);
      obj2.setVelocity(0,0);
  }

  handleCollisionWeaponWall(obj1,obj2){
      this.player.destroyKnife(obj1);
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
      });

      this.anims.create({
          key: 'lizard-run',
          frames: this.anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png' }),
          repeat: -1,
          frameRate: 10
      });

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

  createEnemies(n){
      if(n==1){
          this.end=0;
          const enemies = this.map.getObjectLayer("Enemies1");
          enemies.objects.forEach(eneObj=>{
              const l=this.lizards1.get(eneObj.x+eneObj.width*0.5,eneObj.y-eneObj.height*0.5,'lizard');
              l.setPlayer(this.player);
          })
          this.physics.add.collider(this.lizards1,this.wallsLayer);
          this.physics.add.collider(this.lizards1,this.player,this.hanndleCollision,null, this);
          this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);
          this.physics.add.collider(this.knives,this.lizards1,this.handleCollisionWeapon,null,this);
      }
      else if(n==2){
          const enemies = this.map.getObjectLayer("Enemies2");
          enemies.objects.forEach(eneObj=>{
              const l=this.lizards2.get(eneObj.x+eneObj.width*0.5,eneObj.y-eneObj.height*0.5,'lizard');
              l.setPlayer(this.player);
          })
          this.physics.add.collider(this.lizards2,this.wallsLayer);
          this.physics.add.collider(this.lizards2,this.player,this.hanndleCollision,null, this);
          this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);
          this.physics.add.collider(this.knives,this.lizards2,this.handleCollisionWeapon,null,this);
      }
      else{
          const enemies = this.map.getObjectLayer("Enemies3");
          enemies.objects.forEach(eneObj=>{
              const l=this.lizards3.get(eneObj.x+eneObj.width*0.5,eneObj.y-eneObj.height*0.5,'lizard');
              l.setPlayer(this.player);
          })
          this.physics.add.collider(this.lizards3,this.wallsLayer);
          this.physics.add.collider(this.lizards3,this.player,this.hanndleCollision,null, this);
          this.physics.add.collider(this.knives,this.wallsLayer, this.handleCollisionWeaponWall,null,this);
          this.physics.add.collider(this.knives,this.lizards3,this.handleCollisionWeapon,null,this);
      }
  }

  update() {
      this.changeCameras();
      this.player.update(this.controls);
      if(this.end==1){
          this.createEnemies(1);
      }
      if(this.lizard1Counter==0 && this.flag2==1){
          this.createEnemies(2);
          this.flag2=0;
      }
      else if(this.lizard2Counter==0 && this.flag3==1){
          this.createEnemies(3);
          this.flag3=0;
      }
      else if(this.lizard3Counter==0 && this.flagEnd ==0) {
          this.flagEnd = 1;
          this.sword = this.physics.add.sprite(50*16+25 * 16, 25 * 16, "weaponGold");
          this.cameras.main.flash(1000);
          this.sword.setVelocity(0, -50);
          this.time.addEvent({
              delay: 5000,
              callback: () => {
                  this.scene.stop("UI");
                  this.scene.start("Menu");
                  this.scene.stop();
              }
          })
      }
  }
}