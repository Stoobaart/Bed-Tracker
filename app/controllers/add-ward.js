import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import CreateWard from 'bed-checker/gql/mutations/create-ward';

export default class AddWardController extends Controller {
  @service router;
  @service apollo;

  shortName = '';
  longName = '';

  @action
  async createWard(event) {
    event.preventDefault();

    const variables = {
      input: {
        shortName: this.shortName,
        longName: this.longName
      }
    };

    try {
      const response = await this.apollo.mutate({ mutation: CreateWard, variables });
      this.router.transitionTo('/dashboard')
    } catch (error) {
      console.error(error);
    }
  }
}