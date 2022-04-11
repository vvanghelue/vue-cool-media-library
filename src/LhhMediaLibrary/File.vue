<template>
  <div
    :class="[
      'file',
      { 'file--selected': file.selected, 'file--animate-delete': isDeleting },
    ]"
  >
    <div class="file-block" @click="onFileClick">
      <div class="file-close-icon" @click="handleDeleteFile"></div>
      <div class="file-selected-icon">
        <IconChecked />
      </div>
      <div
        :class="[
          'file-preview',
          {
            'file-preview--image': file.imagePreview,
          },
        ]"
        :style="{
          backgroundImage: isImage ? `url(${file.imagePreview})` : undefined,
        }"
      >
        <div v-if="!isImage" class="file-preview-file-extension">
          {{ fileExtenson }}
        </div>
      </div>
      <div class="file-info">
        <div class="file-info-size">
          {{ Number(Math.round(file.sizeBytes / 1000)).toLocaleString() }}
          kb
        </div>
        <div class="file-actions" v-if="!!file.url">
          <div
            v-if="isImage"
            class="file-actions-button crop-action-button"
            @click="$refs.croppingModal.open(file)"
          ></div>
          <div
            class="file-actions-button download-action-button"
            @click="downloadFile"
          ></div>
        </div>
      </div>
      <div class="file-uploading-progress-bar" v-if="file.uploading">
        <div :style="{ width: `${file.uploadingProgress}%` }"></div>
      </div>
    </div>
    <div
      class="file-name"
      contenteditable
      @click="handleNameClick"
      @keyup="handleNameKeyup"
    >
      {{ file.name }}
    </div>
  </div>
  <CroppingModal
    ref="croppingModal"
    @edit-image="(params) => $emit('edit-image', params)"
  />
</template>

<script>
import CroppingModal from './cropping-modal/CroppingModal.vue';
import IconChecked from './assets/IconChecked.vue';

export default {
  components: { CroppingModal, IconChecked },
  props: ['file', 'backendCreate'],
  data() {
    return {
      isDeleting: false,
    };
  },
  computed: {
    fileExtenson() {
      return this.file.mimeType && this.file.mimeType.split('/')[1];
    },
    isImage() {
      return this.file.mimeType.includes('image/');
    },
  },
  mounted() {
    if (this.file.url) {
      if (this.file.mimeType.includes('image/')) {
        this.file.imagePreview = this.file.url;
      }
      return;
    }

    if (this.file.uploading) {
      return;
    }

    // upload file
    this.file.uploading = true;
    if (this.file.mimeType.includes('image/')) {
      this.file.imagePreview = URL.createObjectURL(this.file.blob);
    }
    // Uploadting file to server
    this.backendCreate({
      file: this.file,
      onProgress: (progressPercent) => {
        console.log('onProgress', progressPercent);
        this.file.uploadingProgress = progressPercent;
      },
      onResponse: (mediaObject) => {
        this.file.meta = mediaObject.meta;
        console.log('onResponse');
        this.file.uploading = false;
        this.file.url = mediaObject.url;

        if (this.file.mimeType.includes('image/')) {
          this.file.imagePreview = mediaObject.url;
        }
      },
    });
  },
  methods: {
    async handleDeleteFile() {
      // await new Promise((r) => setTimeout(r, 300));
      this.isDeleting = true;
      await new Promise((r) => setTimeout(r, 300));
      this.$emit('delete-file', this.file);
    },
    onFileClick(event) {
      if (event.target.classList.contains('file-close-icon')) {
        return;
      }
      if (event.target.classList.contains('download-action-button')) {
        return;
      }
      if (event.target.classList.contains('crop-action-button')) {
        return;
      }
      this.$emit('select-file', this.file);
    },
    downloadFile() {
      window.open(this.file.url, '_blank');
    },
    handleNameClick() {
      document.execCommand('selectAll', false, null);
    },
    handleNameKeyup(event) {
      if (event.key === 'Enter') {
        event.target.innerHTML = event.target.innerText.trim();
        event.target.blur();
      }
    },
  },
};
</script>

<style scoped>
.file {
  --width: 150px;
  position: relative;
  user-select: none;
  cursor: inherit;
  /*overflow: hidden;*/
  transition: 0.3s ease;
}
.file-block {
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  padding: 10px;
  width: var(--width);
  padding-bottom: 0;
}
.file-block:hover {
  border-color: transparent;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
}

.file-preview {
  __width: var(--width);
  height: 104px;
  background: #ccc;
  background: transparent;
  display: flex;
  align-items: end;
  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(./assets/file-icon.svg);
  position: relative;
}
.file-preview--image {
  background-size: contain;
}
.file-preview-file-extension {
  width: 100%;
  text-align: center;
  font-weight: 900;
  font-size: 20px;
  text-transform: uppercase;
  color: #767676;
}
.file-name {
  overflow: hidden;
  ___white-space: nowrap;
  ___text-overflow: ellipsis;
  width: var(--width);
  text-align: center;
  padding-top: 10px;
}
.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  __font-weight: bold;
  color: #aaa;
  height: 35px;
}
.file-info-extension {
  text-transform: uppercase;
}
.file--animate-delete {
  transform: scale(0.5);
  opacity: 0;
}

.file-close-icon {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 40px;
  height: 40px;
  opacity: 0;
  cursor: pointer;
  transition: 0.1s ease;
  background-image: url(./assets/close-icon.svg);
  background-position: center center;
  background-size: cover;
  background-size: 30px 30px;
  background-repeat: no-repeat;
  transform: scale(0.8);
}
.file-block:hover .file-close-icon {
  opacity: 1;
  transform: scale(1);
}
.file--selected .file-block,
.file--selected:hover .file-block {
  box-shadow: 0 0 0 3px rgb(var(--lhh-media-library-color-2));
  border-color: rgb(var(--lhh-media-library-color-2));
}
.file-selected-icon {
  position: absolute;
  left: -13px;
  top: -13px;
  opacity: 0;
  cursor: pointer;
  __transition: 0.1s ease;
  /*
  background-size: cover;
  background-size: 30px 30px;
  background-repeat: no-repeat;
  background-image: url(./assets/checked-icon.svg);
  background-position: center center;
  */
}
.file--selected .file-selected-icon {
  opacity: 1;
}

.file-actions {
  display: flex;
}
.file-actions-button {
  width: 35px;
  height: 35px;
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  /*transition: 0.3s ease;*/
  /*transform: scale(0.999);*/
  opacity: 0.5;
}
.file-actions-button:hover {
  /*transform: scale(1.2);*/
  opacity: 1;
}
.crop-action-button {
  background-image: url(./assets/crop-icon-2.svg);
}
.download-action-button {
  background-image: url(./assets/file-download.svg);
}

.file-uploading-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.03);
}
.file-uploading-progress-bar,
.file-uploading-progress-bar > div {
  height: 5px;
}
.file-uploading-progress-bar > div {
  background: #4287f5;
}
</style>
