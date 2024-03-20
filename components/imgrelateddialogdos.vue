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
            </template> DEBUG
            <v-list>
              <v-list-item>
                <v-list-item-title @click="$refs.fontDialog2.openDialog()">Enviar por correo <ContentDialogSendEmail /></v-list-item-title>
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
                  outlined
                  @click="$refs.fontDialog2.openDialog()"
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

            <v-tooltip bottom v-if="isFromMensajero">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  dark
                  outlined
                  @click="dialogMensajero = true"
                >
                  <v-icon>mdi-message-image</v-icon>
                </v-btn>
              </template>
              <span>Solicitar archivo</span>
            </v-tooltip>

          </div>

          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeOtherDialog()">
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
                <v-card-text>
                  <v-img
                    :src="image"
                    :lazy-src="image"
                    @error="errorHandler()"
                    @click="$refs.zoomDialog.openDialog(image)"
                    v-ripple
                    style="cursor: pointer"
                    contain
                    max-height="75vh"
                  ></v-img>
                </v-card-text>
                <v-card-text v-if="img.description != null || img.description != ''" :style="'max-height: 82vh; overflow-y: scroll'" class="image-text" v-html="img.description"></v-card-text>

              </v-card>
            </v-flex>

            <v-flex xs12 md4 v-if="!loading">
              <v-card outlined>
                <v-card-text>
                  <div class="mr-5 ml-5">
                    <v-img
                      :src="imgPath + img.publicationRef.icon"
                      :lazy-src="imgPath + img.publicationRef.icon"
                      contain
                      height="80"
                    />
                  </div>

                  <v-divider class="ma-3"></v-divider>
                  <label>Información</label><br />

                  <Content-Card-List
                    type="images"
                    :fromMensajero="img.fromMensajero"
                    :id="img._id != undefined ? img._id : ''"
                    :publishDate="
                      img.date != undefined
                        ? new Date(img.date).toISOString().substring(0, 10)
                        : ''
                    "
                    :idMegamedia="img.idMegamedia != undefined ? img.idMegamedia : ''"
                    :section="img.noteBookRef != undefined && img.noteBookRef != null && img.noteBookRef != '' ? img.noteBookRef.NoteBookName : ''"
                    :taked="img.origenDate != undefined && img.origenDate != null && img.origenDate != '' ? new Date(img.origenDate).toISOString().substring(0, 10) : ''"
                    :location="img.place != undefined && img.place != null && img.place != '' ? img.place : ''"
                    :agency="img.publicationRef != undefined && img.publicationRef != null && img.publicationRef != ''? img.publicationRef.publicationName : ''"
                    :clasification="img.clasificationRef != undefined && img.clasificationRef != null && img.clasificationRef != '' ? img.clasificationRef.name : ''"
                    :photographer="img.photographer != undefined && img.photographer != null && img.photographer != '' ? img.photographer : ''"
                    :page="img.page != undefined && img.page != null && img.page != '' ? img.page : ''"
                    :material="img.material != undefined && img.material != null && img.material != '' ? img.material : null"
                    :published="img.isPublished != undefined && img.isPublished != null && img.isPublished != '' ? img.isPublished : false"
                    :selleable="img.isSelleable != undefined && img.isSelleable != null && img.isSelleable != '' ? img.isSelleable : false"
                    :size=" pixel != undefined && pixel != null && pixel != '' ? pixel : ''"
                    :descriptors="img.observations != undefined && img.observations != null && img.observations != '' ? img.observations.trim() : ''"
                    :icon="img.publicationRef.icon"

                   />

                  <NoteRelated v-if="relatedNotes.length > 0" :relatedNotes="relatedNotes" />
                  <releatedpdfsdos v-if="relatedPDF.length > 0" :relatedPDFs="relatedPDF" />
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogMensajero" max-width="350">
      <v-card>
        <v-card-title>¿Esta seguro de realizar la solicitud?</v-card-title>
        <v-card-text>Se realizará una solicitud de su archivo al mensajero</v-card-text>
        <v-card-text>
          <v-layout row wrap>
              <v-spacer />
              <v-btn color="secondary" @click="dialogMensajero = false" >Cancelar</v-btn>
              <v-btn color="primary" @click="addReport()" class="ml-2" >Aceptar</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Content-Zoom-Dialog ref="zoomDialog" />
    <Add-Workbench-Dialog ref="addWorkbenchDialog" />
    <ContentReportDialog ref="reportDialog" />
    <Content-Font-Dialog2 ref="fontDialog2" />
    <Content-Download-Dialog ref="downloadDialog" :urlFile="image" :modeAux="modeAuxs"/>


  </v-dialog>
</template>

