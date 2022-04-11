<template>
  <div class="cropping-modal-container" v-if="isOpen">
    <div class="cropping-modal">
      <div class="cropping-modal-header">
        <div class="cropping-modal-title">Edit Image</div>
        <div class="cropping-modal-close-icon" @click="isOpen = false"></div>
      </div>
      <div class="cropping-container">
        <div v-if="isLoading" class="lhh-media-library-loader"></div>
        <img :src="imageDataURI" ref="imageToEdit" />
      </div>
      <div style="padding: 10px 0; text-align: right">
        <button @click="exportCrop">Ok</button>
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
        file: this.currentEditedFile,
        newBlob: blob,
      });
    },
  },
};
</script>

<style scoped>
.cropping-modal-container {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  __width: 100vw;
  __height: 100vh;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cropping-modal {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  __max-width: 800px;
  min-height: 300px;
  min-width: 400px;
  padding: 15px;
}
.cropping-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}
.cropping-modal-title {
  font-size: 23px;
  font-weight: bold;
}
.cropping-modal-close-icon {
  width: 40px;
  height: 40px;
  background-size: 24px 24px;
  cursor: pointer;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url('../assets/close-icon-modal.svg');
}
.cropping-container {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cropping-container img {
  min-width: 50vw;
  max-width: 70vw;
  max-height: 80vh;
}
</style>
