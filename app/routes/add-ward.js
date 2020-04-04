import Route from '@ember/routing/route';

export default class AddWardRoute extends Route {
  model() {
    return this.modelFor('dashboard');
  }
}
