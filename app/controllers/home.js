import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { v4 } from 'ember-uuid';

export default class HomeController extends Controller {
  @service router;

  @action
  addBed() {
    const uuid = v4();
    this.router.transitionTo('add-bed.js', uuid);
  }
}
