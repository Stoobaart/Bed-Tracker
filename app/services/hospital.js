import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import GetHospitalQuery from 'bed-checker/gql/queries/get-hospital';

export default class AccountService extends Service {
  @service apollo;

  @tracked _hospital = null;
  @tracked timeout = null;

  get hospital() {
    return this._hospital;
  }

  set hospital(hospital) {
    this._hospital = new Hospital(hospital);
  }

  init() {
    super.init(...arguments);
    this.fetchHospital();
  }

  async fetchHospital() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (JSON.parse(localStorage.getItem('token'))) {
      const response = await this.apollo.query({ query: GetHospitalQuery, fetchPolicy: 'network-only' });

      if (response && response.getHospital && response.getHospital.hospital) {
        this.hospital = response.getHospital.hospital;
      }
    }

    this.timeout = setTimeout(this.fetchHospital.bind(this), 10000);
  }

  async fetchWards() {
    if (JSON.parse(localStorage.getItem('token'))) {
      const response = await this.apollo.query({ query: GetHospitalQuery, fetchPolicy: 'network-only' });
      const wards = response.getHospital.hospital.wards;
      return wards;
    }
  }

  addWard(ward) {
    this.hospital.wards.push(new Ward(ward));
  }

  removeWard(wardId) {
    const wardIndex = this.hospital.wards.findIndex((ward) => ward.id === wardId);
    this.hospital.wards.splice(wardIndex, 1);
  }

  addBeds(ward, beds) {
    beds.forEach((bed) => {
      ward.beds.push(new Bed(bed));
    });
  }

  editBed(ward, updateBed) {
    const foundIndex = ward.beds.findIndex(x => x.id === updateBed.bed.id);
    ward.beds[foundIndex].available = updateBed.bed.available;
    ward.beds[foundIndex].covidStatus = updateBed.bed.covidStatus;
    ward.beds[foundIndex].dateOfAdmission = updateBed.bed.dateOfAdmission;
    ward.beds[foundIndex].useTracheostomy = updateBed.bed.useTracheostomy;
    ward.beds[foundIndex].levelOfCare = updateBed.bed.levelOfCare;
    ward.beds[foundIndex].ventilationType = updateBed.bed.ventilationType;
    ward.beds[foundIndex].reference = updateBed.bed.reference;
    ward.beds[foundIndex].rrtType = updateBed.bed.rrtType;
    ward.beds[foundIndex].sourceOfAdmission = updateBed.bed.sourceOfAdmission;
  }
}

class Hospital {
  @tracked id = null;
  @tracked name = null;
  @tracked address = null;
  @tracked wards = [];
  @tracked totalCovidBeds = null;
  @tracked totalAvailableCovidBeds = null;
  @tracked totalNumberOfOtherRns = null;
  @tracked totalNumberOfCritcareNurses = null;
  @tracked totalNumberOfNurseSupportStaff = null;
  @tracked totalCovidStatusGreen = null;
  @tracked totalCovidStatusNegative = null;
  @tracked totalCovidStatusPositive = null;
  @tracked totalAvailableGreenBeds = null;
  @tracked totalGreenBeds = null;
  @tracked totalAvailableAmberBeds = null;
  @tracked totalAmberBeds = null;
  @tracked totalVentilationTypeInvasive = null;
  @tracked totalVentilationTypeHfno = null;
  @tracked totalVentilationTypeCpap = null;
  @tracked totalVentilationTypeSv = null;
  @tracked totalVentilationTypeNasal = null;
  @tracked totalVentilationTypeBipap = null;
  @tracked totalVentilationTypeNone = null;
  @tracked totalRrtTypeRiskOfNextTwentyFourH = null;
  @tracked totalRrtTypeHaemofiltration = null;
  @tracked totalRrtTypeHaemodialysis = null;
  @tracked totalMaxAdmissionCapacity = null;

  // get totalMaxAdmissionCapacity() {
  //   return this.wards.reduce((totalMaxAdmissionCapacity, ward) => totalMaxAdmissionCapacity + ward.maxAdmissionCapacity, 0);
  // }

  get totalBeds() {
    return this.wards.reduce((totalBeds, ward) => totalBeds + ward.totalBeds, 0);
  }

  get availableBeds() {
    return this.wards.reduce((availableBeds, ward) => availableBeds + ward.availableBeds, 0);
  }

  get unavailableBeds() {
    return this.wards.reduce((unavailableBeds, ward) => unavailableBeds + ward.unavailableBeds, 0);
  }

  // get totalCovidStatusNegative() {
  //   return this.wards.reduce((totalCovidStatusNegative, ward) => totalCovidStatusNegative + ward.totalCovidStatusNegative, 0);
  // }

  get totalCovidStatusUnknownSuspected() {
    return this.wards.reduce((totalCovidStatusUnknownSuspected, ward) => totalCovidStatusUnknownSuspected + ward.totalCovidStatusUnknownSuspected, 0);
  }

