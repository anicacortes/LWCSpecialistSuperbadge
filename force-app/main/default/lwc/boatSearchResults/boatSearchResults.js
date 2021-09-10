import { LightningElement, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {

    boats = [];
    selectedBoatId;
    columns = [];
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
    refresh() { }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        console.log('result parent selected_');
        console.log(event.detail);
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
    handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then(() => {})
    .catch(error => {})
    .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) { }
}