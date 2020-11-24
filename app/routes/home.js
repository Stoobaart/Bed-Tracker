import Route from '@ember/routing/route';
import { queryManager } from "ember-apollo-client";
import GetHospital from 'bed-checker/gql/queries/get-hospital';
import { inject as service } from '@ember/service';
// import { action } from '@ember/object';

export default class HomeRoute extends Route {
  @queryManager() apollo;
  @service errors;

  async model() {
    const response = await this.apollo.watchQuery({ query: GetHospital });
    this.errors.hasError = false;
    return response.getHospital;
  }

  // @action
  // error() {
  //   localStorage.setItem('token', JSON.stringify(null));
  //   this.transitionTo('/qr');
  // }
}
