<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card color="#F5F5F5">
      <v-card-title class="pa-0">
        <v-toolbar dark color="secondary">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title  @click="$refs.fontDialog2.openDialog()">Enviar por correo</v-list-item-title>
              </v-list-item>

              <v-list-item @click="openWorkbench()">
                <v-list-item-title
                  >Agregar a una mesa de trabajo</v-list-item-title
                >
              </v-list-item>

              <v-list-item @click="$refs.downloadDialog.openDialog()">
                <v-list-item-title>Descargar</v-list-item-title>
              </v-list-item>

              <v-list-item @click="$refs.reportDialog.openDialog()">
                <v-list-item-title>Reportar errores</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer class="hidden-md-and-up" />

          <v-icon class="hidden-sm-and-down">
            mdi-newspaper-variant-outline
          </v-icon>
          <v-spacer />

          <div class="hidden-sm-and-down">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  @click="$refs.fontDialog2.openDialog()"
                  outlined
                >
                  <v-icon>mdi-email</v-icon>
                </v-btn>
              </template>
              <span>Enviar por correo</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="openWorkbench()"
                >
                  <v-icon>mdi-folder-plus</v-icon>
                </v-btn>
              </template>
              <span>Agregar a una mesa de trabajo</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.downloadDialog.openDialog()"
                >
                  <v-icon>mdi-file-download</v-icon>
                </v-btn>
              </template>
              <span>Descargar</span>
            </v-tooltip>

            <!--v-tooltip bottom >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.contentPDFDiaog.openDialog()"
                >
                  <v-icon>mdi-file</v-icon>
                </v-btn>
              </template>
              <span>Ver PDF</span>
            </v-tooltip-->

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.reportDialog.openDialog()"
                >
                  <v-icon>mdi-alert-circle</v-icon>
                </v-btn>
              </template>
              <span>Reportar errores</span>
            </v-tooltip>

          </div>

          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeThisDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center>
            <v-flex xs12 md4 v-if="loading">
              <v-card flat style="margin-top: 15rem">
                <v-card-text class="text-center">
                  <v-icon size="80" class="mb-2"
                    >mdi-newspaper-variant-outline</v-icon
                  >
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
              <v-card outlined>
                <v-card-title>{{ pdf.title.substring(0, 20) }}</v-card-title>

                <v-card-text>
                  <!--v-layout justify-center>
                    <v-flex xs12 class="text-center">
                      <v-btn color="primary" disabled
                        ><v-icon>mdi-chevron-double-left</v-icon></v-btn
                      >
                      <v-btn color="primary" disabled
                        ><v-icon>mdi-chevron-left</v-icon></v-btn
                      >
                      <v-btn outlined disabled style="color: black !important"
                        >1 de 1</v-btn
                      >
                      <v-btn color="primary" disabled
                        ><v-icon>mdi-chevron-right</v-icon></v-btn
                      >
                      <v-btn color="primary" disabled
                        ><v-icon>mdi-chevron-double-right</v-icon></v-btn
                      >
                    </v-flex>
                  </v-layout>
                  <v-img
                    :src="image"
                    :lazy-src="image"
                    @error="errorHandler()"
                    @click="$refs.zoomDialog.openDialog(image)"
                    v-ripple
                    style="cursor: pointer"
                  ></v-img-->
                  <client-only>
                    <vue-pdf-app style="height:1440px" v-if="showPDF" :pdf="pdfpath" :config="config"></vue-pdf-app>
                  </client-only>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 md4 v-if="!loading">
              <v-card outlined>
                <v-card-text>
                  <div class="mr-5 ml-5">
                    <v-img
                      :src="imgPath + icon"
                      :lazy-src="imgPath + icon"
                      contain
                      height="80"
                    />
                  </div>

                  <v-divider class="ma-3"></v-divider>
                  <label>Información</label><br />

                  <Content-Card-List
                    :id="pdf.id != undefined ? pdf.id : ''"
                    :date="
                      pdf.publishDate != undefined
                        ? new Date(pdf.publishDate)
                            .toISOString()
                            .substring(0, 10)
                        : ''
                    "
                    :idMegamedia="pdf.idMegamedia != undefined ? pdf.idMegamedia : ''"
                    :section="pdf.section != undefined ? pdf.section : ''"
                    :taked="pdf.taked != undefined ? pdf.taked : ''"
                    :agency="pdf.agency != undefined ? pdf.agency : ''"
                    :page="pdf.page != undefined ? pdf.page : ''"
                    :material="pdf.material != undefined ? pdf.material : ''"
                    :published="pdf.published != undefined ? pdf.published : ''"
                    :selleable="pdf.selleable != undefined ? pdf.selleable : ''"
                  />

                  <v-divider class="ma-3"></v-divider>
                  <NoteRelated v-if="relatedNotes.length > 0" :relatedNotes="relatedNotes"  @openOtherDialog="openOtherDialog()" @closeOtherDialog="closeOtherDialog()"/>
                  <releatedimgsdos v-if="relatedIMGs.length > 0" :relatedIMGs="relatedIMGs"  @openOtherDialog="openOtherDialog()" @closeOtherDialog="closeOtherDialog()"/>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <Content-Zoom-Dialog ref="zoomDialog" />
    <Add-Workbench-Dialog ref="addWorkbenchDialog" />
    <Content-Font-Dialog2 ref="fontDialog2" />
    <ContentReportDialog ref="reportDialog" />
    <ContentPDFDiaog ref="contentPDFDiaog" :pdfSrc="srcPDF" :pdfTitle="pdf.title"  @closeDialog="closeOtherDialog()"/>
    <Content-Download-Dialog ref="downloadDialog" :urlFile="srcFile" :modeAux="modeAuxs"/>

  </v-dialog>
