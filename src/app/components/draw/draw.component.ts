import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements OnInit {
  colorIndex: number = 1;
  colors: string[] = ['#000000', '#378805', '#e81919'];
  matrixSize = 24;
  pixelSize = 25;

  @ViewChild('canvas')
  canvas!: any;

  ctx: any;

  // @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;

  constructor() {}

  @HostListener('mousedown', ['$event'])
  onMousedown(event: any) {
    const x = event.pageX - this.canvas.offsetLeft;
    const y = event.pageY - this.canvas.offsetTop;
    this.draw(this.ctx, x, y);
    console.log(event);
  }

  ngOnInit(): void {
    // this.myCanvas.nativeElement.width = this.matrixSize * this.pixelSize;
    // this.myCanvas.nativeElement.height = this.matrixSize * this.pixelSize;
    // const ctx = this.myCanvas.nativeElement.getContext('2d');

    // var canvas: any = {};
    // canvas.node = document.createElement('canvas');
    // canvas.context = canvas.node.getContext('2d');
    // canvas.node.width = this.matrixSize * this.pixelSize;
    // canvas.node.height = this.matrixSize * this.pixelSize;

    // const ctx = canvas.context;

    if (this.canvas) {
      console.log(`HEEEEEEEEELO`);
      this.ctx = this.canvas.getContext('2d');
      console.log(this.ctx);
    }

    // const canvas: any = document.getElementById('draw');
    // if (canvas) {
    //   const ctx = canvas.getContext('2d');
    //   console.log(ctx);
    //   const color = this.colors[this.colorIndex];
    //   const drawFunction = this.draw;
    //   canvas.onmousedown = (e: any) =>
    //     (canvas.onmousedown = function (e: any) {
    //       var x = e.pageX - this.offsetLeft;
    //       var y = e.pageY - this.offsetTop;
    //       drawFunction(ctx, x, y);
    //       // var radius = 10; // or whatever
    //       // console.log(this.colorIndex);
    //       // //var fillColor = this.colors[this.colorIndex];
    //       // // ctx.fillStyle = '#000000';
    //       // ctx.fillStyle = color;
    //       // ctx.beginPath();
    //       // ctx.arc(x, y, radius, 0, 2 * Math.PI);
    //       // ctx.fill();
    //     });
    // }

    // const parent = document.getElementById('canvas');
    // if (parent) {
    //   parent.appendChild(canvas.node);
    // }
  }

  selectColor(index: number) {
    this.colorIndex = index;
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
