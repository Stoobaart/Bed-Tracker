import Route from '@ember/routing/route';
import GetReport from 'bed-checker/gql/queries/get-report';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ReportsRoute extends Route {
  @service apollo;
  @service errors;

  async model() {
    try {
      return await this.apollo.query({ query: GetReport, fetchPolicy: 'network-only' });
    } catch (error) {
      this.errors.hasError = true;
    }
  }

  @action
  error() {
    localStorage.setItem('token', JSON.stringify(null));
    this.transitionTo('/');
  }

}
