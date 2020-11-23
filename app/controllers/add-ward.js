import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import CreateWard from 'bed-checker/gql/mutations/create-ward';

export default class AddWardController extends Controller {
  @service router;
  @service apollo;
  @service hospital;

  @tracked name = '';
  @tracked description = '';
  @tracked isCovidWard = false;
  @tracked isSurgeWard = false;

  @tracked error = false;

  @tracked wardType = null;
  wardTypes = ['COVID', 'AMBER', 'GREEN'];

  @action
  cancel() {
    this.name = '';
    this.description = '';
    this.router.transitionTo('dashboard');
  }

  @action
  setWardType(type) {
    this.wardType = type;
  }

  @action
  setIsSurgeWard(bool) {
    this.isSurgeWard = bool;
  }

  @action
  async createWard(event) {
    event.preventDefault();

    this.error = false;

    const variables = {
      input: {
        name: this.name,
        description: this.description,
        isSurgeWard: this.isSurgeWard,
        wardType: this.wardType
      }
    };

    try {
      const { createWard } = await this.apollo.mutate({ mutation: CreateWard, variables });
      this.hospital.addWard(createWard.ward);
      this.set('model.showSuccessMessage', true);
      this.name = '';
      this.description = '';
      this.wardType = null;
      this.router.transitionTo('dashboard');
    } catch (error) {
      this.error = true;
      console.error(error);
    }
  }
}
