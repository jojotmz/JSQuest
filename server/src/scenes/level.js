class Level extends Phaser.Scene {
    constructor({key, create, update, preload}) {
        super({key});

        // Requires the levels extend this scene to share similar functions between them
        // run the unique code for the levels in THIS create, update, and preload scene.
        // naming them differently suffices to avoid conflicts
        this.key = key;
        this.onCreate = create;
        this.onUpdate = update;
        this.onPreload = preload;
        this.state = {};
    }
   
    preload(){
      const self = this;
      self.onPreload();
    }

    create(){
      const self = this;
      // Need to make players a group rather than 1 player now
      self.players = this.physics.add.group();
      
      self.knives = self.physics.add.group({
        classType: Phaser.Physics.Arcade.Image
      });

      //Creates the enemies group
      self.enemyIndex = {};
      self.enemies = this.physics.add.group({
        classType:Enemies, // makes that the Lizards will be from the Enemies Sprite created
        createCallback:(go) =>{//to do when sprite is created
          const lizGo = go;
          lizGo.body.onCollide = true; //makes sprite collidable
          lizGo.setSize(15,18).setOffset(1,10); // size and position of hitbox
        }
      });

      self.onCreate();

      // update loop for physics, but we only handle input
      // and send input every 16 ticks
      // as recommended in the documentation
      self.updateInputLoop = self.time.addEvent({ 
        delay: 16, 
        callback: ()=>{self.handleInput(self)}, 
        loop:true
      });

      // Send info about the game: where the players are,
      // where enemies are etc
      self.sendStateLoop = self.time.addEvent({ 
        delay: 16, 
        callback: ()=>self.sendState(self), 
        loop:true
      });
    }

    getEnemies(){
      const self = this;
      let enemyState = {};
      self.enemies.getChildren().forEach((enemy) => {
        // Player has input
        enemyState[enemy.id] = enemy.getState();
      });

      return enemyState;
    }

    sendState(self){
      // the variable state send the contents periodically.
      io.emit(self.key, {
        action: 'state',
        data: {
          enemies: self.getEnemies()
        }
      });
      
    }

    // Add a player to our scene's physics AND
    // add's the listeners
    addPlayer({user}){
      const self = this;
      try{

        let sceneKey = user.scene.key;
        let socket = user.socket;

        // Listen to that players input
        // We're only listening on a socket channel with
        // the users's currents scene's key
        socket.on(sceneKey, ({action, data})=>{
          switch(action){
            case 'input':
              user.handleInput(data);
              break;
          }
        });

        socket.on('disconnect', ()=>{
          try{
            // Save the users data on disconnect
            adminHelper.set({user: user.getState()});
          }catch(e){
            console.error(e);
          }finally{
            self.removePlayer({user: user});
          }
        })

        // Add Player to our physics
        self.players.add(user);

        socket.emit('startScene', sceneKey);
        // Tell other users that we added a new user

        io.emit(sceneKey, {
          action: 'newUser',
          data: ScenePlayers[sceneKey][user.id],
        });

        // Give the client time to open up the new scene
        setTimeout(()=>{
          // Send user the info about players in the room
          socket.emit(sceneKey, {
            action: 'currentUsers',
            data: ScenePlayers[sceneKey]
          });
          
        }, 500);
      }catch(e){
        console.error(e);
      }
    }

    handleInput(self){
      try{
        if(!self.players){
          return;
        }
        // Iterate through all players in scene,
        // If player has input, handle accordingly
        self.players.getChildren().forEach((player) => {
            // Player has input
            player.update();
        });

        // Emit the new player updates to the scene
        io.emit(self.key, {
          action: 'playerUpdates',
          data: ScenePlayers[self.key]
        })
      }catch(e){
        console.error(e);
      }
    }

    // Remove a player from scene's physics
    removePlayer({user}){
      const self = this;
      try{
        user.socket.removeAllListeners(self.key);

        io.emit(self.key, {
          action: 'leave', 
          data: user.id
        });

        ScenePlayers[self.key][user.id] = null;
        delete ScenePlayers[self.key][user.id];
        user.destroy();
        user = null;
      }catch(e){
        console.log(e);
      }
    }

    update() { // will do every frame
      const self = this;
      self.onUpdate();
    }
}