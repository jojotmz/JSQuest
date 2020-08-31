import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Make sure it hasn't already been initialized
if (!firebase.apps.length) {
  firebase.initializeApp({
      apiKey: "AIzaSyCmIYtdZnSAktU16ZK7SYU7zlYIYsWot8E",
      authDomain: "questjs-d6d10.firebaseapp.com",
      databaseURL: "https://questjs-d6d10.firebaseio.com",
      projectId: "questjs-d6d10",
      storageBucket: "questjs-d6d10.appspot.com",
      messagingSenderId: "665747985090",
      appId: "1:665747985090:web:9b0df930d5ed1cca3de15b"
  });
}


export default firebase;
