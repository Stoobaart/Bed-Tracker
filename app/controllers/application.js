import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service account;
  @service router;

  get showHospitalDetails() {
    return this.router._router.url !== '/' && !this.router._router.url.includes('/qr') && this.account.hospital;
  }

  get isDetectifyRoute() {
    return this.router._router.url === '/4a2b2d7c58df5c43d63986fb23385307.txt';
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
    localStorage.setItem('hospital', JSON.stringify(null));
    localStorage.setItem('bed_tracker_token', JSON.stringify(null));
    this.router.transitionTo('/');
  }
}
