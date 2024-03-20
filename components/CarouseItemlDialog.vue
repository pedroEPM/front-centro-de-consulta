<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="1000"
    v-model="dialog"
  >
    <v-card class="rounded-xl">
      <v-toolbar
        color="#FFF"
        dark
        flat
      >
        <v-spacer />
        <v-btn icon @click="dialog = false" color="grey"> <v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-layout row wrap justify="center">
          <v-flex>
            <v-img @click="externalURL != null ? openPage() : dialogFake = false " :style="externalURL != null ? 'cursor : pointer' : ''" :src="imgPath + img" max-height="500"></v-img>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-subtitle>{{ description }}</v-card-subtitle>
    </v-card>
  </v-dialog>
</template>


<script>
  export default {
    data(){
      return {
        imgPath: process.env.imgPath,
        dialog : false,
        dialogFake : null,
        img : null,
        date : null,
        description : null,
        externalURL : null
      }
    },
    methods : {
      openDialog( item ){
        this.externalURL = item.externalUrl != undefined ? item.externalUrl : null;
        this.description = item.description != undefined ? item.description : null;
        this.date = item.date != undefined ? item.date : null;
        this.img = item.imgUrl != undefined ? item.imgUrl : null;

        if(this.externalURL != null)
          if(this.externalURL.trim() == ''){
            this.externalURL = null;
          }

        this.dialog = true;
      },
      openPage(){
        window.open(
          this.externalURL,
          '_blank' // <- This is what makes it open in a new window.
        );
      }
    }
  }
</script>

<style>

</style>
