import Route from '@ember/routing/route';

export default class WardAddBedsRoute extends Route {
  model() {
    return this.modelFor('ward');
  }
}
