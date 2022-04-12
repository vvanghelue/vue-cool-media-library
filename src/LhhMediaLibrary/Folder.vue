<template>
  <div
    :class="[
      'folder',
      { 'folder--animate-open': animateOpenFolder },
      { 'folder--dragover': isDragOver },
    ]"
    @click="handleFolderClick"
    :droppable="true"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div
      class="folder-delete-icon"
      @click="deleteFolder"
      src="./assets/close-icon.svg"
    ></div>
    <IconFolder class="folder-icon" />
    <div class="folder-items-count">{{ getItemsCountRecursive }} items</div>
    <div
      class="folder-name"
      contenteditable
      @blur="onNameChange"
      @click="handleNameClick"
      @keyup="handleNameKeyup"
      spellcheck="false"
      ref="nameEditBox"
    >
      {{ folder.name }}
    </div>
  </div>
  <div v-if="deleteFolderModalOpened" class="lhh-media-library-modal-container">
    <div class="lhh-media-library-modal">
      <div
        class="lhh-media-library-modal-close-icon"
        @click="deleteFolderModalOpened = false"
      ></div>
      <div class="lhh-media-library-modal-title">Directory non-empty</div>
      <div class="lhh-media-library-modal-content">
        This repository is not empty. <br />You must empty directory before
        deleting it.
        <div class="lhh-media-library-modal-bottom" style="text-align: right">
          <button
            class="lhh-media-library-button"
            @click="deleteFolderModalOpened = false"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconFolder from './assets/IconFolder.vue';

export default {
  props: ['folder'],
  components: { IconFolder },
  emits: ['open-folder', 'delete-folder'],
  data() {
    return {
      animateOpenFolder: false,
      deleteFolderModalOpened: false,
      isDragOver: false,
    };
  },
  methods: {
    onDragOver(event) {
      event.preventDefault();
      if (
        event.dataTransfer.items[0] &&
        event.dataTransfer.items[0].kind === 'string'
      ) {
        this.isDragOver = true;
      }
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    onDrop() {
      this.isDragOver = false;
    },
    async handleFolderClick(event) {
      if (event.target.classList.contains('folder-name')) {
        return;
      }
      if (event.target.classList.contains('folder-delete-icon')) {
        return;
      }
      this.animateOpenFolder = true;
      await new Promise((r) => setTimeout(r, 100));
      this.$emit('open-folder', this.folder);
    },
    onNameChange(event) {
      console.log('onNameChange !!');
      this.folder.name = event.target.innerHTML.trim();
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
    deleteFolder() {
      if (this.getItemsCountRecursive > 0) {
        this.deleteFolderModalOpened = true;
        return;
      }
      this.$emit('delete-folder', this.folder);
    },
    scrollAndFocusEditName() {
      this.$refs.nameEditBox.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setTimeout(() => {
        this.$refs.nameEditBox.focus();
        window.getSelection().selectAllChildren(this.$refs.nameEditBox);
      }, 300);
    },
  },
  computed: {
    getItemsCountRecursive() {
      let totalItems = 0;
      function crawlFolder(parentFolder) {
        totalItems += parentFolder.children.length;
        const subFolders = parentFolder.children.filter(
          (i) => i.type === 'folder'
        );
        for (const childFolder of subFolders) {
          crawlFolder(childFolder);
        }
      }
      crawlFolder(this.folder);
      return totalItems;
    },
  },
};
</script>

<style scoped>
.folder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.1s ease;
}
.folder--animate-open {
  opacity: 0;
  transform: scale(1.5);
}
.folder--dragover {
  transform: scale(1.1);
}

.folder-items-count {
  position: absolute;
  top: 123px;
  right: 23px;
  font-weight: bold;
  font-size: 14px;
  color: rgb(var(--lhh-media-library-color-3));
  user-select: none;
}
.folder-name {
  text-align: center;
  width: 140px;
  z-index: 2;
}
.folder-name:focus {
  font-weight: bold;
}

.folder-delete-icon {
  background: url(./assets/close-icon.svg);
  width: 24px;
  height: 24px;
  position: absolute;
  right: -1px;
  top: 8px;
  opacity: 0;
  transition: 0.2s ease;
  transform: scale(0.8);
}
.folder:hover .folder-delete-icon {
  opacity: 1;
  transform: scale(1);
}
.folder-delete-icon:hover {
  transform: scale(1.4) !important;
  cursor: pointer;
}
</style>
