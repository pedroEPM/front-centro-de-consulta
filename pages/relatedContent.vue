<template>
  <div>
    <v-card color="#F5F5F5" id="printable">
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title @click="$refs.fontDialog2.openDialog()"
                  >Enviar por correo</v-list-item-title
                >
              </v-list-item>

              <v-list-item
                v-if="mode == 1"
                @click="$refs.fontDialog.openDialog()"
              >
                <v-list-item-title>Ajustes de letra</v-list-item-title>
              </v-list-item>

              <v-list-item @click="openWorkbench()">
                <v-list-item-title
                  >Agregar a una mesa de trabajo</v-list-item-title
                >
              </v-list-item>

              <v-list-item
                v-if="mode != 1"
                @click="$refs.downloadDialog.openDialog()"
              >
                <v-list-item-title>Descargar</v-list-item-title>
              </v-list-item>

              <v-list-item @click="$refs.contentPDFDiaog.openDialog()">
                <v-list-item-title>Ver PDF</v-list-item-title>
              </v-list-item>

              <v-list-item>
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
          <v-spacer class="hidden-sm-and-down" />
          <div class="hidden-sm-and-down">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.fontDialog2.openDialog(emailtype, fileEmailSrc)"
                >
                  <v-icon>mdi-email</v-icon>
                </v-btn>
              </template>
              <span>Enviar por correo</span>
            </v-tooltip>

            <v-tooltip v-if="mode == 1" bottom>
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
                  @click="openWorkbench()"
                >
                  <v-icon>mdi-folder-plus</v-icon>
                </v-btn>
              </template>
              <span>Agregar a una mesa de trabajo</span>
            </v-tooltip>

            <v-tooltip bottom v-if="mode != 1">
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

            <v-tooltip bottom v-if="mode == 3">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="
                    $refs.contentPDFDiaog.openDialog();
                    $refs.pdforigenDialog.openDialogpdf();
                  "
                >
                  <v-icon>mdi-file</v-icon>
                </v-btn>
              </template>
              <span>Ver PDF</span>
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

            <!-- <v-tooltip bottom v-if="mode != 3">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                  dark
                  outlined
                  @click="$refs.openAllElement.openDialog()"
                >
                  <v-icon>mdi-file-multiple</v-icon>
                </v-btn>
              </template>
              <span>Mostrar todo</span>
            </v-tooltip> -->

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
          <v-spacer class="hidden-sm-and-down" />
          <v-btn icon @click="closeCurrentTab()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
      </v-card-title>

      <v-card-text id="toPrint">
        <v-container grid-list-xl>
          <Content-Note-Card
            :loading="loading"
            :title="title != undefined ? title : null"
            :content="content != undefined ? content : null"
            :id="id != undefined ? id : null"
            :publishDate="publishDate != undefined ? publishDate : null"
            :section="section != undefined ? section : null"
            :taked="taked != undefined ? taked : null"
            :agency="agency != undefined ? agency : null"
            :page="page != undefined ? page : null"
            :material="material != undefined ? material : null"
            :published="published != undefined ? published : null"
            :selleable="selleable != undefined ? selleable : null"
            :relatedPDFs="relatedPDFs"
            :fontSize="fontSize"
            :fontColor="colorText"
            :icon="icon"
            :idMegamedia="idMegamedia"
            :subTitle="subTitleN != undefined ? subTitleN : null"
            v-if="mode == 1"
            :author="author != undefined ? author : null"
            :observations="observations != undefined ? observations : null"
            :locationChanged="locationChanged"
            :advSearch="advSearch"
            :relatedIMGs="relatedIMGs"
          />
          <!--CARD MODE 2 (IMAGES) :id="imageObj.idMegamedia != undefined ? imageObj.idMegamedia : null -->
          <Content-Image-Card
            :fromMensajero="imageObj.fromMensajero"
            :loading="loading"
            :observations="
              imageObj.observations != undefined ? imageObj.observations : null
            "
            :title="
              imageObj.ImageTitle != undefined ? imageObj.ImageTitle : null
            "
            :description="
              imageObj.description != undefined ? imageObj.description : null
            "
            :image="imageObj.imageSrc != undefined ? imageObj.imageSrc : null"
            :id="imageObj._id != undefined ? imageObj._id : null"
            :publishDate="
              imageObj.publicationDate != undefined
                ? imageObj.publicationDate
                : imageObj.publicationDate
            "
            :section="
              imageObj.noteBookRef != undefined
                ? imageObj.noteBookRef.NoteBookName
                : null
            "
            :taked="
              imageObj.origenDate != undefined
                ? new Date(imageObj.origenDate).toISOString().substring(0, 10)
                : null
            "
            :location="imageObj.place != undefined ? imageObj.place : null"
            :photographer="photographer"
            :clasification="
              imageObj.clasificationRef != undefined
                ? imageObj.clasificationRef.name
                : null
            "
            :agency="
              imageObj.publicationRef != undefined
                ? imageObj.publicationRef.publicationName
                : null
            "
            :page="imageObj.page != undefined ? imageObj.page : null"
            :material="material != undefined ? material : null"
            :published="published != undefined ? published : null"
            :selleable="selleable != undefined ? selleable : null"
            :relatedPDFs="relatedPDFs"
            :icon="
              imageObj.publicationRef != undefined
                ? imageObj.publicationRef.icon
                : null
            "
            :pixel="pixelS"
            v-if="mode == 2"
            :advSearch="advSearch"
            :relatedNotes="relatedNotes"
            :_id="imageObj._id"
            :idMegamedia="
              imageObj.idMegamedia != undefined
                ? imageObj.idMegamedia
                : imageObj._id
            "
            :pathImg="imageObj.fromMensajero ? imageObj.carpetaOrigen : '/'"
          />

          <!--CARD MODE 3 (PFDs)-->
          <Content-PDF-Card
            ref="pdforigenDialog"
            :loading="loading"
            :title="pdfObject.title != undefined ? pdfObject.title : null"
            :image="pdfObject.imageSrc != undefined ? pdfObject.imageSrc : null"
            :id="pdfObject._id != undefined ? pdfObject._id : null"
            :publishDate="
              pdfObject.datePublication != undefined
                ? pdfObject.datePublication
                : null
            "
            :section="
              pdfObject.notebook != undefined
                ? pdfObject.notebook.NoteBookName
                : null
            "
            :taked="null"
            :agency="
              pdfObject.publication != undefined
                ? pdfObject.publication.publicationName
                : ''
            "
            :page="pdfObject.page != undefined ? pdfObject.page : null"
            :material="null"
            :idMegamedia="
              pdfObject.idMegamedia != undefined
                ? pdfObject.idMegamedia
                : pdfObject._id
            "
            :published="published != undefined ? published : null"
            :selleable="selleable != undefined ? selleable : null"
            :relatedPDFs="relatedPDFs"
            :icon="
              pdfObject.publication != undefined
                ? pdfObject.publication.icon
                : ''
            "
            :catalogingInstitution="
              pdfObject.catalogingInstitution != undefined ||
              pdfObject.catalogingInstitution != null
                ? pdfObject.catalogingInstitution
                : ''
            "
            :language="
              pdfObject.language != undefined || pdfObject.language != null
                ? pdfObject.language
                : ''
            "
            :imprint="
              pdfObject.imprint != undefined || pdfObject.imprint != null
                ? pdfObject.imprint
                : ''
            "
            :director="
              pdfObject.director != undefined || pdfObject.director != null
                ? pdfObject.director
                : ''
            "
            :localSeries="
              pdfObject.localSeries != undefined ||
              pdfObject.localSeries != null
                ? pdfObject.localSeries
                : ''
            "
            v-if="mode == 3"
            :advSearch="advSearch"
            :allRelatedPDF="allRelatedPDF"
            :relatedNotes="relatedNotes"
            :relatedIMGs="relatedIMGs"
          />
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog v-model="notePrint" max-width="800">
      <v-card flat>
        <v-container grid-list-xl>
          <ContentNoteCardPrint
            :loading="loading"
            :title="title != undefined ? title : null"
            :content="content != undefined ? content : null"
            :id="id != undefined ? id : null"
            :publishDate="publishDate != undefined ? publishDate : null"
            :section="section != undefined ? section : null"
            :taked="taked != undefined ? taked : null"
            :agency="agency != undefined ? agency : null"
            :page="page != undefined ? page : null"
            :material="material != undefined ? material : null"
            :published="published != undefined ? published : null"
            :selleable="selleable != undefined ? selleable : null"
            :fontSize="fontSize"
            :fontColor="colorText"
            :icon="icon"
            :subTitle="subTitleN != undefined ? subTitleN : null"
            v-if="mode == 1"
            :author="author != undefined ? author : null"
            :observations="observations != undefined ? observations : null"
            :locationChanged="
              locationChanged != undefined ? locationChanged : null
            "
            :relatedPDFs="[]"
          />

          <ContentImageCardPrint
            :fromMensajero="imageObj.fromo"
            :loading="loading"
            :observations="
              imageObj.observations != undefined ? imageObj.observations : null
            "
            :title="
              imageObj.ImageTitle != undefined ? imageObj.ImageTitle : null
            "
            :description="
              imageObj.description != undefined ? imageObj.description : null
            "
            :image="imageObj.imageSrc != undefined ? imageObj.imageSrc : null"
            :id="
              imageObj.idMegamedia != undefined
                ? imageObj.idMegamedia
                : imageObj._id
            "
            :idMegamedia="
              imageObj.idMegamedia != undefined
                ? imageObj.idMegamedia
                : imageObj._id
            "
            :publishDate="
              imageObj.publicationDate != undefined
                ? imageObj.publicationDate
                : null
            "
            :section="
              imageObj.noteBookRef != undefined
                ? imageObj.noteBookRef.NoteBookName
                : null
            "
            :taked="
              imageObj.origenDate != undefined
                ? new Date(imageObj.origenDate).toISOString().substring(0, 10)
                : null
            "
            :location="imageObj.place != undefined ? imageObj.place : null"
            :photographer="photographer"
            :clasification="
              imageObj.clasificationRef != undefined
                ? imageObj.clasificationRef.name
                : null
            "
            :agency="
              imageObj.publicationRef != undefined
                ? imageObj.publicationRef.publicationName
                : null
            "
            :page="imageObj.page != undefined ? imageObj.page : null"
            :material="material"
            :published="published != undefined ? published : null"
            :selleable="selleable != undefined ? selleable : null"
            :relatedPDFs="[]"
            :icon="
              imageObj.publicationRef != undefined
                ? imageObj.publicationRef.icon
                : null
            "
            :pixel="pixelS"
            v-if="mode == 2"
          />
          <ContentPDFCardPrint
            style="z-index: 99999"
            :loading="loading"
            :title="pdfObject.title != undefined ? pdfObject.title : null"
            :image="
              pdfObject.imageSrc != undefined
                ? imgPath + pdfObject.imageSrc
                : null
            "
            :id="
              pdfObject.idMegamedia != undefined
                ? pdfObject.idMegamedia
                : pdfObject._id
            "
            :idMegamedia="
              pdfObject.idMegamedia != undefined
                ? pdfObject.idMegamedia
                : pdfObject._id
            "
            :publishDate="
              pdfObject.dateCreation != undefined
                ? pdfObject.dateCreation
                : null
            "
            :section="
              pdfObject.notebook != undefined
                ? pdfObject.notebook.NoteBookName
                : null
            "
            :taked="null"
            :agency="
              pdfObject.publication != undefined
                ? pdfObject.publication.publicationName
                : null
            "
            :page="pdfObject.page != undefined ? pdfObject.page : null"
            :material="null"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :relatedPDFs="[]"
            :icon="
              pdfObject.publication != undefined
                ? pdfObject.publication.icon
                : null
            "
            :catalogingInstitution="
              pdfObject.catalogingInstitution != undefined ||
              pdfObject.catalogingInstitution != null
                ? pdfObject.catalogingInstitution
                : null
            "
            :language="
              pdfObject.language != undefined || pdfObject.language != null
                ? pdfObject.language
                : null
            "
            :imprint="
              pdfObject.imprint != undefined || pdfObject.imprint != null
                ? pdfObject.imprint
                : null
            "
            :director="
              pdfObject.director != undefined || pdfObject.director != null
                ? pdfObject.director
                : null
            "
            :localSeries="
              pdfObject.localSeries != undefined ||
              pdfObject.localSeries != null
                ? pdfObject.localSeries
                : null
            "
            v-if="mode == 3"
          />
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMensajero" max-width="350">
      <v-card>
        <v-card-title>¿Esta seguro de realizar la solicitud?</v-card-title>
        <v-card-text
          >Se realizará una solicitud de su archivo al mensajero</v-card-text
        >
        <v-card-text>
          <v-layout row wrap>
            <v-spacer />
            <v-btn color="secondary" @click="dialogMensajero = false"
              >Cancelar</v-btn
            >
            <v-btn color="primary" @click="addReport()" class="ml-2"
              >Aceptar</v-btn
            >
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Add-Workbench-Dialog ref="addWorkbenchDialog" />
    <Content-Font-Dialog ref="fontDialog" />
    <Content-Font-Dialog2 ref="fontDialog2" />
    <Content-Download-Dialog ref="downloadDialog" :urlFile="srcFile" />
    <Content-Report-Dialog ref="reportDialog" />
    <ContentPDFDiaog
      ref="contentPDFDiaog"
      :pdfSrc="pdfObject.imageSrc"
      :pdfTitle="pdfObject.title"
      @closeDialog="$refs.pdforigenDialog.closeDialog()"
    />
    <OpenAllElement
      ref="openAllElement"
      :index="index"
      :page="$parent.page"
      :mode="mode"
      :advSearch="advSearch"
    />
  </div>
