import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class ScanRoute extends Route {
  @action
  async didTransition() {
    this.controller.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  }

  @action
  willTransition() {
    this.controller.stream.getTracks().forEach((track) => track.stop());
  }
}
