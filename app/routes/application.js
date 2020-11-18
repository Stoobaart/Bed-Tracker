import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service router;

  @action
  didTransition() {
    super.init(...arguments);

    window.scrollTo(0,0);
    const hasToken = JSON.parse(localStorage.getItem('bed_tracker_token'));

    const isDetectifyRoute = this.router._router.url === '/4a2b2d7c58df5c43d63986fb23385307.txt';
    if (!hasToken && !isDetectifyRoute) {
      this.transitionTo('/');
    }
  }
}
