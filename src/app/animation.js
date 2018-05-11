export default class Animation {

  constructor(data, socketCallback) {
    this.animater = p5 => {
      p5.setup = () => {
        this.setup(p5);
      }
      p5.draw = () => {
        this.draw(p5);
      }
    }

    this.p5 = new p5(this.animater);
    this.id = data.id;
    this.currentDisplay = data.currentDisplay;
    this.socketCallback = socketCallback;
    this.amplitude = 80;
    this.theta = 0.0;
    this.rangeColor = 200;
    this.obstacules = [];
    this.decreasingY = 0;
    this.left = false;
    this.right = false;
    this.players = [data];
    this.circleRadius = 80;
    //Text config
    this.initialTime = Date.now() + 3000; //initial delay time
    this.lastTime = 0;
    this.firstAppear = false;
  }

  setup(p5) {
    this.canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
  }

  draw(p5) {
    //clean screen
    p5.background(150, this.rangeColor - 4, this.rangeColor);

    if(this.initialTime >= this.lastTime) {
      p5.textSize(32);
      p5.text('Player '+this.id, window.innerWidth /2, window.innerHeight /2);
      p5.fill(0, 102, 153);

      this.lastTime = Date.now();
    }

    //Iterate every object's position and validate if some reach the display limit
    this.players.forEach( player => {
      //Only paint the players that are at this display
      if(player.currentDisplay === this.id) p5.ellipse(player.position.x, player.position.y, this.circleRadius, this.circleRadius);
    });

    if(this.left) {
      this.socketCallback({name: 'moveLeft'});
    }
    if(this.right) {
      this.socketCallback({name: 'moveRight'});
    }
    if(this.up) {
      this.socketCallback({name: 'moveLeft'});
    }
    if(this.down) {
      this.socketCallback({name: 'moveRight'});
    }

  }

  getId() {
    return this.id;
  }

  movePlayer(position) {
    this.moving = true;
    this.x = position.x;
  }

  setPosition(position) {
    this.position = position;
    //this.positions.push(position);
  }

  addPlayers(players) {
    this.players = players;
  }

  keyDown(keyCode) {
    if(keyCode === 37) { //left
        this.left = true;
    } else if(keyCode === 39) { //right
        this.right = true;
    }
  }

  keyUp(keyCode) {
    if(keyCode === 37) { //left
        this.left = false;
    } else if(keyCode === 39) { //right
        this.right = false;
    }
  }
}
