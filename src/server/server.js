const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Socket = require('./socket');
const connection = new Socket(io);

//public folders where the user catches dependencies
app.use(express.static(path.resolve(__dirname, '../public')) );
//it returns a main page to play the game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

http.listen(3000, () => {
  console.log('listening on: 3000!');
});
