import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import jsQR from 'jsqr';

export default class ScanController extends Controller {
  @tracked cameraFeed = document.querySelector('#camera-feed');
  @tracked video = document.createElement('video');
  @tracked canvas = this.cameraFeed.getContext('2d');

  async init() {
    super.init(...arguments);

    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

    this.video.srcObject = stream;
    this.video.setAttribute('playsinline', true);
    await this.video.play();

    requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.cameraFeed.height = this.video.videoHeight;
      this.cameraFeed.width = this.video.videoWidth;
      this.canvas.drawImage(this.video, 0, 0, this.cameraFeed.width, this.cameraFeed.height);

      const imageData = this.canvas.getImageData(0, 0, this.cameraFeed.width, this.cameraFeed.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        // this.router.transitionTo('bed', code.data);
        this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, 'red');
        this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, 'red');
        this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, 'red');
        this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, 'red');
      }
    }

    requestAnimationFrame(this.tick.bind(this));
  }

  drawLine(begin, end, color) {
    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  }
}

