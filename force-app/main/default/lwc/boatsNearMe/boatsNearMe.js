import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

const ERROR_VARIANT = 'error';
const ERROR_TITLE = 'Error loading Boats Near Me';
const LABEL_YOU_ARE_HERE = 'You are here';
const ICON_STANDARD_USER = 'standard:user';

export default class BoatsNearMe extends LightningElement {

    @api boatTypeId;
    @track isRendered = true;
    listMarkers = [];
    @track mapMarkers = [];
    isLoading = true;

    latitude;
    longitude;

    @wire(getBoatsByLocation, {latitude: this.listMarkers[0].location.latitude, longitude: this.listMarkers[0].location.longitude, boatTypeId: this.boatTypeId})
    wiredBoatsJSON({error, data}) {
        if(data) {
            console.log('>> result from apex location:');
            console.log(data);
            this.createMapMarkers(data);
        }
        else {
            this.isLoading = false;
            const event = new ShowToastEvent({
                title: ERROR_TITLE,
                variant: ERROR_VARIANT
            });
            this.dispatchEvent(event);
        }
    }

    renderedCallback() {
        console.log('>> Rendered');
        if(this.isRendered) {
            this.isLoading = true;
            this.isRendered = false;
            this.getLocationFromBrowser();
        }
    }

    getLocationFromBrowser() {
        if(navigator.geolocation) {
            console.log('>> location from browser');
            navigator.geolocation.getCurrentPosition(position => {
                 // Get the Latitude and Longitude from Geolocation API
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            })
        }
    }



    createMapMarkers(boatData) {
        // const newMarkers = boatData.map(boat => {...});
        // newMarkers.unshift({...});

        for(var i = 0; i < boatData.length; i++) {
            var newMarker = {
                location: {
                    Latitude: boatData[i].Geolocation__Latitude__s,
                    Longitude: boatData[i].Geolocation__Longitude__s
                },
                title: boatData[i].Name,
                icon: ICON_STANDARD_USER
            }
            this.mapMarkers = [...this.mapMarkers, newMarker];
        }

        const firstElement = {
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        };

        this.mapMarkers.unshift(firstElement);
        console.log(this.mapMarkers);

        this.isLoading = false;
    }
}