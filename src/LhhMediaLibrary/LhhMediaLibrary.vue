<template>
  <div
    :class="[
      'lhh-media-library',
      {
        'lhh-media-library--empty':
          [].concat(shownFiles).concat(shownFolders).length === 0,
      },
      {
        'lhh-media-library--dragover': isDragOver,
      },
    ]"
    droppable="true"
    @drop="handleDrop"
    @dragover="allowDrop"
    @dragleave="onDragLeave"
  >
    <div class="lhh-media-library-top">
      <div class="lhh-media-library-top-left">
        <div class="lhh-media-library-top-left-buttons">
          <div
            class="top-left-button add-file-button"
            @click="$refs.newFileInputElement.click()"
          >
            <div class="top-left-button-add-icon"></div>
            Add file
          </div>
          <div class="top-left-button add-folder-button" @click="addNewFolder">
            <div class="top-left-button-add-icon"></div>
            Add folder
          </div>
        </div>
        <BreadCrumb
          :rootFolder="rootFolder"
          :currentOpenedFolder="currentOpenedFolder"
          :onOpenFolder="openFolder"
          ref="breadCrumb"
        />
      </div>
      <div class="lhh-media-library-top-right">
        <div v-if="areFilesUploading" class="lhh-media-library-loader"></div>
      </div>
    </div>

    <div class="lhh-media-library-content" ref="fileList">
      <div
        v-if="[].concat(shownFiles).concat(shownFolders).length === 0"
        class=""
      >
        Drop files here, or click on "Add file"
      </div>

      <!-- display folders and files -->
      <div
        class="lhh-media-library-content-item"
        v-for="(folder, index) of shownFolders"
        :key="folder"
      >
        <Folder
          :folder="folder"
          :onOpenFolder="openFolder"
          @open-folder="openFolder"
          @delete-folder="onDeleteFolder"
          :ref="index === shownFolders.length - 1 ? 'folder-last' : 'none'"
          @file-dropped="() => onFileDroppedOnFolder(folder)"
        />
      </div>
      <div
        class="lhh-media-library-content-item"
        v-for="file of shownFiles"
        :key="file"
      >
        <File
          :file="file"
          :backendCreate="backendCreate"
          @delete-file="onDeleteFile"
          @select-file="onSelectFile"
          @start-dragging="currentFileDragging = file"
        />
      </div>
    </div>
  </div>
  <input
    class="lhh-media-library-input-file"
    type="file"
    ref="newFileInputElement"
    :multiple="canSelectMultiple"
    @change="onInputFile"
  />
</template>

<script>
// https://fengyuanchen.github.io/cropperjs/
import File from './File.vue';
import Folder from './Folder.vue';
import BreadCrumb from './BreadCrumb.vue';

/*
// Not used anymore ... use URL.createObjectURL(object) instead...

function getImageDataURI(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.readAsDataURL(blob);
  });
}
*/

function fileToBlob(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const blob = new Blob([new Uint8Array(e.target.result)], {
        type: file.mimeType,
      });
      resolve(blob);
    };
    reader.readAsArrayBuffer(file);
  });
}

// const mapMimeExtension = {
//  'image/jpeg': 'jpg',
//  'image/jpg': 'jpg',
//  'image/png': 'png',
//  'image/svg+xml': 'svg',
//  'application/pdf': 'pdf',
//  'application/vnd.openxml': 'docx',
// };

// function getFileExtension(name) {
//   return name.split('.')[name.split('.').length - 1];
// }

// function createFile({ blob, name, mime }) {}

const DEFAULT_FOLDER = {
  name: 'All files',
  type: 'folder',
  children: [],
};

