import Controller from '@ember/controller';
import { queryManager } from 'ember-apollo-client';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import GetHospitalQuery from 'bed-checker/gql/queries/get-hospital';

export default class QrController extends Controller {
  @service router;
  @service errors;
  @service account;

  @queryManager() apollo;

  hospitalId = 'ed20d06e-60af-4a67-a7db-3a00285e5786';

  @action
  async submit(event) {
    event.preventDefault();
    localStorage.setItem('bed_tracker_token', JSON.stringify(this.hospitalId));
    localStorage.setItem('hospital_manager', false);

    const response = await this.apollo.watchQuery({ query: GetHospitalQuery });
    // const hospitalId = response.getHospital.hospital.id;

    if (this.hospitalId) {
      this.router.transitionTo('/scan');
    }
  }
}
