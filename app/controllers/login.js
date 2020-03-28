import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service router;
  @service errors;

  hospitalId = null;

  @action
  submit(event) {
    event.preventDefault();
    localStorage.setItem('bed_tracker_token', JSON.stringify(this.hospitalId));

    if (this.hospitalId) {
      this.router.transitionTo('/home');
    }
  }
}
