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
          <v-icon>mdi-file</v-icon>
          <v-spacer />
          <v-toolbar-title>

            <h5>{{pdfTitle !== null ? pdfTitle.substring(0, 25) : '' }}...</h5>
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text v-if="isError">
        <v-img class="mt-5" :src="errImgPath" :lazy-src="errImgPath"></v-img>
      </v-card-text>
      <v-card-text v-if="!isError">
            <!---vizualizador pdf secundario---->
        <v-row>
          <v-col>
        <client-only>
          <vue-pdf-app
           style="height:900px"
            v-if="showPDF && showPDFBig"
            :pdf="showPDFSrc"
            :config="config"
          ></vue-pdf-app>
          <!--vue-pdf-app v-if="showPDF" :pdf="showPDFSrc" :id-config="idConfig">
                    <template #viewer-prepend>
                        <div class="viewer-prepend">
                        <button :id="idConfig.zoomIn" type="button">Zoom in</button>
                        </div>
                    </template>
                </vue-pdf-app-->

          <!---div style="top:-99.7%; width:26%; left:73%; padding: 15px 12px; background-color: rgb(108,117,125); position: relative; z-index 200000"></div-->
        </client-only>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("keypress", function(e) {
      console.log(String.fromCharCode(e.keyCode));
    });
  },
  data() {
    return {
      showPDFBig: true,
      imgPath: process.env.imgPath,
      errImgPath: process.env.errorImagePath,
      isError: false,
      dialog: false,
      showPDFSrc: null,
      idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId" },
      config: {
        toolbar: {
          toolbarViewerRight: {
            presentationMode: false,
            openFile: false,
            print: false,
            download: false,
            viewBookmark: false,
          },
        },
      },

      // disable whole page navigation panel
      config2: {
        toolbar: {
          toolbarViewerLeft: false,
        },
      },

      // disable whole panel
      config3: {
        toolbar: false,
      },
      showPDF: false,
    };
  },
  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.showPDFSrc = null;
        this.showPDF = false;

        this.showPDFBig = false;
        this.$emit("closeDialog");
        this.dialog = false;
      }
    },
  },
  props: {
    pdfSrc: {
      type: String,
      require: true,
    },
    pdfTitle: {
      type: String,
    },
  },
  methods: {
    closeDialog() {
      this.showPDFBig = false;
      this.$emit("closeDialog");
      this.dialog = false;
    },
    async openDialog() {
      //console.log(this.pdfSrc);
      this.isError = false;
      this.showPDFBig = true;
      this.pdfSrc = this.pdfSrc.replaceAll("tn_", "");
      this.showPDFSrc =
        this.imgPath + this.pdfSrc.substring(0, this.pdfSrc.length - 3) + "pdf";

      try {
        // const response = await this.$axios.$get(this.showPDFSrc, {
        //   responseType: "blob",
        // });

        // //console.log(this.pdfSrc);
        this.dialog = true;
        setTimeout(() => {
          this.showPDF = true;
        }, 1);
      } catch (error) {
        this.isError = true;
        this.dialog = true;
      }
    },
    openHandler(pdfApp) {
      window._pdfApp = pdfApp;
    },
  },
};
</script>

<style scoped>
</style>
