import Controller from '@ember/controller';
// import QRCode from 'qrcode';

export default class DashboardController extends Controller {
  // @service printThis;

  get canProvideIcsRatios() {
    return !this.model.wards.some((ward) => ward.canProvideIcsRatios === false);
  }

  get availableBedsPercentage() {
    if (this.model.totalBeds === 0) {
      return 0;
    }
    
    return Math.round((this.model.availableBeds / this.model.totalBeds) * 100);
  }

  get availableBedsPercentageClass() {
    if (this.availableBedsPercentage <= 25) {
      return 'low';
    } else if (this.availableBedsPercentage < 75) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  // @action
  // async printQrCode(bedId) {
  //   this.qrCode = await QRCode.toDataURL(bedId);
  //   await this.printThis.print('img.qr-code');
  // }
}
