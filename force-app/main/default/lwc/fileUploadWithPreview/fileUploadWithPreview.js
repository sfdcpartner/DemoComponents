import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from 'lightning/platformResourceLoader';
import MyModal from 'c/imageModal';
export default class FileUploadWithPreview extends LightningElement {
    @track selectedFiles = [];

    // Handle file selection
    handleFileSelection(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                this.selectedFiles = [...this.selectedFiles, {
                    id: Date.now() + file.name,
                    name: file.name,
                    size: file.size,
                    fileData: file,
                    previewUrl: reader.result
                }];
            };
            reader.readAsDataURL(file);
        });
    }

    // Remove selected file
    removeFile(event) {
        const index = event.currentTarget.dataset.index;
        this.selectedFiles = this.selectedFiles.filter((_, i) => i != index);
    }

    // Upload files to server
    async uploadFiles() {
        for (let fileObj of this.selectedFiles) {
            const { fileData } = fileObj;
            try {
                await this.uploadFile(fileData);
            } catch (error) {
                console.error(`Error uploading ${fileObj.name}:`, error);
            }
        }
        this.selectedFiles = [];
        this.showToast('Success', 'Files uploaded successfully.', 'success');
    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Uploading file: ${file.name}`);
                resolve();
            }, 1000);
        });
    }

    // Handle image click to open modal
    handleImageClick(event) {
        const index = event.currentTarget.dataset.index;
        const file = this.selectedFiles[index];

        if (file?.previewUrl) {
            // Open modal dynamically and pass image URL
            this.openModal(file.previewUrl);
        }
    }

    // Open modal and pass image URL
    async openModal(imageUrl) {
        const result = await MyModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'medium',
            imageUrl: imageUrl
        });
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);

        // const modal = await import("lightning/modal")
        //     .then((modalModule) => modalModule.default);

        // modal.open({
        //     // Component to open in modal
        //     label: "Image Preview",
        //     content: imageModal,
        //     size: "medium",
        //     initialValues: {
        //         imageUrl: imageUrl
        //     }
        // });
    }

    // Show toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

}