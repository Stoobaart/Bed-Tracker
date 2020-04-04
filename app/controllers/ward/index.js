import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class WardController extends Controller {
  @tracked totalBeds = this.model.totalBeds || 0;
  @tracked availableBeds = this.model.availableBeds || 0;

  get availableBedsPercentage() {
    if (this.totalBeds === 0) {
      return 0;
    }

    return Math.round((this.availableBeds / this.totalBeds) * 100);
  }
}
