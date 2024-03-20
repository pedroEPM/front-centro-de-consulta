<template>
  <v-hover v-slot="{ hover }">
    <v-card
      ripple
      :color="hover ? '#BFCFED' : 'grey lighten-3'"
      class="card-hover"
      style="cursor: pointer"
      max-width="200"
    >
      <!--<v-img :src="image" @error="errorHandler" :lazy-src="image">-->
      <v-img max-width="200" :src="isImg == true ? image : img" @error="errorHandler" :lazy-src="image">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <v-card-text class="text-center img-label pt-2 pb-2">
        <div v-if="imageTitle" class="justifyText mb-1">
          <span class="img-title acortartittile" v-html="createImageTitle(imageTitle)"></span>
          <br>
        </div>
        <v-img :src="icon" :lazy-src="icon" height="20" contain style="margin: auto !important;"></v-img>
        <span v-if="date != undefined "><b>Fecha:</b> {{ date != undefined ? date.substring(8, 10) + '-' + getMonth(date.substring(5, 7)) + '-' + date.substring(0, 4) : date }}</span>
        <span ><b>Página:</b> {{ page != null && page != undefined ? page : 'Desconocido' }}</span>
        <div v-if="notebookName != null">
          <span class="img-label"><b>Sección:</b> </span>
          {{ notebookName }}
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
        integrity=
"sha512-5CYOlHXGh6QpOFA/TeTylKLWfB3ftPsde7AnmhuitiTX4K5SqCLBeKro6sPS8ilsz1Q4NRx3v8Ko2IBiszzdww=="
        crossorigin="anonymous">
    </script>
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
      type: String,
    },
    imageTitle: {
      type: String,
    },
    publicationName: {
      type: String,
    },
    notebookName: {
      type: String,
    },
    icon: {
      type: String,
    },
    date: {
      type: String
    },
    page : {

    },
    section : {

    },
    item : {

    }

  },
  Mounted(){
    console.log('titulo montado===',this.imageTitle);

  },
  methods : {
    createImageTitle(imageTitle){
      return imageTitle

      //console.log('pintado descripcion', imageTitle);
        /*
      let words = imageTitle.split(" ")
       console.log(words);
      if (words.length>0){
        let titlefinal = words[0]
         console.log(titlefinal);
        words.forEach(word=>{
          if (titlefinal <195 && word != words[0]){
            titlefinal = titlefinal + " " + word
          }
        })
      }
      console.log(imageTitle.substr(0, imageTitle.lastIndexOf(" ")));
        */
      // console.log('texto que llega a img', imageTitle);
    },
    async printtext(imageTitle){
      return imageTitle
    },
    async strongword(){
       console.log('==========ENTRO A strongword========');
         var text1 = document.querySelector(".tituloimg")
            console.log('inicio', text1);
            var ob = new Mark(text1);
            // First unmark the highlighted word or letter
            ob.unmark();
            // Highlight letter or word
            var text  = 'carlos loret de mola'
            ob.mark(text
                ,
                {"element": "span",
                "className": "highlight" }
            );
            console.log('respuesta',text1);

    },
    errorHandler(){


      this.isImg = false;
      this.img = this.errImgPath;
      this.$forceUpdate()
    },
    getImage(){
      try {
        if(this.image.search('imgundefined') != -1 ){
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

<style lang="scss" scoped>

  .img-label{
    line-height: 1rem;
    font-size : 12px !important;
    color: rgba(0, 0, 0, 0.75) !important;
  }
  .justifyText {
    text-align: left !important;
    // text-justify: inter-word !important;
    hyphens: auto !important;
    // hyphens: inherit !important;
    // hyphens: initial;
    // hyphens: unset;
  }
  .acortartittile{
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  }
</style>
