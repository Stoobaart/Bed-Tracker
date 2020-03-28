import Route from '@ember/routing/route';
import { queryManager } from "ember-apollo-client";
import GetHospital from 'bed-tracker/gql/queries/get-hospital';
import { inject as service } from '@ember/service';

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
}
