import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UpdateBed from 'bed-checker/gql/mutations/update-bed';
import RemoveBed from 'bed-checker/gql/mutations/remove-bed';
import DischargePatient from 'bed-checker/gql/mutations/discharge-patient';
import UpdateWardMutation from 'bed-checker/gql/mutations/update-ward';
import moment from 'moment';
import { later } from '@ember/runloop';

export default class WardController extends Controller {
  @service apollo;
  @service hospital;

  // ward properties
  @tracked wards = [];
  @tracked beds = [];
  @tracked wardHasNoBeds = false;

  // discharge properties
  @tracked selectedDischargeReason;
  @tracked transferPatientToWardId = null;
  @tracked transferPatientToBedId = null;

  dischargeReasons = [
    { code: 'INTERNAL_WARD', string: 'Internal Ward'}, 
    { code: 'INTERNAL_ICU', string: 'Internal ICU' }, 
    { code: 'EXTERNAL_WARD', string: 'External Ward' }, 
    { code: 'EXTERNAL_ICU', string: 'External ICU' }, 
    { code: 'DEATH', string: 'Death' }, 
    { code: 'OTHER', string: 'Other' }
  ];

  // bed properties
  @tracked available = null;
  @tracked covidStatus = null;
  @tracked dateOfAdmission = moment().format("YYYY-MM-DD");
  @tracked timeOfAdmission = moment().format("HH-MM");
  @tracked id = null;
  @tracked levelOfCare = null;
  @tracked rrtType = 'NONE';
  @tracked ventilationType = 'NONE';
  @tracked index = null;
  @tracked sourceOfAdmission = null;
  @tracked reference = null;
  @tracked useTracheostomy = false;
  @tracked today = moment().format("YYYY-MM-DD");

  // modals properties
  @tracked editBedModalIsOpen = false;
  @tracked dischargeBedModalIsOpen = false;
  @tracked updateStaffModalIsOpen = false;
  @tracked changesMade = false;
  @tracked showDeleteForm = false;

  // edit bed form error properties
  @tracked refError = false;
  @tracked dateTimeError = false;
  @tracked sourceOfAdmissionError = false;
  @tracked covidStatusError = false;
  @tracked levelOfCareError = false;

  get hasFormError() {
    return this.refError || this.dateTimeError || this.sourceOfAdmissionError || this.covidStatusError || this.levelOfCareError;
  }

  // staffing properties
  @tracked numberOfCritcareNurses = 0;
  @tracked numberOfNurseSupportStaff = 0;
  @tracked numberOfOtherRns = 0;
  @tracked canProvideIcsRatios = null;
  @tracked maxAdmissionCapacity = null;

  covidStatuses = [ 'GREEN', 'POSITIVE', 'NEGATIVE', 'UNKNOWN_SUSPECTED', 'UNKNOWN_NOT_SUSPECTED' ];
  levelsOfCare = [ 'LEVEL_1', 'LEVEL_2', 'LEVEL_3']
  sourcesOfAdmission = [ 'ED', 'EXTERNAL_WARD', 'INTERNAL_WARD', 'EXTERNAL_ITU', 'INTERNAL_ITU', 'ITU_READMISSION' ];
  ventilationTypes = [ 'NONE', 'SV', 'NASAL', 'CPAP', 'HFNO', 'BIPAP', 'INVASIVE' ];
  rrtTypes = [ 'NONE', 'RISK_OF_NEXT_TWENTY_FOUR_H', 'HAEMOFILTRATION', 'HAEMODIALYSIS', 'PD' ];

  staffingTypes = [ 'CRIT_CARE_NURSES', 'NURSE_SUPPORT', 'OTHER_RNS'];

  get availableBedsPercentage() {
    if (this.model.totalBeds === 0) {
      return 0;
    }
    return Math.round((this.model.availableBeds / this.model.totalBeds) * 100);
  }

  get totalBipapAndCpap() {
    return this.model.totalVentilationTypeCpap + this.model.totalVentilationTypeBipap;
  }

  get dischargeIsDisabled() {
    if (!this.selectedDischargeReason && this.selectedDischargeReason !== 'INTERNAL_ICU') return true;
    if (this.selectedDischargeReason === 'INTERNAL_ICU' && !this.transferPatientToBedId) return true;
    return false;
  }

  @action
  selectWard(wardId) {
    this.transferPatientToBedId = null;
    this.transferPatientToWardId = wardId;
    const selectedWard = this.wards.find((ward) => ward.id === wardId);
    if (selectedWard.beds.length === 0) {
      this.wardHasNoBeds = true;
      this.beds = [];
    } else {
      this.wardHasNoBeds = false;
      this.beds = selectedWard.beds.filter((bed) => bed.available === true);
    }
  }

  @action
  selectBed(bedId) {
    this.transferPatientToBedId = bedId;
  }

