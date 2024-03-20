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
        :title="'Artículos de:'"
        :allWords="true"
        :icon="false"
      />
      <div style="margin-bottom: 10px" v-if="searched != ''">
        <h2>
          <span class="primary--text"> Resultado de: </span>{{ searched }}
        </h2>
      </div>
      <v-card outlined style="overflow-y: scroll">
        <v-card-title v-html="title"></v-card-title>

        <div
          v-if="
            subTitle != undefined && subTitle != null && subTitle.trim() != ''
          "
          class="subtitle-2 ml-5"
          v-html="subTitle"
        ></div>
        <div
          v-if="author != undefined && author != null && author.trim() != ''"
          class="subtitle-2 ml-5"
          v-html="'Autor: ' + author"
        ></div>

        <v-card-text
          :style="
            'color : ' +
            fontColor +
            ';max-height: 82vh; font-size:' +
            fontSize +
            'px'
          "
        >
          <div class="context" v-html="content"></div>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md4 v-if="!loading">
      <v-card outlined>
        <v-card-text>
          <div class="mr-5 ml-5">
            <v-img :src="imgPath + icon" :lazy-src="imgPath + icon" />
          </div>

          <v-divider class="ma-3"></v-divider>
          <label>Información</label><br />

          <Content-Card-List
            type="notes"
            :id="idMegamedia != undefined ? idMegamedia : ''"
            :idMegamedia="id != undefined ? id : ''"
            :date="
              publishDate != undefined
                ? new Date(publishDate).toISOString().substring(0, 10)
                : ''
            "
            :section="section != undefined ? section : ''"
            :taked="taked != undefined ? taked : ''"
            :agency="agency != undefined ? agency : ''"
            :page="page != undefined ? page : ''"
            :material="material != undefined ? material : ''"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :author="author != undefined || author != null ? author : null"
          />

          <!--
          <v-divider class="ma-3"></v-divider>

          <label>Observaciones</label><br />
          <v-card-text>
            <span v-if="observations == undefined || observations == null ">Sin observaciones</span>
            <span v-else>{{ observations }}</span>
          </v-card-text>-->

          <ReleatedPDFs
            :relatedPDFs="relatedPDFs"
            v-if="relatedPDFs.length > 0"
          />
          <ReleatedIMGs
            :relatedIMGs="relatedIMGs"
            v-if="relatedIMGs.length > 0"
          />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
        integrity=
"sha512-5CYOlHXGh6QpOFA/TeTylKLWfB3ftPsde7AnmhuitiTX4K5SqCLBeKro6sPS8ilsz1Q4NRx3v8Ko2IBiszzdww=="
        crossorigin="anonymous">
</script>

<script>
import unorm from 'unorm';
//advSearch
import ContentCardList from "~/components/ContentCardList";
import AdvSearchChips from "~/components/advSearchChips.vue";

import ReleatedIMGs from "~/components/ReleatedIMGs.vue";
import ReleatedPDFs from "~/components/ReleatedPDFs.vue";

export default {
  components: {
    ContentCardList,
    AdvSearchChips,
    ReleatedIMGs,
    ReleatedPDFs,
  },
  data: () => ({
    imgPath: process.env.imgPath,
    showPDFR: "",
    searched: null,
  }),
  watch: {
    locationChanged: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        //console.log( newValue )
        //console.log(this.$parent.$parent.$parent.$parent.locationChanged)
      },
    },
    loading(val) {
      if (val == false) {
        if (this.$route.query.searched != undefined) {
          this.searched = this.$route.query.searched;
        } else {
          this.searched = "";
        }
        this.strongword();
      }
    },
  },
  props: {
    loading: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    id: {
      type: String,
    },
    idMegamedia: {
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
    relatedIMGs: {
      type: Array,
    },
    icon: {
      type: String,
    },

    fontSize: {
      type: String,
    },
    fontColor: {
      type: String,
      default: "000",
    },
    subTitle: {
      type: String,
    },
    author: {
      type: String,
      default: null,
    },
    observations: {
      type: String,
    },
    locationChanged: {
      type: Boolean,
    },
    advSearch: {},
  },
  methods: {
    async strongword() {
      setTimeout(() => {
        const textsearch = document.querySelector(".context");
          if(this.$route.query.searched !== undefined) {
            this.advSearch = {
              keywords: null,
            };
            this.advSearch.keywords = this.$route.query.searched;
          }
          const keywords = this.advSearch?.keywords?.trim()?.split(' ') ?? [];
          const keysentence = this.advSearch?.keysentence?.trim() ?? null;

          if(keysentence !== null) {
            const normalizedSearchText = unorm.nfkd(keysentence).replace(/[\u0300-\u036F]/g, '');
            const normalizedText = unorm.nfkd(textsearch?.innerHTML).replace(/[\u0300-\u036F]/g, '');
            const cRegex = new RegExp(normalizedSearchText.toLowerCase(), "gi");

            textsearch.innerHTML = normalizedText.replaceAll(cRegex, function(match, index, original) {
                return "<strong style='color: blue;'>" + textsearch.innerHTML?.substring(index, index + match.length) + "</strong>";
            });
          }

          for(const x of keywords) {
            // console.log(x)
            if(x.trim() !== ''){

              const normalizedSearchText = unorm.nfkd(x).replace(/[\u0300-\u036F]/g, '');
              const normalizedText = unorm.nfkd(textsearch?.innerHTML).replace(/[\u0300-\u036F]/g, '');
              const cRegex = new RegExp(normalizedSearchText.toLowerCase(), "gi");

              textsearch.innerHTML = normalizedText.replaceAll(cRegex, function(match, index, original) {
                  return "<strong style='color: blue;'>"+ textsearch.innerHTML?.substring(index, index + match.length) + "</strong>";
              });
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
</style>


