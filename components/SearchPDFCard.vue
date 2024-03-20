<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :color="hover ? '#BFCFED' : 'grey lighten-3'"
      ripple
      class="card-hover"
      style="cursor: pointer"
    >
      <v-img max-width="270" max-height="440" :src="isImg == true ? image : img" @error="errorHandler" :lazy-src="image">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-text class="text-center img-label ">
        <v-img :src="icon" :lazy-src="icon" height="20" contain style="margin: auto !important;" v-if="icon != null"></v-img>
        
        <div v-if="date != undefined">
          <span><b>Fecha:</b> {{ date != undefined ? date.substring(8, 10) + '-' + getMonth(date.substring(5, 7)) + '-' + date.substring(0, 4) : date }}</span>
        </div>

        <div v-if="notebookName != null">
          <span class="img-label"><b>Sección:</b> </span>
          {{ notebookName }}
        </div>
        
        <div>
          <span><b>Página:</b> {{ page != null && page != undefined ? page : 'Desconocido' }}</span>
        </div>

      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  data(){
    return {
      errImgPath : process.env.errorImagePath,
      isImg : true,
      img : null
    }
  },
  props: {
    image: {
      type: String
    },
    title: {
      type: String
    },
    notebookName: {
      type: String
    },
    icon: {
      type: String,
    },
    date: {
      type: String
    },
    page: {
      type: Number
    }
  },
  methods : {
    errorHandler(){
      this.isImg = false;
      this.img = this.errImgPath;
      this.$forceUpdate()
    },
     getPDFImage(){
      try {
        //console.log(this.image)
        if(this.image.search('imgundefined') != -1 ){
          //console.log(this.image)
          //console.log('uwu')
          return this.errImgPath;
        }else{
          return this.image;
        }
      } catch (error) {
        ////console.log(error)
      }

    },
    getMonth( month ){

      let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months[ parseInt(month -1) ];
    }
  },
};
</script>

<style>
</style>
