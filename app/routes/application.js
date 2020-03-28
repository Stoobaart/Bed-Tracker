import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class extends Route {

  @action
  didTransition() {
    super.init(...arguments);
    if (!JSON.parse(localStorage.getItem('bed_tracker_token'))) {
      this.transitionTo('/login');
    }
  }
}
