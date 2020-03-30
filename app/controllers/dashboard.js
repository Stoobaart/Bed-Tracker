import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UseQrCodeSystem from 'bed-tracker/gql/mutations/use-qr-code-system';
import UpdateNumberOfBeds from 'bed-tracker/gql/mutations/update-number-of-beds';
import RegisterBeds from 'bed-tracker/gql/mutations/register-beds';
import ActivateBedMutation from 'bed-tracker/gql/mutations/activate-bed';
import QRCode from 'qrcode';

export default class DashboardController extends Controller {
  @service apollo;
  @service printThis;

  @tracked useQrCode = null;
  @tracked totalBeds = this.model.hospital.totalBeds;
  @tracked totalQrBeds = this.model.hospital.beds ? this.model.hospital.beds.length : 0;
  @tracked availableBeds = this.model.hospital.availableBeds;
  @tracked noOfBedsToEditAvailabiity = null;
  @tracked makeBedsAvailable = true;
  @tracked errorMessage = null;
  @tracked totalErrorMessage = null;
  @tracked showEditTotalBedsForm = false;
  @tracked showRegisterBedsForm = false;
  @tracked newNoOfTotalBeds = null;
  @tracked noOfBedsToRegister = null;
  @tracked qrCode = null;
  @tracked beds = this.model.hospital.beds;

  get availableBedsPercentage() {
    return  Math.round((this.availableBeds / this.totalQrBeds) * 100);
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
  async setQrCodeSystem() {
    const variables = {
      input: {
        useQrCode: this.useQrCode
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
          numberOfTotalBeds: JSON.parse(this.totalBeds),
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

  @action
  async editTotalBeds(event) {
    event.preventDefault();

    if (this.newNoOfTotalBeds < this.availableBeds) {
      this.totalErrorMessage = 'Total beds cannot be less than available beds';
    } else {
      const variables = {
        input: {
          numberOfAvailableBeds: this.availableBeds,
          numberOfTotalBeds: JSON.parse(this.newNoOfTotalBeds),
        }
      }

      try {
        await this.apollo.mutate({ mutation: UpdateNumberOfBeds, variables });
        this.totalBeds = this.newNoOfTotalBeds;
        this.newNoOfTotalBeds = null;
        this.totalErrorMessage = null;
        this.showEditTotalBedsForm = false;
      } catch (error) {
        console.error(error);
      }
    }
  }

  @action
  async registerBeds(event) {
    event.preventDefault();

    const variables = {
      input: {
        numberOfBeds: JSON.parse(this.noOfBedsToRegister),
      }
    }

    try {
      const response = await this.apollo.mutate({ mutation: RegisterBeds, variables });
      const newBedArray = [...this.beds];
      response.registerBeds.beds.forEach((bed) => {
        newBedArray.push(bed);
      });
      this.beds = newBedArray;
      
      this.totalQrBeds = this.totalQrBeds + JSON.parse(this.noOfBedsToRegister);
      this.noOfBedsToRegister = null;
      this.showRegisterBedsForm = false;
    } catch (error) {
      console.error(error);
    }
  }

  @action
  async printQrCode(bedId) {
    this.qrCode = await QRCode.toDataURL(bedId);
    await this.printThis.print('img.qr-code');
  }

  @action
  async activateBed(bed) {
    if (!bed.reference) {
      alert('Please enter a bed reference');
    } else {
      const tempRef = 'ABC';

      try {
        const variables = {
          input: {
            id: bed.id,
            reference: tempRef,
          }
        };
  
        await this.apollo.mutate({ mutation: ActivateBedMutation, variables });
        
        const newBeds = [
          {
            reference: tempRef,
            active: true,
            available: true,
            id: bed.id
          }
        ]
        const updatedBeds = this.beds.map(x => {
          const bed = newBeds.find(({ id }) => id === x.id);
          return bed ? bed : x;
        });
        this.beds = updatedBeds;

      } catch (error) {
        console.error(error);
      }
    }
  }
}
