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
      <v-card outlined>
        <AdvSearchChips
          v-if="advSearch"
          :chips="advSearch"
          :isWhiteText="true"
          :color="'secondary'"
          :title="'Imágenes de:'"
          :allWords="true"
          :icon="false"
        />
        <v-card-title v-if="searched != ''"
          ><span class="primary--text">Imágenes de:</span
          >{{ searched }}</v-card-title
        >

        <v-card-text>
          <v-img
            :src="img"
            :lazy-src="img"
            @error="errorHandler()"
            @click="$refs.zoomDialog.openDialog(img)"
            v-ripple
            style="cursor: pointer"
            contain
            max-height="75vh"
          ></v-img>
          <!--<h1 class="image-footer"
          v-if="title != null"
          >{{ title }}</h1>-->
        </v-card-text>
        <v-card-text
          v-if="description != null || description != ''"
          :style="'max-height: 82vh; overflow-y: scroll'"
          class="image-text"
        >
          <div class="context"><p v-html="description"></p></div>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md4 v-if="!loading">
      <v-card outlined>
        <v-card-text>
          <div class="mr-10 ml-10">
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
            type="images"
            :fromMensajero="fromMensajero"
            :id="id != undefined ? id : ''"
            :date="
              publishDate != undefined
                ? new Date(publishDate).toISOString().substring(0, 10)
                : ''
            "
            :section="section != undefined ? section : ''"
            :taked="taked != undefined ? taked : ''"
            :location="location != undefined ? location : ''"
            :place="place != undefined ? place : ''"
            :idMegamedia="idMegamedia != undefined ? idMegamedia : ''"
            :agency="agency != undefined ? agency : ''"
            :clasification="clasification != undefined ? clasification : ''"
            :photographer="
              photographer != undefined || photographer != null
                ? photographer
                : ''
            "
            :page="page != undefined || page != null ? page : ''"
            :material="material != undefined ? material : null"
            :published="
              published != undefined || published != null ? published : false
            "
            :selleable="
              selleable != undefined || selleable != null ? selleable : false
            "
            :size="pixel != undefined || pixel != null ? pixel : ''"
            :descriptors="
              observations != undefined || observations != null
                ? observations
                : ''
            "
          />

          <NoteRelated
            :relatedNotes="relatedNotes"
            v-if="relatedNotes.length > 0"
          />
          <PDFRelated
            :relatedPDFs="relatedPDFs"
            v-if="relatedPDFs.length > 0"
          />
        </v-card-text>
      </v-card>
    </v-flex>
    <Content-Zoom-Dialog ref="zoomDialog" />
    <PDF-Related-Dialog ref="pdfDialog" />
  </v-layout>
</template>
    <script src="|https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
        integrity=
"sha512-5CYOlHXGh6QpOFA/TeTylKLWfB3ftPsde7AnmhuitiTX4K5SqCLBeKro6sPS8ilsz1Q4NRx3v8Ko2IBiszzdww=="
        crossorigin="anonymous">
</script>
<script>
import unorm from "unorm";

import ContentCardList from "~/components/ContentCardList";
import ContentZoomDialog from "~/components/ContentZoomDialog";
import AdvSearchChips from "~/components/advSearchChips.vue";
import PDFRelatedDialog from "~/components/PDFRelatedDialog";

import PDFRelated from "~/components/ReleatedPDFs.vue";
import NoteRelated from "~/components/RelatedNotes.vue";

export default {
  components: {
    ContentCardList,
    ContentZoomDialog,
    AdvSearchChips,
    PDFRelatedDialog,
    PDFRelated,
    NoteRelated,
  },
  data: () => ({
    imgPath: process.env.imgPath,
    errImgPath: process.env.errorImagePath,
    mesajeroIMGMega: process.env.mesajeroIMGMega,

    searched: null,
    img: null,
    secondTime: false,
  }),
  watch: {
    loading(val) {
      this.img = this.imgPath + this.image;
      if (val == false) {
        if (this.$route.query.searched != undefined) {
          this.searched = this.$route.query.searched;
        } else {
          this.searched = "";
        }
        this.strongword();
      }
    },
    description() {},
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
      // type: String,
    },
    idMegamedia: {},
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
    relatedNotes: {
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
    advSearch: {},
    fromMensajero: {
      type: Boolean,
      default: false,
    },
    _id: {
      type: String,
    },
    pathImg: {
      type: String,
    },
  },
  methods: {
    errorHandler() {
      if (!this.secondTime) {
        if (this.img.search("png") != -1) {
          this.img = this.img.substring(0, this.img.length - 3) + "jpg";
        } else {
          this.img = this.img.substring(0, this.img.length - 3) + "png";
        }
        //console.log('There was change')
        this.secondTime = true;
        this.$store.commit("setIsMensajer", false);
      } else {
        this.img = this.errImgPath;
        if (this.fromMensajero) {
          this.img = this.mesajeroIMGMega;
          this.$store.commit("setIsMensajer", true);
          // this.addReport();
        }
        this.$forceUpdate();
      }
    },
    async strongword() {
      setTimeout(() => {
        const textsearch = document.querySelector(".context");
        if (this.$route.query.searched !== undefined) {
          this.advSearch = {
            keywords: null,
          };
          this.advSearch.keywords = this.$route.query.searched;
        }
        const keywords = this.advSearch?.keywords?.trim()?.split(" ") ?? [];
        const keysentence = this.advSearch?.keysentence?.trim() ?? null;

        if (keysentence !== null) {
          const normalizedSearchText = unorm
            .nfkd(keysentence)
            .replace(/[\u0300-\u036F]/g, "");
          const normalizedText = unorm
            .nfkd(textsearch?.innerHTML)
            .replace(/[\u0300-\u036F]/g, "");
          const cRegex = new RegExp(normalizedSearchText.toLowerCase(), "gi");

          textsearch.innerHTML = normalizedText.replaceAll(
            cRegex,
            function (match, index, original) {
              return (
                "<strong style='color: blue;'>" +
                textsearch.innerHTML?.substring(index, index + match.length) +
                "</strong>"
              );
            }
          );
        }

        for (const x of keywords) {
          // console.log(x)
          if (x.trim() !== "") {
            const normalizedSearchText = unorm
              .nfkd(x)
              .replace(/[\u0300-\u036F]/g, "");
            const normalizedText = unorm
              .nfkd(textsearch?.innerHTML)
              .replace(/[\u0300-\u036F]/g, "");
            const cRegex = new RegExp(normalizedSearchText.toLowerCase(), "gi");

            textsearch.innerHTML = normalizedText.replaceAll(
              cRegex,
              function (match, index, original) {
                return (
                  "<strong style='color: blue;'>" +
                  textsearch.innerHTML?.substring(index, index + match.length) +
                  "</strong>"
                );
              }
            );
          }
        }
      }, 1000);
    },
  },
  mounted() {
    if (this.$route.query.searched != undefined) {
      this.searched = this.$route.query.searched;
    } else {
      this.searched = "";
    }
    this.strongword();
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

.image-text {
  color: rgba(0, 0, 0, 0.7) !important;
}
.highlight {
  background-color: lightblue !important;
  color: #001689 !important;
  font-weight: 400 !important;
}
</style>
