import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AddWardRoute extends Route {
  model() {
    return this.modelFor('dashboard');
  }

  @action
  willTransition(transition) {
    if (transition.to.name !== 'add-ward') {
      this.controller.error = false;
    }
  }
}
