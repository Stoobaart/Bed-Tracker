import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const DASHBOARD_ROUTES = [
  '/',
  'dashboard'
];
export default class extends Route {
  @service router;

  @action
  didTransition() {
    super.init(...arguments);

    const isDashboardRoute = DASHBOARD_ROUTES.some((route) => this.router._router.url.includes(route));

    if (!JSON.parse(localStorage.getItem('hospital_manager')) &&
        !JSON.parse(localStorage.getItem('bed_tracker_token')) &&
        !isDashboardRoute) {
      this.transitionTo('/hospital-id');
    } else if (!isDashboardRoute) {
      this.transitionTo('/home');
    } else if (!JSON.parse(localStorage.getItem('hospital_manager')) && isDashboardRoute) {
      this.transitionTo('/');
    }
  }
}
