<template>
  <div class="imagenes-container">
    <el-carousel
      height="200px"
      direction="horizontal"
      :autoplay="true"
      :interval="3000"
      :loop="true"
      trigger="hover"
    >
      <el-carousel-item v-for="(img, index) in getImagenes" :key="'image-'+index">
        <el-image style="width: 100%; height: 200px" :src="getDownloadFileUrl+img.url" fit="contain" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { downloadFileUrl } from '@/api/file';
export default {
  name: 'ImagenesViaje',
  props: {
    imagenes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    getImagenes() {
      return this.imagenes;
    },
    getDownloadFileUrl() {
      return downloadFileUrl('');
    },
  },
};
</script>

<style lang="scss" scoped>
.imagenes-container{
  padding: 0px;
}
</style>
