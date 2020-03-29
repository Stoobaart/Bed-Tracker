import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DashboardController extends Controller {

  @tracked totalBeds = this.model.hospital.totalBeds;
  @tracked availableBeds = this.model.hospital.availableBeds;

  get valuesHaveChanged() {
    if (this.totalBeds != this.model.hospital.totalBeds || this.availableBeds != this.model.hospital.availableBeds) {
      return true;
    } else {
      return false;
    }
  }

  @action
  updateBedNumber() {
    if (this.availableBeds > this.totalBeds) {
      alert('The available beds cannot be more than the total beds, you idiot');
    } else {
      alert(`You're submitting ${this.availableBeds} available beds and ${this.totalBeds} Total beds`);
    }
  }
}
