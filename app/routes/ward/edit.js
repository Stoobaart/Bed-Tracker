import Route from '@ember/routing/route';

export default class EditWardRoute extends Route {
  model() {
    return this.modelFor('ward');
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.name = model.name;
    controller.description = model.description;
    controller.isSurgeWard = model.isSurgeWard;
    controller.wardType = model.wardType;
  }
}
