import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
// import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
// import UseQrCodeSystem from 'bed-checker/gql/mutations/use-qr-code-system';
// import UpdateNumberOfBeds from 'bed-checker/gql/mutations/update-number-of-beds';
// import RegisterBeds from 'bed-checker/gql/mutations/register-beds';
// import UpdateBedAvailabilityMutation from 'bed-checker/gql/mutations/update-bed-availability';
// import ActivateBedMutation from 'bed-checker/gql/mutations/activate-bed';
// import RemoveBedMutation from 'bed-checker/gql/mutations/remove-bed';
// import QRCode from 'qrcode';

export default class DashboardController extends Controller {
  @service apollo;
  // @service printThis;

  // @tracked useManagement = null;
  // @tracked totalBeds = this.model.hospital.totalBeds;
  @tracked totalManagedBeds = this.model.hospital.beds ? this.model.hospital.beds.length : 0;
  @tracked availableBeds = this.model.hospital.availableBeds || 0;
  @tracked totalVentilators = this.model.hospital.totalVentilatorInUse || 0;
  @tracked totalCovidStatusNegative = this.model.hospital.totalCovidStatusNegative || 0;
  @tracked totalCovidStatusPositive = this.model.hospital.totalCovidStatusPositive || 0;
  @tracked totalCovidStatusSuspected = this.model.hospital.totalCovidStatusSuspected || 0;
  // @tracked noOfBedsToEditAvailabiity = null;
  // @tracked makeBedsAvailable = true;
  // @tracked errorMessage = null;
  // @tracked totalErrorMessage = null;
  // @tracked showEditTotalBedsForm = false;
  // @tracked showRegisterBedsForm = false;
  // @tracked newNoOfTotalBeds = null;
  // @tracked noOfBedsToRegister = null;
  // @tracked qrCode = null;
  // @tracked beds = this.model.hospital.beds;
  // @tracked selectedBedInMemory = {};
  // @tracked showReferenceEntryModal = false;
  // @tracked tempReference = '';
  // @tracked showDeleteBedModal = false;

