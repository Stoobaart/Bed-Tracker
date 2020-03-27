import Route from '@ember/routing/route';
import { queryManager } from "ember-apollo-client";
import GetHospital from 'bed-tracker/gql/queries/get-hospital';

export default class HomeRoute extends Route {
  @queryManager() apollo;

  async model() {
    const hospitalId = JSON.parse(localStorage.getItem('bed_tracker_token'));
    let variables = {
      input: { hospitalId }
    };

    try {
      const response = await this.apollo.watchQuery({ query: GetHospital, variables });
      return response.getHospital;
    } catch (error) {
      console.error(error);
      localStorage.setItem('bed_tracker_token', JSON.stringify(null));
      this.transitionTo('/login');
    }
  }
}
