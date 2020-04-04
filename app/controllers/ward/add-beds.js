import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RegisterBedsMutation from 'bed-checker/gql/mutations/register-beds';

export default class WardAddBedsController extends Controller {
  @service router;
  @service apollo;

  @tracked noOfBedsToAdd = null;
  @tracked error = false;

  @action
  async addBeds() {
    this.error = false;

    const variables = {
      input: {
        numberOfBeds: JSON.parse(this.noOfBedsToAdd),
        wardId: this.model.id
      }
    };

    try {
      await this.apollo.mutate({ mutation: RegisterBedsMutation, variables });
      this.noOfBedsToAdd = null;
      this.router.transitionTo('ward', this.model.id);
    } catch (error) {
      this.error = true;
      console.error(error);
    }
  }
}
