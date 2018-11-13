import _ from 'underscore';

export default class Snake {

  constructor ({ctx, canvas, gridSize, style, updateScore, food}) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.gridSize = gridSize;
    this.style = style;
    this.updateScore = updateScore;
    this.food = food;
    this.snakeBodyCells = [{ x: 150, y: 150 }, { x: 180, y: 150 }];
    this.snakeHead = { x: 210, y: 150 };
    this.direction = 'right';
    this.nextMove = undefined;
  }

  drawSnake () {
    [...this.snakeBodyCells, this.snakeHead].forEach(cell => {
      this.ctx.fillStyle = this.style.snakeColor;
      this.ctx.fillRect(cell.x, cell.y, this.gridSize, this.gridSize);
    });
  }

  newSnakeHead (direction) {
    switch (direction) {
      case 'right': {
        return Object.assign({}, this.snakeHead, { x: this.snakeHead.x + this.gridSize });
      }
      case 'left': {
        return Object.assign({}, this.snakeHead, { x: this.snakeHead.x - this.gridSize });
      }
      case 'up': {
        return Object.assign({}, this.snakeHead, { y: this.snakeHead.y - this.gridSize });
      }
      case 'down': {
        return Object.assign({}, this.snakeHead, { y: this.snakeHead.y + this.gridSize });
      }
      default: {
        break;
      }
    }
  }

  setNextMove (nextMove) {
    this.nextMove = nextMove;
  }

  updateSnake () {
    if (this.nextMove) {
      if (_.isEqual(this.getNextHeadLocation(this.nextMove), this.food.getFoodLocation())) {
        this.eat(this.nextMove);
        this.food.eatFood();
        this.updateScore();
      } else {
        this.move(this.nextMove);
        this.nextMove = undefined;
      }
    } else {
      if (_.isEqual(this.getNextHeadLocation(), this.food.getFoodLocation())) {
        this.eat();
        this.food.eatFood();
        this.updateScore();
      } else {
        this.move();
      }
    }
  }

  getNextHeadLocation (direction = this.getDirection()) {
    return this.newSnakeHead(direction);
  }

  getDirection () {
    return this.direction;
  }

  setDirection (direction) {
    this.direction = direction;
  }

  move (direction = this.getDirection()) {
    this.snakeBodyCells.push(this.snakeHead);
    this.snakeBodyCells.shift();
    this.snakeHead = this.newSnakeHead(direction);
    this.direction = direction;
  }

  eat (direction = this.getDirection()) {
    this.snakeBodyCells.push(this.snakeHead);
    this.snakeHead = this.newSnakeHead(direction);
    this.direction = direction;
  }

  getSnakeCells () {
    return [...this.snakeBodyCells, this.snakeHead];
  }

  collideWithBorder () {
    const xMax = this.canvas.width - this.gridSize;
    const yMax = this.canvas.height - this.gridSize;
    if (this.snakeHead.x > xMax || this.snakeHead.x < 0 ||
      this.snakeHead.y > yMax || this.snakeHead.y < 0) {
      return true;
    } else {
      return false;
    }
  }

  collideWithSelf () {
    const collision = this.snakeBodyCells.filter(cell => _.isEqual(cell, this.snakeHead));
    if (collision.length > 0) {
      return true;
    } else {
      return false;
    }
  }

}
