<template>
  <div class="desc-container">
    <el-row :gutter="20" type="flex" justify="space-between">
      <strong>{{ getNoticia.titulo }}</strong> <span>{{ getTimeAgo }}</span>
    </el-row>
    <div class="desc">
      <div>
        <p>{{ getNoticia.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/filters';
export default {
  name: 'DescripcionNoticia',
  props: {
    noticia: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getNoticia() {
      return this.noticia;
    },
    getTimeAgo() {
      return timeAgo(this.getNoticia.fechaRegistro);
    },
  },
};
</script>

<style lang="scss" scoped>
.desc-container{
    padding-left: 10px;
}
.desc{
    width: 100%;
    height: 165px;
    margin-top: 20px;
    overflow-y: auto;
    text-align: left;
}
</style>
