//To have in mind when a user connected the server response with a currentDisplay that is equals to player's id
//cause display == player.id
class Socket {

  constructor(io) {
    this.io = io;
    this.velocityMovement = 4;
    this.playerId = 0;
    this.players = [];
    this.totalScreenSize = 0;
    this.onceCall = false;
    this.currentDisplay = 1;//by default is 1 cause player one begins the game
    this.position = { x: 0, y: 0};
    this.xLimit = 0;

    this.init();
  }

  init() {
    this.io.on('connection', socket => {
      socket.on('sendDisplayLimits', display => this.clientConnected(display, socket));

      socket.on('moveLeft', data => {
        this.players.forEach( player => {
          if(data.id === player.id) {
            player.position.x -= this.velocityMovement;
            if(player.position.x <= - 50) this.changeCurrentDisplay(player, 'left');

            console.log('player ',player);
            this.io.sockets.connected[this.players[player.currentDisplay-1].sessionId].emit('getPlayers', this.players);
          }
        });
      });
      socket.on('moveRight', data => {
        this.players.forEach( player => {
          if(data.id === player.id) {
            player.position.x += this.velocityMovement;
            if(player.position.x >= this.getWidthOfCurrentDisplay(player.currentDisplay) + 50) this.changeCurrentDisplay(player, 'right');

            console.log('player ',player);
            this.io.sockets.connected[this.players[player.currentDisplay-1].sessionId].emit('getPlayers', this.players);
          }
        });
      });

      //Handle when a user disconnects
      socket.on('disconnect', () => {
          this.players.map( (player, index) => {
            if(player.sessionId === socket.id) {
              console.log('user ',player.id,' disconnected');
              this.playerId -= 1;
              this.players.splice(index, 1);
            }
          });
      });

    });

  }

  clientConnected(display, socket) {
    console.log('client connected');
    this.playerId += 1;
    this.players.push({sessionId: socket.id, id: this.playerId, display: {width:  display.width, height:  display.height},
      position: {x: display.width/2, y: display.height/2}, currentDisplay: this.playerId });
    this.io.sockets.connected[this.getLastPlayer().sessionId].emit('init', this.getLastPlayer());
  }

  changeCurrentDisplay(player, side) {
    if(this.players.length > 1) {
      if(player.currentDisplay === 1 && side === 'left') {
        //go to the last display
        player.currentDisplay = this.getLastPlayer().id;
        player.position.x = this.getWidthOfCurrentDisplay(player.currentDisplay);
      } else if(player.currentDisplay === 1 && side === 'right') {
        player.currentDisplay += 1;
        player.position.x = 0;
      } else if(player.currentDisplay > 1 && side === 'left') {
        player.currentDisplay -= 1;
        player.position.x = this.getWidthOfCurrentDisplay(player.currentDisplay);
      } else if(player.currentDisplay > 1 && side === 'right') {
        if(this.getLastPlayer().id === player.currentDisplay) {
          player.currentDisplay = 1;
          player.position.x = 0;
        } else {
          player.currentDisplay += 1;
          player.position.x = 0;
        }
      }
    } else{
      if(side === 'left') {
        player.position.x = player.display.width;
      }
      if(side === 'right') {
        player.position.x = 0;
      }
    }
  }

  getLastPlayer() {
    return this.players[this.players.length-1];
  }

  getWidthOfCurrentDisplay(currentDisplay) {
    //by this way "this.players[player.currentDisplay-1].display.width" we can determinate at wich display we are and calculate
    //the new position
    return this.players[currentDisplay-1].display.width;
  }
}

module.exports = Socket;
