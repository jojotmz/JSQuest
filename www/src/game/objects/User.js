import Player from './Player';

export default class User extends Player{
  constructor(scene, user){
    super(scene, user.x, user.y,'player');
    const self = this;
    self.id = user.socketId || user.id;
  }
}