// npm install websocket@1.0.25 --save

const WebSocketClient = require('websocket').client;
const client = new WebSocketClient({tlsOptions: {rejectUnauthorized: false}});
let lastPing = new Date().getTime();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('Connected to Server...');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection Closed');
    });
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log(message.utf8Data);
      }
    });
    connection.on('pong', function(){
      console.log('[pingpong] response took', (new Date().getTime() - lastPing) + 'ms');
    })

    function send(message) {
      if (connection.connected) {
          connection.sendUTF(message);
      }
    }

    // subscribe to book
    send(`{
      "type": "SUBSCRIBE",
      "topic": "BOOK",
      "market": "ZRX-WETH", // e.g. 'ZRX-WETH'
      "requestId": 1 // optional requestId
    }`);

    // Send a ping every 10s to
    // keep the connection live
    setInterval(function(){
      lastPing = new Date().getTime();
      connection.ping();
    }, 10000);

});

client.connect('wss://ws.radarrelay.com/ws');
