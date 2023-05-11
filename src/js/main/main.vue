<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fs, os, path } from "../lib/cep/node";
import {
  csi,
  evalES,
  subscribeBackgroundColor,
} from "../lib/utils/bolt";
import "../index.scss";

const backgroundColor = ref("#282c34");

// Arrays are not reliably reactive in Vue unless inside a ref
const imageFiles = ref([]);

const exportAndDisplayArtboard = async () => {
  imageFiles.value = [];
  /**
   * Filepaths returned by new File() will not be POSIX paths, and read "/c/Users" instead of "C:/Users"
   * 
   * We pretreat them in JSX and return the list correctly here while assigning it as our REF.value
   */
  const files = JSON.parse(await evalES(`exportArtboards()`));
  for (let file of files)
    // We can just read the data from Node with base64
    await fs.readFile(file, { encoding: "base64" }, (err, data) => {
      // Then push it to our array with the correct metadata prefix
      if (!err) (imageFiles.value as string[]).push(`data:image/jpeg;charset=utf-8;base64,${data as string}`);
    })
}

onMounted(() => {
  if (window.cep) {
    subscribeBackgroundColor((c: string) => (backgroundColor.value = c));
  }
});
</script>

<template>
  <div class="app" :style="{ backgroundColor: backgroundColor }">
    <button @click="exportAndDisplayArtboard">
      IMAGE TEST
    </button>
    <div class="image-wrapper">
      <img class="image-item" v-for="(image, i) in imageFiles" :key="i" :src="image" />
    </div>
  </div>
</template>


<style>
.image-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.image-wrapper>* {
  max-width: 200px;
  margin: 12px auto;
}
</style>