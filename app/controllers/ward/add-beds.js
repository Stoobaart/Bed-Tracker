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
  @tracked isSaving = false;

  get addButtonDisabled() {
    return !this.noOfBedsToAdd || this.noOfBedsToAdd <= 0 || this.isSaving;
  }

  @action
  async addBeds() {
    this.error = false;
    this.isSaving = true;

    const variables = {
      input: {
        numberOfBeds: JSON.parse(this.noOfBedsToAdd),
        wardId: this.model.id
      }
    };

    try {
      const { registerBeds } = await this.apollo.mutate({ mutation: RegisterBedsMutation, variables });
      this.noOfBedsToAdd = null;
      this.model.beds.push(...registerBeds.beds);
      this.set('model.showSuccessMessage', true);
      this.router.transitionTo('ward', this.model.id);
    } catch (error) {
      this.error = true;
      console.error(error);
    }

    this.isSaving = false;
  }
}
