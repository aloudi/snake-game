export default class Food {

  constructor ({ctx, canvas, gridSize, style, snake}) {
    this.ctx = ctx;
    this.canvasSize = canvas.width;
    this.gridSize = gridSize;
    this.style = style;
    this.snake = snake;
    this.location = {};
  }

  getRandomLocation () {
    const randomInteger = Math.floor(Math.random() * this.canvasSize);
    const location = randomInteger - (randomInteger % this.gridSize);
    return location;
  }

  generateFood () {
    this.location.x = this.getRandomLocation();
    this.location.y = this.getRandomLocation();
  }

  drawFood () {
    if (!this.location.x && !this.location.y) {
      this.generateFood();
    }
    this.ctx.fillStyle = this.style.foodColor;
    this.ctx.fillRect(this.location.x, this.location.y, this.gridSize, this.gridSize);
  }

  eatFood () {
    this.location = {};
  }

  getFoodLocation () {
    return this.location;
  }

}
