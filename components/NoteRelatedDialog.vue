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
              <v-list-item  @click="$refs.fontDialog.openDialog()">
                <v-list-item-title>Ajustes de letra</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Enviar por correo</v-list-item-title>
              </v-list-item>

              <v-list-item @click="openWorkbench()">
                <v-list-item-title
                  >Agregar a una mesa de trabajo</v-list-item-title
                >
              </v-list-item>

              <v-list-item @click="$refs.reportDialog.openDialog()">
                <v-list-item-title>Reportar errores</v-list-item-title>
              </v-list-item>

              <v-list-item @click="print()">
                <v-list-item-title>Imprimir</v-list-item-title>
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
            <!--v-tooltip v-if="mode == 1" bottom-->
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.fontDialog.openDialog()"
                >
                  <v-icon>mdi-format-size</v-icon>
                </v-btn>
              </template>
              <span>Ajustes de letra</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
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
                  @click="$refs.reportDialog.openDialog()"
                >
                  <v-icon>mdi-alert-circle</v-icon>
                </v-btn>
              </template>
              <span>Reportar errores</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  dark
                  outlined
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  @click="print()"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <span>Imprimir</span>
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
              <v-card outlined style="overflow-y: scroll;">
                <v-card-title v-html="note.title"></v-card-title>

                <div v-if="note.subTitle != undefined && note.subTitle != null && note.subTitle.trim() != '' " class="subtitle-2 ml-5" v-html="note.subTitle"></div>
                <div v-if="note.originalAuthor != undefined && note.originalAuthor != null && note.originalAuthor.trim() != '' " class="subtitle-2 ml-5" v-html=" 'Autor: '+ note.originalAuthor "></div>

                <v-card-text :style="'color : #000;max-height: 82vh; font-size:' + fontSize + 'px'" v-html="note.content"></v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 md4 v-if="!loading">
              <v-card outlined>
                <v-card-text>
                  <div class="mr-5 ml-5">
                    <v-img
                      :src="imgPath + note.publicationRef.icon"
                      :lazy-src="imgPath + note.publicationRef.icon"
                      contain
                      height="80"
                    />
                  </div>

                  <v-divider class="ma-3"></v-divider>
                  <label>Información</label><br />

                  <Content-Card-List
                    type="notes"
                    :id="note._id != undefined ? note._id : ''"
                    :idMegamedia="note.idMegamedia != undefined ? note.idMegamedia : ''"
                    :date="note.date != undefined ? new Date(note.date).toISOString().substring(0,10) : ''"
                    :section="note.noteBookRef != undefined ? note.noteBookRef.NoteBookName : ''"
                    :taked="note.date  != undefined ? note.date  : ''"
                    :agency="note.publicationRef != undefined ? note.publicationRef.publicationName : ''"
                    :page="note.page != undefined ? note.page : ''"
                    :material="note.material != undefined ? note.material : ''"
                    :published="note.published != undefined ? note.published : false"
                    :selleable="note.salable != undefined ? note.salable : false"
                    :author="note.originalAuthor != undefined || note.originalAuthor != null ?  note.originalAuthor : null"
                  />
                  <Related-Alt-PDF v-if="relatedPDF.length > 0" :relatedPDFs="relatedPDF" />
                  <Releated-Imgs-Dos :relatedIMGs="relatedIMGs" v-if="relatedIMGs.length > 0"/>

                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <Add-Workbench-Dialog ref="addWorkbenchDialog" />
    <ContentReportDialog ref="reportDialog" />
    <Content-Font-Dialog ref="fontDialog" />


  </v-dialog>
</template>

<script>
  import ContentCardList from "~/components/ContentCardList";
  import AddWorkbenchDialog from "~/components/AddWorkbenchDialog";
  import ContentReportDialog from "~/components/ContentReportDialog";
  import RelatedAltPDF from '~/components/RelatedAltPDF';
  import ContentFontDialog from "~/components/ContentFontDialog";
  import ReleatedImgsDos from "~/components/releatedimgsdos";

  export default {
    components : {
      ContentCardList,
      AddWorkbenchDialog,
      ContentReportDialog,
      RelatedAltPDF,
      ContentFontDialog,
      ReleatedImgsDos
    },
    data(){
      return {
        dialog : false,
        loading : true,
        imgPath: process.env.imgPath,
        fontSize : null,
        note : {
          id : null,
          publishDate : null,
          section : null,
          taked : null,
          agency : null,
          page : null,
          material : null,
          published : null,
          selleable : null,
          icon : null,
          subTitle : null,
          title : null,
          subTitle : null,
          originalAuthor : null,
        },
        secondTime : false,
        pixel : null,
        relatedPDF : [],
        relatedIMGs : []
      }
    },
    methods : {
      closeOtherDialog(){
        this.$emit('closeDialog');
        this.dialog = false
      },
      print(){
      this.dialog = true;
      this.locationChanged = true;
      this.notePrint = true;
      /*switch(this.mode){
        case 1:
          this.notePrint = true;
        break;
        case 2:
          this.notePrint = true;
        break;
        case 3:
          this.notePrint = true;
        break;
      }*/

    },
      openDialog( note ){
        this.dialog = true;
        this.loading = true;
        this.relatedPDF = [];
        this.relatedIMGs = [];
        this.getNote( note._id );
      },
      async getNote( id ){
        try {
          const response = await this.$axios.$get('/notes/' + id, {
            headers : { Authorization : 'Beaere ' + localStorage.token }
          });

          this.note = response.data.note;

          this.relatedPDF = response.data.relatedPDF != undefined ? response.data.relatedPDF : [];
          this.relatedIMGs = response.data.relatedImages != undefined ? response.data.relatedImages : [];


          this.loading = false;
        } catch (error) {
          //console.log(error)
        }
      },
    },
  }
</script>

<style>

</style>
