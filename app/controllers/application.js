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

  @tracked showSlideMenu = false;

  @action
  toggleMenu() {
    this.showSlideMenu = !this.showSlideMenu;

    if (this.showSlideMenu) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  @action
  logout() {
    this.showSlideMenu = false;
    localStorage.setItem('token', JSON.stringify(null));
    this.router.transitionTo('/');
  }

  @action
  gotToRoute(route) {
    this.router.transitionTo(`/${route}`);
    this.showSlideMenu = false;
  }
}
