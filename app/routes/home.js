import Route from '@ember/routing/route';
import { queryManager } from "ember-apollo-client";
import GetHospital from 'bed-tracker/gql/queries/get-hospital';
import { inject as service } from '@ember/service';

export default class HomeRoute extends Route {
  @queryManager() apollo;
  @service errors;

  async model() {
    // const hospitalId = JSON.parse(localStorage.getItem('bed_tracker_token'));	
    // let variables = {	
    //   input: { hospitalId }	
    // };
    try {
      const response = await this.apollo.watchQuery({ query: GetHospital });
      this.errors.hasError = false;
      return response.getHospital;
    } catch (error) {
      this.errors.hasError = true;
      localStorage.setItem('bed_tracker_token', JSON.stringify(null));
      this.transitionTo('/login');
    }
  }
}