  @action
  async openModal(bed, index, event) {
    this.reference = bed.reference;
    this.id = bed.id;
    this.available = bed.available;
    this.covidStatus = bed.covidStatus;
    this.dateOfAdmission = bed.dateOfAdmission ? moment(bed.dateOfAdmission).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
    this.timeOfAdmission = bed.dateOfAdmission ? moment(bed.dateOfAdmission).format("HH:mm") : moment().format("HH:mm");
    this.levelOfCare = bed.levelOfCare;
    this.rrtType = bed.rrtType === null ? 'NONE' : bed.rrtType;
    this.sourceOfAdmission = bed.sourceOfAdmission;
    this.useTracheostomy = bed.useTracheostomy;
    this.ventilationType = bed.ventilationType === null ? 'NONE' : bed.ventilationType;

    if (event.target.outerText === 'Discharge') {
      this.wards = await this.hospital.fetchWards();
      this.dischargeBedModalIsOpen = true;
      document.body.classList.add('no-scroll');
    } else {
      this.changesMade = false;
      const bedIndex = index + 1;
      this.index = bedIndex;

      this.editBedModalIsOpen = true;
      document.body.classList.add('no-scroll');
    }
  }

  @action
  openStaffModal() {
    this.numberOfCritcareNurses = this.model.numberOfCritcareNurses ? this.model.numberOfCritcareNurses : 0;
    this.numberOfNurseSupportStaff = this.model.numberOfNurseSupportStaff ? this.model.numberOfNurseSupportStaff : 0;
    this.numberOfOtherRns = this.model.numberOfOtherRns ? this.model.numberOfOtherRns : 0;
    this.canProvideIcsRatios = this.model.canProvideIcsRatios;
    this.maxAdmissionCapacity = this.model.maxAdmissionCapacity;
    this.updateStaffModalIsOpen = true;
  }

  @action
  closeModal() {
    this.editBedModalIsOpen = false;
    this.dischargeBedModalIsOpen = false;
    this.showDeleteForm = false;
    this.updateStaffModalIsOpen = false;
    this.selectedDischargeReason = null;
    this.clearFormErrors();
    document.body.classList.remove('no-scroll');
  }

  @action
  setAvailability(available) {
    if (this.available === available) {
      return;
    }

    this.available = !this.available;
    this.covidStatus = null;
    this.levelOfCare = null;
    this.clearFormErrors();
    this.changesMade = true;
  }
  
  @action
  setSourceOfAdmission(source) {
    this.sourceOfAdmissionError = false;
    this.sourceOfAdmission = source;
    this.available = false;
    this.changesMade = true;
  }

  @action
  setCovidStatus(status) {
    this.covidStatusError = false;
    this.covidStatus = status;
    this.available = false;
    this.changesMade = true;
  }

  @action
  setUseTracheostomy() {
    this.useTracheostomy = !this.useTracheostomy;
    this.available = false;
    this.changesMade = true;
    if (this.useTracheostomy && this.ventilationType === 'HFNO' || this.useTracheostomy && this.ventilationType === 'BIPAP') {
      this.ventilationType = 'NONE';
    }
  }

  @action
  setLevelOfCare(level) {
    this.levelOfCareError = false;
    this.levelOfCare = level;
    this.available = false;
    this.changesMade = true;
  }

  @action
  setVentilationType(status) {
    this.ventilationType = status;
    this.available = false;
    this.changesMade = true;
  }

  @action
  setRrtType(type) {
    this.rrtType = type;
    this.available = false;
    this.changesMade = true;
  }

  @action
  async editBed(event) {
    event.preventDefault();
    this.error = false;
    this.checkFormErrors();

    if (!this.hasFormError) {
      const dateTime = moment(`${this.dateOfAdmission}T${this.timeOfAdmission}:00`);

      const variables = {
        input: {
          available: this.available,
          covidStatus: this.covidStatus,
          dateOfAdmission: dateTime,
          id: this.id,
          useTracheostomy: this.useTracheostomy ? true : false,
          levelOfCare: this.levelOfCare,
          ventilationType: this.ventilationType,
          reference: this.reference,
          rrtType: this.rrtType,
          sourceOfAdmission: this.sourceOfAdmission
        }
      };

      try {
        const { updateBed } = await this.apollo.mutate({ mutation: UpdateBed, variables });
        this.hospital.editBed(this.model, updateBed);
        this.closeModal();
        this.set('model.showSuccessMessage', { type: 'bed-edited'});
        later(() => {
          this.set('model.showSuccessMessage', false);
        }, 4000);
      } catch (error) {
        this.error = true;
        // console.error(error);
      }
    }
  }

  @action
  checkFormErrors() {
    const dateTimeIsInFuture = moment().diff(`${this.dateOfAdmission}T${this.timeOfAdmission}:00`) < 0;
    const dateTimeIsValid = moment(`${this.dateOfAdmission}T${this.timeOfAdmission}:00`, true).isValid();

    if (!this.available) {
      this.dateTimeError = this.dateOfAdmission === '' || this.timeOfAdmission === '' || dateTimeIsInFuture || !dateTimeIsValid;
      this.sourceOfAdmissionError = !this.sourceOfAdmission;
      this.covidStatusError = !this.covidStatus;
      this.levelOfCareError = !this.levelOfCare;
    } else {
      this.dateTimeError = false;
      this.sourceOfAdmissionError = false;
      this.covidStatusError = false;
      this.levelOfCareError = false;
    }

    this.refError = this.reference === '';
  }

