import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WardRoute extends Route {
  @service hospital;

  async model({ id }) {
    await this.hospital.fetchHospital();
    return this.hospital.hospital.wards.find((ward) => ward.id === id);
  }

  @action
  willTransition(transition) {
    if (transition.to.name !== 'ward.index') {
      this.controller.set('model.showSuccessMessage', false);
    }
  }

  @action
  error(error) {
    console.error(error);
    this.transitionTo('dashboard');
  }
}
