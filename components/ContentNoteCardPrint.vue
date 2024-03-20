<template>
  <v-layout row wrap justify-center id="toPrint2">
    <v-flex style="padding:15px" :class="relatedPDFs.length > 0 ? 'xs12 md9' : 'xs12'" v-if="!loading && locationChanged">
    <!--<v-flex xs12 md9 v-if="!loading && !$parent.$parent.$parent.$parent.locationChanged">-->
      <v-card flat class="pa-3">
        <v-card-text>
          <ContentCardListPrint
            type="notes"
            :id="id != undefined ? id : ''"
            :publishDate="publishDate != undefined ? new Date(publishDate).toISOString().substring(0,10) : ''"
            :section="section != undefined ? section : ''"
            :taked="taked != undefined ? taked : ''"
            :agency="agency != undefined ? agency : ''"
            :page="page != undefined ? page : ''"
            :material="material != undefined ? material : ''"
            :published="published != undefined ? published : false"
            :selleable="selleable != undefined ? selleable : false"
            :author="author != undefined || author != null ? author : null"
            :icon="icon"
            :isPrint="true"
            :title="title"
            :subTitle="subTitle"
            :idMegamedia="idMegamedia"
          />
        </v-card-text>
        <!-- <v-card-title>{{ title }}</v-card-title> -->
        <!-- <div v-if="subTitle != undefined && subTitle != null && subTitle.trim() != '' " class="subtitle-2 ml-5"> {{ subTitle }} </div> -->
        <div v-if="author != undefined && author != null && author.trim() != '' " class="subtitle-2 ml-5" v-html=" 'Autor: '+ author "></div>

        <v-card-text :style="'color : ' + fontColor + '; font-size:' + fontSize + 'px;'" v-html="content"></v-card-text>
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
    <PDFRelatedDialog ref="pdfDialog"/>
  </v-layout>
</template>

<script>
    import ContentCardListPrint from '~/components/ContentCardListPrint.vue';
    import PDFRelatedDialog from '~/components/PDFRelatedDialog.vue'
    import PHE from "print-html-element";

    import { mapState } from "vuex";

export default {
  components: {
    ContentCardListPrint,
    PDFRelatedDialog
  },
  data:() => ({
    imgPath: process.env.imgPath,
    showbutton : true,
  }),
  watch : {
    locationChanged : {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {

      }
    },
  },
  computed: {
    ...mapState(["locationIsChanged"]),
  },
  props: {
    loading: {
      type: Boolean
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    id: {
      type: String
    },
    publishDate: {
      type: String
    },
    section: {
      type: String
    },
    taked: {
      type: String
    },
    agency: {
      type: String
    },
    page: {
      type: Number
    },
    material: {
      type: String
    },
    published: {
      type: Boolean
    },
    selleable: {
      type: Boolean
    },
    relatedPDFs: {
      type: Array
    },
    icon: {
      type: String
    },

    fontSize: {
      type: String
    },
    fontColor : {
      type : String,
      default : '000'
    },
    subTitle : {
      type : String
    },
    author : {
      type : String
    },
    observations : {
      type : String
    },
    locationChanged : {
      type : Boolean
    },
    allPrint : {
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
    print(){
      this.showbutton = false;
      setTimeout(() => {
        PHE.printElement( document.getElementById('toPrint2'));

        this.$parent.$parent.$parent.$parent.$parent.$parent.notePrint = false;
        this.showbutton = true;
      }, 1);
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
