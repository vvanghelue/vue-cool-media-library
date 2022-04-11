<template>
  <div
    :class="['folder', { 'folder--animate-open': animateOpenFolder }]"
    @click="handleFolderClick"
  >
    <div class="folder-icon"></div>

    <IconFolder />

    <div class="folder-items-count">{{ getItemsCountRecursive }} items</div>

    <div
      class="folder-name"
      contenteditable
      @blur="onNameChange"
      @click="handleNameClick"
      @keyup="handleNameKeyup"
      spellcheck="false"
    >
      {{ folder.name }}
    </div>
  </div>
</template>

<script>
import IconFolder from './assets/IconFolder.vue';

export default {
  props: ['folder'],
  components: { IconFolder },
  data() {
    return {
      animateOpenFolder: false,
    };
  },
  methods: {
    async handleFolderClick(event) {
      if (event.target.classList.contains('folder-name')) {
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
  },
  computed: {
    getItemsCountRecursive() {
      let totalItems = 0;
      function crawlFolder(parentFolder) {
        totalItems += parentFolder.children.length;
        const subFolders = parentFolder.children.filter(
          (i) => i.type === 'folder',
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
.folder-items-count {
  position: absolute;
  top: 123px;
  right: 23px;
  font-weight: bold;
  font-size: 14px;
  color: rgb(var(--lhh-media-library-color-3));
}
.folder-name {
  text-align: center;
  width: 140px;
  z-index: 99;
}
.folder-name:focus {
  font-weight: bold;
}
</style>
