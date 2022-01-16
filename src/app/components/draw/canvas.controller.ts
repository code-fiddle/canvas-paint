export interface CanvasConfig {
  matrixSize: number;
  pixelSize: number;
  ctx: CanvasRenderingContext2D;
  colors: string[];
  file?: string;
}

export interface DrawRequest {
  x: number;
  y: number;
  colorIndex: number;
}

export class CanvasController {
  private ctx: CanvasRenderingContext2D;
  private matrix: number[][] = [];
  public base: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private config: CanvasConfig) {
    this.ctx = this.config.ctx;
    this.initMatrix();
  }

  public reset() {
    this.ctx.clearRect(
      0,
      0,
      this.config.matrixSize * this.config.pixelSize,
      this.config.matrixSize * this.config.pixelSize
    );
    this.initMatrix();
  }

  public setBase(x: number, y: number) {
    this.base = { x: this.getIndex(x), y: this.getIndex(y) };
  }

  public draw(request: DrawRequest) {
    this.ctx.fillStyle = this.config.colors[request.colorIndex];
    this.ctx.strokeStyle = this.config.colors[request.colorIndex];
    const indexX = this.getIndex(request.x);
    const indexY = this.getIndex(request.y);

    const value = this.updateMatrix(indexX, indexY, request.colorIndex);

    if (value >= 0) {
      this.ctx.fillRect(
        indexX * this.config.pixelSize,
        indexY * this.config.pixelSize,
        this.config.pixelSize,
        this.config.pixelSize
      );
    } else {
      this.ctx.clearRect(
        indexX * this.config.pixelSize,
        indexY * this.config.pixelSize,
        this.config.pixelSize,
        this.config.pixelSize
      );
    }
  }

  public loadFile(img: any) {
    this.ctx.drawImage(
      img,
      0,
      0,
      this.config.matrixSize * this.config.pixelSize,
      this.config.matrixSize * this.config.pixelSize
    );
    this.ctx.fillStyle = '#adadad50';
    this.ctx.fillRect(
      0,
      0,
      this.config.matrixSize * this.config.pixelSize,
      this.config.matrixSize * this.config.pixelSize
    );
  }

  public copyInstructions() {
    let instructions = `base: {
        x: ${this.base.x},
        y: ${this.base.y},
      },
      requests: [\n`;
    for (let indexX = 0; indexX < this.matrix.length; indexX++) {
      for (let indexY = 0; indexY < this.matrix[indexX].length; indexY++) {
        if (this.matrix[indexX][indexY] >= 0) {
          instructions += `{
                    colorIndex: ${this.matrix[indexX][indexY]},
                    type: 'pixel',
                    x: ${indexX - this.base.x},
                    y: ${indexY - this.base.y},
                  },\n`;
        }
      }
    }
    instructions += `]`;
    navigator.clipboard
      .writeText(instructions)
      .then()
      .catch((e) => console.error(e));
  }

  private getIndex(coordinate: number) {
    return Math.floor(coordinate / this.config.pixelSize);
  }

  private updateMatrix(x: number, y: number, colorIndex: number) {
    const value = this.matrix[x][y] >= 0 ? -1 : colorIndex;
    this.matrix[x][y] = value;
    return value;
  }

  private initMatrix() {
    for (let i = 0; i < this.config.matrixSize; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < this.config.matrixSize; j++) {
        this.matrix[i][j] = -1;
      }
    }
  }
}
