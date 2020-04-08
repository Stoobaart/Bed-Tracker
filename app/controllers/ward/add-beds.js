import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RegisterBedsMutation from 'bed-checker/gql/mutations/register-beds';

export default class WardAddBedsController extends Controller {
  @service router;
  @service apollo;
  @service hospital;

  @tracked noOfBedsToAdd = null;
  @tracked error = false;
  @tracked isSaving = false;

  get addButtonDisabled() {
    return !this.noOfBedsToAdd || this.noOfBedsToAdd <= 0 || this.isSaving;
  }

  @action
  makeNumberPositive() {
    if (this.noOfBedsToAdd) {
      this.noOfBedsToAdd = Math.abs(JSON.parse(this.noOfBedsToAdd));
    }
  }

  @action
  cancel() {
    this.noOfBedsToAdd = null;
    this.router.transitionTo('ward', this.model.id);
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
      this.hospital.addBeds(this.model, registerBeds.beds);
      this.set('model.showSuccessMessage', true);
      this.router.transitionTo('ward', this.model.id);
    } catch (error) {
      this.error = true;
      console.error(error);
    }

    this.isSaving = false;
  }
}
