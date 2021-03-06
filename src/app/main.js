import Animation from './animation';

class Main {

  constructor() {
    this.id = null;
    this.io = io();
    this.io.emit('sendDisplayLimits', {width: window.innerWidth, height: window.innerHeight});
    this.io.on('init', data => {
      this.animation = new Animation(data, event => {
        this.io.emit(event.name, {id: this.animation.getId(), display: { width: window.innerWidth, height: window.innerHeight }});
      });
    });

    this.io.on('getPlayers', players => {
      this.animation.addPlayers(players);
    });

    this.loadListenner();
  }

  loadListenner() {
    document.addEventListener('touchstart', e => {
      if(e.touches[0].clientX > window.innerWidth/2) {
        this.animation.touchDown('right');
      } else{
        this.animation.touchDown('left');
      }
    });

    document.addEventListener('touchend', e => {
      this.animation.touchUp();
    });

    document.addEventListener('mousemove', e => {
    //  this.mousemoveHandler(e);
    });

    document.addEventListener('keydown', e => {
      this.keyDownHandler(e);
    });

    document.addEventListener('keyup', e => {
      this.keyUpHandler(e);
    });
  }

  keyDownHandler(key) {
    let {keyCode} = key;
    this.animation.keyDown(keyCode);
  }

  keyUpHandler(key) {
    let {keyCode} = key;
    this.animation.keyUp(keyCode);
  }

}

const game = new Main();
