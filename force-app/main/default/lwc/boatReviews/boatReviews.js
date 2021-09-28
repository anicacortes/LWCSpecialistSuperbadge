import { LightningElement, api } from 'lwc';

import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {

    @api boatId;
    boatReviews = [];
    isLoading;
    error;

    // Public Getter and Setter to allow for logic to run on recordId change
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
        return this.boatReviews ? true : false;
    }

   @api refresh() {
       this.getReviews();
   }

    navigateToRecord(event) {
        // Navigate to Account record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                "recordId": event.target.dataset.recordId,
                "objectApiName": "BoatReview__c",
                "actionName": "view"
            },
        });
    }
}