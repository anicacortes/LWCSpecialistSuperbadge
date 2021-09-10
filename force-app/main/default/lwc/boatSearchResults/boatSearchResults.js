import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';


const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

const COLUMNS = [
     {label: 'Name', fieldName: 'Name', type: 'text', editable : 'true'},
     {label: 'Length', fieldName: 'Length__c', type: 'number', editable : 'true'},
     {label: 'Price', fieldName: 'Price__c', type: 'currency', editable : 'true'},
     {label: 'Description', fieldName: 'Description__c', editable : 'true'}
];

export default class BoatSearchResults extends LightningElement {

//spinner here?

    boats = [];
    selectedBoatId;
    columns = COLUMNS;
    boatTypeId = '';
    isLoading = false;

    // wired message context
    messageContext;

    @wire(getBoats)
    wiredBoats({data, error}) {
        if(data) {
            console.log('boats success');
            console.log(data);
            this.boats = data;
        }
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    searchBoats(boatTypeId) { }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        refreshApex(this.boats);
        this.isLoading = false;
        console.log('done loading, false');
        this.notifyLoading(this.isLoading);

    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        console.log('result parent selected_');
        console.log(event.detail);

        this.selectedBoatId = event.detail;
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        // explicitly pass boatId to the parameter recordId
    }

    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    async handleSave(event) {
        // notify loading
        const updatedFields = event.detail.draftValues;
        console.log(updatedFields);
        // Update the records via Apex
        updateBoatList({data: updatedFields})
            .then((result) => {
                console.log('success updating');
                const event = new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: MESSAGE_SHIP_IT,
                    variant: SUCCESS_VARIANT
                });
                this.dispatchEvent(event);
                this.refresh();
            })
            .catch(error => {
                console.log('error updating');
                console.log(error);
                const event = new ShowToastEvent({
                    title: ERROR_TITLE,
                    variant: ERROR_VARIANT
                });
                this.dispatchEvent(event);
            })
            .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
         if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}