<template>
  <div v-if="relatedPDFs.length > 0">
    <v-divider class="ma-3"></v-divider>
    <label>PDFs relacionados</label><br />

    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex
          xs6
          v-for="(item, index) in relatedPDFs"
          v-bind:key="index"
        >
          <v-card ripple @click="showPDFR = item.imageSrc, $refs.pdfDialogAlt.openDialog(item)">
            <v-img :src="imgPath + item.imageSrc"></v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <PDF-Related-Dialog-Alt ref="pdfDialogAlt" :srcPDF="showPDFR"/>

  </div>
</template>

<script>
  import PDFRelatedDialogAlt from '~/components/PDFRelatedDialogAlt.vue'

  export default {
    components : {
      PDFRelatedDialogAlt
    },
    data(){
      return {
        imgPath: process.env.imgPath,
        showPDFR : '',
      }
    },
    props : {
      relatedPDFs : {
        type : Array
      }
    }
  }
</script>

<style>

</style>
