import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RegisterBedsMutation from 'bed-checker/gql/mutations/register-beds';
import { later } from '@ember/runloop';

export default class WardAddBedsController extends Controller {
  @service router;
  @service apollo;
  @service hospital;

  @tracked noOfBedsToAdd = null;
  @tracked prefix = null;
  @tracked startFrom = this.model.beds.length + 1;
  @tracked error = false;
  @tracked isSaving = false;

  get addButtonDisabled() {
    return !this.noOfBedsToAdd || this.noOfBedsToAdd <= 0 || this.isSaving;
  }

  get hideResults() {
    return !this.noOfBedsToAdd || !this.startFrom;
  }

  get resultsRange() {
    return `${this.prefix || ''}${parseInt(this.startFrom)} to ${this.prefix || ''}${parseInt(this.startFrom) + parseInt(this.noOfBedsToAdd) - 1}`;
  }

  @action
  makeNumberPositive() {
    if (this.noOfBedsToAdd) {
      this.noOfBedsToAdd = Math.abs(JSON.parse(this.noOfBedsToAdd));
    }
  }

  @action
  makeStartFromPositive() {
    if (this.startFrom) {
      this.startFrom = Math.abs(JSON.parse(this.startFrom));
    }

    if (this.startFrom === 0) {
      this.startFrom = 1;
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
        wardId: this.model.id,
        startFrom: JSON.parse(this.startFrom)
      }
    };

    if (this.prefix) {
      variables.input.prefix = this.prefix;
    }

    try {
      const { registerBeds } = await this.apollo.mutate({ mutation: RegisterBedsMutation, variables });
      this.noOfBedsToAdd = null;
      this.prefix = null;
      this.hospital.addBeds(this.model, registerBeds.beds);
      this.startFrom = this.model.beds.length;
      this.set('model.showSuccessMessage', { type: 'beds-added' });
      later(() => {
        this.set('model.showSuccessMessage', false);
      }, 4000);
      this.router.transitionTo('ward', this.model.id);
    } catch (error) {
      this.error = true;
      console.error(error);
    }

    this.isSaving = false;
  }
}
