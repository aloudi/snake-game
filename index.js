class Game {

  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.gridSize = 30;
    this.animation = {
      tickCount: 0,
      ticksPerFrame: 9,
    }
    this.snake = new Snake(this.ctx, this.gridSize);
  }

  init() {
    window.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowRight':
          if (this.snake.direction !== 'left' && this.snake.direction !== 'right') {
            this.snake.move('right');
          }
          break;
        case 'ArrowLeft':
          if (this.snake.direction !== 'left' && this.snake.direction !== 'right') {
            this.snake.move('left');            
          }
          break;
        case 'ArrowUp':
          if (this.snake.direction !== 'up' && this.snake.direction !== 'down') {
            this.snake.move('up');            
          }
          break;
        case 'ArrowDown':
          if (this.snake.direction !== 'up' && this.snake.direction !== 'down') {
            this.snake.move('down');
          }
          break;
        default:
          break;
      }
    })
  }

  start() {
    this.init();
    this.run();
  }

  drawGrid() {
    this.ctx.fillStyle = 'darkgrey';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    for (let positionX = 0; positionX <= this.canvas.width; positionX += this.gridSize) {
      this.ctx.moveTo(positionX, 0);
      this.ctx.lineTo(positionX, this.canvas.height);
    }
    for (let positionY = 0; positionY <= this.canvas.width; positionY += this.gridSize) {
      this.ctx.moveTo(0, positionY);
      this.ctx.lineTo(this.canvas.height, positionY);
    }
    this.ctx.stroke();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.snake.drawSnake();
    this.snake.move();

  }

  update() {
    if (this.animation.tickCount > this.animation.ticksPerFrame) {
      this.animation.tickCount = 0;
      this.render();
    }
    this.animation.tickCount++;

  }
  run() {
    this.update();
    window.requestAnimationFrame(() => {
      this.run();
    });
  }
}

class Snake {

  constructor(ctx, gridSize) {
    this.ctx = ctx;
    this.gridSize = gridSize;
    this.snakeCells = [{ x: 150, y: 150 }, { x: 180, y: 150 }, { x: 210, y: 150 }];
    this.snakeHead = { x: 210, y: 150 }
    this.direction = 'right';
  }

  drawSnake() {
    this.snakeCells.map(cell => {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(cell.x, cell.y, this.gridSize, this.gridSize);
    })
  }

  move(direction = this.direction) {
    let newSnakeHead;
    switch (direction) {
      case 'right': {
        newSnakeHead = Object.assign({}, this.snakeHead, { x: this.snakeHead.x + this.gridSize });
        break;
      }
      case 'left': {
        newSnakeHead = Object.assign({}, this.snakeHead, { x: this.snakeHead.x - this.gridSize });
        break;
      }
      case 'up': {
        newSnakeHead = Object.assign({}, this.snakeHead, { y: this.snakeHead.y - this.gridSize });
        break;
      }
      case 'down': {
        newSnakeHead = Object.assign({}, this.snakeHead, { y: this.snakeHead.y + this.gridSize });
        break;
      }
      default: {
        break;
      }
    }
    this.snakeCells.push(newSnakeHead);
    this.snakeCells.shift();
    this.snakeHead = newSnakeHead;
    this.direction = direction;
  }

}

window.addEventListener('load', () => {
  const newGame = new Game();
  newGame.start();
});