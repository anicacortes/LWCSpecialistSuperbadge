import { LightningElement, track, wire } from 'lwc';
import getBoatTypesMethod from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {

    selectedBoatTypeId = '';
    searchOptions = [];

    // Private
    error = undefined;

    @wire(getBoatTypesMethod)
    wiredBoatTypes({ error, data }) {
        if (data) {
            console.log(data);
            //this.searchOptions = data;
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
            console.log(error);
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.target.value;

        // Create the const searchEvent, must be the new custom event search
        //key boatTypeId ?
        const searchEvent = new CustomEvent('search', { detail: this.selectedBoatTypeId });
        this.dispatchEvent(searchEvent);
    }

}