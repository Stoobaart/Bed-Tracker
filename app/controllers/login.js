import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import LoginHospitalManager from 'bed-checker/gql/mutations/login-hospital-manager';

export default class LoginController extends Controller {
  @service apollo;
  @service router;
  @service errors;
  @service account;

  email = null;
  passowrd = null;

  @action
  async submit(event) {
    event.preventDefault();
    this.errors.hasError = false;

    const variables = {
      input: {
        email: this.email,
        password: this.password
      }
    };

    try {
      const response = await this.apollo.mutate({ mutation: LoginHospitalManager, variables });
      const hospitalId = response.loginHospitalManager.hospitalManager.hospital.id;
      this.account.hospital = response.loginHospitalManager.hospitalManager.hospital;
      localStorage.setItem('hospital', JSON.stringify(this.account.hospital));
      localStorage.setItem('bed_tracker_token', JSON.stringify(hospitalId));
      this.router.transitionTo('dashboard');
    } catch (error) {
      this.errors.hasError = true;
    }
  }
}
