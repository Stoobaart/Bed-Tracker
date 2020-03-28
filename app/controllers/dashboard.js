import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DashboardController extends Controller {

  @tracked totalBeds = this.model.hospital.totalBeds;
  @tracked availableBeds = this.model.hospital.availableBeds;
  @tracked unavailableBeds = this.model.hospital.unavailableBeds;

  @action
  updateUnavailableNumber(symbol) {
    if (symbol === '+') {
      this.unavailableBeds++
      this.totalBeds++
    } else {
      this.unavailableBeds--
      this.totalBeds--
    }
  }

  @action
  updateAvailableNumber(symbol) {
    if (symbol === '+') {
      this.availableBeds++
      this.totalBeds++
    } else {
      this.availableBeds--
      this.totalBeds--
    }
  }
}
