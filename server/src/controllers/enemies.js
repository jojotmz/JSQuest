class Enemies extends Phaser.Physics.Arcade.Sprite { // Enemies Sprite Function
    constructor(scene,x,y,texture,frame,player) {
        super(scene,x,y,texture,frame);
        this.scene = scene; // scene where enemy is located
        this.DIR=[0,0,0,0]; //directions fot the enemy
        this.DIR[RIGHT]=1; // starts going right
        this.direction = RIGHT;
        this.setScale(2);//change size
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE,this.handleTileCollision,this); // will do the function on collide with tile
        this.life = 2; //life of enemy
        this.flagPlayer=0; // if player is nearby
    }
    handleTileCollision(go, tile) {
        if (go !== this)
        {
            return
        }
        if(this.flagPlayer==0) { //will go random if player isn't nearby
            this.randomDirection()
        }

    }

    getState(){
      const self = this;
      return {
        x: self.x,
        y: self.y,
        direction: self.direction,
        life: self.life,
        id: self.id
      }
    }

    hitKnive(){ //when hit by weapon
        this.life-=1;
        if(this.life==0){
            let x = Math.random()
            if(x<0.35){
              // I'll need to figure out a way to find out what player
              // hit an enemy with a knife.
              // It may be that I need to create a new Knife object
              // And then attach a playerId to that knife object
              // this.player.knifeCounter+=5;
            }
            this.destroy();
        }
    }

    destroy(fromScene) { //deletes the sprite
      const self = this;
      
      // Tell client what enemy we destroyed
      io.emit(self.scene.key, {
        action: 'destroyEnemy',
        data: self.id
      });

      super.destroy(fromScene);

      if(this.timeEvent) {
          this.timeEvent.destroy();
      }
    }

    // TODO, check what player is the closest player

    randomDirection(){ //select random direction or will follow the player if player is under 300 blocks from it
        let speed = 50;
        if(this.flagPlayer==0) {
            let newDirection = Phaser.Math.Between(0, 3)
            while (newDirection === this.direction) {
                newDirection = Phaser.Math.Between(0, 3)
            }
            this.DIR[this.direction] = 0;
            this.DIR[newDirection] = 1;
            this.direction = newDirection;
        }
        else{
            this.scene.physics.moveToObject(this,this.player,speed);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        const speed = 50;
        
        // You're going to need to iterate through all players in a scene
        // And find out what player is closest to this enemy

        // if(this.player!=null) {
        //     if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y) <= 500) { //checks player location
        //         this.flagPlayer = 1;
        //         this.scene.physics.moveToObject(this,this.player,speed);
        //     }
        //     else{
        //         this.flagPlayer=0;
        //         if(this.DIR[UP]){
        //             this.setVelocity(0, -speed);
        //         }
        //         else if(this.DIR[DOWN]){
        //             this.setVelocity(0, speed);
        //         }
        //         else if(this.DIR[LEFT]){
        //             this.setVelocity(-speed, 0)
        //         }
        //         else if(this.DIR[RIGHT]) {
        //             this.setVelocity(speed, 0)
        //         }
        //     }
        // }
        // else{
            this.flagPlayer=0;
            if(this.DIR[UP]){
                this.setVelocity(0, -speed);
            }
            else if(this.DIR[DOWN]){
                this.setVelocity(0, speed);
            }
            else if(this.DIR[LEFT]){
                this.setVelocity(-speed, 0)
            }
            else if(this.DIR[RIGHT]) {
                this.setVelocity(speed, 0)
            }
        //}
    }

}