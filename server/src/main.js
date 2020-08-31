const FirebaseUserCache = {};
const adminHelper = AdminHelper();

class Root extends Phaser.Scene {
  constructor(){
      super({key: 'root', active: true});
  }

  preload(){
    Preload(this);
  }

  create(){
    const self = this;

    self.numPlayers = 0;

    // Start and run all the levels simultaneously. They'll always
    // Be on and running while the game is running now.
    self.scene.manager.processQueue();
    self.scene.manager.isProcessing = false;
    self.scene.launch('level1');

    // im listening to new connection, then run and grab socket
    io.on('connection', function (socket) {
        console.log("user connected");
        self.numPlayers += 1;
        window.setNumPlayers(self.numPlayers);

        socket.on("connectionReady", ({id})=>{
          // Grab the user data from firebase
          adminHelper.get({
            id,
            onSuccess: (user)=>{
              try {
                // I want to disable letting a user connect if
                // I already have a user in the cache.
                // Otherwise they could login twice.
                if(FirebaseUserCache[socket.id]){
                  return;
                }
                user['socketId'] = socket.id;

                // Cache the data
                FirebaseUserCache[socket.id] = user;
                
                // Tell the client we grabbed a user
                socket.emit('user', user);
              }catch(e){
                // Either didn't have a user, or the socket was invalid
                console.error(e);
              }
            }
          });
        });

        // The user has clicked 'Start' on the menu
        socket.on("startGame", ()=>{
          // add the user to their last scene on the server
          // And then add them on the server, tell them what
          // scene they need to open on the clientside.
          try{
            let firebaseUser = FirebaseUserCache[socket.id];
            let scene = self.scene.get(firebaseUser.level);
            let user = new User({
              scene,
              x: firebaseUser.x,
              y: firebaseUser.y,
              socket: socket
            });
            user.enterScene({
              key: firebaseUser.level,
              user: firebaseUser
            });
          }catch(e){
            console.error(e);
          }
        })

        // Disconnects are tricky: TO-DO
        socket.on('disconnect', function () {
          self.numPlayers -= 1;
          window.setNumPlayers(self.numPlayers);
          // Remove this user from our userCache
          try{
            FirebaseUserCache[socket.id] = null;
            delete FirebaseUserCache[socket.id];
          }catch(e){
            console.error(e);
          }
        });
    });
  }
}

// Running Phaser in 
const config = {
  type: Phaser.HEADLESS,
  parent: "phaser-game",
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  },
  scene: [Root, Level1],
  autoFocus: false
};


const game = new Phaser.Game(config);
window.gameLoaded();
