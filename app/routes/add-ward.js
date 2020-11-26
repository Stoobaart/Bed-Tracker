import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AddWardRoute extends Route {
  beforeModel() {
    const hasToken = JSON.parse(localStorage.getItem('token'));
    if (!hasToken) {
      this.transitionTo('/');
    }
  }
  
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