  clearFormErrors() {
    this.refError = false;
    this.dateTimeError = false;
    this.sourceOfAdmissionError = false;
    this.covidStatusError = false;
    this.levelOfCareError = false;
  }

  @action
  toggleDeleteModal() {
    this.showDeleteForm = !this.showDeleteForm;
  }

  @action
  async deleteBed(event) {
    event.preventDefault();
    this.error = false;

    const selectedBedId = this.id;

    const variables = {
      input: {
        id: selectedBedId
      }
    };

    try {
      await this.apollo.mutate({ mutation: RemoveBed, variables });
      
      const newBeds = this.model.beds.filter(x => x.id !== selectedBedId);
      this.set('model.beds', newBeds);
      this.closeModal();
      this.set('model.showSuccessMessage', { type: 'bed-deleted'});
      later(() => {
        this.set('model.showSuccessMessage', false);
      }, 4000);
    } catch (error) {
      this.error = true;
      // console.error(error);
    }
  }

  @action
  async dischargePatient(event) {
    event.preventDefault();

    this.error = false;
    const bedId = this.transferPatientToBedId ? this.transferPatientToBedId : null;

    const variables = {
      input: {
        bedId,
        id: this.id,
        reason: this.selectedDischargeReason
      }
    };

    try {
      await this.apollo.mutate({ mutation: DischargePatient, variables });

      this.model.beds.forEach(x => {
        if (x.id === this.id) {
          x.available = true;
          x.covidStatus = null;
          x.dateOfAdmission = null;
          x.levelOfCare = null;
          x.rrtType = 'NONE';
          x.sourceOfAdmission = null;
          x.useTracheostomy = false;
          x.ventilationType = 'NONE';
        } else if (x.id === bedId) {
          const dateTime = moment(`${this.dateOfAdmission}T${this.timeOfAdmission}:00`);
          x.available = this.available;
          x.covidStatus = this.covidStatus;
          x.dateOfAdmission = dateTime;
          x.levelOfCare = this.levelOfCare;
          x.rrtType = this.rrtType;
          x.sourceOfAdmission = this.sourceOfAdmission;
          x.useTracheostomy = this.useTracheostomy;
          x.ventilationType = this.ventilationType;
        } else {
          return x;
        }
      });


      this.set('model.showSuccessMessage', { type: 'bed-discharged' });
      later(() => {
        this.set('model.showSuccessMessage', false);
      }, 4000);
      this.closeModal();
    } catch (error) {
      this.error = true;
      // console.error(error);
    }
  }

  @action
  setDischargeReason(reason) {
    this.selectedDischargeReason = reason;
    this.beds = [];
    this.transferPatientToBedId = null;
    this.wardHasNoBeds = false;
  }

  @action
  updateCritCareTotal(type) {
    if (type === 'add') {
      this.numberOfCritcareNurses++;
    } else if (this.numberOfCritcareNurses >= 1) {
      this.numberOfCritcareNurses--;
    }
  }

  @action
  updateOtherRnsTotal(type) {
    if (type === 'add') {
      this.numberOfOtherRns++;
    } else if (this.numberOfOtherRns >= 1) {
      this.numberOfOtherRns--;
    }
  }

  @action
  updateNurseSupportTotal(type) {
    if (type === 'add') {
      this.numberOfNurseSupportStaff++;
    } else {
      this.numberOfNurseSupportStaff--;
    }
  }

  @action
  setCanProvideNurseRatios(bool) {
    this.canProvideIcsRatios = bool;
  }

  @action
  async updateStaffing() {
    this.error = false;

    const variables = {
      input: {
        id: this.model.id,
        numberOfCritcareNurses: this.numberOfCritcareNurses,
        numberOfOtherRns: this.numberOfOtherRns,
        numberOfNurseSupportStaff: this.numberOfNurseSupportStaff,
        canProvideIcsRatios: this.canProvideIcsRatios,
        maxAdmissionCapacity: parseInt(this.maxAdmissionCapacity)
      }
    };

    try {
      await this.apollo.mutate({ mutation: UpdateWardMutation, variables });
      this.closeModal();
      this.set('model.showSuccessMessage', { type: 'staff-updated' });
      later(() => {
        this.set('model.showSuccessMessage', false);
      }, 4000);

      this.model.numberOfCritcareNurses = this.numberOfCritcareNurses;
      this.model.numberOfOtherRns = this.numberOfOtherRns;
      this.model.numberOfNurseSupportStaff = this.numberOfNurseSupportStaff;
      this.model.canProvideIcsRatios = this.canProvideIcsRatios;
      this.model.maxAdmissionCapacity = this.maxAdmissionCapacity;
    } catch (error) {
      this.error = true;
      // console.error(error);
    }
  }
}
