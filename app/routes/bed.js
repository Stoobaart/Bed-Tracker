import Route from '@ember/routing/route';
import { queryManager } from 'ember-apollo-client';
import GetBedQuery from 'bed-tracker/gql/queries/get-bed';
import { action } from '@ember/object';

export default class BedRoute extends Route {
  @queryManager() apollo;

  async model({ id }) {
    const { getBed } = await this.apollo.watchQuery({ query: GetBedQuery, variables: { input: { id } } });
    return getBed.bed;
  }

  @action
  error() {
    this.transitionTo('home');
  }
}
