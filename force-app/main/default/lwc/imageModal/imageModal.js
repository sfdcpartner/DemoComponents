import { api } from 'lwc';
import LightningModal from 'lightning/modal';
export default class ImageModal extends LightningModal  {
    @api imageUrl; // Image URL passed from the main component

    handleOkay() {
        this.close('okay');
    }
}