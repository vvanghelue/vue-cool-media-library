<template>
  <div v-if="isOpen" class="lhh-media-library-modal-container">
    <div class="lhh-media-library-modal">
      <div
        class="lhh-media-library-modal-close-icon"
        @click="isOpen = false"
      ></div>
      <div class="lhh-media-library-modal-title">Crop image</div>
      <div class="lhh-media-library-modal-content">
        <div class="cropping-container">
          <div v-if="isLoading" class="lhh-media-library-loader"></div>
          <img :src="imageDataURI" ref="imageToEdit" />
        </div>
      </div>
      <div class="lhh-media-library-modal-bottom" style="text-align: right">
        <button class="lhh-media-library-button" @click="exportCrop">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import loadRemoteImage from '../_lib/load-remote-image';

/*
function loadImageDataFromFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
}
*/

export default {
  props: [],
  data() {
    return {
      isOpen: false,
      isLoading: false,
      imageDataURI: null,
      cropperInstance: null,
      currentEditedFile: null,
    };
  },
  methods: {
    async open(file) {
      this.currentEditedFile = file;
      console.log('Cropper : open file', file);
      this.isOpen = true;
      this.isLoading = true;
      // wait new Promise((r) => setTimeout(r, 4000));
      // this.isLoading = false;
      // return;
      // this.imageDataURI = await loadImageDataFromFile(file.blob);
      // await new Promise((r) => setTimeout(r, 1000));

      // this.imageDataURI = URL.createObjectURL(await loadRemoteImage(file.url));

      const remoteImage = URL.createObjectURL(await loadRemoteImage(file.url));
      this.imageDataURI = remoteImage;
      this.isLoading = false;

      await new Promise((r) => setTimeout(r, 100));

      const image = this.$refs.imageToEdit;
      // await new Promise((resolve) => {
      //   image.addEventListener('load', resolve);
      // });

      this.isLoading = false;

      return;
      this.cropperInstance = new Cropper(image, {
        checkCrossOrigin: false,
        // aspectRatio: 16 / 9,
        // crop(event) {
        //  console.log(event.detail.x);
        //  console.log(event.detail.y);
        //  console.log(event.detail.width);
        //  console.log(event.detail.height);
        //  console.log(event.detail.rotate);
        //  console.log(event.detail.scaleX);
        //  console.log(event.detail.scaleY);
        // },
      });
    },
    async exportCrop() {
      const blob = await new Promise((resolve) => {
        this.cropperInstance.getCroppedCanvas().toBlob((b) => resolve(b));
      });
      this.isOpen = false;
      this.$emit('edit-image', {
        newBlob: blob,
      });
    },
  },
};
</script>

<style scoped>
.cropping-container {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cropping-container img {
  max-height: 250px;
}
</style>
