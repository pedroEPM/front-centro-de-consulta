<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 md4 v-if="loading">
      <v-card flat style="margin-top: 15rem">
        <v-card-text class="text-center">
          <v-icon size="80" class="mb-2">mdi-newspaper-variant-outline</v-icon>
          <h1 class="mb-5">Cargando</h1>
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md8 v-if="!loading">
      <AdvSearchChips
        v-if="advSearch"
        :chips="advSearch"
        :isWhiteText="true"
        :color="'secondary'"
        :title="'Páginas de:'"
        :allWords="true"
        :icon="false"
      />
      <!-- {{pdfpath}} -->
      <!---vizualizador pdf principal---->
      <v-card outlined max-height="800">
        <v-card-title class="pb-0">{{ title !== null ? title.substring(0, 20) : '' }}</v-card-title>
        <v-card-text>
          <v-layout justify-center v-if="allRelatedPDF.length > 0">
            <v-flex xs12 class="text-center">
              <v-btn small color="primary" :disabled="allRelatedPDF.length == 0 || $parent.$parent.$parent.$parent.contentIndex == 0" @click="firstElemt()"
                ><v-icon>mdi-chevron-double-left</v-icon></v-btn
              >
              <v-btn small color="primary" :disabled="allRelatedPDF.length == 0 || $parent.$parent.$parent.$parent.contentIndex == 0" @click="backward()"
                ><v-icon>mdi-chevron-left</v-icon></v-btn
              >
              <v-btn small outlined disabled style="color: black !important"
                > {{ $parent.$parent.$parent.$parent.contentIndex + 1 }} de {{ allRelatedPDF.length == 0 ? '1' : allRelatedPDF.length }}</v-btn
              >
              <v-btn small color="primary" :disabled="allRelatedPDF.length == 0 || $parent.$parent.$parent.$parent.contentIndex == ( allRelatedPDF.length - 1 < 0 ? 0 : allRelatedPDF.length - 1 )" @click="forward()"
                ><v-icon>mdi-chevron-right</v-icon></v-btn
              >
              <v-btn small color="primary" :disabled="allRelatedPDF.length == 0 || $parent.$parent.$parent.$parent.contentIndex == ( allRelatedPDF.length - 1 < 0 ? 0 : allRelatedPDF.length - 1  )" @click="lastElemt()"
                ><v-icon>mdi-chevron-double-right</v-icon></v-btn
              >
            </v-flex>
          </v-layout>
          <v-img
            :src="img"
            :lazy-src="img"
            @error="errorHandler()"
            @click="$refs.zoomDialog.openDialog(img)"
            v-ripple
            style="cursor: pointer;height:0px"
          ></v-img>
          <v-row>
            <v-col>
          <client-only>
            <vue-pdf-app style="height:650px" v-if="showPDF && showPDFBig" :pdf="pdfpath" :config="config"></vue-pdf-app>
          </client-only>
            </v-col>
          </v-row>


        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md4 v-if="!loading">
      <v-card outlined>
        <v-card-text>
          <div class="mr-5 ml-5">
          <!--div class="mr-5 ml-5" v-if="!icon.includes('QRoo')"-->
            <v-img
              :src="imgPath + icon"
              :lazy-src="imgPath + icon"
              contain
              height="80"
            />
          </div>
          <!--div class="mr-5 ml-5" v-if="icon.includes('QRoo')">
            <v-img
              :src="imgPath + icon"
              :lazy-src="imgPath + icon"
              cover
              height="80"
            />
          </div-->

          <v-divider class="ma-3"></v-divider>
          <label>Información</label><br />

          <Content-Card-List
            type="pdfs"
            :id="id != undefined ? id : ''"
            :date="
              publishDate != undefined
                ? new Date(publishDate).toISOString().substring(0, 10)
                : ''
            "
            :section="section != undefined ? section : ''"
            :taked="taked != undefined ? taked : ''"
            :agency="''"
            :idMegamedia="idMegamedia != undefined ? idMegamedia : ''"
            :page="page != undefined ? page : ''"
            :material="material != undefined ? material : ''"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :catalogingInstitution="catalogingInstitution"
            :language="language"
            :imprint="imprint"
            :director="director"
            :localSeries="localSeries"
          />
          <NoteRelated v-if="relatedNotes.length > 0" :relatedNotes="relatedNotes" />
          <!--ReleatedPDFs v-if="relatedPDFs.length > 0" :relatedPDFs="relatedPDFs" /-->
          <ReleatedIMGs v-if="relatedIMGs.length > 0" :relatedIMGs="relatedIMGs" />

        </v-card-text>
      </v-card>
    </v-flex>
    <Content-Zoom-Dialog ref="zoomDialog" />
    <PDF-Related-Dialog ref="pdfDialog" :srcPDF="newSRCPDF !== undefined ? pdfpath : image"/>
  </v-layout>
</template>

<script>
import ContentCardList from "~/components/ContentCardList";
import ContentZoomDialog from "~/components/ContentZoomDialog";
import AdvSearchChips from '~/components/advSearchChips.vue';
import PDFRelatedDialog from '~/components/PDFRelatedDialog';

