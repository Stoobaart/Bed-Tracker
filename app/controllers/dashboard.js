import Controller from '@ember/controller';

export default class DashboardController extends Controller {

  get totalBipapAndCpap() {
    return this.model.totalVentilationTypeCpap + this.model.totalVentilationTypeBipap;
  }

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
}