<script>
  import ContentCardList from "~/components/ContentCardList";
  import ContentZoomDialog from "~/components/ContentZoomDialog";
  import AddWorkbenchDialog from "~/components/AddWorkbenchDialog";
  import ContentReportDialog from "~/components/ContentReportDialog";
  import ContentDownloadDialog from "~/components/ContentDownloadDialog";

  import ContentFontDialog2 from "~/components/ContentDialogSendEmail";
  import releatedpdfsdos from '~/components/releatedpdfsdos.vue';
  import NoteRelated from '~/components/RelatedNotes.vue';
  import { mapState } from "vuex";
  import ContentDialogSendEmail from "~/components/ContentDialogSendEmail";

  export default {
    components: {
      ContentCardList,
      ContentZoomDialog,
      AddWorkbenchDialog,
      ContentReportDialog,
      ContentDownloadDialog,
      ContentFontDialog2,
      releatedpdfsdos,
      NoteRelated,
      ContentDialogSendEmail
    },
    data(){
      return {
        modeAuxs:2,
        dialog : false,
        dialogMensajero : false,
        loading : true,
        imgPath: process.env.imgPath,
        mesajeroIMGMega : process.env.mesajeroIMGMega,
        image : '',
        img : {
          id : null,
          publishDate : null,
          section : null,
          taked : null,
          location : null,
          agency : null,
          clasification : null,
          photographer : null,
          page : null,
          material : null,
          published : null,
          selleable : null,
          pixel : null,
          observations : null,
          icon : null,
          fromMensajero : null,
        },
        secondTime : false,
        pixel : null,
        relatedPDF : [],
        relatedNotes : []
      }
    },
    computed: mapState(['isFromMensajero']),

    methods : {
      closeOtherDialog(){
        this.$emit('closeDialog');
        this.dialog = false
      },
      openDialog( img ){
        this.dialog = true;
        this.loading = true;
        this.relatedPDF = [];
        this.relatedNotes = [];
        this.getImg( img._id );
      },
      async getImg( id ){
        try {
          const response = await this.$axios.$get('/images/' + id, {
            headers : { Authorization : 'Beaere ' + localStorage.token }
          });
          this.pixel = response.data.image.pixels != undefined && response.data.image.pixels == '0 x 0' ? response.data.image.pixels : await this.getPixel();

          // //console.log(response.data.image)
          // //console.log('----------')
          this.img = response.data.image;

          this.image = this.imgPath + response.data.image.imageSrc;
          this.relatedPDF = response.data.relatedPDF != undefined ? response.data.relatedPDF : [];
          this.relatedNotes = response.data.relatedNotes != undefined ? response.data.relatedNotes : [];

          // if( this.img.fromMensajero){
          //   this.image = this.mesajeroIMGMega;
          // }

          this.loading = false;
        } catch (error) {
          //console.log(error)
        }
      },
      errorHandler(){
        if(!this.secondTime){
          if(this.image.search('png') != -1 ){
            this.image = this.image.substring(0, this.image.length - 3) + 'jpg';
          }else{
            this.image = this.image.substring(0, this.image.length - 3) + 'png';
          }
          //console.log('There was change')
          this.$store.commit('setIsMensajer', false);

          this.secondTime = true;
        }else{
          this.image = this.errImgPath;
          if( this.img.fromMensajero ){
            this.image = this.mesajeroIMGMega;
            this.$store.commit('setIsMensajer', true);

            // this.addReport();
          }
          this.$forceUpdate()
        }
      },
      async addReport(){
        try {

          const user = await this.$axios.$get('/users/' + localStorage.user_idC, {
            headers : { Authorization : 'Bearer ' + localStorage.tokenC }
          });

          const body = {
            name : user.data.name,
            email : user.data.email,
            // description : "Esta imagen no ha sido localizada, su localización es correspondiente a la carpeta " + this.img.carpetaOrigen,
            description : "La foto está en la carpeta " + this.img.carpetaOrigen + " clave " + this.img.ImageTitle,

            userId : localStorage.user_idC,
            fileId : this.img._id,
            mode : 'Imagenes',
            path : this.$route.fullPath,
            fromMensajero : true,
          }

          const response = await this.$axios.$post('/addReport', body, {
            headers : { Authorization : 'Bearer ' + localStorage.tokenC }
          });


        } catch (error) {
          //console.log(error.response)
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo from'
          );
        }
      },
      async getPixel(){
        const img = new Image();
        img.src = this.image;
        img.onload = () => {
          this.pixel = img.width + ' x ' + img.height;
        }
        try {
          const response = await this.$axios.$put('/imageP', {
            id : this.img._id,
            size : this.pixel,
            headers : { Authorization: "Bearer " + localStorage.tokenC },
          });


        } catch (error) {
          //console.log(error);
        }
        return img.width + ' x ' + img.height;
      },
    },
  }
</script>

<style>

</style>
