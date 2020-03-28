import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const DASHBOARD_ROUTES = [
  'home',
  'hospital-id'
];
export default class extends Route {
  @service router;

  @action
  didTransition() {
    super.init(...arguments);

    const isQrRoute = DASHBOARD_ROUTES.some((route) => this.router._router.url.includes(route));
    const hasToken = JSON.parse(localStorage.getItem('bed_tracker_token'));
    const isManager = JSON.parse(localStorage.getItem('hospital_manager'));

    if (!hasToken) {
      if (isQrRoute) {
        this.transitionTo('/hospital-id');
      } else {
        this.transitionTo('/');
      }
    }

    if (hasToken && !isManager) {
      if (this.router._router.url.includes('dashboard')) {
        this.transitionTo('/');
      }
    }
  }
}