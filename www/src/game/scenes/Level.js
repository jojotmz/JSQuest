import User from "../objects/User";
import Enemies from '../objects/enemies';

export default class Level extends Phaser.Scene {

  init({socket}){
    const self = this;
    self.socket = socket;
  }

  constructor({key, create, preload, update, stateUpdate}) { //key that will identidy the scene
    super({key});//key da scene
    const self = this;
    self.key = key;
    self.onCreate = create;
    self.onPreload = preload;
    self.onUpdate = update;
    self.stateUpdate = stateUpdate;
    self.currentPlayer = {};
  }

  preload(){
    this.onPreload();
  }

  createEnemy({x, y, id}){
    const self = this;
    const l=self.enemies.get(x,y,'lizard');
    l.id = id;
    return l;
  }

  updateEnemies(enemies){
    const self = this;
    Object.keys(enemies).forEach(id=>{
      if(!self.enemiesIndex[id]){
        self.enemiesIndex[id] = this.createEnemy(enemies[id]);
      }else{
        self.enemiesIndex[id].update(enemies[id]);
      }
    });

  }

  destroyEnemy(id){
    const self = this;
    self.enemiesIndex[id].destroy();
    delete self.enemiesIndex[id];
  }
  
  create(){
    const self = this;

    // Knives will be in each level
    this.knives = self.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    });


    //Creates the enemies group
    self.enemies = this.physics.add.group({
      classType:Enemies, // makes that the Lizards will be from the Enemies Sprite created
      createCallback:(go) =>{//to do when sprite is created
        const lizGo = go;
        lizGo.body.onCollide = true; //makes sprite collidable
        lizGo.setSize(15,18).setOffset(1,10); // size and position of hitbox
      }
    });
    // Create an index to easily be able to check for the existence 
    // of an enemy id
    self.enemiesIndex = {};


    //chests in the level
    this.chests = this.physics.add.staticGroup();

    this.anim();

    // Run the extended Level's create
    self.onCreate();

    this.controls = this.input.keyboard.createCursorKeys(); //keyboard keys

    this.cameras.main.setBounds(50*16, 50*16, 25*16, 25*16);
    this.camerax =50*16;
    this.cameray =50*16;

    // We want to send just they press up and down
    this.keys = {
      'space': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      'up': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      'left': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      'right': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      'down': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      'shift': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
    }

    self.players = self.add.group();
    console.log("key", self.key);

    //listening to all the game data, all the commands
    self.socket.on(self.key, ({action, data})=>{
      try{
        switch(action){
          case 'playerUpdates': 
            if(!data){
              return;
            }
            if(data){
              self.players.getChildren().forEach((player) => {
                if(data[player.id]){
                  console.log(data[player.id])
                  player.update(data[player.id]);
                }
              });
            }
            break;
          case 'destroyEnemy':
            self.destroyEnemy(data);
            break;
          case 'state':
            if(!data){
              return;
            }
            if(data['enemies']){
              self.updateEnemies(data['enemies']);
            }
            break;
          case 'currentUsers':
            Object.keys(data).forEach(id=> {
              console.log(data);
              let player = new User(self, data[id]);
              console.log("adding player", data[id])
              self.players.add(player);

              if(id === self.socket.id){
                  self.currentPlayer = player;
                  self.changeCameras();
              }
            });
            break;
          case 'newUser':
            let player = new User(self, data);
            self.players.add(player);
            break;
        }
      }catch(e){
        console.error(e);
      }
    });

    self.socket.on('disconnect', (playerId)=>{
      // Socket.io lingo to say that the game connection has ended
      if(playerId == 'transport close'){
        console.log("GAME OVER");
        return;
      }

      self.players.getChildren().forEach(function (player) {
        if (playerId === player.playerId) {
            player.remove();
        }
    });
    })
  }

  updateUsers(){

  }

  createUsers(){
    
  }

  handleInput(){
    const self = this;
    
    let input = {};
    let flag = 0;
    Object.keys(self.keys).forEach(key=>{
      if(Phaser.Input.Keyboard.JustDown(self.keys[key])){
        flag = 1;
        input[key] = {isDown: true};
      }else if(Phaser.Input.Keyboard.JustUp(self.keys[key])){
        flag = 1;
        input[key] = {isUp: true};
      }
    })

    if(flag){
      self.socket.emit(self.key, {
        action: 'input',
        data: input
      });
    }
  }

  update(){
    if(this.onUpdate()){
      this.onUpdate();
    }
    this.handleInput();
    this.changeCameras();
  }

  changeCameras(){ //Will know when player changed scene and follow it to the other scene
    // We set self.currentPlayer, and we follow that player
    
    // console.log("currentPlayer", {
    //   x: this.currentPlayer.x,
    //   y: this.currentPlayer.y,
    //   camera:{
    //     x:this.camerax,
    //     y: this.cameray
    //   }
    // });

    if(this.currentPlayer.x>=this.camerax + this.cameras.main.width ){
        this.cameras.main.setBounds(Math.round(this.currentPlayer.x),this.cameray,25*16, 25*16);
        this.camerax = this.currentPlayer.x;
        this.cameras.main.fadeIn(1000);
    }
    else if(this.currentPlayer.y>=this.cameray + this.cameras.cameras[0].height ){
        this.cameras.main.setBounds(this.camerax,Math.round(this.currentPlayer.y),25*16, 25*16);
        this.cameray = this.currentPlayer.y;
        this.cameras.main.fadeIn(1000);
    }
    else if(this.currentPlayer.y<=this.cameray){
        this.cameras.main.setBounds(this.camerax,Math.round(this.currentPlayer.y)-50*16,25*16, 25*16);
        this.cameray = this.currentPlayer.y-50*16;
        this.cameras.main.fadeIn(1000);
    }
    else if(this.currentPlayer.x<=this.camerax){
        this.cameras.main.setBounds(Math.round(this.currentPlayer.x)-50*16,this.cameray,25*16, 25*16);
        this.camerax = this.currentPlayer.x-50*16;
        this.cameras.main.fadeIn(1000);
    }
  }

  anim(){ //animations for the sprites
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
  }
  
}
