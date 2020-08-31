// To get this working I need to setup Firebase Admin on this server
const AdminHelper = function (){
  function getUserData({user, onSuccess, onError}){
    let firebaseUser = {
      level: 'level1',
      x: 73.5*16,
      y: 90*16
    }
    onSuccess(firebaseUser);
  }

  function setUserData({data}){
    
  }
  return {
    get: getUserData,
    set: setUserData
  }
}