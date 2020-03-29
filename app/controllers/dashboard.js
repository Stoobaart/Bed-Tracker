import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UseQrCodeSystem from 'bed-tracker/gql/mutations/use-qr-code-system';
import UpdateNumberOfBeds from 'bed-tracker/gql/mutations/update-number-of-beds';

export default class DashboardController extends Controller {
  @service apollo;

  @tracked totalBeds = this.model.hospital.totalBeds;
  @tracked availableBeds = this.model.hospital.availableBeds;
  @tracked noOfBedsToEditAvailabiity = null;
  @tracked makeBedsAvailable = true;
  @tracked errorMessage = null;

  get valuesHaveChanged() {
    if (this.totalBeds != this.model.hospital.totalBeds || this.availableBeds != this.model.hospital.availableBeds) {
      return true;
    } else {
      return false;
    }
  }

  @action
  updateBedNumber() {
    if (this.availableBeds > this.totalBeds) {
      alert('The available beds cannot be more than the total beds, you idiot');
    } else {
      alert(`You're submitting ${this.availableBeds} available beds and ${this.totalBeds} Total beds`);
    }
  }

  @action
  async setQrCodeSystem(value) {
    const variables = {
      input: {
        useQrCode: value
      }
    }

    try {
      const response = await this.apollo.mutate({ mutation: UseQrCodeSystem, variables });
      this.model = response.useQrCodeSystem;
    } catch (error) {
      console.error(error);
    }
  }

  @action
  async editBedsAvailability(event) {
    event.preventDefault();

    let updatedAvailableBeds;

    if (this.makeBedsAvailable) {
      updatedAvailableBeds = this.availableBeds + JSON.parse(this.noOfBedsToEditAvailabiity);
    } else {
      updatedAvailableBeds = this.availableBeds - JSON.parse(this.noOfBedsToEditAvailabiity);
    }

    if (updatedAvailableBeds > this.totalBeds) {
      this.errorMessage = 'Available beds cannot exceed the total number of beds';
    } else if (updatedAvailableBeds < 0) {
      this.errorMessage = 'Available beds cannot be less than 0';
    } else {
      const variables = {
        input: {
          numberOfAvailableBeds: updatedAvailableBeds,
          numberOfTotalBeds: this.totalBeds,
        }
      }
  
      try {
        await this.apollo.mutate({ mutation: UpdateNumberOfBeds, variables });
        this.availableBeds = updatedAvailableBeds;
        this.noOfBedsToEditAvailabiity = null;
        this.errorMessage = null;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
