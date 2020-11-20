import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service account;
  @service router;

  get showHospitalDetails() {
    return this.router._router.url !== '/' && this.account.hospital;
  }

  @action
  logout() {
    localStorage.setItem('token', JSON.stringify(null));
    this.router.transitionTo('/');
  }
}
