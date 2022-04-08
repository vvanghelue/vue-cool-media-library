<template>
  <h1>Basic example</h1>
  <!-- Basic Example -->
  <div class="my-parent-container">
    <LhhMediaLibrary
      ref="mediatekExample1"
      :___onDelete="(uid, blob) => dispatch()"
      :___onAdd="(blob) => dispatch()"
      :___onUpdate="(uid, blob) => dispatch()"
      :canSelectMultiple="true"
      :backendCreate="backendCreateLogic"
      :backendUpdateLogic="backendUpdateLogic"
      @files-selected="(files) => (demo1SelectedFiles = files)"
    />
  </div>
  <br />
  <button>select {{ demo1SelectedFiles.length }} items</button>

  <div style="height: 70px"></div>

  <h1>Example for alexandre</h1>
  <Button
    label="Select medias"
    icon="pi pi-external-link"
    @click="openModal1 = true"
  />
  <Dialog
    header="Select medias"
    v-model:visible="openModal1"
    :style="{ minWidth: '50vw', maxWidth: '80vw' }"
  >
    <LhhMediaLibrary
      ref="mediatekExample2"
      :displayAddButton="true"
      :onFileSelected="(files) => (demo2SelectedFiles = files)"
    />
    <div style="height: 30px"></div>
    <template #footer>
      <Button
        :label="`Select ${demo2SelectedFiles.length} medias`"
        icon="pi pi-external-link"
        @click="openModal1 = true"
      />
    </template>
  </Dialog>
</template>

<script>
import LhhMediaLibrary from './LhhMediaLibrary/LhhMediaLibrary.vue';
import lhhMultipartFileUploader from './LhhMediaLibrary/file-uploader';
import generateFakeInputData from './generate-fake-input-data';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

function backendCreateLogic({ file, onProgress, onResponse }) {
  lhhMultipartFileUploader({
    method: 'POST',
    url: 'https://lhh-file-upload.vvanghelue.repl.co/my-cool-api/create_media',
    form: {
      file: file.blob,
      file_name: file.name,
    },
    //multipartFormMimeTypeName: 'mime-type',
    onUploadProgress: (percentProgress) => {
      onProgress(percentProgress);
    },
    onUploadResponse: (responseText) => {
      const body = JSON.parse(responseText);
      onResponse({
        url: body.media.url,
        name: body.media.file_image,
        meta: {
          id: body.id,
        },
      });
    },
  });
}

function backendUpdateLogic({
  blob,
  name,
  extension,
  fileMeta,
  onProgress,
  onResponse,
}) {
  lhhMultipartFileUploader({
    blob,
    name,
    extension,
    fileMeta,
    method: 'PUT',
    url: `https://lhh-file-upload.vvanghelue.repl.co/my-cool-api/update_media/${fileMeta.id}`,
    multipartFormFileKey: 'file',
    multipartFormNameKey: 'file_name',
    multipartFormFileExtensionKey: 'file_extension',
    //multipartFormMimeTypeName: 'mime-type',
    onUploadProgress: (percentProgress) => {
      onProgress(percentProgress);
    },
    onUploadResponse: (responseText) => {
      const body = JSON.parse(responseText);
      onResponse({
        url: body.url,
        isImage: body.is_image,
        name: body.file_image,
        extension: body.file_extension,
        meta: {
          id: body.id,
        },
      });
    },
  });
}

export default {
  components: {
    LhhMediaLibrary,
    Dialog,
    Button,
  },
  data() {
    return {
      backendCreateLogic,
      backendUpdateLogic,
      demo1SelectedFiles: [],
      demo2SelectedFiles: [],
      openModal1: false,
      exampleExistingFiles: [],
    };
  },
  async mounted() {
    /*
    const serverFiles = await (
      await fetch(
        'https://lhh-file-upload.vvanghelue.repl.co/my-cool-api/get_all_medias'
      )
    ).json();
    const existingFiles = serverFiles.allMedias.map((i) => {
      return {
        url: i.url,
        isImage: i.is_image,
        name: i.file_name,
        extension: i.file_extension,
        meta: {
          id: i.id,
        },
      };
    });
    */
    const folder = {
      isRootFolder: true,
      type: 'folder',
      name: 'My files',
      children: generateFakeInputData(),
    };
    this.$refs.mediatekExample1.setRootFolder(folder);
    this.$refs.mediatekExample1.openFolder(folder);
  },
  methods: {
    testButton1Click(newFiles) {
      console.log('new files aded !', this.$refs.mediatekExample1.getFiles());
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 30px;
}
/*.my-parent-container .lhh-media-library {*/
:root .lhh-media-library {
  --lhh-media-library-color-1: 109, 64, 168 !important;
  --lhh-media-library-color-2: 109, 64, 168 !important;
  --lhh-media-library-color-2: 30, 220, 30 !important;
}
</style>