export default {
  components: { File, BreadCrumb, Folder },
  emits: ['files-selected'],
  props: {
    canSelectMultiple: {
      type: Boolean,
      default: false,
    },
    onFileSelected: {
      type: Function,
      default: () => () => {},
    },
    backendCreate: {
      type: Function,
      default: () => () => console.log('No backendCreate method implemented !'),
    },
    backendUpdate: {
      type: Function,
      default: () => () => console.log('No backendUpdate method implemented !'),
    },
    backendDelete: {
      type: Function,
      default: () => () => console.log('No backendDelete method implemented !'),
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const rootFolder = {
      ...DEFAULT_FOLDER,
      children: this.items,
    };
    return {
      isDragOver: false,
      rootFolder,
      currentOpenedFolder: rootFolder,
      currentFileDragging: null,
    };
  },
  watch: {
    // when "items" props change, we update the internal structure
    items(freshItems) {
      this.rootFolder = {
        ...DEFAULT_FOLDER,
        children: freshItems,
      };
      this.currentOpenedFolder = this.rootFolder;
    },
  },
  mounted() {
    // showItems(this.files)
  },
  computed: {
    /*
    rootFolder() {
      return {
        name: 'My files',
        type: 'folder',
        children: this.items,
      };
    },
    currentOpenedFolder() {
      return this.rootFolder;
    }, */
    shownFolders() {
      // if (!this.currentOpenedFolder) {
      //  return [];
      // }
      return this.currentOpenedFolder.children.filter(
        (i) => i.type === 'folder'
      );
    },
    shownFiles() {
      // if (!this.currentOpenedFolder) {
      //  return [];
      // }
      return this.currentOpenedFolder.children.filter((i) => i.type === 'file');
    },
    areFilesUploading() {
      for (const file of this.shownFiles) {
        if (file.uploading) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    onFileDroppedOnFolder(folder) {
      this.currentOpenedFolder.children =
        this.currentOpenedFolder.children.filter(
          (i) => i !== this.currentFileDragging
        );
      folder.children.push(this.currentFileDragging);
    },
    allowDrop(event) {
      event.preventDefault();
      if (
        event.dataTransfer.items[0] &&
        event.dataTransfer.items[0].kind === 'file'
      ) {
        this.isDragOver = true;
      }
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        this.addFiles(event.dataTransfer.files);
        this.scrollIntoContentEnd();
      } else {
        console.log('handleDrop not files !!');
        console.log(event.dataTransfer.items[0]);
        console.log(event.dataTransfer.getData('text'));
      }
      // const target = event.currentTarget;
      this.isDragOver = false;
    },
    openFolder(folder) {
      this.currentOpenedFolder = folder;
    },
    onInputFile(event) {
      this.addFiles(event.target.files);
      setTimeout(() => {
        this.scrollIntoContentEnd();
      }, 500);
    },
    scrollIntoContentEnd() {
      this.$refs.fileList.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    },
    async addFiles(files) {
      for (const rawFile of files) {
        console.log('adding file', rawFile);
        const blob = await fileToBlob(rawFile);

        const file = {
          type: 'file',
          blob,
          name: rawFile.name.split('.').slice(0, -1).join('.'),
          mimeType: rawFile.type,
          sizeBytes: rawFile.size,
          uploading: false,
          uploadingProgress: 0,
          meta: {
            // here will come custom backend fields
          },
        };
        this.currentOpenedFolder.children.push(file);

        // wtf vue.js ???
        // file =
        //   this.currentOpenedFolder.children[
        //     this.currentOpenedFolder.children.length - 1
        //   ];
      }
    },
    onDeleteFile(file) {
      console.log('onDeleteFile', file);
      // this.items = this.items.filter((i) => i !== file);
      function searchInFolder(parentFolder) {
        const fildFoundInChildren = !!parentFolder.children.find(
          (i) => i === file
        );
        if (fildFoundInChildren) {
          // we remove the file
          parentFolder.children = parentFolder.children.filter(
            (i) => i !== file
          );
          return;
        }
        for (const childFolder of parentFolder.children.filter(
          (i) => i.type === 'folder'
        )) {
          searchInFolder(childFolder);
        }
      }
      searchInFolder(this.rootFolder);
      console.log('@TODO manage onDeleteFile call to backend !!');
    },
    onDeleteFolder(folder) {
      console.log('onDeleteFolder', folder);
      function searchInFolder(parentFolder) {
        const fildFoundInChildren = !!parentFolder.children.find(
          (i) => i === folder
        );
        if (fildFoundInChildren) {
          // we remove the folder
          parentFolder.children = parentFolder.children.filter(
            (i) => i !== folder
          );
          return;
        }
        for (const childFolder of parentFolder.children.filter(
          (i) => i.type === 'folder'
        )) {
          searchInFolder(childFolder);
        }
      }
      searchInFolder(this.rootFolder);
      console.log('@TODO manage onDeleteFolder call to backend !!');
    },
    onSelectFile(file) {
      if (!this.canSelectMultiple) {
        for (const childFile of this.getAllFilesRecursively()) {
          childFile.selected = false;
        }
      }
      file.selected = !file.selected;
      // this.onFileSelected(alreadySelectedItems);
      this.$emit(
        'files-selected',
        this.getAllFilesRecursively().filter((i) => i.selected === true)
      );
    },
    addNewFolder() {
      this.currentOpenedFolder.children.push({
        type: 'folder',
        name: 'My new folder',
        children: [],
      });

      // scroll to folder position

      setTimeout(() => {
        this.$refs['folder-last'] &&
          this.$refs['folder-last'][0] &&
          this.$refs['folder-last'][0].scrollAndFocusEditName();
      });
    },
    getAllFilesRecursively() {
      const files = [];
      function crawlFolder(parentFolder) {
        files.push(...parentFolder.children.filter((i) => i.type === 'file'));
        for (const childFolder of parentFolder.children.filter(
          (i) => i.type === 'folder'
        )) {
          crawlFolder(childFolder);
        }
      }
      crawlFolder(this.rootFolder);
      return files;
    },
  },
};
</script>

<style scoped>
.lhh-media-library {
  border: 5px dashed #eee;
  background: rgba(0, 0, 0, 0.015);
  transition: 0.3s ease;
  __cursor: pointer;
  padding: 5px;
  position: relative;
}
.lhh-media-library * {
  box-sizing: border-box;
}
.lhh-media-library-input-file {
  width: 1px;
  height: 1px;
  opacity: 0;
}
.lhh-media-library:hover {
  border-color: rgba(var(--lhh-media-library-color-1), 0.08);
  background-color: rgba(var(--lhh-media-library-color-1), 0.05);
}
.lhh-media-library--dragover,
.lhh-media-library--dragover:hover {
  border-color: rgb(var(--lhh-media-library-color-1));
  background-color: rgba(var(--lhh-media-library-color-1), 0.1);
}
.lhh-media-library-top {
  display: flex;
  /*align-items: center;*/
  justify-content: space-between;
  padding-left: 25px;
  padding-top: 20px;
  padding-bottom: 10px;
}
.lhh-media-library-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 200px;
}
.lhh-media-library--empty .lhh-media-library-content {
  justify-content: center;
}
.lhh-media-library-content-item {
  width: 200px;
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 10px;
}
.lhh-media-library-top-left {
}
.lhh-media-library-top-left-buttons {
  display: flex;
  align-items: center;
}

.top-left-button {
  background: #000;
  color: #fff;
  line-height: 30px;
  border-radius: 99px;
  padding: 0 15px;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.top-left-button:hover {
  border: 2px solid #333;
}
.top-left-button-add-icon {
  width: 24px;
  height: 24px;
  margin-right: 7px;
  background-image: url('./assets/add-plus-icon.svg');
}
.add-file-button {
  background: #fff;
  border: 2px solid rgb(var(--lhh-media-library-color-3));
  color: #333;
}
.add-folder-button {
  border: 2px solid rgb(var(--lhh-media-library-color-3));
  background: rgba(var(--lhh-media-library-color-3), 0.2);
  color: #333;
}

.lhh-media-library-top-right {
  padding: 0 20px;
}
</style>

<style>
/* Global Library Style, used in other components */

/* You can override theses CSS variables to customize the library  */
:root .lhh-media-library {
  --lhh-media-library-color-1: 66, 173, 255;
  --lhh-media-library-color-2: 98, 239, 159;
  --lhh-media-library-color-3: 109, 194, 255;
}

/* LOADER --> */
@keyframes loader-spin {
  to {
    transform: rotate(360deg);
  }
}
.lhh-media-library-loader {
  content: '';
  display: inline-block;
  animation: loader-spin 0.3s linear infinite;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  height: 20px;
  width: 20px;
  box-sizing: border-box;
}
/* <-- LOADER */

/* MODAL --> */
.lhh-media-library-modal-container {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
.lhh-media-library-modal {
  background: white;
  border-radius: 7px;
  min-width: 200px;
  min-height: 100px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  position: relative;
  padding: 15px;
}
.lhh-media-library-modal-title {
  font-size: 24px;
  padding-bottom: 10px;
  font-weight: bold;
}
.lhh-media-library-modal-content {
}
.lhh-media-library-modal-bottom {
  padding-top: 10px;
}
.lhh-media-library-modal-close-icon {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 40px;
  height: 40px;
  background: url(./assets/close-icon-modal.svg) center center no-repeat;
}
/* <-- MODAL */

/* BUTTONS --> */
.lhh-media-library-button {
  border: 1px solid transparent;
  display: inline-block;
  background: #000;
  color: #fff;
  border-radius: 99px;
  line-height: 35px;
  padding: 0 25px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}
/* <-- BUTTONS */
</style>
