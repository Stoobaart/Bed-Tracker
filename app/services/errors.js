import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ErrorsService extends Service {
  @tracked hasError = false;
}
