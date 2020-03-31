import Route from '@ember/routing/route';
import QRCode from 'qrcode';
import { inject as service } from '@ember/service';
import RegisterBedMutation from 'bed-checker/gql/mutations/register-bed';

export default class AddBedRoute extends Route {
  @service apollo;

  async model() {
    const { registerBed } = await this.apollo.mutate({ mutation: RegisterBedMutation });
    return registerBed.bed;
  }

  async setupController(controller, model) {
    const qrCode = await QRCode.toDataURL(model.id);
    controller.set('qrCode', qrCode);
  }
}