import ReleatedPDFs from '~/components/ReleatedPDFs.vue';
import ReleatedIMGs from '~/components/ReleatedIMGs.vue';
import NoteRelated from '~/components/RelatedNotes.vue';

export default {
  components: {
    ContentCardList,
    ContentZoomDialog,
    AdvSearchChips,
    PDFRelatedDialog,
    ReleatedPDFs,
    ReleatedIMGs,
    NoteRelated,
  },
  mounted() {
    window.addEventListener("keypress", function(e) {
      console.log(String.fromCharCode(e.keyCode));
    });
  },
  data: () => ({
    config: {
        toolbar: {
            toolbarViewerRight: {
                presentationMode: false,
                openFile: false,
                print: false,
                download: false,
                viewBookmark: false,
            },
        }
    },
    showPDFBig:true,
    showPDF: false,
    imgPath: process.env.imgPath,
    pdfpath: "",
    workingPath : process.env.workingPath,
    img : null,
    indexContent : 0,
    buttonsDisabled : {
      firstElemt : true,
      lastElemt : true,
      forward : true,
      backward : true,

    }
  }),
  watch : {
    loading(){
      if(this.newSRCPDF !== undefined) {
        this.pdfpath = this.imgPath + this.newSRCPDF;
        // this.img = pdfpath;

      } else {
        this.img = this.imgPath + this.image;
        this.pdfpath = this.img
        if (this.pdfpath.includes('tn_')){
          this.pdfpath=this.pdfpath.replace('tn_', '')
        }
        if (this.pdfpath.includes('-0')){
          this.pdfpath=this.pdfpath.replace('-0', '')
        }
        if (this.pdfpath.includes('.png')){
          this.pdfpath=this.pdfpath.replace('.png', '.pdf')
        }
        if (this.pdfpath.includes('.jpg')){
          this.pdfpath=this.pdfpath.replace('.jpg', '.pdf')
        }
        if (this.pdfpath.includes('.PNG')){
          this.pdfpath=this.pdfpath.replace('.PNG', '.pdf')
        }
        if (this.pdfpath.includes('.JPG')){
          this.pdfpath=this.pdfpath.replace('.JPG', '.pdf')
        }
      }
      this.showPDF=true
    }
  },
  props: {
    loading: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    id: {
      type: String,
    },
    idMegamedia:{},
    publishDate: {
      type: String,
    },
    section: {
      type: String,
    },
    taked: {
      type: String,
    },
    agency: {
      type: String,
    },
    page: {
      type: Number,
    },
    material: {
      type: String,
    },
    published: {
      type: Boolean,
    },
    selleable: {
      type: Boolean,
    },
    relatedPDFs: {
      type: Array,
    },
    relatedIMGs: {
      type: Array,
    },
    relatedNotes: {
      type: Array,
    },
    icon: {
      type: String,
      default: "",
    },
    catalogingInstitution : {
      type : String
    },
    language : {
      type : String
    },
    imprint : {
      type : String
    },
    director : {
      type : String
    },
    localSeries : {
      type : String
    },
    advSearch : {},
    allRelatedPDF : {},
    newSRCPDF: { type: String }
  },
  methods : {
    openNewTab(){
      //console.log("NewTab")
    },
    closeDialog(){
      this.showPDFBig = true
    },
    openDialogpdf(){
      this.showPDFBig = false
    },
    async errorHandler(){
      //console.log("errorhandler se ha activado el evento de pedir la imagen del pdf")
      let img2 = this.img;

      setTimeout(() => {
        this.img = this.workingPath;
      }, 1);

      // try {
      //   const response = await this.$axios.$get('/pdfs/Createimage/' + this.id, {
      //     haeders : { Authorization : 'Bearer ' + localStorage.token }
      //   });

      //   //console.log(response);

      //   if( response ){
      //     this.img = img2;
      //   }
      // } catch (error) {
      //   //console.log(error.response);
      // }
      this.$forceUpdate()
    },
    //async errorHa-ndler(){
    //  this.img.replace('.pdf', '.PDF')
    //},
    firstElemt(){
      this.$parent.$parent.$parent.$parent.contentIndex = 0;
      this.img = this.imgPath + this.allRelatedPDF[0].imageSrc;
    },
    lastElemt(){

      this.$parent.$parent.$parent.$parent.contentIndex = this.allRelatedPDF.length - 1;
      this.img = this.imgPath + this.allRelatedPDF[ this.allRelatedPDF.length - 1 ].imageSrc;
    },
    forward(){

      this.$parent.$parent.$parent.$parent.contentIndex = this.$parent.$parent.$parent.$parent.contentIndex + 1;
      this.img = this.imgPath + this.allRelatedPDF[ this.$parent.$parent.$parent.$parent.contentIndex ].imageSrc;
    },
    backward(){

      this.$parent.$parent.$parent.$parent.contentIndex = this.$parent.$parent.$parent.$parent.contentIndex - 1;
      this.img = this.imgPath + this.allRelatedPDF[ this.$parent.$parent.$parent.$parent.contentIndex ].imageSrc;
    }
  },
};
</script>

<style>
</style>

<style scoped>

</style>
