import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UpdateBed from 'bed-checker/gql/mutations/update-bed';
import RemoveBed from 'bed-checker/gql/mutations/remove-bed';
import moment from 'moment';

export default class WardController extends Controller {
  @service apollo;
  @service hospital;

  dischargeReasons = ['Internal Ward', 'Internal ICU', 'External Ward', 'External ICU', 'Death', 'Other'];
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
  @tracked changesMade = false;
  @tracked showDeleteForm = false;

  ventilationTypes = [
    { type: 'NONE', label: 'None' }, 
    { type: 'SV', label: 'SV no supplemental O2' }, 
    { type: 'NASAL', label: 'Nasal / FM' }, 
    { type: 'CPAP', label: 'CPAP' }, 
    { type: 'HFNO', label: 'HFNO (Optiflow)' }, 
    { type: 'BIPAP', label: 'BiPAP / NIV' }, 
    { type: 'INVASIVE', label: 'Invasive Ventilation' }
  ];

  rrtTypes = [
    { type: 'NONE', label: 'None' }, 
    { type: 'RISK_OF_NEXT_TWENTY_FOUR_H', label: 'Risk of RRT in next 24 hours' }, 
    { type: 'HAEMOFILTRATION', label: 'Using Haemofiltration' }, 
    { type: 'HAEMODIALYSIS', label: 'Using Haemodialysis' }, 
    { type: 'PD', label: 'Using Peritoneal Dialysis' },
  ];

  get availableBedsPercentage() {
    if (this.model.totalBeds === 0) {
      return 0;
    }
    return Math.round((this.model.availableBeds / this.model.totalBeds) * 100);
  }

  @action
  openModal(bed, index, event) {
    this.reference = bed.reference;
    if (event.target.outerText === 'Discharge') {
      this.dischargeBedModalIsOpen = true;
      document.body.classList.add('no-scroll');
    } else {
      this.changesMade = false;
      const bedIndex = index + 1;

      this.available = bed.available;
      this.covidStatus = bed.covidStatus;
      this.dateOfAdmission = bed.dateOfAdmission ? moment(bed.dateOfAdmission).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
      this.id = bed.id;
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
  closeModal() {
    this.editBedModalIsOpen = false;
    this.dischargeBedModalIsOpen = false;
    this.showDeleteForm = false;
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
      // this.set('model.showSuccessMessage', true);
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
      // this.set('model.showSuccessMessage', true);
    } catch (error) {
      this.error = true;
      console.error(error);
    }
  }

  @action
  dischargePatient() {
    console.log('patient discharged!')
  }

  @action
  setDischargeReason(reason) {
    this.selectedDischargeReason = reason;
  }
}
