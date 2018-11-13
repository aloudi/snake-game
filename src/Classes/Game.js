import Snake from './Snake.js';
import Food from './Food.js';

export default class Game {

  constructor () {
    this.canvas = document.getElementById('game-canvas');
    this.highScoreOutput = document.getElementById('high-score');
    this.scoreOutput = document.getElementById('score');
    this.timerOutput = document.getElementById('timer');
    this.levelOutput = document.getElementById('level');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.gridSize = 30;
    this.highScore = window.localStorage.getItem('snake-high-score') || 0;
    this.score = 0;
    this.timeRemaining = 30;
    this.level = 1;

    this.animation = {
      tickCount: 0,
      ticksPerFrame: 6,
    };

    this.style = {
      canvasBackgroundColor: 'darkgrey',
      gridColor: 'black',
      snakeColor: 'green',
      foodColor: 'black'
    };

    this.food = new Food({
      ctx: this.ctx,
      canvas: this.canvas,
      gridSize: this.gridSize,
      style: this.style,
      snake: this.snake
    });

    this.snake = new Snake({
      ctx: this.ctx,
      canvas: this.canvas,
      gridSize: this.gridSize,
      style: this.style,
      updateScore: this.updateScore.bind(this),
      food: this.food
    });
  }

  setControls () {
    window.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowRight':
          if (this.snake.getDirection() !== 'left' && this.snake.getDirection() !== 'right') {
            this.snake.setDirection('right');
          }
          break;
        case 'ArrowLeft':
          if (this.snake.getDirection() !== 'left' && this.snake.getDirection() !== 'right') {
            this.snake.setDirection('left');
          }
          break;
        case 'ArrowUp':
          if (this.snake.getDirection() !== 'up' && this.snake.getDirection() !== 'down') {
            this.snake.setDirection('up');
          }
          break;
        case 'ArrowDown':
          if (this.snake.getDirection() !== 'up' && this.snake.getDirection() !== 'down') {
            this.snake.setDirection('down');
          }
          break;
        default:
          break;
      }
    });
  }

  startNewGame () {
    this.setControls();
    this.startCountdown();
    this.run();
  }

  gameOver () {
    return this.snake.collideWithBorder() || this.snake.collideWithSelf();
  }

  drawGrid () {
    this.ctx.fillStyle = this.style.canvasBackgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    for (let positionX = 0; positionX <= this.canvas.width; positionX += this.gridSize) {
      this.ctx.moveTo(positionX, 0);
      this.ctx.lineTo(positionX, this.canvas.height);
    }
    for (let positionY = 0; positionY <= this.canvas.height; positionY += this.gridSize) {
      this.ctx.moveTo(0, positionY);
      this.ctx.lineTo(this.canvas.width, positionY);
    }
    this.ctx.strokeStyle = this.style.gridColor;
    this.ctx.stroke();
  }

  updateLevel () {
    this.level++;
    this.animation.ticksPerFrame--;
  }

  startCountdown () {
    setInterval(() => {
      if (this.timeRemaining !== 0) {
        this.timeRemaining--;
      } else {
        this.timeRemaining = 30;
        this.updateLevel();
      }
    }, 1000);
  }

  outputInfo () {
    this.highScoreOutput.innerHTML = `
      ${this.highScore}
    `;
    this.scoreOutput.innerHTML = `
      ${this.score}
    `;
    this.timerOutput.innerHTML = `
      ${this.timeRemaining}
    `;
    this.levelOutput.innerHTML = `
      ${this.level}
    `;

  }

  updateScore () {
    if (this.highScore < this.score) {
      window.localStorage.setItem('snake-high-score', this.score);
      this.highScore = this.score;
    }
    this.score += this.level * 5;
  }

  render () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.snake.drawSnake();
    this.food.drawFood();
    this.outputInfo();
  }

  update () {
    if (this.animation.tickCount > this.animation.ticksPerFrame) {
      if (!this.gameOver()) {
        this.animation.tickCount = 0;
        this.snake.updateSnake();
        this.render();
      }
    } else {
      this.animation.tickCount++;
    }
  }

  run () {
    this.update();
    window.requestAnimationFrame(() => {
      this.run();
    });

  }
}
