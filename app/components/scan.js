import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import jsQR from 'jsqr';

export default class ScanComponent extends Component {
  @service router;

  @tracked video = document.getElementById('camera-feed');
  @tracked cameraFeed = document.createElement('canvas');
  @tracked canvas = this.cameraFeed.getContext('2d');
  @tracked debouncedCodeCheck = null;

  async didUpdate() {
    super.didUpdate();
    this.video.srcObject = await this.stream;
    this.video.setAttribute('playsinline', true);
    this.video.setAttribute('muted', true);
    await this.video.play();

    this.tick();
  }

  tick() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      const width = this.video.videoWidth;
      const height = this.video.videoHeight;
      this.cameraFeed.width = width;
      this.cameraFeed.height = height;
      this.canvas.drawImage(this.video, 0, 0, width, height);

      const imageData = this.canvas.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.router.transitionTo('bed', code.data);
      }
    }

    setTimeout(this.tick.bind(this), 500);
  }
}

