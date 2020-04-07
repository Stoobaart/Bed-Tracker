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
}

class Hospital {
  @tracked id = null;
  @tracked useManagement = null;
  @tracked name = null;
  @tracked address = null;
  @tracked wards = [];

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

  get totalVentilatorInUse() {
    return this.wards.reduce((totalVentilatorInUse, ward) => totalVentilatorInUse + ward.totalVentilatorInUse, 0);
  }

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
  @tracked shortName = null;
  @tracked longName = null;
  @tracked beds = [];

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

  get totalVentilatorInUse() {
    return this.beds.reduce((totalVentilatorInUse, bed) => {
      if (bed.ventilatorInUse) {
        return totalVentilatorInUse + 1
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
  @tracked ventilatorInUse = null;

  constructor(bed) {
    for (const property in this) {
      this[property] = bed[property];
    }
  }
}
