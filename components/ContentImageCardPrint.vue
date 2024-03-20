<template>
  <v-layout row wrap justify-center id="toPrint2">
    <v-flex
      :class="relatedPDFs.length > 0 ? 'xs12 md9' : 'xs12'"
      xs12
      v-if="!loading && locationIsChanged"
    >
      <v-card flat>
        <v-card-text>
          <ContentCardListPrint
            type="images"
            :id="id != undefined ? id : ''"
            :publishDate="
              publishDate != undefined
                ? new Date(publishDate).toISOString().substring(0, 10)
                : ''
            "
            :section="
              section != undefined || section != null || section != ''
                ? section
                : ''
            "
            :taked="
              taked != undefined || taked != null || taked != '' ? taked : ''
            "
            :location="
              location != undefined || location != null || location != ''
                ? location
                : ''
            "
            :place="
              place != undefined || place != null || place != '' ? place : ''
            "
            :agency="
              agency != undefined || agency != null || agency != ''
                ? agency
                : ''
            "
            :clasification="
              clasification != undefined ||
              clasification != null ||
              clasification != ''
                ? clasification
                : ''
            "
            :photographer="
              photographer != undefined ||
              photographer != null ||
              photographer != ''
                ? photographer
                : ''
            "
            :page="page != undefined || page != null || page != '' ? page : ''"
            :material="
              material != undefined || material != null || material != ''
                ? material
                : null
            "
            :published="
              published != undefined || published != null || published != ''
                ? published
                : false
            "
            :selleable="
              selleable != undefined || selleable != null || selleable != ''
                ? selleable
                : false
            "
            :size="
              pixel != undefined || pixel != null || pixel != '' ? pixel : ''
            "
            :descriptors="
              observations != undefined ||
              observations != null ||
              observations != ''
                ? observations
                : ''
            "
            :icon="icon"
            :idMegamedia="idMegamedia != undefined ? idMegamedia : null"
          />
        </v-card-text>
        <!--v-card-title
          ><span class="primary--text">Imágenes de:</span>{{ searched }}</v-card-title
        -->

        <v-card-text>
          <v-layout row wrap class="ml-5">
            <img
              class="center"
              :src="forceOpen2 ? imgPath + image : img"
              @error="errorHandler()"
              style="max-height: 480px"
              v-if="true"
            />
            <v-card-text
              class="mr-5 ml-5 image-text"
              v-if="description != null || description != ''"
              v-html="description"
            ></v-card-text>
          </v-layout>
          <!--<h1 class="image-footer"
          v-if="title != null"
          >{{ title }}</h1>-->
        </v-card-text>
        <!--<v-card-text v-if="description != null || description != ''" :style="'max-height: 82vh; overflow-y: scroll'" v-html="description"></v-card-text>-->
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

    <Content-Zoom-Dialog ref="zoomDialog" />
    <PDFRelatedDialog ref="pdfDialog" />
  </v-layout>
</template>

<script>
import ContentCardListPrint from "~/components/ContentCardListPrint.vue";
import ContentZoomDialog from "~/components/ContentZoomDialog";
import PDFRelatedDialog from "~/components/PDFRelatedDialog.vue";
import PHE from "print-html-element";

import { mapState } from "vuex";

export default {
  components: {
    ContentZoomDialog,
    ContentCardListPrint,
    PDFRelatedDialog,
  },
  data: () => ({
    imgPath: process.env.imgPath,
    errImgPath: process.env.errorImagePath,
    searched: null,
    img: null,
    secondTime: false,

    showbutton: true,
    forceOpen2: true,
  }),
  watch: {
    loading() {
      this.img = this.imgPath + this.image;
    },
  },
  computed: {
    ...mapState(["locationIsChanged"]),
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
    location: {
      type: String,
    },
    place: {
      type: String,
    },
    agency: {
      type: String,
    },
    clasification: {
      type: String,
    },
    page: {
      type: Number,
    },
    photographer: {
      type: String,
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
    },
    pixel: {
      type: String,
    },
    description: {
      type: String,
    },
    observations: {
      type: String,
    },
    forceOpen: {
      type: Boolean,
      default: false,
    },
    isPrint: {
      type: Boolean,
      default: true,
    },
    fromMensajero: {
      type: Boolean,
      default: false,
    },
    idMegamedia: {
      type: String,
    },
  },
  methods: {
    errorHandler() {
      this.forceOpen2 = false;
      this.img = this.imgPath + this.image;
      if (!this.secondTime) {
        if (this.img.search("png") != -1) {
          this.img = this.img.substring(0, this.img.length - 3) + "jpg";
        } else {
          this.img = this.img.substring(0, this.img.length - 3) + "png";
        }
        //console.log('There was change')
        this.secondTime = true;
      } else {
        (this.img = this.errImgPath), this.$forceUpdate();
      }
    },
    print() {
      this.showbutton = false;
      setTimeout(() => {
        PHE.printElement(document.getElementById("toPrint2"));

        this.$parent.$parent.$parent.$parent.$parent.$parent.notePrint = false;
        this.showbutton = true;
      }, 1);
    },
  },
  mounted() {
    if (this.$route.query.searched != undefined) {
      this.searched = this.$route.query.searched;
    }
  },
};
</script>

<style lang="scss" scoped>
.image-footer {
  margin-top: 1rem;
  font-size: 16px;
  line-height: 1rem;
  font-weight: 400;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.image-text {
  color: rgba(0, 0, 0, 0.7) !important;
}
</style>
