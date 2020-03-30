import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service account;
  @service router;

  get showHospitalDetails() {
    return this.router._router.url !== '/' && !this.router._router.url.includes('/qr') && this.account.hospital;
  }
}
