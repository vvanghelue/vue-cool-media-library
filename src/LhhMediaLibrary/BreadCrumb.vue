<template>
  <div class="breadcrumb">
    <div
      class="breadcrumb-item"
      v-for="pathItem of path"
      @click="onOpenFolder(pathItem)"
      :key="pathItem"
    >
      {{ pathItem.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['rootFolder', 'currentOpenedFolder', 'onOpenFolder'],
  data() {
    return {
      // path: [],
    };
  },
  computed: {
    path() {
      let foundPath;
      /*
      console.log(
        'find breadcrumb path',
        this.rootFolder,
        this.currentOpenedFolder
      );
      */

      if (!this.currentOpenedFolder || !this.rootFolder) {
        return [];
      }

      // naive path search
      const searchPath = ({ path, folder }) => {
        if (folder === this.currentOpenedFolder) {
          foundPath = path;
          return;
        }
        const subFolders = folder.children.filter((i) => i.type === 'folder');
        for (const childFolder of subFolders) {
          const derivedPath = [...path];
          derivedPath.push(childFolder);
          searchPath({
            path: derivedPath,
            folder: childFolder,
          });
        }
      };

      searchPath({
        folder: this.rootFolder,
        path: [this.rootFolder],
      });

      return foundPath;
    },
  },
};
</script>

<style>
.breadcrumb {
  display: flex;
  font-weight: bold;
  user-select: none;
  padding-top: 20px;
}
.breadcrumb-item:not(:last-child):after {
  display: inline-block;
  content: '/';
  padding: 0 10px;
}
.breadcrumb-item:not(:last-child):hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
