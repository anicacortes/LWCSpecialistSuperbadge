import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';


export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;

    // Handles loading event
    handleLoading() {
        console.log('parent-spinner true');
        this.isLoading = true;
    }

    // Handles done loading event
    handleDoneLoading() {
         this.isLoading = false;
    }

    // This custom event comes from the form (child)
    searchBoats(event) {
        console.log('>> search boats from parent');
        console.log(event.detail.boatTypeId);
        this.isLoading = true;
        this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId);
        //searchBoats
        /*getBoats({boatTypeId: event.detail.boatTypeId})
            .then(result => {
                console.log('success');
                console.log(result);
                //const eventLoading
                this.isLoading = false;
            })
            .catch(error => {
                console.log('error');
                this.isLoading = false;
            })*/
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