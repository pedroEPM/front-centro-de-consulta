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
          <v-card ripple @click="showPDFR = item.imageSrc, $refs.pdfDialog.openDialog(item)">
            <v-img :src="imgPath + item.imageSrc"></v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <pdfrelateddialogdos ref="pdfDialog" :srcPDF="showPDFR"/>

  </div>
</template>

<script>
  import pdfrelateddialogdos from '~/components/pdfrelateddialogdos'

  export default {
    components : {
      pdfrelateddialogdos
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
