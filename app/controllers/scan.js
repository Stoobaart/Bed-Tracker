import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ScanController extends Controller {
  @tracked stream = null;
}

