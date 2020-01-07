// npm install websocket@1.0.25 --save

const WebSocketClient = require('websocket').client;
const client = new WebSocketClient({tlsOptions: {rejectUnauthorized: false}});
let lastPing = new Date().getTime();

client.on('connectFailed', error => {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', connection => {
    console.log('Connected to Server...');
    connection.on('error', (error) => {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', () => {
        console.log('Connection Closed');
    });
    connection.on('message', message => {
      if (message.type === 'utf8') {
        console.log(message.utf8Data);
      }
    });
    connection.on('pong', () => {
      console.log('[pingpong] response took', (new Date().getTime() - lastPing) + 'ms');
    })

    const send = message => {
      if (connection.connected) {
        connection.sendUTF(message);
      }
    };

    // subscribe to book
    send(
      JSON.stringify({
        type: 'SUBSCRIBE',
        topic: 'BOOK',
        market: 'ZRX-WETH', // e.g. 'ZRX-WETH'
        requestId: '1'
      })
    );

    // Send a ping every 10s to
    // keep the connection live
    setInterval(() => {
      lastPing = new Date().getTime();
      connection.ping();
    }, 10000);

});

client.connect('wss://ws.radarrelay.com/v3');
