import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service router;

  hospitalId = null;

  @action
  submit() {
    localStorage.setItem('bed_tracker_token', this.hospitalId);

    if (this.hospitalId) {
      this.router.transitionTo('/home');
    }
  }
}