import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import QRCode from 'qrcode';

export default class GenerateController extends Controller {
  @tracked textValue = null;
  @tracked qrCode = null;

  @action
  async generateQrCode() {
    this.qrCode = await QRCode.toDataURL(this.textValue);
  }
}
