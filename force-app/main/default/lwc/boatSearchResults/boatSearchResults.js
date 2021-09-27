import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import { publish, APPLICATION_SCOPE,subscribe,MessageContext,unsubscribe } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

const COLUMNS = [
     {label: 'Name', fieldName: 'Name', type: 'text', editable : 'true'},
     {label: 'Length', fieldName: 'Length__c', type: 'number', editable : 'true'},
     {label: 'Price', fieldName: 'Price__c', type: 'currency', editable : 'true'},
     {label: 'Description', fieldName: 'Description__c', editable : 'true'}
];

export default class BoatSearchResults extends LightningElement {

//spinner here?

    @track boats = [];
    selectedBoatId;
    columns = COLUMNS;
    boatTypeId = '';
    isLoading = false;

    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId : '$boatTypeId'})
    wiredBoats({data, error}) {
        if(data) {
            console.log('>> Got all boats');
            this.boats = data;
        }
        else {
            this.boats = undefined;
        }
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api
    searchBoats(boatTypeId) {
        console.log('>> search boats in child');
        console.log(boatTypeId);
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    async refresh() {
        console.log('>> loading = true');
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        console.log('>> loading = false');
        this.notifyLoading(this.isLoading);

    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        console.log('>> parent: boat selected');
        console.log(event.detail);
        console.log(event.target);

        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        // explicitly pass boatId to the parameter recordId ??
        publish(this.messageContext, BoatMC, { recordId : boatId });
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