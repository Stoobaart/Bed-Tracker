import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import UpdateBedAvailabilityMutation from 'bed-checker/gql/mutations/update-bed-availability';
import ActivateBedMutation from 'bed-checker/gql/mutations/activate-bed';

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
  async toggleAvailability() {
    try {
      this.errors.hasError = false;
      this.variables.input.available = !this.variables.input.available;
      await this.apollo.mutate({ mutation: UpdateBedAvailabilityMutation, variables: this.variables });
      this.set('model.available', this.variables.input.available);
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
      this.errors.hasError = true;
    }
  }
}
