import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HospitalIdController extends Controller {
  @service router;
  @service errors;

  hospitalId = 'ed20d06e-60af-4a67-a7db-3a00285e5786';

  @action
  submit(event) {
    event.preventDefault();
    localStorage.setItem('bed_tracker_token', JSON.stringify(this.hospitalId));
    localStorage.setItem('hospital_manager', false);
    if (this.hospitalId) {
      this.router.transitionTo('/home');
    }
  }
}
