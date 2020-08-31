import React, {PureComponent} from "react";
import Phaser from "phaser";

import Level1 from "./scenes/Level1.js"
import Level2 from "./scenes/Level2.js"
import Level3 from "./scenes/Level3.js"
import Preloader from "./scenes/Preload.js"
import MainMenu from "./scenes/Menu.js"
import Tutorial from "./scenes/Tutorial.js"
import UI from "./scenes/UI.js";

var callbacks, initialPlayerData, socket;

var Root = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Root (){
      Phaser.Scene.call(this, 'root');
    },
    preload: function (){

    },
    create: function (){
        const self = this;
        self.socket = window.socket;
        self.socket.emit("connectionReady", window.userData);

        self.socket.on("user", function(user){
            self.scene.start('loader',{
              socket: self.socket,
              user
            });
        })
    }
});

var config = {
  type:Phaser.AUTO,
  width:800,
  height:800,
  parent: "game-container",
  scale: {
      mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  },
  autoStart: true,
  physics: {
      default: 'arcade',
      fps:{
          target:60,
          forceSetTimeOut: true
      },
      arcade: {
          gravity:{y:0},
          debug: false
      }
  },
  scene: [Root, Preloader, MainMenu, Tutorial, Level1, Level2, Level3, UI],
};

// In order to make Phaser Game work properly in React, we can't have it re-render anytime some react data changes.
// By using a PureComponent from, we make sure that the game won't re-render at all.

class GameComponent extends PureComponent {
    componentDidMount(){
      // Pass the data we grabbed from the user to a variable which will passed into the game
      window.userData = this.props.userData;

      window.callbacks = this.props.callback;

      // Pass our Socket that we created to the game
      window.socket = this.props.socketClient;
      // Here is where we initiate the game
      const game = new Phaser.Game(config);
    }

    componentWillUnmount(){
      // Clean up the socket connection when we exit the game. Otherwise memory leak may happen.
      if(socket){
          socket.close()
      }
    }

    render(){
        return (
            <div
                id="game-container" 
                className="pixelated"
                style={{
                    height: '800px',
                    width: '800px'
                }}
            />
        );
    }
}

export default GameComponent;