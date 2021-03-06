import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {

    selectedBoatTypeId = '';
    searchOptions = [];

    // Private
    error = undefined;

    @wire(getBoatTypes)
    wiredBoatTypes({ error, data }) {
        if (data) {
            var i = 0;
            for(i=0; i<data.length; i++)  {
                const option = {
                    label: data[i].Name,
                    value: data[i].Id
                };
                this.searchOptions = [...this.searchOptions , option];
            }

            this.searchOptions.unshift({ label: 'All Types', value: '' });
        }
        else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.target.value;

        // Create the const searchEvent, must be the new custom event search
        const eventData = {
            boatTypeId : this.selectedBoatTypeId
        }
        const searchEvent = new CustomEvent('search', { detail: eventData });
        this.dispatchEvent(searchEvent);
    }

}