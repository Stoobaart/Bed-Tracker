import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class WardController extends Controller {
  @tracked totalBeds = this.model.totalBeds || 0;
  @tracked availableBeds = this.model.availableBeds || 0;
  @tracked totalVentilatorInUse = this.model.totalVentilatorInUse || 0;
  @tracked totalCovidStatusPositive = this.model.totalCovidStatusPositive || 0;
  @tracked totalCovidStatusNegative = this.model.totalCovidStatusNegative || 0;
  @tracked totalCovidStatusSuspected = this.model.totalCovidStatusSuspected || 0;

  get availableBedsPercentage() {
    if (this.totalBeds === 0) {
      return 0;
    }

    return Math.round((this.availableBeds / this.totalBeds) * 100);
  }
}
