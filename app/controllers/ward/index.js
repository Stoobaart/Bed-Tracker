import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import UpdateBed from 'bed-checker/gql/mutations/update-bed';
import RemoveBed from 'bed-checker/gql/mutations/remove-bed';

export default class WardController extends Controller {
  @service apollo;

  @tracked totalBeds = this.model.totalBeds || 0;
  @tracked availableBeds = this.model.availableBeds || 0;
  @tracked totalVentilatorInUse = this.model.totalVentilatorInUse || 0;
  @tracked totalCovidStatusPositive = this.model.totalCovidStatusPositive || 0;
  @tracked totalCovidStatusNegative = this.model.totalCovidStatusNegative || 0;
  @tracked totalCovidStatusSuspected = this.model.totalCovidStatusSuspected || 0;
  @tracked editBedModalIsOpen = false;
  @tracked bedInMemory = null;
  @tracked changesMade = false;

  @tracked showBedAvailableRadio = false;
  @tracked showPatientPositiveRadio = false;
  @tracked showPatientNegativeRadio = false;
  @tracked showPatientSuspectedRadio = false;

  @tracked showDeleteForm = false;

  get availableBedsPercentage() {
    if (this.totalBeds === 0) {
      return 0;
    }

    return Math.round((this.availableBeds / this.totalBeds) * 100);
  }

  @action
  openEditBedModal(bed, index) {
    this.bedInMemory = {
      bed,
      index: index + 1
    }

    this.showBedAvailableRadio = !bed.available;
    this.showPatientPositiveRadio = bed.covidStatus !== 'POSITIVE';
    this.showPatientNegativeRadio = bed.covidStatus !== 'NEGATIVE';
    this.showPatientSuspectedRadio = bed.covidStatus !== 'SUSPECTED';

    if (bed.available) {
      this.setAvailability();
    }

    this.editBedModalIsOpen = true;
  }

  @action
  closeModal() {
    this.editBedModalIsOpen = false;
    this.bedInMemory = null;
    this.changesMade = false;
    this.showDeleteForm = false;
  }

  @action
  setAvailability() {
    this.set('bedInMemory', { 
      bed: { 
        available: !this.bedInMemory.bed.available,
        covidStatus: this.bedInMemory.bed.covidStatus,
        id: this.bedInMemory.bed.id,
        ventilatorInUse: this.bedInMemory.bed.ventilatorInUse
      }
    });
    this.changesMade = true;
  }

  @action
  setCovidStatus(status) {
    this.set('bedInMemory', { 
      bed: { 
        available: this.bedInMemory.bed.available,
        covidStatus: status,
        id: this.bedInMemory.bed.id,
        ventilatorInUse: this.bedInMemory.bed.ventilatorInUse
      } 
    });
    this.changesMade = true;
  }

  @action
  setVentilatorStatus() {
    this.set('bedInMemory', { 
      bed: { 
        available: this.bedInMemory.bed.available,
        covidStatus: this.bedInMemory.bed.covidStatus,
        id: this.bedInMemory.bed.id,
        ventilatorInUse: !this.bedInMemory.bed.ventilatorInUse
      }
    });
    this.changesMade = true;
  }

  @action
  async editBed(event) {
    event.preventDefault();

    this.error = false;

    const available = this.bedInMemory.bed.available;

    const variables = {
      input: {
        available,
        covidStatus: available ? null : this.bedInMemory.bed.covidStatus,
        id: this.bedInMemory.bed.id,
        ventilatorInUse: available ? false : this.bedInMemory.bed.ventilatorInUse
      }
    };

    try {
      const { updateBed } = await this.apollo.mutate({ mutation: UpdateBed, variables });

      const mutatableBedsArray = [...this.model.beds];
      const foundIndex = mutatableBedsArray.findIndex(x => x.id === updateBed.bed.id);
      mutatableBedsArray[foundIndex] = updateBed.bed;

      this.set('model.beds', mutatableBedsArray);
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

    const selectedBedId = this.bedInMemory.bed.id;

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
