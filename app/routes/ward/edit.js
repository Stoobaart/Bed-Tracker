import Route from '@ember/routing/route';

export default class EditWardRoute extends Route {
  model() {
    return this.modelFor('ward');
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.shortName = model.shortName;
    controller.longName = model.longName;
  }
}
