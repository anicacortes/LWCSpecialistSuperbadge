import { LightningElement, api, track, wire } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

export default class BoatsNearMe extends LightningElement {

    @api boatTypeId;
    @track isRendered = true;
    listMarkers = [];

    renderedCallback() {
        if(this.isRendered) {
            this.isRendered = false;
            this.getLocationFromBrowser();
        }
    }

    getLocationFromBrowser() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                 // Get the Latitude and Longitude from Geolocation API
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                this.listMarkers = [{
                    location: {
                        Latitude: latitude,
                        Longitude: longitude
                    },
                    title: 'You are here'
                }];
            })
        }
    }

    @wire(getBoatsByLocation, {latitude: this.listMarkers[0].location.latitude, longitude: this.listMarkers[0].location.longitude, boatTypeId: this.boatTypeId})
    wiredBoatsJSON({error, data}) {
        if(data) {
            console.log('>> result from apex location:');
            console.log(data);
        }
    }
}