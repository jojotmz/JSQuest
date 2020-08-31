export default class Preloader extends Phaser.Scene { //Will load all the files that the game needs
  init({user, socket}){
    const self = this;
    self.user = user;
    self.socket = socket;
    console.log("got socket", socket);
  }

  constructor() {
      super({key: "loader"});//scene key
  }
  preload(){
      //Tiles
      this.load.image("Houses", "/assets/map/Houses.png");
      this.load.image("Dungeon", "/assets/map/0x72_DungeonTilesetII_v1.3.png");
      this.load.image("Dungeon2", "/assets/map/0x72_16x16DungeonTileset.v4.png");
      this.load.image("Tiles", "assets/map/tiles.png");
      this.load.image("Tiles2", "assets/map/tileset_16x16_final_1.png");
      //tutorial
      this.load.image("menuS","/assets/Menu/menu_400x450_forest.png");
      this.load.image("space","/assets/Menu/Space.png");
      this.load.image("tutKeys","/assets/Menu/keys.png");
      this.load.image("shiftKey","/assets/Menu/shift.png");
      this.load.image("close","/assets/Menu/close.png");
      //Images
      this.load.image("title","/assets/Menu/TITLE.png");
      this.load.image("back","/assets/Menu/back_cave.png");
      this.load.image("fall","/assets/Menu/die.png");
      this.load.image("full","/assets/sprites/ui_heart_full.png");
      this.load.image("empty","/assets/sprites/ui_heart_empty.png");
      this.load.image("knife","/assets/sprites/weapon_knife.png");
      this.load.image("btn","/assets/Menu/btn.png");
      this.load.spritesheet("btnA","/assets/Menu/btn_190x49_forest.png",{ frameWidth: 190, frameHeight: 49 });
      this.load.image("box","/assets/sprites/box.png");
      this.load.image("weaponGold","/assets/sprites/goldenWeapon.png");
      this.load.spritesheet("weapon","/assets/sprites/Mobile - Knife Hit - Knives.png",{frameWidth:80,frameHeight:256});
      //sprites
      this.load.spritesheet("doorOpen","/assets/sprites/doorAnim.png",{frameWidth:4*16,frameHeight:3*16});
      this.load.image("doorOpenI","/assets/sprites/doorOpen.png");
      this.load.spritesheet("key","/assets/sprites/KeyIcons.png",{frameWidth:32,frameHeight:32});
      this.load.atlas('faune', '/assets/sprites/fauna.png', '/assets/sprites/fauna.json');
      this.load.atlas('lizard', '/assets/sprites/lizard.png', '/assets/sprites/lizard.json');
      this.load.atlas('chest', '/assets/sprites/treasure.png', '/assets/sprites/treasure.json');
      this.load.atlas('spike', '/assets/sprites/spikes.png', '/assets/sprites/spikes.json');
      this.load.atlas('button', '/assets/sprites/button.png', '/assets/sprites/button.json');
      //levels
      this.load.tilemapTiledJSON("map1", "/assets/map/dungeon1.json");
      this.load.tilemapTiledJSON("map2", "/assets/map/dungeon2.json");
      this.load.tilemapTiledJSON("map3", "/assets/map/dungeon3.json");
  }
  create(){
    const self = this;
    console.log("passing socket", self.socket);
    self.scene.start("Menu", {user: self.user, socket: self.socket});
  }
}