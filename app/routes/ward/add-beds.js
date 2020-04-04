import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class WardAddBedsRoute extends Route {
  model() {
    return this.modelFor('ward');
  }

  @action
  willTransition(transition) {
    if (transition.to.name !== 'ward.add-beds') {
      this.controller.error = false;
    }
  }
}
