export default class Tutorial extends Phaser.Scene { //Main menu for the game
  constructor() {
      super({key: "Tutorial"});//key da scene
  }
  create(){
      this.add.image(0,0,"back");
      this.add.image(400,400,"menuS").setScale(1.5);
      this.add.image(250,200,"tutKeys").setScale(0.5);
      this.add.image(400,200,"shiftKey").setScale(0.5);
      this.add.text(330,100,"TUTORIAL",{fontFamily: 'font1'}).setFontSize(20).setColor("black");
      this.add.text(350,230,"Throw Knife",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.add.image(550,200,"space").setScale(0.5);
      this.add.text(500,230,"Main Attack",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.physics.add.staticSprite(200,300,'key',1).setScale(1.5);
      this.add.text(250,300,"Catch Keys to Advance Levels",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.add.text(150,350,"Be aware of:",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.physics.add.staticSprite(300,400,'lizard',1).setScale(3);
      this.physics.add.staticSprite(400,410,'spike',"spikes-3.png").setScale(3);
      this.physics.add.staticSprite(500,410,'fall').setScale(3);
      this.add.text(150,480,"Click on Buttons to shutdown the spikes",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.physics.add.staticSprite(400,550,'button').setScale(3);
      this.add.text(150,600,"Catch Chests to get hearts, ammo or the keys",{fontFamily: 'font1'}).setFontSize(9).setColor("black");
      this.physics.add.staticSprite(400,650,'chest').setScale(3);
      this.add.sprite(630,690,'close').setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.stop();  this.scene.run("Menu");});
  }
}