import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CanvasController } from './canvas.controller';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit {
  colorIndex: number = 0;
  colors: string[] = ['#000000', '#378805', '#e81919'];
  matrixSize = 24;
  pixelSize = 25;
  mode: 'base' | 'draw' = 'draw';

  @ViewChild('mycanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D | null = null;

  canvasController: CanvasController | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      if (this.ctx) {
        this.canvasController = new CanvasController({
          colors: this.colors,
          matrixSize: this.matrixSize,
          pixelSize: this.pixelSize,
          ctx: this.ctx,
        });
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: any) {
    const x = event.pageX - this.canvas.nativeElement.offsetLeft;
    const y = event.pageY - this.canvas.nativeElement.offsetTop;
    if (this.canvasController) {
      switch (this.mode) {
        case 'base':
          this.canvasController.setBase(x, y);
          this.mode = 'draw';
          break;
        case 'draw':
          this.canvasController.draw({
            x,
            y,
            colorIndex: this.colorIndex,
          });
          break;
      }
    }
  }

  selectColor(index: number) {
    this.colorIndex = index;
  }

  selectBase() {
    this.mode = 'base';
  }

  getBase(): { x: number; y: number } {
    if (this.canvasController) {
      return this.canvasController.base;
    } else {
      return { x: 0, y: 0 };
    }
  }

  openFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const image = new Image();
        image.src = data;
        image.onload = (event: any) => {
          const image = event.target;
          if (this.canvasController) {
            this.canvasController.loadFile(image);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  copyInstructions() {
    if (this.canvasController) {
      this.canvasController.copyInstructions();
    }
  }

  private draw(ctx: any, x: number, y: number) {
    const color = this.colors[this.colorIndex];
    ctx.fillStyle = color;
    var radius = 10; // or whatever
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
