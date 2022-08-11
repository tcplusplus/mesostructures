export class Camera {
  video: HTMLVideoElement;

  canvas: HTMLCanvasElement;

  constructor(width = 640, height = 480) {
    this.video = new HTMLVideoElement();
    this.canvas = new HTMLCanvasElement();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    this.video.srcObject = stream;
  }

  async grabImage() {
    this.canvas.getContext('2d')?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const url = this.canvas.toDataURL('image/jpeg');
    const data = await fetch(url);
    return data.blob();
  }
}
