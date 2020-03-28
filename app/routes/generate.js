import Route from '@ember/routing/route';
import QRCode from 'qrcode';

export default class GenerateRoute extends Route {
  model({ uuid }) {
    return uuid;
  }

  async setupController(controller, model) {
    const qrCode = await QRCode.toDataURL(model);
    controller.set('qrCode', qrCode);
  }
}
