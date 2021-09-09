import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';


export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;

    // Handles loading event
    handleLoading() { }

    // Handles done loading event
    handleDoneLoading() { }

    // This custom event comes from the form (child)
    searchBoats(event) {
        console.log(event.detail.boatTypeId);
        this.isLoading = true;
        getBoats({boatTypeId: event.detail.boatTypeId})
            .then(result => {
                console.log('success');
                console.log(result);
                //const eventLoading
                this.isLoading = false;
            })
            .catch(error => {
                console.log('error');
                this.isLoading = false;
            })
    }

    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });
    }
}