  get availableBedsPercentage() {
    if (this.totalManagedBeds === 0) {
      return 0;
    }
    
    return Math.round((this.availableBeds / this.totalManagedBeds) * 100);
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

  // get valuesHaveChanged() {
  //   if (this.totalBeds != this.model.hospital.totalBeds || this.availableBeds != this.model.hospital.availableBeds) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // @action
  // updateBedNumber() {
  //   if (this.availableBeds > this.totalBeds) {
  //     alert('The available beds cannot be more than the total beds, you idiot');
  //   } else {
  //     alert(`You're submitting ${this.availableBeds} available beds and ${this.totalBeds} Total beds`);
  //   }
  // }

  // @action
  // async setQrCodeSystem() {
  //   const variables = {
  //     input: {
  //       useManagement: this.useManagement
  //     }
  //   };
  //
  //   try {
  //     const response = await this.apollo.mutate({ mutation: UseQrCodeSystem, variables });
  //     this.model = response.useQrCodeSystem;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // @action
  // async editBedsAvailability(event) {
  //   event.preventDefault();
  //
  //   let updatedAvailableBeds;
  //
  //   if (this.makeBedsAvailable) {
  //     updatedAvailableBeds = this.availableBeds + Math.round(Math.floor(JSON.parse(this.noOfBedsToEditAvailabiity)));
  //   } else {
  //     updatedAvailableBeds = this.availableBeds - Math.round(Math.floor(JSON.parse(this.noOfBedsToEditAvailabiity)));
  //   }
  //
  //   if (updatedAvailableBeds > this.totalBeds) {
  //     this.errorMessage = 'Available beds cannot exceed the total number of beds';
  //   } else if (updatedAvailableBeds < 0) {
  //     this.errorMessage = 'Available beds cannot be less than 0';
  //   } else {
  //     const variables = {
  //       input: {
  //         numberOfAvailableBeds: updatedAvailableBeds,
  //         numberOfTotalBeds: JSON.parse(this.totalBeds),
  //       }
  //     };
  //
  //     try {
  //       await this.apollo.mutate({ mutation: UpdateNumberOfBeds, variables });
  //       this.availableBeds = updatedAvailableBeds;
  //       this.noOfBedsToEditAvailabiity = null;
  //       this.errorMessage = null;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }

  // @action
  // async editTotalBeds(event) {
  //   event.preventDefault();
  //
  //   if (this.newNoOfTotalBeds < this.availableBeds) {
  //     this.totalErrorMessage = 'Total beds cannot be less than available beds';
  //   } else {
  //     const variables = {
  //       input: {
  //         numberOfAvailableBeds: this.availableBeds,
  //         numberOfTotalBeds: JSON.parse(this.newNoOfTotalBeds),
  //       }
  //     };
  //
  //     try {
  //       await this.apollo.mutate({ mutation: UpdateNumberOfBeds, variables });
  //       this.totalBeds = Math.round(Math.floor(JSON.parse(this.newNoOfTotalBeds)));
  //       this.newNoOfTotalBeds = null;
  //       this.totalErrorMessage = null;
  //       this.showEditTotalBedsForm = false;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }

  // @action
  // resetForms() {
  //   this.newNoOfTotalBeds = null;
  //   this.noOfBedsToRegister = null;
  // }

  // @action
  // async registerBeds(event) {
  //   event.preventDefault();

  //   const variables = {
  //     input: {
  //       numberOfBeds: JSON.parse(this.noOfBedsToRegister),
  //     }
  //   };

  //   try {
  //     const response = await this.apollo.mutate({ mutation: RegisterBeds, variables });
  //     const newBedArray = [...this.beds];
  //     response.registerBeds.beds.forEach((bed) => {
  //       newBedArray.push(bed);
  //     });
  //     this.beds = newBedArray;

  //     this.totalManagedBeds = this.totalManagedBeds + JSON.parse(this.noOfBedsToRegister);
  //     this.noOfBedsToRegister = null;
  //     this.showRegisterBedsForm = false;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // @action
  // async printQrCode(bedId) {
  //   this.qrCode = await QRCode.toDataURL(bedId);
  //   await this.printThis.print('img.qr-code');
  // }
  //
  // @action
  // showReferenceModal(bed) {
  //   this.selectedBedInMemory = bed;
  //   this.showReferenceEntryModal = true;
  // }
  //
  // @action
  // showDeleteModal(bed) {
  //   this.selectedBedInMemory = bed;
  //   this.showDeleteBedModal = true;
  // }

  // @action
  // async toggleAvailability(bed, toggleChoice) {
  //   const variables = {
  //     input: {
  //       available: toggleChoice,
  //       id: bed.id
  //     }
  //   };
  //   try {
  //     await this.apollo.mutate({ mutation: UpdateBedAvailabilityMutation, variables });
  //     this.updateTable(bed, true, toggleChoice);
  //
  //     if (toggleChoice === true) {
  //       this.availableBeds++;
  //     } else {
  //       this.availableBeds--;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // @action
  // async activateBed(bed) {
  //   let reference;
  //
  //   if (bed.reference) {
  //     reference = bed.reference;
  //   } else {
  //     reference = this.tempReference;
  //   }
  //
  //   try {
  //     const variables = {
  //       input: {
  //         id: bed.id,
  //         reference,
  //       }
  //     };
  //
  //     await this.apollo.mutate({ mutation: ActivateBedMutation, variables });
  //
  //     this.updateTable(bed, true, true, reference);
  //
  //     this.selectedBedInMemory = {};
  //     this.showReferenceEntryModal = false;
  //     this.tempReference = '';
  //     this.availableBeds++;
  //
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // @action
  // cancelModal() {
  //   this.selectedBedInMemory = {};
  //   this.showDeleteBedModal = false;
  //   this.showReferenceEntryModal = false;
  //   this.tempReference = '';
  // }

  // @action
  // async removeBed() {
  //   const idToRemove = this.selectedBedInMemory.id;
  //
  //   try {
  //     const variables = {
  //       input: {
  //         id: idToRemove
  //       }
  //     };
  //
  //     await this.apollo.mutate({ mutation: RemoveBedMutation, variables });
  //
  //     const updatedBeds = this.beds.filter(x => x.id !== idToRemove);
  //     this.beds = updatedBeds;
  //
  //     this.totalManagedBeds--;
  //     this.availableBeds--;
  //     this.showDeleteBedModal = false;
  //     this.selectedBedInMemory = {};
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // updateTable(bed, active, available, newReference) {
  //   let reference = bed.reference ? bed.reference : newReference;
  //   const newBeds = [
  //     {
  //       reference,
  //       active,
  //       available,
  //       id: bed.id
  //     }
  //   ];
  //   const updatedBeds = this.beds.map(x => {
  //     const bed = newBeds.find(({ id }) => id === x.id);
  //     return bed ? bed : x;
  //   });
  //   this.beds = updatedBeds;
  // }
}
