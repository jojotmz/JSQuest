

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // server side render phaser
import io from 'socket.io-client';

const SERVER_ADDRESS = process.env.NODE_ENV == 'development' ?
  "http://localhost:8080/":
  "PRODUCTION URL";

const GameContainer = dynamic(
  () => import('../game/main'),
  { ssr: false }
)

// react hooks, instead of components
function GamePage(){
  const [socket, setSocket] = useState({connected:false, io: null});
  const [hasConnection, setHasConnection] = useState({loading: true, timeout:null, connection:false});
  const [userData, setUserData] = useState({id: Math.floor(Math.random() * 100000)})

    // adv, rerun when socket connected change
  useEffect(function startSocket(){
    // Start a connection with game server. Remember that socket for later.
    setSocket(io(SERVER_ADDRESS));
    return function cleanSocket(){
      // Clean up the socket on dismount
      if(socket && socket.io){
        socket.close();
      }
    }
  }, []);


  useEffect(function isSocketConnected(){
    if(!socket.io){
      if(hasConnection.timeout){
        clearTimeout(hasConnection.timeout);
      }
      setHasConnection({
        timeout: setTimeout(function(){
          console.log("NOT CONNECTED");
          setHasConnection({
            timeout: null,
            connected: false,
            loading: false
          })
        }, 5000),
        connected: false,
        loading: true
      });
    }
    if(socket.connected){
      console.log("CONNECTED");
      if(hasConnection.timeout){
        clearTimeout(hasConnection.timeout);
      }
      setHasConnection({
        timeout: null,
        connected: true,
        loading: false
      });
    }

    return function cleanUpTimer(){
      if(hasConnection.timeout){
        clearTimeout(hasConnection.timeout);
      }
    }
  }, [socket.connected])

  if(hasConnection.loading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  if(!hasConnection.loading && !hasConnection.connected || !userData){
    return (
      <div>
        Unable to connect to server
      </div>
    )
  }
  
  return (
    <div>
      <GameContainer socketClient={socket} userData={userData}/>
    </div>
  )
}

export default GamePage;