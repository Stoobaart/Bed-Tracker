import Route from '@ember/routing/route';
import { queryManager } from "ember-apollo-client";
import GetHospital from 'bed-checker/gql/queries/get-hospital';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DashboardRoute extends Route {
  @queryManager() apollo;
  @service errors;

  async model() {
    try {
      const response = await this.apollo.watchQuery({ query: GetHospital });
      return response.getHospital;
    } catch (error) {
      this.errors.hasError = true;
    }
  }

  @action
  error() {
    localStorage.setItem('bed_tracker_token', JSON.stringify(null));
    localStorage.setItem('hospital', JSON.stringify(null));
    localStorage.setItem('hospital_manager', JSON.stringify(null));
    this.transitionTo('/');
  }
}
