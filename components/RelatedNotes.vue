<template>
  <div>
    <v-divider class="ma-3"></v-divider>
    <label>Notas relacionadas</label><br />

    <v-list dense>
      <v-layout row wrap>
        <v-list-item
          class="list"
          style="min-height: 25px; cursor: pointer"
          v-for="(item, index) in relatedNotes"
          v-bind:key="index"
        >
          <a style="text-decoration:none" target="_blank" :href="generateTab(item)">
            <!-- <v-list-item-content style="padding: 2px 0"> -->
              <!-- <v-list-item-title style="font-size: 16px; font-weight: 400"> -->
                <!-- <b
                  style="color: black"
                  v-html="
                    item.title != undefined ? item.title.substring(0, 30) : ''
                  "></b> -->
                  <b
                  style="color: black"
                  v-html="
                    item.title
                  "></b>
                <!-- </v-list-item-title> -->
            <!-- </v-list-item-content> -->
          </a>
        </v-list-item>
        <!-- <v-flex
          :class="$vuetify.breakpoint.mdAndUp ? 'xs12' : $vuetify.breakpoint.smAndUp ? 'xs4' : 'xs12'"
          v-for="(item, index) in relatedNotes"
          v-bind:key="index"
        >
          <v-card ripple @click="$refs.pdfDialog.openDialog(item)">
            <v-card-title>hola</v-card-title>
            <v-card-text>dasjioas asidasoid asiodasjiodj asiodjasoidioasjo asdiosadoi</v-card-text>
            <div v-if="item.title != undefined && item.title != null && item.title.trim() != '' " class="subtitle-2 ml-5" v-html="item.title != undefined ? item.title.substring(0, 20) : ''"> </div>

            <v-card-text v-html="item.content != undefined ? item.content.substring(0,40) : ''"></v-card-text>

          </v-card>
          <v-list-item class="list" style="min-height: 25px">
            <v-list-item-content style="padding: 2px 0">
              <v-list-item-title style="font-size: 16px; font-weight: 400;"
                ><b style="color: black" v-html="item.title != undefined ? item.title.substring(0, 30) : ''"></b></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

        </v-flex> -->
        <NoteRelatedDialog
          ref="noteRelatedDialog"
          @closeOtherDialog="closeOtherDialog()"
        />
      </v-layout>
    </v-list>
  </div>
</template>

<script>
import NoteRelatedDialog from "~/components/NoteRelatedDialog.vue";
export default {
  components: {
    NoteRelatedDialog,
  },
  props: {
    relatedNotes: {
      type: Array,
    },
  },
  methods: {
    openOtherDialog() {
      //console.log("se abre una nota desde otro lado");
      this.$emit("openOtherDialog");
    },
    closeOtherDialog() {
      this.$emit("closeOtherDialog");
    },
    generateTab(item) {
      let pathaux = this.$route.fullPath.toString().split("&");
      let encodedUrl = "";

      if (this.$route.path == "/advSearch") {
        let advSearchObj = JSON.parse(atob(this.$route.query.search));
        advSearchObj.search = "Notas";
        encodedUrl = `/advSearch?search=${btoa(JSON.stringify(advSearchObj))}`;
      } else {
        encodedUrl = pathaux[0];
      }
      return (
        "https://megateca.megamedia.com.mx/relatedContent" +
        "?content=" +
        item._id +
        "&index=1&mode=1&year=" +
        item.date
      );
    },
  },
};
</script>

<style>
</style>
