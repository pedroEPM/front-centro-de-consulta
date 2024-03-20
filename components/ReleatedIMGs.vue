<template>
  <div>
    <v-divider class="ma-3"></v-divider>
    <label>Imágenes relacionadas</label><br />

    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex
          xs6
          :class="
            $vuetify.breakpoint.mdAndUp
              ? 'xs6'
              : $vuetify.breakpoint.smAndUp
              ? 'xs3'
              : 'xs12'
          "
          v-for="(item, index) in relatedIMGs"
          v-bind:key="index"
        >
          <template>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <a target="_blank" :href="generateTab(item)">
                  <v-img
                    :src="item.newSRC !== undefined ? imgPath + item.newSRC : imgPath + item.imageSrc"
                    :lazy-src="imgPath + item.imageSrc"
                    aspect-ratio="1"
                    max-height="150"
                    max-width="150"
                    class="grey lighten-2 custom-image"
                    style="cursor: pointer"
                    v-bind="attrs"
                    v-on="on"
                    @error="errorHandler(index)"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </a>
              </template>
              <span><div>
                <p>{{ createDescriptorRow1(item.description) }}<br>
                {{ createDescriptorRow2(item.description) }}<br>
                {{ createDescriptorRow3(item.description) }}</p>
              </div></span>
            </v-tooltip>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
    <IMGRelatedDialog
      ref="IMGRelatedDialog"
      @closeOtherDialog="closeOtherDialog()"
    />
  </div>
</template>

<script>
import IMGRelatedDialog from "~/components/IMGRelatedDialog.vue";
export default {
  components: {
    IMGRelatedDialog,
  },
  props: {
    relatedIMGs: {
      type: Array,
    },
  },
  data() {
    return {
      imgPath: process.env.imgPath,
    };
  },
  methods: {
    errorHandler(index){
      this.relatedIMGs.splice(index, 1);
      this.$forceUpdate()
    },
    openOtherDialog() {
      this.$emit("openOtherDialog");
    },
    closeOtherDialog() {
      this.$emit("closeOtherDialog");
    },
    createDescriptorRow1(text){
      text = (text)?text:""
      let p1 = (text.substring(0,46))? text.substring(0,46):''
      let s1 = (p1[p1.length-1]==' ') ? '' : '-'
      let t = p1+s1
      return t
    },
    createDescriptorRow2(text){
      text = (text)?text:""
      let p2 = (text.substring(46,91))? text.substring(46,91):''
      let s2 = (p2[p2.length-1]==' ') ? '\n' : '- \n'
      let t = p2+s2
      return t
    },
    createDescriptorRow3(text){
      text = (text)?text:""
      let p3 = (text.substring(91,135))? text.substring(91,135):''
      p3 = (p3.length>1) ? p3+'...':''
      let t = p3
      return t
    },
    generateTab(item) {
      let pathaux = this.$route.fullPath.toString().split("&");
      let encodedUrl = "";

      if (this.$route.path == "/advSearch") {
        let advSearchObj = JSON.parse(atob(this.$route.query.search));
        advSearchObj.search = "Imagenes";
        encodedUrl = `/advSearch?search=${btoa(JSON.stringify(advSearchObj))}`;
      } else {
        encodedUrl = pathaux[0];
      }

      return (
        "https://megateca.megamedia.com.mx/relatedContent" +
        "?content=" +
        item._id +
        "&index=1&mode=2&year=" +
        item.date
      );
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-image ::v-deep .v-image__image{
    background-position: center; 
    background-size: contain; 
    background-color: white;
    background-color: #fff;
  }
</style>
