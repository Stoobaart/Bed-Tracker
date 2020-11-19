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

    if (JSON.parse(localStorage.getItem('bed_tracker_token'))) {
      const response = await this.apollo.query({ query: GetHospitalQuery, fetchPolicy: 'network-only' });

      if (response && response.getHospital && response.getHospital.hospital) {
        this.hospital = response.getHospital.hospital;
      }
    }

    this.timeout = setTimeout(this.fetchHospital.bind(this), 10000);
  }

  async fetchWards() {
    if (JSON.parse(localStorage.getItem('bed_tracker_token'))) {
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
}

class Hospital {
  @tracked id = null;
  @tracked name = null;
  @tracked address = null;
  @tracked wards = [];
  // @tracked availableHemofilter = null;
  @tracked totalCovidBeds = null;
  @tracked totalAvailableCovidBeds = null;
  // @tracked totalNonCovidBeds = null;
  // @tracked totalAvailableNonCovidBeds = null;
  // @tracked totalHemofilter = null;

  // get totalAvailableHemofilters() {
  //   return this.totalHemofilter ? this.totalHemofilter - this.availableHemofilter : 0;
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

  get totalCovidStatusNegative() {
    return this.wards.reduce((totalCovidStatusNegative, ward) => totalCovidStatusNegative + ward.totalCovidStatusNegative, 0);
  }

  get totalCovidStatusSuspected() {
    return this.wards.reduce((totalCovidStatusSuspected, ward) => totalCovidStatusSuspected + ward.totalCovidStatusSuspected, 0);
  }

  get totalCovidStatusPositive() {
    return this.wards.reduce((totalCovidStatusPositive, ward) => totalCovidStatusPositive + ward.totalCovidStatusPositive, 0);
  }

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
        return totalCovidStatusNegative + 1
      }

      return totalCovidStatusNegative;
    }, 0);
  }

  get totalCovidStatusSuspected() {
    return this.beds.reduce((totalCovidStatusSuspected, bed) => {
      if (bed.covidStatus === 'SUSPECTED') {
        return totalCovidStatusSuspected + 1
      }

      return totalCovidStatusSuspected;
    }, 0);
  }

  get totalCovidStatusPositive() {
    return this.beds.reduce((totalCovidStatusPositive, bed) => {
      if (bed.covidStatus === 'POSITIVE') {
        return totalCovidStatusPositive + 1
      }

      return totalCovidStatusPositive;
    }, 0);
  }

  // get totalVentilatorInUse() {
  //   return this.beds.reduce((totalVentilatorInUse, bed) => {
  //     if (bed.ventilationType) {
  //       return totalVentilatorInUse + 1
  //     }

  //     return totalVentilatorInUse;
  //   }, 0);
  // }

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
