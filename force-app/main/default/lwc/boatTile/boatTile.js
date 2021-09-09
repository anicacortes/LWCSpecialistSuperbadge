import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId; //??

    //backgroundUrl = this.boat.Boat_Image__c;

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
    }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        return this.selectedBoatId == undefined ? 'tile-wrapper' : 'tile-wrapper selected';
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat(event) {
        console.log('selected boat');
        console.log(this.boat);
        console.log(this.selectedBoatId);
        console.log(event.target.detail);
        console.log(event.detail.value);

        //this.boat = ?

        const boatSelectedEvent = new CustomEvent('boatselect', { detail: boat });
        this.dispatchEvent(searchEvent);

    }
}