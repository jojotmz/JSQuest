export default class MainMenu extends Phaser.Scene { //Main menu for the game
  init({user, socket}){
    const self = this;
    self.user = user;
    self.socket = socket;
  }

  constructor() {
    super({key: "Menu"});//scene key
  }

  create(){
    const self = this;
    self.add.image(0,0,"back");
    self.add.image(400,250,'title');
    let buttonGame = self.add.sprite(0,0,'btnA',0);
    let lG = self.add.text(-32, -10, "Start Game",{font:" Times"});
    let buttonTutorial = self.add.sprite(0,0,'btnA',0);
    let lT = self.add.text(-20, -10, "Tutorial",{font:" Times"});

    self.add.container(400,400,[buttonGame,lG])
      .setSize(190,50) //size of the button
      .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains) //makes it clickable
      .on('pointerup', () =>{
          self.socket.emit("startGame");
      })
      .on('pointerdown',()=>{
          //button1.setFrame(1);
      });
    
    self.socket.on('startScene', (key)=>{
      self.scene.start(key, {socket: self.socket, user: self.user});
    })

    self.add.container(400,500,[buttonTutorial,lT])
      .setSize(190,50) //size of the button
      .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains) //makes it clickable
      .on('pointerup', () =>{
          self.scene.start("Tutorial");
          self.scene.stop();
          //button1.setFrame(0);
      })
      .on('pointerdown',()=>{
          //button1.setFrame(1);
      });
  }
}