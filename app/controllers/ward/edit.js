import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UpdateWardMutation from 'bed-checker/gql/mutations/update-ward';

export default class EditWardController extends Controller {
  @service router;
  @service apollo;
  @service hospital;

  @tracked shortName;
  @tracked longName;

  @tracked error = false;

  @action
  async saveWard() {
    this.error = false;

    const variables = {
      input: {
        id: this.model.id,
        shortName: this.shortName,
        longName: this.longName
      }
    };

    try {
      await this.apollo.mutate({ mutation: UpdateWardMutation, variables });
      this.model.shortName = this.shortName;
      this.model.longName = this.longName;
      this.router.transitionTo('ward', this.model);
    } catch (error) {
      this.error = true;
      console.error(error);
    }
  }
}