  // get totalCovidStatusPositive() {
  //   return this.wards.reduce((totalCovidStatusPositive, ward) => totalCovidStatusPositive + ward.totalCovidStatusPositive, 0);
  // }

  // get totalVentilatorInUse() {
  //   return this.wards.reduce((totalVentilatorInUse, ward) => totalVentilatorInUse + ward.totalVentilatorInUse, 0);
  // }

  constructor(hospital) {
    for (const property in this) {
      if (property === 'wards') {
        hospital.wards.forEach((ward) => this.wards.push(new Ward(ward)));
      } else {
        this[property] = hospital[property];
      }
    }
  }
}

class Ward {
  @tracked id = null;
  @tracked name = null;
  @tracked description = null;
  @tracked wardType = null;
  @tracked beds = [];
  @tracked numberOfNurseSupportStaff = null;
  @tracked numberOfCritcareNurses = null;
  @tracked numberOfOtherRns = null;
  @tracked canProvideIcsRatios = null;
  @tracked maxAdmissionCapacity = null;
  @tracked lastUpdatedByHospitalManagerOfWardOrBeds = { firstName: null, lastName: null };
  @tracked lastUpdatedAtOfWardOrBeds = null;
  @tracked isSurgeWard = null;

  get totalRrtTypeHaemodialysis() {
    return this.beds.filter((bed) => bed.rrtType === 'HAEMODIALYSIS').length;
  }

  get totalRrtTypeHaemofiltration() {
    return this.beds.filter((bed) => bed.rrtType === 'HAEMOFILTRATION').length;
  }

  get totalRrtTypeRiskOfNextTwentyFourH() {
    return this.beds.filter((bed) => bed.rrtType === 'RISK_OF_NEXT_TWENTY_FOUR_H').length;
  }

  get totalVentilationTypeCpap() {
    return this.beds.filter((bed) => bed.ventilationType === 'CPAP').length;
  }

  get totalVentilationTypeBipap() {
    return this.beds.filter((bed) => bed.ventilationType === 'BIPAP').length;
  }

  get totalVentilationTypeInvasive() {
    return this.beds.filter((bed) => bed.ventilationType === 'INVASIVE').length;
  }

  get totalVentilationTypeHfno() {
    return this.beds.filter((bed) => bed.ventilationType === 'HFNO').length;
  }


  get totalBeds() {
    return this.beds.length;
  }

  get availableBeds() {
    return this.beds.filter((bed) => bed.available).length;
  }

  get unavailableBeds() {
    return this.beds.filter((bed) => !bed.available).length;
  }

  get totalCovidStatusNegative() {
    return this.beds.reduce((totalCovidStatusNegative, bed) => {
      if (bed.covidStatus === 'NEGATIVE') {
        return totalCovidStatusNegative + 1;
      }

      return totalCovidStatusNegative;
    }, 0);
  }

  get totalCovidStatusUnknownSuspected() {
    return this.beds.reduce((totalCovidStatusUnknownSuspected, bed) => {
      if (bed.covidStatus === 'SUSPECTED') {
        return totalCovidStatusUnknownSuspected + 1;
      }

      return totalCovidStatusUnknownSuspected;
    }, 0);
  }

  get totalCovidStatusPositive() {
    return this.beds.reduce((totalCovidStatusPositive, bed) => {
      if (bed.covidStatus === 'POSITIVE') {
        return totalCovidStatusPositive + 1;
      }

      return totalCovidStatusPositive;
    }, 0);
  }

  get totalCovidStatusGreen() {
    return this.beds.reduce((totalCovidStatusGreen, bed) => {
      if (bed.covidStatus === 'GREEN') {
        return totalCovidStatusGreen + 1;
      }

      return totalCovidStatusGreen;
    }, 0);
  }

  get totalVentilatorInUse() {
    return this.beds.reduce((totalVentilatorInUse, bed) => {
      if (bed.ventilationType === 'INVASIVE') {
        return totalVentilatorInUse + 1;
      }

      return totalVentilatorInUse;
    }, 0);
  }

  constructor(ward) {
    for (const property in this) {
      if (property === 'beds') {
        ward.beds.forEach((bed) => this.beds.push(new Bed(bed)));
      } else {
        this[property] = ward[property];
      }
    }
  }
}

class Bed {
  @tracked id = null;
  @tracked available = null;
  @tracked covidStatus = null;
  @tracked dateOfAdmission = null;
  @tracked ventilationType = null;
  @tracked levelOfCare = null;
  @tracked reference = null;
  @tracked rrtType = null;
  @tracked sourceOfAdmission = null;
  @tracked useTracheostomy = false;

  constructor(bed) {
    for (const property in this) {
      this[property] = bed[property];
    }
  }
}
