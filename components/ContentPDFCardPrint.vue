<template>
  <v-layout row wrap justify-center id="toPrint3" style="z-index: 99999;">
    <v-flex :class="relatedPDFs.length > 0 ? 'xs12 md9' : 'xs12'" v-if="!loading">
      <v-card flat class="pa-3">
        <v-card-text>
          <ContentCardListPrint
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
            :page="page != undefined ? page : ''"
            :material="material != undefined ? material : ''"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :catalogingInstitution="catalogingInstitution"
            :language="language"
            :imprint="imprint"
            :director="director"
            :localSeries="localSeries"
            :icon="icon"
            :idMegamedia="
              idMegamedia != undefined ? idMegamedia : null
            "
          />
        </v-card-text>
         <v-layout id="toPrintest"  row wrap class="ml-5">
        <v-card-text>
          <center>
          <img  class="center" :src="forceOpen2 ? image : img" @error="errorHandler()"  :height="isPrint ? '850px' : '680px'">
          </center>
        </v-card-text>
         </v-layout>

      </v-card>
      <v-card-actions v-if="showbutton">
        <v-spacer />
        <v-btn v-if="isPrint" color="primary" @click="print()">Imprimir</v-btn>
      </v-card-actions>
    </v-flex>
    <v-flex xs12 md3 v-if="!isPrint && relatedPDFs.length > 0">
    <!--<v-flex xs12 md3 v-if="!isPrint">-->
      <v-card flat>
        <v-card-text>
          <label>PDFs relacionados</label><br />
          <v-container grid-list-xl>
            <v-layout row wrap>
              <v-flex
                xs6
                v-for="(item, index) in relatedPDFs"
                v-bind:key="index"
              >
                <v-card ripple @click="$refs.pdfDialog.openDialog(item)">
                  <v-img :src="imgPath + item.imageSrc"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

      </v-card>
    </v-flex>
    <!----PDF PRINT-->
    <div>
      <!----encerrar en un dialogo a ver---->
    <v-dialog v-model="renderimp" max-width="300">
       <v-card :loading="loading1">
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <center> Mensaje</center>
            </v-col>
              <v-col>
                <a v-if="loading1 == false" @click="cerrar()">X</a>
            </v-col>
            </v-row>

        </v-card-title>
        <v-card-text  v-if="loading1 == true"> Cargando archivo... </v-card-text>
        <v-card-text v-if="loading1 == false">
           <center>
          <h3>PDF Generado.</h3>
          <br>
        <v-btn color="primary" @click="cerrar()">Cerrar ventanas</v-btn>
           </center>
         </v-card-text>
      </v-card>
      <div>
      <client-only>
        <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="false"
          :preview-modal="true"
          :paginate-elements-by-height="1400"
          :filename="titulodoc"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          pdf-orientation="portrait"
          pdf-content-width="800px"

          @hasStartedGeneration="hasStartedGeneration()"
          @hasGenerated="hasGenerated($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content">
           <div style="margin:5px">
          <!--contenido-->
         <v-card flat class="pa-3">
        <v-card-text>
          <ContentCardListPrint
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
            :page="page != undefined ? page : ''"
            :material="material != undefined ? material : ''"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :catalogingInstitution="catalogingInstitution"
            :language="language"
            :imprint="imprint"
            :director="director"
            :localSeries="localSeries"
            :icon="icon"
            :idMegamedia="
              idMegamedia != undefined ? idMegamedia : null
            "
          />
        </v-card-text>
         <v-layout id="toPrintest"  row wrap class="ml-5">
        <v-card-text>
          <center>
          <img  class="center" :src="forceOpen2 ? image : img" @error="errorHandler()"  :height="isPrint ? '890px' : '680px'">
          </center>
        </v-card-text>
         </v-layout>
      </v-card>
           </div>
          </section>
        </vue-html2pdf>
      </client-only>
      </div>
    </v-dialog>
    </div>

    <Content-Zoom-Dialog ref="zoomDialog" />
    <PDFRelatedDialog ref="pdfDialog"/>
  </v-layout>
</template>

<script>
import ContentCardListPrint from "~/components/ContentCardListPrint.vue";
import ContentZoomDialog from "~/components/ContentZoomDialog";
import PDFRelatedDialog from '~/components/PDFRelatedDialog.vue'
import PHE from "print-html-element";

export default {
  components: {
    ContentZoomDialog,
    ContentCardListPrint,
    PDFRelatedDialog
  },
  data: () => ({
    imgPath: process.env.imgPath,
    errImgPath : process.env.errorImagePath,
    img : null,
    showbutton : true,
    forceOpen2 : true,
    renderimp: false,
    loading1 : null,
    generate: false,
  }),
  watch : {
    loading(){
      this.img = this.imgPath + this.image;
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
    forceOpen : {
      type : Boolean,
      default : false
    },
    isPrint : {
      type : Boolean,
      default : true,
    },
    idMegamedia: {
      type: String
    }
  },
  methods : {
    errorHandler(){
      this.forceOpen2 = false;
      this.img = this.imgPath + this.image;
      this.img = this.errImgPath,
      this.$forceUpdate()
    },
    print(){
        this.showbutton = false;
        this.loading1 = true;
        this.renderimp = true;
      setTimeout(() => {
         this.$refs.html2Pdf.generatePdf();
        this.showbutton = true;
      }, 2000);
      setTimeout(() => {
       this.loading1 = false;
      }, 6000);
    },
    cerrar(){
       this.$parent.$parent.$parent.$parent.$parent.$parent.notePrint = false;
      this.renderimp = false;
    },
  },
};
</script>

<style>

</style>