</template>

<script>
import ContentNoteCard from "~/components/ContentNoteCard";
import ContentNoteCardPrint from "~/components/ContentNoteCardPrint.vue";

import ContentImageCard from "~/components/ContentImageCard";
import ContentImageCardPrint from "~/components/ContentImageCardPrint.vue";

import ContentPDFCard from "~/components/ContentPDFCard";
import ContentPDFCardPrint from "~/components/ContentPDFCardPrint.vue";

import AddWorkbenchDialog from "~/components/AddWorkbenchDialog";
import ContentFontDialog from "~/components/ContentFontDialog";
import ContentFontDialog2 from "~/components/ContentDialogSendEmail";
import ContentDownloadDialog from "~/components/ContentDownloadDialog";
import ContentReportDialog from "~/components/ContentReportDialog";

import OpenAllElement from "~/components/OpenAllElement.vue";

import ContentPDFDiaog from "~/components/ContentPdfDialog";
import { mapState } from "vuex";

import PHE from "print-html-element";

export default {
  components: {
    ContentNoteCard,
    ContentImageCard,
    ContentPDFCard,
    AddWorkbenchDialog,
    ContentFontDialog,
    ContentFontDialog2,
    ContentDownloadDialog,
    ContentReportDialog,
    ContentPDFDiaog,
    OpenAllElement,
    ContentNoteCardPrint,
    ContentImageCardPrint,
    ContentPDFCardPrint,
  },
  data: () => ({
    pageChanged: false,
    dialog: false,
    dialogMensajero: false,
    loading: false,
    mode: null,
    // fontSize: null,
    textColor: "#000",
    srcFile: null,

    index: null,
    indexLast: null,
    indexBack: 20,
    fatherPage: null,
    searchtype: null,
    lastPagePagination: "",

    navigationButtons: {
      firstItem: true,
      backward: true,
      forward: true,
      lastItem: true,
    },

    id: null,
    _Id: null,
    title: null,
    idMegamedia: null,
    content: null,
    publishDate: null,
    section: null,
    taked: null,
    agency: null,
    page: null,
    material: null,
    published: false,
    selleable: false,
    icon: null,
    subTitleN: null,

    author: null,
    observations: null,

    imgPath: process.env.imgPath,
    relatedPDFs: [],
    relatedIMGs: [],
    relatedNotes: [],

    imageObj: {
      imageSrc: null,
      ImageTitle: "",
      _id: null,
      noteBookRef: {
        NoteBookName: null,
      },
      idMegamedia: null,
      date: null,
      page: null,
      publicationRef: {
        icon: null,
      },
    },
    emailtype: "",
    fileEmailSrc: "",
    pixelS: null,

    pdfObject: {
      imageSrc: null,
      title: "",
      dateCreation: null,
      _id: null,
      page: null,
      idMegamedia: null,
      publication: {
        icon: null,
      },
    },

    imgPath: process.env.imgPath,

    locationChanged: false,

    notePrint: false,
    allRelatedPDF: [],
    contentIndex: 0,
    cRelatedContent: {
      type: null,
      publicationDate: null,
      page: null,
      notebookRef: null,
      publicationRef: null,
    },
    contentRelatedGot: {},
    photographer: null,
  }),
  props: ["advSearch"],
  watch: {
    dialog(val) {
      this.id = null;
      this.title = null;
      this.relatedPDFs = [];
      this.relatedIMGs = [];
      this.relatedNotes = [];
    },
    dialog(newValu, oldValue) {
      this.paginationState();
    },
    imageObj: {
      handler: function (newValue, oldValue) {
        this.srcFile = process.env.imgPath + newValue.imageSrc;
      },
      deep: true,
    },
    pdfObject: {
      handler: function (newValue, oldValue) {
        this.srcFile = process.env.imgPath + newValue.imageSrc;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["isFromMensajero", "colorText", "fontSize"]),
    ...mapState("search", ["searchedItems"]),
    forwardElement() {
      let fowardIndex = this.index;
      if (this.searchedItems && this.searchedItems.length > 0) {
        let temp = null; //this.searchedItems.find((el) => el.id == this._Id);
        try {
          temp = fowardIndex > this.searchedItems.length ? null : true;
          console.log("fowardIndexfowardIndex =" + fowardIndex);
          fowardIndex =
            fowardIndex > this.searchedItems.length - 1 ? 0 : fowardIndex;
        } catch (e) {
          console.log(e);
        }
        //console.log('los computed index--------')
        //&& !this.pageChanged
        if (temp) {
          if (
            this.searchedItems[fowardIndex].id &&
            this.searchedItems[fowardIndex].date
          ) {
            console.log("////////// CREATING FORWARD //////////");
            console.log(this.searchedItems[fowardIndex]);
            console.log(fowardIndex + "---" + this.index);
            console.log(
              "////////// -------CREATING FORWARD END------ //////////"
            );
            let formatedForwardAux = {
              id: this.searchedItems[fowardIndex].id,
              year: this.searchedItems[fowardIndex].date,
            };
            console.log(formatedForwardAux);
            return formatedForwardAux;
          } else {
            console.log("vueex retorna null1");
            return null;
          }
        } else {
          console.log("vueex retorna null2");
          return null;
        }
      } else {
        console.log("vueex retorna null3");
        return null;
      }
    },
    backElement() {
      let backIndex = this.index;
      if (this.searchedItems && this.searchedItems.length > 0) {
        let temp = null; ///this.searchedItems.find((el) => el.id == this._Id);
        try {
          //temp = this.searchedItems[Number(this.index)].id
          //console.log(this.searchedItems[Number(this.index)].id)
          //console.log(this.searchedItems[this.searchedItems.indexOf(temp)+1].id)
          temp = backIndex < 0 ? null : true;
          backIndex = backIndex < 0 ? this.searchedItems.length - 1 : backIndex;
        } catch (e) {
          console.log(e);
        }
        if (temp) {
          //let index = this.searchedItems.indexOf(temp);

          if (
            this.searchedItems[backIndex].id &&
            this.searchedItems[backIndex].date
          ) {
            console.log("////////// CREATING BACK //////////");
            console.log(this.searchedItems[backIndex]);
            console.log(backIndex + "---" + this.index);
            console.log("////////// -------CREATING BACK END------ //////////");

            let formatedBackdAux = {
              id: this.searchedItems[backIndex].id,
              year: this.searchedItems[backIndex].date,
            };
            console.log(formatedBackdAux);
            return formatedBackdAux;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },
  mounted() {
    if (this.$route.query.content != undefined) {
      switch (this.$route.query.mode) {
        case "1":
          this.getPermissions(
            this.$route.query.content,
            4,
            undefined,
            undefined,
            this.$route.query.year + ""
          );
          break;
        case "2":
          this.getPermissions(
            this.$route.query.content,
            5,
            undefined,
            undefined,
            this.$route.query.year + ""
          );
          break;
        case "3":
          this.getPermissions(
            this.$route.query.content,
            6,
            undefined,
            undefined,
            this.$route.query.year + ""
          );
          break;
      }
    }
  },
  methods: {
    async getRelatedContentd() {
      return await this.$axios.$post("/relatedContent", this.cRelatedContent, {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
    },
    closeCurrentTab() {
      window.close();
    },
    // ...mapMutations(['setIsMensajer']),
    print() {
      this.dialog = true;
      this.locationChanged = true;
      this.$store.commit("changeLocation", true);
      switch (this.mode) {
        case 1:
          this.notePrint = true;
          break;
        case 2:
          this.notePrint = true;
          break;
        case 3:
          this.notePrint = true;
          break;
      }
    },
    async openDialog(note, mode, index, searchType, formatedYear) {
      this.lastPagePagination = this.$parent.elementsCounter;
      this._Id = note._id;
      this.dialog = true;
      this.loading = true;
      this.contentIndex = 0;

      this.index = index != undefined ? index : this.$route.query.index - 1;

      console.log("index opendialog " + this.index);
      console.log("formatedYear openDIalog--" + formatedYear);
      this.searchtype = searchType;

      this.mode = mode != undefined ? mode : this.$route.query.mode;

      this.searchLastItem();
      this.cleanFields();
      switch (mode) {
        case 1:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: note._id,
              index: this.index + 1,
              mode: 1,
              year: formatedYear,
            },
          });
          await this.getNote(note._id, formatedYear);
          break;

        case 2:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: note._id,
              index: this.index + 1,
              mode: 2,
              year: formatedYear,
            },
          });
          await this.getImage(note._id, formatedYear);
          break;

        case 3:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: note._id,
              index: this.index + 1,
              mode: 3,
              year: formatedYear,
            },
          });
          await this.getPDF(note._id, formatedYear);
          break;

        case 4:
          this.mode = 1;
          await this.getNote(note, formatedYear);
          break;

        case 5:
          this.mode = 2;
          await this.getImage(note);
          break;

        case 6:
          this.mode = 3;
          await this.getPDF(note, formatedYear);
          break;
      }
      if (this.index == 0 && this.$parent.page == 1) {
        this.disablesFirstItemAndBackward();
      }

      this.searchLastItem();
      if (
        this.index == this.indexLast &&
        this.$parent.page == this.fatherPage
      ) {
        this.disabledLastItemAndForward();
      }
    },
    async getNote(id, year) {
      let url = year ? `/notes/${id}/${year}` : `/notes/${id}`;

      const response = await this.$axios.$get(url, {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      this.id = response.data.note._id;
      this.idMegamedia =
        response.data.note.idMegamedia || response.data.note._id;
      //console.log("idMegamedia Nota ===============" + this.idMegamedia);
      this.author = response.data.note.originalAuthor
        ? response.data.note.originalAuthor
        : undefined;
      this.observations = response.data.note.observations
        ? response.data.note.observations
        : undefined;
      this.published = response.data.note.isPublished
        ? response.data.note.isPublished
        : false;
      this.selleable = response.data.note.isSelleable
        ? response.data.note.isSelleable
        : false;

      this.title = response.data.note.title;
      // this.title = this.getPlainText(response.data.note.title);
      // this.title = this.title.replaceAll("</b>", '""');
      // this.title = this.title.replaceAll("<b>", '""');
      if (response.data.note.content != undefined) {
        var tempContent = response.data.note.content;
        //var tempContent = response.data.note.content.replaceAll("<", "");
        tempContent = tempContent.replaceAll(
          /\n/g,
          "<br>"
          ///\\n/g, '<br>'
        );

        if (this.$route.path == "/advSearch") {
          let advSearch = JSON.parse(atob(this.$route.query.search));
          //console.log(advSearch);

          const regex =
            /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
          let searchString =
            advSearch.allwords != undefined ? advSearch.allwords : "";
          advSearch.search != undefined ? advSearch.allwords : "";
          searchString = searchString.replace(/ +(?= )/g, "");
          let result = searchString.replace(regex, "");
          let words = result.split(" ");
          //console.log(words);
          for (var i = 0; i < words.length; i++) {
            if (words[i] == "") {
              words.splice(i, 1);
            }
          }
          //console.log(words);

          if (advSearch.keysentence != undefined) {
            /*let keysentence = new RegExp(advSearch.keysentence, "ig");
            console.log('There is problem here')*/

            /*tempContent = tempContent.replaceAll(
              keysentence,
              '<b style="color: black">' + advSearch.keysentence + "</b>"
            );*/
            this.author = this.addStrongKeySetence(
              this.author,
              advSearch.keysentence
            );
            tempContent = this.addStrongKeySetence(
              tempContent,
              advSearch.keysentence
            );
            //console.log(this.addStrongText( tempContent, keysentence, advSearch.keysentence ))
          }

          if (advSearch.keywords != undefined) {
            /*let keywords = new RegExp(advSearch.keywords, "ig");

              tempContent = tempContent.replaceAll(
                keywords,
                '<b style="color: black">' + advSearch.keywords + "</b>"
              );*/
            this.author = this.addStrongText(this.author, advSearch.keywords);
            // tempContent = this.addStrongText( tempContent, advSearch.keywords );
            tempContent = this.addStrongKeySetence(
              tempContent,
              advSearch.keywords
            );
          }

          words.forEach((element) => {
            /*tempContent = tempContent.replaceAll(
              element,
              '<b style="color: black">' + element + "</b>"
            );*/
            this.author = this.addStrongText(this.author, element);

            tempContent = this.addStrongText(tempContent, element);
          });
          this.content = tempContent;
        } else if (this.$route.query.searched != undefined) {
          const regex =
            /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
          let searchString = this.$route.query.searched;
          searchString = searchString.replace(/ +(?= )/g, "");
          let result = searchString.replace(regex, "");
          let words = result.split(" ");
          for (var i = 0; i < words.length; i++) {
            if (words[i] == "") {
              words.splice(i, 1);
            }
          }

          words.forEach((element) => {
            var regEx = new RegExp(element, "ig");
            /*tempContent = tempContent.replaceAll(
              regEx,
              '<b style="color: black">' + element + "</b>"
            );*/
            this.author = this.addStrongText(this.author, element);
            tempContent = this.addStrongText(tempContent, element);
          });

          this.content = tempContent;
        } else {
          this.content = tempContent;
        }
      }
      this.publishDate = response.data.note.date;

      if (response.data.note.noteBookRef != undefined) {
        //this.section = response.data.note.noteBookRef.NoteBookName.toUpperCase();
        this.section = response.data.note.noteBookRef.NoteBookName;
      }
      if (response.data.note.publicationRef != undefined) {
        //this.agency = response.data.note.publicationRef.publicationName.toUpperCase();
        this.agency = response.data.note.publicationRef.publicationName;
        this.icon = response.data.note.publicationRef.icon;
      }
      this.page = response.data.note.page;

      this.relatedPDFs =
        response.data.relatedPDF != undefined ? response.data.relatedPDF : [];
      this.relatedIMGs =
        response.data.relatedImages != undefined
          ? response.data.relatedImages
          : [];

      //console.log(this.relatedIMGs);
      //console.log("Images");
      /*console.log('Here is the note reponse')
      console.log(response)*/
      /*relatedPDF.forEach( x => {
        if( x.imageSrc.search('-0.png') != -1 ){
          x.imageSrc = x.imageSrc.replace('-0.png', '.png');
        }

        this.relatedPDFs.push(x);
      });*/
      //this.relatedPDFs = response.data.relatedPDF;
      this.enabledNavigationButtons();

      this.content = this.content;
      // this.content = this.getPlainText(this.content);
      // this.content = this.getParaph(this.content);
      // this.content = this.content.replaceAll("<br><br>", "<br>");
      this.subTitleN = response.data.note.subTitle;
      // this.subTitleN = this.getPlainText(response.data.note.subTitle);
      this.content = this.content.replaceAll(/" undefined/g, "");
      this.content = this.content.replaceAll(/undefined/g, "");
      await this.addVisit();

      this.cRelatedContent = {
        type: "note",
        publicationDate: response.data?.note?.date,
        page: response.data?.note?.page,
        notebookRef: response.data?.note?.noteBookRef?._id,
        publicationRef: response.data?.note?.publicationRef?._id,
        idMegamedia: response.data?.note?.idMegamedia || null,
      };

      const cResponse = await this.getRelatedContentd();
      this.relatedPDFs = cResponse?.data?.relatedPDfs;
      this.relatedIMGs = cResponse?.data?.relatedImages;
      this.loading = false;
    },

    async getImage(id, year) {
      let url = year ? `/images/${id}/${year}` : `/images/${id}`;

      const response = await this.$axios.$get(url, {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      //console.log("This is the image");
      //console.log(response.data.image);
      this.imageObj = response.data.image;
      this.emailtype = "images";
      this.fileEmailSrc = this.imageObj.imageSrc;
      //console.log(this.imageObj.description);
      if (this.imageObj.description != undefined) {
        var tempContent = this.imageObj.description;
        //var tempContent = response.data.note.content.replaceAll("<", "");
        tempContent = tempContent.replaceAll(
          /\n/g,
          "<br>"
          ///\\n/g, '<br>'
        );

        if (this.$route.path == "/advSearch") {
          let advSearch = JSON.parse(atob(this.$route.query.search));
          //console.log(advSearch);

          const regex =
            /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
          let searchString =
            advSearch.allwords != undefined ? advSearch.allwords : "";
          advSearch.search != undefined ? advSearch.allwords : "";
          searchString = searchString.replace(/ +(?= )/g, "");
          let result = searchString.replace(regex, "");
          let words = result.split(" ");
          //console.log(words);
          for (var i = 0; i < words.length; i++) {
            if (words[i] == "") {
              words.splice(i, 1);
            }
          }
          //console.log(words);

          if (advSearch.keysentence != undefined) {
            this.author = this.addStrongKeySetence(
              this.author,
              advSearch.keysentence
            );
            tempContent = this.addStrongKeySetence(
              tempContent,
              advSearch.keysentence
            );
            //console.log(this.addStrongText( tempContent, keysentence, advSearch.keysentence ))
          }

          if (advSearch.keywords != undefined) {
            // this.author = this.addStrongText( this.author, advSearch.keywords );
            // tempContent = this.addStrongText( tempContent, advSearch.keywords );
            tempContent = this.addStrongKeySetence(
              tempContent,
              advSearch.keywords
            );
          }

          words.forEach((element) => {
            // this.author = this.addStrongText( this.author, element );

            tempContent = this.addStrongText(tempContent, element);
          });
          this.imageObj.description = tempContent;
        } else if (this.$route.query.searched != undefined) {
          const regex =
            /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
          let searchString = this.$route.query.searched;
          searchString = searchString.replace(/ +(?= )/g, "");
          let result = searchString.replace(regex, "");
          let words = result.split(" ");
          for (var i = 0; i < words.length; i++) {
            if (words[i] == "") {
              words.splice(i, 1);
            }
          }

          words.forEach((element) => {
            // this.author = this.addStrongText( this.author, element );
            tempContent = this.addStrongText(tempContent, element);
          });

          this.imageObj.description = tempContent;
        } else {
          this.imageObj.description = tempContent;
        }
      }

      this.selleable = response.data.image.isSelleable;
      this.published = response.data.image.isPublished;

      this.pixelS =
        response.data.image.pixels != undefined
          ? response.data.image.pixels
          : await this.getPixel();
      this.relatedPDFs = [];
      this.relatedPDFs =
        response.data.relatedPDF != undefined ||
        response.data.relatedPDF != null
          ? response.data.relatedPDF
          : [];
      this.relatedNotes =
        response.data.relatedNotes != undefined
          ? response.data.relatedNotes
          : [];

      if (this.imageObj?.photographer) {
        this.photographer =
          this.imageObj.photographer?.name +
          " " +
          this.imageObj.photographer?.lname;
      } else {
        this.photographer = "Desconocido";
      }

      //console.log(this.relatedIMGs);
      //console.log("Images");

      //console.log(this.relatedNotes);
      //console.log("notas");
      this.enabledNavigationButtons();

      this.cRelatedContent = {
        type: "image",
        publicationDate: response.data?.image?.publicationDate,
        page: response.data?.image?.page,
        notebookRef: response.data?.image?.noteBookRef?._id,
        publicationRef: response.data?.image?.publicationRef?._id,
        idMegamedia: response.data?.image?.idNoticia || null,
      };

      const cResponse = await this.getRelatedContentd();
      this.relatedPDFs = cResponse?.data?.relatedPDfs;
      this.relatedNotes = cResponse?.data?.relatedNotes;

      this.loading = false;
      await this.addVisit();
    },

    async getPDF(id, year) {
      let url = year ? `/pdfs/${id}/${year}` : `/pdfs/${id}`;

      const response = await this.$axios.$get(url, {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      //console.log("Here is the pdf reponse");
      //console.log(response);
      this.pdfObject = response.data.pdf;

      //pdfObject.imageSrc
      if (this.pdfObject.imageSrc.search("-0.png") != -1) {
        this.pdfObject.imageSrc = this.pdfObject.imageSrc.replace(
          "-0.png",
          ".png"
        );
      }
      this.emailtype = "pdfs";
      this.fileEmailSrc = this.pdfObject.imageSrc.replace(".png", ".pdf");

      this.selleable = response.data.pdf.isSelleable;
      this.published = response.data.pdf.isPublished;
      this.relatedPDFs = [];
      this.allRelatedPDF = [];
      this.relatedPDFs =
        response.data.relatedPDF != undefined ||
        response.data.relatedPDF != null
          ? response.data.relatedPDF
          : [];
      // this.relatedNotes =
      //   response.data.relatedNotes != undefined
      //     ? response.data.relatedNotes
      //     : [];
      // this.relatedIMGs =
      //   response.data.relatedImages != undefined
      //     ? response.data.relatedImages
      //     : [];
      if (this.relatedPDFs.length > 0) {
        // this.allRelatedPDF = this.relatedPDFs;
        try {
          for (let i = 0; i < this.relatedPDFs.length; i++) {
            let response3 = await this.$axios.$get(
              this.imgPath + this.relatedPDFs[i].imageSrc,
              {
                responseType: "blob",
              }
            );
            if (response3) {
              this.allRelatedPDF.push(this.relatedPDFs[i]);
            }
          }
        } catch (error) {}
        this.allRelatedPDF.unshift(this.pdfObject);
      } else {
        this.allRelatedPDF = [];
      }
      //console.log(this.relatedIMGs);
      //console.log("Images");

      //console.log(this.relatedNotes);
      //console.log("notas");

      this.cRelatedContent = {
        type: "pdf",
        publicationDate: response.data?.pdf?.datePublication,
        page: response.data?.pdf?.page,
        notebookRef: response.data?.pdf?.notebook?._id,
        publicationRef: response.data?.pdf?.publication?._id,
        idMegamedia: null,
      };

      const cResponse = await this.getRelatedContentd();
      this.relatedIMGs = cResponse?.data?.relatedImages;
      this.relatedNotes = cResponse?.data?.relatedNotes;

      this.enabledNavigationButtons();
      this.loading = false;
      await this.addVisit();
    },

    getOrginalImage(img) {
      if (img.search("-0.png") != -1) {
        return img.replace("-0.png", ".png");
      } else {
        return img;
      }
    },
    cleanFields() {
      this.id = null;
      this.title = null;
      this.relatedPDF = null;
    },
    openWorkbench() {
      switch (this.mode) {
        case 1:
          //console.log("note id" + this.id);
          this.$refs.addWorkbenchDialog.openDialog(
            "note",
            this.id,
            this.publishDate
          );
          break;

        case 2:
          this.$refs.addWorkbenchDialog.openDialog(
            "image",
            this.imageObj._id,
            this.imageObj.date
          );
          break;

        case 3:
          this.$refs.addWorkbenchDialog.openDialog(
            "pdfs",
            this.pdfObject._id,
            this.pdfObject.dateCreation
          );
          break;
      }
    },
    // setFontSize(size) {
    //   this.fontSize = size;
    // },
    // setFontColor(color) {
    //   this.textColor = ;
    // },
    async getInformation(mode, id, index, year) {
      switch (Number(mode)) {
        case 1:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: id,
              index: index,
              mode: mode,
            },
          });
          await this.getNote(id, year);
          break;

        case 2:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: id,
              index: index,
              mode: mode,
            },
          });
          await this.getImage(id, year);
          break;

        case 3:
          this.$router.push({
            query: {
              ...this.$route.query,
              content: id,
              index: index,
              mode: mode,
            },
          });
          await this.getPDF(id, year);
          break;

        case 4:
          this.mode = 1;
          this.getNote(note);
          break;

        case 5:
          this.mode = 2;
          this.getImage(note);
          break;

        case 6:
          this.mode = 3;
          this.getPDF(note);
          break;
      }
    },
    // NAVIGATION METHODS //////////////
    async forward() {
      this.contentIndex = 0;
      this.paginationState();
      this.loading = true;
      this.disabledNavigationButtons();

      try {
        let newId = "";

        this.index = this.index + 1;
        console.log("index deberia cambiar de pagina ===" + this.index);
        if (this.index >= 20) {
          this.index = 0;
          this.$parent.page += 1;
          this.pageChanged = true;
          if (this.searchtype == "simple") {
            this.refreshFatherPage(Number(this.mode));
          } else {
            this.$parent.getAdvSearch(true);
          }
        }

        console.log("////////// TEST FORWARD //////////");

        if (!this.forwardElement) {
          const response = await this.$axios.$get("/searchnavigation/forward", {
            params: {
              index: this.index,
              page: this.$parent.page,
              searchtype: this.searchtype,
            },
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          });

          newId = response ? response?.data?.foundItems[0]?._id : "";
        } else {
          newId = this.forwardElement.id;
        }

        let _id = newId;

        if (this.forwardElement) {
          let formatedYear = new Date(this.forwardElement.year).getFullYear();
          await this.getInformation(this.mode, _id, this.index, formatedYear);
        } else {
          await this.getInformation(this.mode, _id, this.index);
        }

        this.searchLastItem();

        if (
          this.index == this.indexLast &&
          this.$parent.page == this.fatherPage
        ) {
          this.disabledLastItemAndForward();
        }
      } catch (error) {
        //console.log("error-------go forward");
        console.log(error);
        this.disabledNavigationButtons();
        this.$store.commit("openSnack", "Ha ocurrido un error");
      }
    },
    async backward() {
      this.contentIndex = 0;
      this.paginationState();
      this.loading = true;
      this.disabledNavigationButtons();

      try {
        let newId = "";
        this.index = this.index - 1;
        console.log("index deberia cambiar de pagina ===" + this.index);
        if (this.index < 0) {
          this.index = 19;
          this.$parent.page = this.$parent.page - 1;
          this.pageChanged = true;
          this.$parent.page = this.$parent.page < 1 ? 0 : this.$parent.page;
          if (this.searchtype == "simple") {
            this.refreshFatherPage(Number(this.mode));
          } else {
            this.$parent.getAdvSearch(true);
          }
        }

        // if (this.index >= 20) {
        //   this.index = 0;
        //   this.$parent.page += 1;
        //   this.pageChanged=true
        //   if (this.searchtype == "simple") {
        //     this.refreshFatherPage(Number(this.mode));
        //   } else {
        //     this.$parent.getAdvSearch(true);
        //   }
        // }

        if (!this.backElement) {
          const response = await this.$axios.$get("/searchnavigation/back", {
            params: {
              index: this.index,
              page: this.$parent.page,
              searchtype: this.searchtype,
            },
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          });

          newId = response ? response?.data?.foundItems[0]?._id : "";
        } else {
          newId = this.backElement.id;
        }

        let _id = newId;
        if (this.backElement) {
          console.log("inicia año");
          let formatedYear = new Date(this.backElement.year).getFullYear();
          console.log("entrega año " + formatedYear);
          await this.getInformation(this.mode, _id, this.index, formatedYear);
        } else {
          await this.getInformation(this.mode, _id, this.index);
        }
        console.log("backelement DONE ");

        if (this.index == 0 && this.$parent.page == 1) {
          this.disablesFirstItemAndBackward();
        }
      } catch (error) {
        this.disabledNavigationButtons();
        this.$store.commit("openSnack", "Ha ocurrido un error");
      }
    },
    async lastItem() {
      this.contentIndex = 0;
      this.loading = true;
      this.mode = this.$route.query.mode;
      if (this.searchtype == "simple") {
        this.refreshFatherPage(Number(this.mode));
      }
      this.searchLastItem();

      this.index = this.indexLast;
      this.$parent.page = this.fatherPage;
      this.disabledNavigationButtons();
      try {
        const response = await this.$axios.$get("/searchnavigation/last", {
          params: {
            searchtype: this.searchtype,
          },
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        let _id = response.data.foundItems[0]._id;
        await this.getInformation(this.mode, _id, Number(this.index) + 1);
        this.paginationState();
        this.disabledLastItemAndForward();
      } catch (error) {
        this.disabledNavigationButtons();
        this.$store.commit("openSnack", "Ha ocurrido un error");
      }
    },
    async firstItem() {
      this.contentIndex = 0;
      this.loading = true;
      this.disabledNavigationButtons();
      this.index = 0;
      this.$parent.page = 1;
      this.mode = this.$route.query.mode;

      if (this.searchtype == "simple") {
        this.refreshFatherPage(Number(this.mode));
      }
      try {
        const response = await this.$axios.$get("/searchnavigation/first", {
          params: {
            index: this.index,
            page: this.$parent.page,
            searchtype: this.searchtype,
          },
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        let _id = response.data.foundItems[0]._id;
        await this.getInformation(this.mode, _id, 1);
        this.disablesFirstItemAndBackward();
      } catch (error) {
        this.$store.commit("openSnack", "Ha ocurrido un error");
      }
    },
    enabledNavigationButtons() {
      this.navigationButtons.firstItem = false;
      this.navigationButtons.backward = false;
      this.navigationButtons.forward = false;
      this.navigationButtons.lastItem = false;
    },
    disabledNavigationButtons() {
      this.navigationButtons.firstItem = true;
      this.navigationButtons.backward = true;
      this.navigationButtons.forward = true;
      this.navigationButtons.lastItem = true;
    },
    disabledLastItemAndForward() {
      this.navigationButtons.forward = true;
      this.navigationButtons.lastItem = true;
    },
    disablesFirstItemAndBackward() {
      this.navigationButtons.backward = true;
      this.navigationButtons.firstItem = true;
    },
    searchLastItem() {
      switch (this.mode) {
        case 1:
          if (Math.trunc(this.$parent.elementsCounter % 20 != 0)) {
            this.indexLast =
              this.$parent.elementsCounter -
              Math.trunc(this.$parent.elementsCounter / 20) * 20 -
              2;
            this.fatherPage = Math.trunc(this.$parent.elementsCounter / 20) + 1;
          } else {
            this.indexLast =
              this.$parent.elementsCounter -
              (Math.ceil(this.$parent.elementsCounter / 20) - 1) * 20 -
              2;
            this.fatherPage = Math.trunc(this.$parent.elementsCounter / 20);
          }
          break;
        case 2:
          this.indexLast =
            this.$parent.elementsCounter -
            Math.trunc(this.$parent.elementsCounter / 20) * 20 -
            1;
          this.fatherPage = Math.trunc(this.$parent.elementsCounter / 20) + 1;
          break;
        case 3:
          if (Math.trunc(this.$parent.elementsCounter % 20 != 0)) {
            this.indexLast =
              this.$parent.elementsCounter -
              Math.trunc(this.$parent.elementsCounter / 20) * 20 -
              2;
            this.fatherPage = Math.trunc(this.$parent.elementsCounter / 20) + 1;
          } else {
            this.indexLast =
              this.$parent.elementsCounter -
              (Math.ceil(this.$parent.elementsCounter / 20) - 1) * 20 -
              1;
            this.fatherPage = Math.trunc(this.$parent.elementsCounter / 20);
          }
          break;
      }
    },
    refreshFatherPage(mode) {
      switch (Number(mode)) {
        case 1:
          this.$parent.getSearch();
          break;
        case 2:
          this.$parent.getImages();
          break;
        case 3:
          this.$parent.getPDFs();
          break;
      }
    },
    paginationState() {
      if (this.$parent.page == this.fatherPage) {
        this.lastPagePagination = this.indexLast + 1;
      } else {
        this.lastPagePagination = this.$parent.totalResult;
      }
    },
    async addVisit() {
      this._Id = this.$route.query.content;
      const body = {
        userId: localStorage.user_idC,
        fileId: this.$route.query.content,
        date: new Date().toISOString().substring(0, 10),
        fileType: "Visit",
        mode: this.selectMode(),
      };
      //console.log(body)
      try {
        const response = await this.$axios.$post("/addChartFile", body, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
      } catch (error) {
        console.log(error.response);
      }
    },
    selectMode() {
      switch (Number(this.mode)) {
        case 1:
          return "Notas";
        case 2:
          return "Imagenes";
        case 3:
          return "PDF";
      }
    },
    getPlainText(text) {
      text = !text ? "" : text;
      let plainText = text.split(/(\s+)/);
      let diccionario = [
        /\\n/g,
        "<b>",
        "@",
        "�",
        /■/gi,
        "[",
        "]",
        "^",
        /-/gi,
        /—/gi,
        "±",
        "«",
        "..",
        "*",
        "|",
        /™/gi,
        /_/gi,
      ];

      for (let i = 0; i < plainText.length; i++) {
        for (let j = 0; j < diccionario.length; j++) {
          plainText[i] = plainText[i].replace(diccionario[j], "");
          plainText[i] = plainText[i].replace("%F1", "ñ");
          if (plainText[i].trim() == "" && plainText[i].length > 1) {
            plainText.splice(i, 1);
          }
        }
      }
      // this.content = tempContent;
      return plainText.join("");
    },
    getParaph(text) {
      let count = 0;
      text = !text ? "" : text;
      let getParaph = text.split(/(\s+)/);
      getParaph.forEach((x, index) => {
        if (
          x.search(/\./) != -1 &&
          x.toLowerCase().search("no.") == -1 &&
          x.toLowerCase().search("p.m") == -1 &&
          x.toLowerCase().search("a.m") == -1
        ) {
          count++;
          if (count == 2) {
            if (isNaN(x)) {
              getParaph[index] = x.substring(0, x.search(/\./)) + ". <br><br>";
              getParaph[index + 1] =
                x.substring(x.search(/\./) + 1, x.length) +
                " " +
                getParaph[index + 1];
              //getParaph[index] = getParaph[index] +  "<br><br>";
              //console.log(x + ' ' + index + ' ' + isNaN(x) + ' ' + x.length + ' ' + x.search(/\./))
              count = 0;
            } else {
              count--;
            }
          }
        }
      });

      return getParaph.join("");
    },
    addStrongText(text, simpleText) {
      return text;
      /* text = !text ? "" : text;

      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");

      const text2 = this.removeAccents(text);
      let getParaph = text2.split(/(\s+)/);
      let getParaph2 = text.split(/(\s+)/);
      getParaph.forEach((x, index) => {
        if (x.search(key) != -1) {
          let i = x.search(key);
          //console.log(i + ' ' + x + ' ' + x.search(key) );
          let text = getParaph2[index].substring(i, i + simpleText.length);
          //console.log(text)
          getParaph2[index] = getParaph2[index].replaceAll(
            text,
            '<mark class="markbg" style="background-color: lightblue;"><b style="color: #001689; ">' +
              text +
              "</b></mark>"
          );
        }
      });

      return getParaph2.join("");*/
    },
    addStrongKeySetence(text, simpleText) {
      return text;
      /* text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");

      const text2 = this.removeAccents(text);
      // console.log(text2);
      // let getParaph = text2.split(key);

      let index = text2.search(key);

      if (index != -1) {
        text =
          text.substring(0, index) +
          '<mark class="markbg" style="background-color: lightblue;"><b style="color: #001689">' +
          text.substring(index, index + simpleText.length) +
          "</b></mark>" +
          text.substring(index + simpleText.length, text.length);
      }
      return text;*/
    },
    async getPixel() {
      const img = new Image();
      img.src = this.imgPath + this.imageObj.imageSrc;
      img.onload = () => {
        this.pixelS = img.width + " x " + img.height;
      };
      try {
        const response = await this.$axios.$put("/imageP", {
          id: this._Id,
          size: this.pixelS,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
      } catch (error) {
        console.log(error);
      }
      return img.width + " x " + img.height;
    },
    async getPermissions(note, mode, index, searchType, year) {
      try {
        const response = await this.$axios.$get(
          "/users/" + localStorage.user_idC,
          {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          }
        );

        let data = response.data.permissions[0].permissions;
        let formatedYear = year ? new Date(year).getFullYear() : "";
        console.log("formatedYear---------" + formatedYear);
        for (let i = 0; i < data.length; i++) {
          //console.log(data[i] + ' ' + mode  + ' <----')
          if (data[i] == "60d47ee00f82f40014419ae5") {
            this.openDialog(note, mode, index, searchType, formatedYear);
            return true;
          }
          if (
            data[i] == "60d47eec0f82f40014419ae6" &&
            (mode == 1 || mode == 4)
          ) {
            this.openDialog(note, mode, index, searchType, formatedYear);
            return true;
            //notasz<
          }

          if (
            data[i] == "60d47ef70f82f40014419ae7" &&
            (mode == 2 || mode == 5)
          ) {
            this.openDialog(note, mode, index, searchType, formatedYear);
            return true;
            //Imágenes
          }

          if (
            data[i] == "60d47f290f82f40014419ae8" &&
            (mode == 3 || mode == 6)
          ) {
            this.openDialog(note, mode, index, searchType, formatedYear);
            return true;
            //Imágenes
          }
        }
        return false;
      } catch (error) {}
    },
    removeAccents(str) {
      // console.log(str)
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    async addReport() {
      try {
        this.dialogMensajero = false;

        const user = await this.$axios.$get("/users/" + localStorage.user_idC, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });

        const body = {
          name: user.data.name,
          email: user.data.email,
          description:
            "La foto está en la carpeta " +
            this.imageObj.carpetaOrigen +
            " clave " +
            this.imageObj.ImageTitle,
          userId: localStorage.user_idC,
          fileId: this.imageObj._id,
          mode: "Imagenes",
          path: this.$route.fullPath,
          fromMensajero: true,
        };

        const response = await this.$axios.$post("/addReport", body, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });

        this.$store.commit(
          "openSnack",
          "Se ha enviado la solicitud al mensajero."
        );
      } catch (error) {
        console.log(error.response);
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, vuelva a intentarlo from"
        );
      }
    },
  },
};
</script>

<style scope>
.v-card__title {
  line-height: 1.5rem !important;
  word-break: inherit !important;
}
.markbg {
  background-color: lightblue;
}

.pdf-app .toolbar,
#errorWrapper {
  z-index: auto !important;
}
</style>
