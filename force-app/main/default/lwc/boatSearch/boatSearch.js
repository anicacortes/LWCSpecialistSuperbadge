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
        isLoading = true;
        getBoats({boatTypeId: event.detail.boatTypeId})
            .then(result => {
                //const eventLoading
                isLoading = false;
            })
            .catch(error => {

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