import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UpdateBed from 'bed-checker/gql/mutations/update-bed';
import RemoveBed from 'bed-checker/gql/mutations/remove-bed';
import DischargePatient from 'bed-checker/gql/mutations/discharge-patient';
import UpdateWardMutation from 'bed-checker/gql/mutations/update-ward';
import moment from 'moment';

export default class WardController extends Controller {
  @service apollo;
  @service hospital;

  @tracked wards = [];
  @tracked beds = [];
  @tracked wardHasNoBeds = false;
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
  @tracked selectedDischargeReason;

  @tracked available = null;
  @tracked covidStatus = null;
  @tracked dateOfAdmission = moment().format("YYYY-MM-DD");
  @tracked id = null;
  @tracked levelOfCare = null;
  @tracked rrtType = null;
  @tracked ventilationType = null;
  @tracked index = null;
  @tracked sourceOfAdmission = null;
  @tracked reference = null;
  @tracked useTracheostomy = false;

  @tracked editBedModalIsOpen = false;
  @tracked dischargeBedModalIsOpen = false;
  @tracked updateStaffModalIsOpen = false;
  @tracked changesMade = false;
  @tracked showDeleteForm = false;

  @tracked numberOfCritcareNurses = 0;
  @tracked numberOfNurseSupportStaff = 0;
  @tracked numberOfOtherRns = 0;
  @tracked canProvideIcsRatios = null;
  @tracked maxAdmissionCapacity = null;

  covidStatuses = [ 'GREEN', 'POSITIVE', 'NEGATIVE', 'SUSPECTED' ];
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

  get dischargeIsDisabled() {
    if (!this.selectedDischargeReason && this.selectedDischargeReason !== 'INTERNAL_ICU') return true;
    if (this.selectedDischargeReason === 'INTERNAL_ICU' && !this.transferPatientToBedId) return true;
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
    if (event.target.outerText === 'Discharge') {
      this.wards = await this.hospital.fetchWards();
      this.dischargeBedModalIsOpen = true;
      document.body.classList.add('no-scroll');
    } else {
      this.changesMade = false;
      const bedIndex = index + 1;

      this.available = bed.available;
      this.covidStatus = bed.covidStatus;
      this.dateOfAdmission = bed.dateOfAdmission ? moment(bed.dateOfAdmission).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
      this.levelOfCare = bed.levelOfCare;
      this.rrtType = bed.rrtType;
      this.sourceOfAdmission = bed.sourceOfAdmission;
      this.useTracheostomy = bed.useTracheostomy;
      this.ventilationType = bed.ventilationType;
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
    
    this.changesMade = true;
  }
  
  @action
  setSourceOfAdmission(source) {
    this.sourceOfAdmission = source;
    this.available = false;
    this.changesMade = true;
  }

  @action
  setCovidStatus(status) {
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
      this.ventilationType = null;
    }
  }

  @action
  setLevelOfCare(level) {
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

    const variables = {
      input: {
        available: this.available,
        covidStatus: this.available ? null : this.covidStatus,
        dateOfAdmission: moment(this.dateOfAdmission),
        id: this.id,
        useTracheostomy: this.useTracheostomy,
        levelOfCare: this.levelOfCare,
        ventilationType: this.ventilationType,
        reference: this.reference,
        rrtType: this.rrtType,
        sourceOfAdmission: this.sourceOfAdmission
      }
    };

    try {
      const { updateBed } = await this.apollo.mutate({ mutation: UpdateBed, variables });

      const foundIndex = this.model.beds.findIndex(x => x.id === updateBed.bed.id);
      this.model.beds[foundIndex].available = updateBed.bed.available;
      this.model.beds[foundIndex].covidStatus = updateBed.bed.covidStatus;
      this.model.beds[foundIndex].dateOfAdmission = updateBed.bed.dateOfAdmission;
      this.model.beds[foundIndex].useTracheostomy = updateBed.bed.useTracheostomy;
      this.model.beds[foundIndex].levelOfCare = updateBed.bed.levelOfCare;
      this.model.beds[foundIndex].ventilationType = updateBed.bed.ventilationType;
      this.model.beds[foundIndex].reference = updateBed.bed.reference;
      this.model.beds[foundIndex].rrtType = updateBed.bed.rrtType;
      this.model.beds[foundIndex].sourceOfAdmission = updateBed.bed.sourceOfAdmission;

      this.hospital.fetchHospital();

      this.closeModal();
      this.set('model.showSuccessMessage', { type: 'bed-edited'});
    } catch (error) {
      this.error = true;
      console.error(error);
    }
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
    } catch (error) {
      this.error = true;
      console.error(error);
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

      const resetBed = {
        available: true,
        covidStatus: null,
        dateOfAdmission: null,
        id: this.id,
        levelOfCare: null,
        reference: this.reference,
        rrtType: null,
        sourceOfAdmission: null,
        useTracheostomy: null,
        ventilationType: null
      }

      const newBeds = this.model.beds.map(x => {
        if (x.id === this.id) {
          return resetBed;
        } else {
          return x;
        }
      });

      this.set('model.beds', newBeds);


      this.set('model.showSuccessMessage', { type: 'bed-discharged' });
      this.closeModal();
    } catch (error) {
      this.error = true;
      console.error(error);
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

      this.model.numberOfCritcareNurses = this.numberOfCritcareNurses;
      this.model.numberOfOtherRns = this.numberOfOtherRns;
      this.model.numberOfNurseSupportStaff = this.numberOfNurseSupportStaff;
      this.model.canProvideIcsRatios = this.canProvideIcsRatios;
      this.model.maxAdmissionCapacity = this.maxAdmissionCapacity;
    } catch (error) {
      this.error = true;
      console.error(error);
    }
  }
}
