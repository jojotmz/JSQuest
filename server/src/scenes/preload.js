function Preload(scene){
  //Tiles
  scene.load.image("Houses", "assets/map/Houses.png");
  scene.load.image("Dungeon", "assets/map/0x72_DungeonTilesetII_v1.3.png");
  scene.load.image("Dungeon2", "assets/map/0x72_16x16DungeonTileset.v4.png");
  scene.load.image("Tiles", "assets/map/tiles.png");
  scene.load.image("Tiles2", "assets/map/tileset_16x16_final_1.png");
  //tutorial
  scene.load.image("menuS","assets/Menu/menu_400x450_forest.png");
  scene.load.image("space","assets/Menu/Space.png");
  scene.load.image("tutKeys","assets/Menu/keys.png");
  scene.load.image("shiftKey","assets/Menu/shift.png");
  scene.load.image("close","assets/Menu/close.png");
  //Images
  scene.load.image("title","assets/Menu/TITLE.png");
  scene.load.image("back","assets/Menu/back_cave.png");
  scene.load.image("fall","assets/Menu/die.png");
  scene.load.image("full","assets/sprites/ui_heart_full.png");
  scene.load.image("empty","assets/sprites/ui_heart_empty.png");
  scene.load.image("knife","assets/sprites/weapon_knife.png");
  scene.load.image("btn","assets/Menu/btn.png");
  scene.load.spritesheet("btnA","assets/Menu/btn_190x49_forest.png",{ frameWidth: 190, frameHeight: 49 });
  scene.load.image("box","assets/sprites/box.png");
  scene.load.image("weaponGold","assets/sprites/goldenWeapon.png");
  scene.load.spritesheet("weapon","assets/sprites/Mobile - Knife Hit - Knives.png",{frameWidth:80,frameHeight:256});
  //sprites
  scene.load.spritesheet("doorOpen","assets/sprites/doorAnim.png",{frameWidth:4*16,frameHeight:3*16});
  scene.load.image("doorOpenI","assets/sprites/doorOpen.png");
  scene.load.spritesheet("key","assets/sprites/KeyIcons.png",{frameWidth:32,frameHeight:32});
  scene.load.atlas('faune', 'assets/sprites/fauna.png', 'assets/sprites/fauna.json');
  scene.load.atlas('lizard', 'assets/sprites/lizard.png', 'assets/sprites/lizard.json');
  scene.load.atlas('chest', 'assets/sprites/treasure.png', 'assets/sprites/treasure.json');
  scene.load.atlas('spike', 'assets/sprites/spikes.png', 'assets/sprites/spikes.json');
  scene.load.atlas('button', 'assets/sprites/button.png', 'assets/sprites/button.json');
  //levels
  scene.load.tilemapTiledJSON("map1", "assets/map/dungeon1.json");
  scene.load.tilemapTiledJSON("map2", "assets/map/dungeon2.json");
  scene.load.tilemapTiledJSON("map3", "assets/map/dungeon3.json");
}