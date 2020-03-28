import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import jsQR from 'jsqr';

export default class ScanController extends Controller {
  @tracked cameraFeed = document.findElementById('camera-feed');

  processQrCode(code) {
    console.log('code' ,code);
  }

  async init() {
    super.init(...arguments);

    if (navigator.mediaDevices.getUserMedia) {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.querySelector('#camera-feed');
      video.srcObject = camera;
      const code = jsQR(camera, 400, 400);

      if (code) {
        console.log(code);
      }
    }
  }
}

