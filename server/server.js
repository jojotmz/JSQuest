const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
// const cors = require('cors');
const httpServer = require('http').Server(app);
const https = require('https');
const SocketIO = require('socket.io');
var io;
const Datauri = require('datauri');
const fs = require('fs');

// uri required to read assets from Phaser files
const datauri = new Datauri();

// JSDOM simulates the HTML DOM and window (requires REACT), so Phaser can run on a server
// and not in a browser
const { JSDOM } = jsdom;

var NUM_PLAYERS = 0;

// Serving a static folder for sprites / images from the /public folder
app.use(express.static(__dirname + '/public'));

// ENABLE CORS - currently not in use, couldn't deploy in time, used for deployment
// app.use(cors());

// Only server rout to check number of connected players
app.get('/ping', (req, res)=>{
    res.status(200).json(NUM_PLAYERS);
});

function secondsToDuration(num){
    const hour = 3600;
    const minute = 60;
    const [hours, minutes, seconds] = [Math.floor(num/hour), Math.floor((num%hour)/minute), Math.floor(num%minute)];
    return `${hours > 0 ? `${hours} hours ` : ''}${((minutes > 0) || (hours > 0))? `${minutes} minutes ` : ''}${seconds} seconds`;
}

// from youtube tutorial: using `not prod` and `prod` is recommended when working locally
// to differentiate from the deployment code
const runGame = async ({isProd})=>{ 
    return new Promise((resolve, reject)=>{
        // run js in index
        JSDOM.fromFile(path.join(__dirname, 'src/index.html'), {
            // To run the scripts in the html file
            runScripts: "dangerously",
            // Also load supported external resources
            resources: "usable",
            // So requestAnimatinFrame events fire
            pretendToBeVisual: true
            }).then((dom) => {
                dom.window.URL.createObjectURL = (blob) => {
                    if (blob){
                        let url =  datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
                        return url;
                    }
                };
                dom.window.URL.revokeObjectURL = (objectURL) => {};
                dom.window.gameLoaded = () => {
                    if(!isProd){
                        httpServer.listen(8080, function () {
                            console.log(`Listening on ${httpServer.address().port}`);
                            resolve();
                        });
                        io = SocketIO.listen(httpServer);
                        io.set('origins', '*:*');
                    }else{
                        // To Run in prod, I should put my HTTPS certificiates in ./src/certs
                        // TO-DO bellow
                        const SSL_OPTIONS = {
                            key: fs.readFileSync('./src/certs/privkey.pem'),
                            cert: fs.readFileSync('./src/certs/fullchain.pem')
                        };
                        let httpsServer = https.createServer(SSL_OPTIONS, app);
                        httpsServer.listen(443, function () {
                            console.log(`Listening on ${httpsServer.address().port}`);
                            resolve();
                        });
                        io = SocketIO.listen(httpsServer);
                        io.set('origins', '*:*');
                    }

                    // Set properties we need to pass to game
                    dom.window.io = io;
                    dom.window.setNumPlayers = (num)=>{
                        NUM_PLAYERS = num;
                    }
                };
        }).catch((error) => {
            reject(error);
        });
    });
}


const connect = async ({PROD}) =>{
    try{
      let connectTime = Date.now();
		  let lifetimeInterval = setInterval(() => {
        let lifetimeSeconds = Math.floor((Date.now() - connectTime) / 1000);
        console.log(`Running for ${secondsToDuration(lifetimeSeconds)}`);
      }, 10000);
      await runGame({isProd:PROD});
    }catch(e) {
        console.log(e);
    }
}

let args = process.argv.slice(2);
let PROD = process.env.NODE_ENV == 'production';

for (let arg of args) {
	let [argName, argValue] = arg.split('=');
	if (argName === '--NODE_ENV'){
    if(argValue === 'production'){
        PROD = true;
    }
  }
}

connect({PROD});
