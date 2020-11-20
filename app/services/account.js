import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AccountService extends Service {
  @tracked hospital;
}
