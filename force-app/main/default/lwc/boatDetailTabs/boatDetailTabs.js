import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import Details from '@salesforce/label/c.Details';
import Full_Details from '@salesforce/label/c.Full_Details';
import Reviews from '@salesforce/label/c.Reviews';
import Add_Review from '@salesforce/label/c.Add_Review';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

import { APPLICATION_SCOPE,subscribe,MessageContext,unsubscribe } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {

    @api boatId;
    reviews;

    label = {
        Details,
        Full_Details,
        Reviews,
        Add_Review,
        labelPleaseSelectABoat
    };

    // Private
    subscription = null;

    @wire(getRecord, { recordId:'$boatId', fields:BOAT_FIELDS })
    wiredRecord;

    @wire(MessageContext)
    messageContext;

    // Subscribe to the message channel
    subscribeMC() {
        // local boatId must receive the recordId from the message
    }

    // Calls subscribeMC()
    connectedCallback() { }

    get boatName() {
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
    }

    get detailsTabIconName() {
        if(this.wiredRecord.data) {
            return 'utility:anchor';
        }
        else {
            return null;
        }
    }

    navigateToRecordViewPage(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                objectApiName: 'Boat__c', // objectApiName is optional
                actionName: 'view'
            }
        });
    }

    // Navigates back to the review list, and refreshes reviews component
    handleReviewCreated() { }
}