</template>

<script>
import ContentCardList from "~/components/ContentCardList";
import ContentZoomDialog from "~/components/ContentZoomDialog";
import AddWorkbenchDialog from "~/components/AddWorkbenchDialog";
import ContentReportDialog from "~/components/ContentReportDialog";
import ContentDownloadDialog from "~/components/ContentDownloadDialog";
import ContentPDFDiaog from '~/components/ContentPdfDialog';
import ContentFontDialog2 from "~/components/ContentDialogSendEmail";
import releatedimgsdos from '~/components/releatedimgsdos.vue';
import NoteRelated from '~/components/RelatedNotes.vue';

export default {
  components: {
    ContentCardList,
    ContentZoomDialog,
    AddWorkbenchDialog,
    ContentReportDialog,
    ContentPDFDiaog,
    ContentDownloadDialog,
    ContentFontDialog2,
    NoteRelated,
    releatedimgsdos
  },
  data: () => ({    
    showPDFBig: true,
    modeAuxs:3,
    showPDF: false,
    dialog: false,
    image: "",
    loading: true,
    imgPath: process.env.imgPath,
    workingPath : process.env.workingPath,
    icon: null,
    image: null,
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
    pdf: {
      title: null,
      id: null,
      publishDate: null,
      section: null,
      taked: null,
      agency: null,
      page: null,
      material: null,
      published: null,
      selleable: null,
    },
    srcFile : null,
    relatedNotes : [],
    relatedIMGs : []
  }),
  props : {
    srcPDF : {
      type : String
    }
  },
  watch: {
    image( newV ){
      this.srcFile = newV;
    },
    loading(){
      //this.img = this.imgPath + this.image;
      this.pdfpath = this.image
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
      this.showPDF=true
    }
  },
  methods: {
    closeThisDialog(){
      this.showPDFBig = true
      this.dialog = false
    },
    closeOtherDialog(){
      this.showPDFBig = true
    },
    openOtherDialog(){
      //console.log("PDFdos-*-***--**--**--**-*-*---*-*-")
      this.showPDFBig = true
    },
    openDialog(pdf) {
      this.dialog = true;
      this.loading = true;
      ////console.log(pdf)
      this.pdf.title = '';
      this.getPDF(pdf._id);
      this.showPDFBig = true
      //this.image = pdf;
      //this.relatedNotes = [];
      //this.relatedIMGs = [];
    },
    async getPDF(id) {

      const response = await this.$axios.$get("/pdfs/" + id, {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      ////console.log(response.data.notebook.icon)
      
      this.pdf.idMegamedia = response.data.pdf.idMegamedia != undefined && response.data.pdf.idMegamedia != null ? response.data.pdf.idMegamedia : '';
      this.pdf.title = response.data.pdf.title != undefined && response.data.pdf.title != null ? response.data.pdf.title : '';
      this.pdf.id = response.data.pdf._id != undefined && response.data.pdf._id != null ? response.data.pdf._id : '';
      this.pdf.publishDate = response.data.pdf.dateCreation != undefined && response.data.pdf.dateCreation != null ? response.data.pdf.dateCreation : '';
      this.pdf.section = response.data.pdf.notebook != undefined && response.data.pdf.notebook != null ? response.data.pdf.notebook.NoteBookName : '';
      this.pdf.taked = null;
      this.pdf.agency = response.data.pdf.publication != null && response.data.pdf.publication != undefined ? response.data.pdf.publication.publicationName : '';
      this.icon = response.data.pdf.publication!= null && response.data.pdf.publication != undefined ? response.data.pdf.publication.icon : '';
      this.pdf.page = response.data.pdf.page != null && response.data.pdf.page != undefined ? response.data.pdf.page : 'Desconocido';
      this.pdf.material = null;



      //isSelleable
      //isPublished
      this.pdf.published = response.data.pdf.isPublished != undefined && response.data.pdf.isPublished != null ? response.data.pdf.isPublished : false;
      this.pdf.selleable = response.data.pdf.isSelleable != undefined && response.data.pdf.isSelleable != null ? response.data.pdf.isSelleable : false;

      this.image = response.data.pdf.imageSrc;

      if( this.image != undefined && this.image != null ){
        this.image = this.image.replace('-0', '');
      }
      this.image = this.imgPath + this.image;
      this.loading = false;

      this.relatedNotes = response.data.relatedNotes != undefined ? response.data.relatedNotes : [];
      this.relatedIMGs = response.data.relatedImages != undefined ? response.data.relatedImages : [];
      //console.log('----------related images response------------')
      //console.log(response.data)
      //console.log(response.data.relatedImages)
      //console.log(this.relatedIMGs)
      //this.loading = false;
    },
    async errorHandler(){
      let img2 = this.image;

      setTimeout(() => {
        this.image = this.workingPath;
      }, 1);

      // try {
      //   const response = await this.$axios.$get('/pdfs/Createimage/' + this.pdf.id, {
      //     haeders : { Authorization : 'Bearer ' + localStorage.token }
      //   });

      //   //console.log(response);

      //   if( response ){
      //     this.image = img2;
      //   }
      // } catch (error) {
      //   //console.log(error.response);
      // }
      this.$forceUpdate()
    },
    openWorkbench() {
      this.$refs.addWorkbenchDialog.openDialog("pdfs", this.pdf.id);
    },
  },
};
</script>

<style>
</style>
