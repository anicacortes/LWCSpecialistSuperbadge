import { LightningElement, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {

    boatId;
    boatReviews = [];
    isLoading = false;
    error;

    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() {
        return this.boatId;
    }

    set recordId(value) {
        this.boatId = value;
        this.getReviews();
    }

    getReviews() {
        if(!this.boatId) return;

        this.isLoading = true;
        getAllReviews({boatId: '$boatId'})
        .then(result => {
            this.boatReviews = result;
            this.isLoading = false;
        })
        .catch(error => {
            this.isLoading = false;
            this.error = error;
        })
    }

    get reviewsToShow() {
        return this.boatReviews && this.boatReviews.length > 0 ? true : false;
    }

   @api refresh() {
       refreshApex(this.getReviews());
   }

    navigateToRecord(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.recordId,
                objectApiName: 'User',
                actionName: 'view'
            }
        });
    }
}