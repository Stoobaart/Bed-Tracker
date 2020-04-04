import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { queryManager } from 'ember-apollo-client';
import GetHospital from 'bed-checker/gql/queries/get-hospital';

export default class WardRoute extends Route {
  @queryManager() apollo;

  async model({ id }) {
    const { getHospital } = await this.apollo.watchQuery({ query: GetHospital });
    return getHospital.hospital.wards.find((ward) => ward.id === id);
  }

  @action
  error(error) {
    console.error(error);
    this.transitionTo('dashboard');
  }
}
