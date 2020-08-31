//Variables to be used as help

const IDLE = 1;
const DAMAGE = 0;
const DOWN = 0;
const UP = 1;
const LEFT = 2;
const RIGHT = 3;

function SendPlayerToScene({socket}){
  socket.emit({})
}

class Player extends Phaser.Physics.Arcade.Sprite { // Class for the Player
    constructor(scene,x,y,texture) {
        super(scene, x, y, texture);
        this.isDead = 0;
        this.scene = scene; //scene where the player is located
        this.healthStat = IDLE; // If player is taking dmg or not
        this.damageTime = 0; //How much time is the player on damage state
        this.health = 5; // health of player
        this.state = DOWN; // position the player is located
        this.kniveState=1;  // so player cant spam the space button
        this.swordState=1;  // so player cant spam the space button
        this.kniveCounter = 8; // how many knifes the player has throwned
        this.invulnerable = 0;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1.5); // Changes the size
        this.setOrigin(0,0);
        this.setSize(20,20); //Changes size of hitbox
        this.setOffset(5,6); //Offset of the hutbox
        this.setCollideWorldBounds(true);
    }

    preUpdate(time, delta) { // function that will be done before the Update
        //Will check the player state (Damage or Idle)
        super.preUpdate(time, delta);
        if(this.healthStat == DAMAGE) {
            this.damageTime +=delta;
            if(this.damageTime>=250){
                this.healthStat = IDLE;
                this.clearTint();
            }
        }
    }

    throwKnive(){
        if(this.kniveCounter<=0){ //can throw only 8 knifes
            return;
        }
        this.kniveState=0;
        this.kniveCounter-=1;
        //check position to wich throw the knive
        const vec = new Phaser.Math.Vector2(0,0);
        if(this.state==DOWN) {
            vec.y=1;
        }
        else if(this.state==UP) {
            vec.y=-1;
        }
        else if(this.state==LEFT) {
            vec.x=-1;
        }
        else if(this.state==RIGHT) {
            vec.x=1;
        }
        const angle = vec.angle();
        const knife=this.knives.get(this.x,this.y, 'knife');
        knife.setRotation(angle);
        knife.setVelocity(vec.x*300,vec.y*300);
    }

    frontBlade(){
      const self = this;
      const vec = new Phaser.Math.Vector2(0,0);
      let posx=5,posy=5;
      if(this.state==DOWN) {
          vec.y=1;
          posy=25;
      }
      else if(this.state==UP) {
          vec.y=-1;
          posy=-25;
      }
      else if(this.state==LEFT) {
          vec.x=-1;
          posx=-25;
      }
      else if(this.state==RIGHT) {
          vec.x=1;
          posx=25;
      }
      const angle = vec.angle();
      const knife = self.scene.knives.get(this.x+posx,this.y+posy, 'knife');
      knife.depth=0;
      knife.setScale(3,1);
      knife.setRotation(angle);
      if(this.state==DOWN || this.state==UP){
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

    getState(){
      // We don't send the physics object from phaser, we just
      // send the info we need over the websockets
      const self = this;
      return {
        id: self.id,
        x: self.body.x,
        y: self.body.y,
        direction: self.state,
        kniveCounter: self.kniveCounter,
        idle: self.isIdle,
        sword: self.swordState == 1 ? false : true,
        knife: self.kniveState == 1 ? false : true,
        healthStat: self.healthStat,
        health: self.health,
        damageTime: self.damageTime
      }
    }

    // After we collect the input inbetween updates, 
    checkInput(input){
      const self = this;

      if(!input){
        return;
      }


      // Just so we don't have issues trying to read
      // input.right.VARIABLE or input.left.VARIABLE
      if(!input.shift){
        input.shift = {};
      }
      if(!input.right){
        input.right = {}
      }
      if(!input.left){
        input.left = {}
      }
      if(!input.up){
        input.up = {}
      }
      if(!input.down){
        input.down = {};
      }
      if(!input.space){
        input.space = {};
      }

      const velX = 100;
      const velY = 100;
      
      if(input.shift.isDown && self.kniveState){ //space to throw knife
        self.throwKnive();
      }else if(input.shift.isUp){
          self.kniveState=1;
      }

      // We don't know if a user is holding down their key or not
      // So instead, send to the server when they press it down
      // And when they press it up.
      // In between that, we can assume that the key is down.
      if(input.up.isDown) {
          this.setVelocityY(-velY);
          this.state = UP;
      }else if (input.down.isDown) {
          this.setVelocityY(velY);
          this.state = DOWN;
      }else if(input.up.isUp || input.down.isUp){
        this.setVelocityY(0);
      }

      if(input.right.isDown){
        this.setVelocityX(velX);
        self.state = RIGHT;
      }else if(input.left.isDown){
        self.setVelocityX(-velX);
        self.state = LEFT;
      }else if(input.left.isUp || input.right.isUp){
        self.setVelocityX(0);
      }

      // Lot of changes in game mechanics when running on the server, flags are bad
      // lesson learned.
      // If we're not moving after this, we are idle.
      // It's tricky to check with flags since you can't directly check
      // the input. Since inputs come in at different times.
      // 
      // For example in one update you can get input={right:{isDown: true}}
      // Then in the next update you can get input={up: {isDown: true}}
      // But in that second update, right is still down. Even though we don't have
      // that in the input object. So we can either store that a key was pressed down
      // like the sword state, or just directly check the velocity.
      if(self.body.velocity.x == 0 && self.body.velocity.y == 0){
        self.isIdle = true;
      }else{
        self.isIdle = false;
      }

      if(self.isIdle){
        if(input.space){
          if(input.space.isDown && this.swordState){
            self.frontBlade();
            self.swordState = 0;
          }else if(input.space.isUp){
            self.swordState = 1;
          }
        }
      }
    }

    update() { //will check 1 every frame
      const self = this;
      try {
        if(this.health<=0){ //player died
          self.scene.removePlayer({user: this, dead: true});
          return;
        }
        if(ScenePlayers[self.scene.key][self.id].input){
          self.checkInput(ScenePlayers[self.scene.key][self.id].input);
        }
        ScenePlayers[self.scene.key][self.id] = self.getState();
      }catch(e){
        console.log(e);
      }
    }

    handleDamage(dir){ //will handle the dmg
      const self = this;
      if(this.health<=0){ //player died
        console.log("User is dead");
        this.healthStat = this.isDead;
        this.isDead = true;
        return;
      }
      if(this.healthStat == DAMAGE || this.isDead || this.invulnerable){
          return;
      }
      //throw player behind and make the blood effect
      //this.setVelocity(dir.x,dir.y);
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
          self.isDead = true;
      }
    }
}