import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import GetHospital from 'bed-checker/gql/queries/get-hospital';

export default class extends Route {
  @service apollo;
  @service router;
  @service account;

  @action
  async didTransition() {
    super.init(...arguments);

    window.scrollTo(0,0);
    const hasToken = JSON.parse(localStorage.getItem('token'));
    const hasHospital = this.account.hospital;

    if (hasToken && !hasHospital) {
      const response = await this.apollo.watchQuery({ query: GetHospital });
      this.account.hospital = response.getHospital.hospital;
    }

    if (!hasToken) {
      this.transitionTo('/');
    }
  }
}
