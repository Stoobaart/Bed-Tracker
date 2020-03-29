import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UpdateBedAvailabilityMutation from 'bed-tracker/gql/mutations/update-bed-availability';
import ActivateBedMutation from 'bed-tracker/gql/mutations/activate-bed';

export default class BedController extends Controller {
  @service apollo;
  @service errors;

  @tracked bedReference = null;
  @tracked variables = {
    input: {
      id: this.model.id,
      available: this.model.available,
    }
  };

  @action
  async makeAvailable() {
    try {
      this.errors.hasError = false;
      this.variables.input.available = true;
      await this.apollo.mutate({ mutation: UpdateBedAvailabilityMutation, variables: this.variables });
      this.set('model.available', true);
    } catch (error) {
      console.log(error);
      this.errors.hasError = true;
    }
  }

  @action
  async makeUnavailable() {
    try {
      this.errors.hasError = false;
      this.variables.input.available = false;
      await this.apollo.mutate({ mutation: UpdateBedAvailabilityMutation, variables: this.variables });
      this.set('model.available', false);
    } catch (error) {
      console.log(error);
      this.errors.hasError = true;
    }
  }

  @action
  async activateBed() {
    try {
      this.errors.hasError = false;

      const variables = {
        input: {
          id: this.model.id,
          reference: this.bedReference,
        }
      };

      await this.apollo.mutate({ mutation: ActivateBedMutation, variables });
      this.set('model.reference', this.bedReference);
      this.set('model.active', true);
    } catch (error) {
      console.log(error);
      this.errors.hasError = true;
    }
  }
}
