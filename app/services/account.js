import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AccountService extends Service {
  @tracked hospital;

  init() {
    super.init(...arguments);

    const hospital = JSON.parse(localStorage.getItem('hospital'));

    if (hospital) {
      this.hospital = hospital;
    }
  }
}
