import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UpdateBed from 'bed-checker/gql/mutations/update-bed';
import RemoveBed from 'bed-checker/gql/mutations/remove-bed';

export default class WardController extends Controller {
  @service apollo;
  @service hospital;

  @tracked available = null;
  @tracked covidStatus = null;
  @tracked id = null;
  @tracked levelOfCare = null;
  @tracked ventilationType = null;
  @tracked index = null;
  @tracked hemofilterInUse = null;

  @tracked editBedModalIsOpen = false;
  @tracked changesMade = false;
  @tracked showDeleteForm = false;

  get availableBedsPercentage() {
    if (this.model.totalBeds === 0) {
      return 0;
    }

    return Math.round((this.model.availableBeds / this.model.totalBeds) * 100);
  }

  @action
  openEditBedModal(bed, index) {
    this.changesMade = false;
    const bedIndex = index + 1;
    
    this.available = bed.available;
    this.covidStatus = bed.covidStatus;
    this.id = bed.id;
    this.levelOfCare = bed.levelOfCare;
    this.ventilationType = bed.ventilationType;
    this.hemofilterInUse = bed.hemofilterInUse;
    this.index = bedIndex;

    this.editBedModalIsOpen = true;
    document.body.classList.add('no-scroll');
  }

  @action
  closeModal() {
    this.editBedModalIsOpen = false;
    this.showDeleteForm = false;
    document.body.classList.remove('no-scroll');
  }

  @action
  setAvailability() {
    this.available = !this.available;
    this.covidStatus = null;
    this.levelOfCare = null;
    this.hemofilterInUse = null;
    this.changesMade = true;
  }

  @action
  setCovidStatus(status) {
    this.covidStatus = status;
    this.available = false;
    this.changesMade = true;
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
  setHemofilterInUse() {
    this.hemofilterInUse = !this.hemofilterInUse;
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
        id: this.id,
        levelOfCare: this.levelOfCare,
        ventilationType: this.ventilationType,
        hemofilterInUse: this.hemofilterInUse
      }
    };

    try {
      const { updateBed } = await this.apollo.mutate({ mutation: UpdateBed, variables });

      const foundIndex = this.model.beds.findIndex(x => x.id === updateBed.bed.id);
      this.model.beds[foundIndex].available = updateBed.bed.available;
      this.model.beds[foundIndex].covidStatus = updateBed.bed.covidStatus;
      this.model.beds[foundIndex].levelOfCare = updateBed.bed.levelOfCare;
      this.model.beds[foundIndex].ventilationType = updateBed.bed.ventilationType;
      this.model.beds[foundIndex].hemofilterInUse = updateBed.bed.hemofilterInUse;

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
}
