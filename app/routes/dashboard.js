import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DashboardRoute extends Route {
  @service errors;
  @service hospital;

  async model() {
    try {
      await this.hospital.fetchHospital();
      return this.hospital.hospital;
    } catch (error) {
      this.errors.hasError = true;
    }
  }

  @action
  willTransition(transition) {
    if (transition.to.name !== 'dashboard') {
      this.controller.set('model.showSuccessMessage', false);
    }
  }

  @action
  error() {
    localStorage.setItem('bed_tracker_token', JSON.stringify(null));
    localStorage.setItem('hospital', JSON.stringify(null));
    localStorage.setItem('hospital_manager', JSON.stringify(null));
    this.transitionTo('/');
  }
}


