// Keep index of our players for easy and quicker access
// This index keeps just the info that we need to send to other
// users. We don't want to send the whole sprite to our users.
var ScenePlayers = {
  'level1':{},
  'level2':{},
  'level3':{}
};

function SwitchScene({scene, x, y, user}){
  user.scene.removePlayer({user});
  user = null;
  delete user;
  let newUser = new User({
    scene,
    x, 
    y,
    user: ScenePlayers[user.scene.key][user.id]
  });
  return newUser;
}

class User extends Player{

  constructor({scene, x, y, user, socket}){
    super(scene, x, y, "player");
    const self = this;
    let userData = {
      id: socket.id,
      ...user
    };

    self.id = socket.id;
    self.socket = socket;
    self.scene = scene;
    ScenePlayers[self.scene.key][self.id] = self.getState();
  }


  handleInput(input){
    const self = this;
    let sceneKey = self.scene.key;
    if(!ScenePlayers[sceneKey][self.id].input){
      ScenePlayers[sceneKey][self.id].input = input;
    }else{
      // If we get 2 inputs before we process it, don't override it
      ScenePlayers[sceneKey][self.id].input = {
        ...ScenePlayers[sceneKey][self.id].input,
        ...input
      }
    }
  }

  leaveScene(){
    const self = this;
    self.scene.removePlayer(self);
    let oldData = ScenePlayers[self.scene.key][self.id];
    delete ScenePlayers[self.scene.key][self.id];
    return oldData;
  }

  enterScene({key, user}){
    const self = this;
    self.scene.addPlayer({user: self});
    ScenePlayers[key][self.id] = user;
  }

  swapScene({key}){
    let user = self.leaveScene();
    self.enterScene({key, user});
  }

  setScene({key}){
    const self = this;
    try{
      // Tell that user that they're leaving the scene
      // Have them switch scenes
      io.to(self.id).emit('scene',  {
        action: 'switch',
        data: key
      });
      
      // Remove user from the previous scene and add them to the new scene
      // We use a timeout to give the client time to actually switch to the new scene
      // Before we send them the scene data.
      // Othewise they'll recieve the scene data before they're even displaying the scene
      setTimeout(()=>{
        self.swapScene({key});
      }, 500)
    }catch(e){
      console.error(e);
    }
  }
}