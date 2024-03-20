<template>
  <div>
    <v-divider class="ma-3"></v-divider>
    <label>Imágenes relacionadas</label><br />

    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex
          xs6
          :class="$vuetify.breakpoint.mdAndUp ? 'xs6' : $vuetify.breakpoint.smAndUp ? 'xs3' : 'xs12'"
          v-for="(item, index) in relatedIMGs"
          v-bind:key="index"
        >
          <v-img
            :src="imgPath + item.imageSrc"
            :lazy-src="imgPath + item.imageSrc"
            aspect-ratio="1"
            max-height="150"
            max-width="150"
            class="grey lighten-2"
            style="cursor : pointer"
            @click="openOtherDialog(); $refs.imgrelateddialogdos.openDialog( item ); "
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
        </v-flex>
      </v-layout>
    </v-container>
    <imgrelateddialogdos ref="imgrelateddialogdos" @closeOtherDialog="closeOtherDialog()"/>
  </div>
</template>

<script>
  import imgrelateddialogdos from '~/components/imgrelateddialogdos.vue';
  export default {
    components : {
      imgrelateddialogdos
    },
    data(){
      return {
        imgPath: process.env.imgPath,

      }
    },
    methods: {
      openOtherDialog(){
        this.$emit('openOtherDialog');
      },
      closeOtherDialog(){
        this.$emit('closeOtherDialog');
      },
    },
    props : {
      relatedIMGs : {
        type : Array
      }
    }
  }
</script>

<style>

</style>
