<template>
  <div v-if="relatedPDFs.length > 0" >
    <v-divider class="ma-3"></v-divider>
    <label>PDFs relacionados</label><br />
    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex xs6 v-for="(item, index) in relatedPDFs" v-bind:key="index">
          <a target="_blank" :href="generateTab(item)">
            <v-card ripple>
              <v-img :src="item.newSRCPDFThumbnail !== undefined ?  imgPath + item.newSRCPDFThumbnail : imgPath + item.imageSrc" :alt="item.title"></v-img>
              <!-- <v-img :src="item.imageSrcThumb ?  imgPath + item.imageSrcThumb : imgPath + item.imageSrc" :alt="item.title"></v-img> -->
            </v-card>
          </a>
        </v-flex>
      </v-layout>
    </v-container>
    <PDF-Related-Dialog ref="pdfDialog" :srcPDF="showPDFR" />
  </div>
</template>

<script>
import PDFRelatedDialog from "~/components/PDFRelatedDialog";

export default {
  components: {
    PDFRelatedDialog,
  },
  props: {
    relatedPDFs: {
      type: Array,
    },
  },
  data() {
    return {
      imgPath: process.env.imgPath,
      showPDFR: "",
    };
  },
  methods: {
    generateTab(item) {
      let pathaux = this.$route.fullPath.toString().split("&");
      let encodedUrl = "";

      if (this.$route.path == "/advSearch") {
        let advSearchObj = JSON.parse(atob(this.$route.query.search));
        advSearchObj.search = "PDFs";
        encodedUrl = `/advSearch?search=${btoa(JSON.stringify(advSearchObj))}`;
      } else {
        encodedUrl = pathaux[0];
      }
      return (
        "https://megateca.megamedia.com.mx/relatedContent" +
        "?content=" +
        item._id +
        "&index=1&mode=3&year=" +
        item.dateCreation
      );
    },
  },
};
</script>

<style>
</style>
