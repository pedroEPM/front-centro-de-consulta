<template>
  <v-layout row wrap>

    <v-flex md6>
      <v-list dense>
        <v-list-item class="list" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><!--b style="color: black">Clave:</b> {{ id }}</v-list-item-title
            --><b style="color: black">Clave:</b> {{ idMegamedia }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="agency != undefined && agency != null && agency != '' && type === 'images'" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Agencia</b>: {{ agency }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="publishDate != undefined && publishDate != null && publishDate != '' && type !== 'pdfs'" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Publicada:</b>
              {{ publishDate.substring(8, 10) + '-' + getMonth(publishDate.substring(5, 7)) + '-' + publishDate.substring(0, 4) }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="taked != undefined && taked != null && taked != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Tomada:</b>
              {{ taked.substring(8, 10) + '-' + getMonth(taked.substring(5, 7))+ '-' + taked.substring(0, 4) }}
              </v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="section != undefined && section != null && section != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Cuaderno:</b> {{ section }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="title != undefined && title != null && title != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Título:</b> {{ title }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="subTitle != undefined && subTitle != null && subTitle != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Subtítulo:</b> {{ subTitle }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="page != undefined && page != null && page != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Página:</b> {{ typeof(page) == typeof(1) ? page : 'Desconocido' }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="location != undefined && location != null && location != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Lugar:</b> {{ location }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="place != undefined && place != null && place != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Lugar:</b> {{ place }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="director != undefined && director != null && director != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Director</b>: {{ director }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="catalogingInstitution != undefined && catalogingInstitution != null && catalogingInstitution != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Intitución catalogadora</b>: {{ catalogingInstitution }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="language != undefined && language != null && language != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Lenguaje</b>: {{ language }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="imprint != undefined && imprint != null && imprint != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Píe de imprenta</b>: {{ imprint }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="localSeries != undefined && localSeries != null && localSeries != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Serie local</b>: {{ localSeries }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="clasification != undefined && clasification != null && clasification.trim() != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Clasificación</b>: {{ clasification }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title v-if="author != undefined && author != null && author.trim() != ''" style="font-size: 16px; font-weight: 400;">
              <b style="color: black">Autor:</b><label v-html="author" style="cursor : text"></label>
            </v-list-item-title>
            <v-list-item-title v-else style="font-size: 16px; font-weight: 400;">
              <b style="color: black">Autor:</b><label style="cursor : text"> Desconocido</label>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="photographer != undefined && photographer != null && photographer != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Fotógrafo:</b> {{ photographer }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="format != undefined && format != null && format != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Formato:</b> {{ format }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <!--<v-list-item v-if="size != undefined && size != null && size != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Medidas:</b> {{ size }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>-->

        <!--v-list-item v-if="type != 'notes' " style="min-height: 25px">
          <v-list-item-content style="padding: 4px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Publicada:</b>
              {{ published == true ? 'Sí' : 'No' }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item-->

        <v-list-item v-if="type != 'notes' " style="min-height: 25px">
          <v-list-item-content style="padding: 4px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;"
              ><b style="color: black">Vendible: </b>
              {{ selleable == true ? 'Sí' : 'No' }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="descriptors != undefined && descriptors != null && descriptors != ''" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;  white-space: normal;"
              ><b style="color: black">Observaciones:</b> {{ descriptors }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="fromMensajero" style="min-height: 25px">
          <v-list-item-content style="padding: 2px 0">
            <v-list-item-title style="font-size: 16px; font-weight: 400;  white-space: normal;"
              >Imagen obtenida del <b style="color: black">Mensajero</b></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-flex>
    <v-flex md6 v-if="icon != undefined || icon != null">
      <div class="mr-5 ml-5">
        <img :src="imgPath + icon" @error="icon = undefined" class="mb-5" contain height="30">
      </div>
    </v-flex>

  </v-layout>
</template>

<script>
export default {
  data(){
    return {
      photoName : null,
      imgPath: process.env.imgPath,

    }
  },
  created(){
    if( process.browser ){
      if(this.photographer !== null ){
        this.photoName = this.photographer;
      }else{
        this.photoName = 'Desconocido';
      }
    }
  },
  props: {
    type: {
      type: String
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
      default : ''
    },
    place: {
      type: String,
      default : ''
    },
    agency: {
      type: String,
    },
    clasification: {
      type: String,
      default : ''
    },
    page: {
      //type: Number,
    },
    photographer: {
      type: String,
      default : ''
    },
    material: {
      type: String,
      default : ''
    },
    published: {
      type: Boolean,
    },
    selleable: {
      type: Boolean,
    },
    format: {
      type: String,
      default : ''
    },
    size: {
      type: String,
      default : ''
    },
    descriptors: {
      type: String
    },
    idMegamedia:{},
    author : {
      type : String,
      default : ''
    },
    catalogingInstitution : {
      type : String,
      default : ''
    },
    language : {
      type : String,
      default : ''
    },
    imprint : {
      type : String,
      default : ''
    },
    director : {
      type : String,
      default : ''
    },
    localSeries : {
      type : String,
      default : ''
    },
    icon : {
      type : String
    },
    isPrint : {
      type : Boolean,
      default : false
    },
    fromMensajero : {
      type : Boolean,
      default : false
    },
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    }
  },
  methods : {
    async getPhotografer(){
      //console.log('Here starts the getPhotographer')
      try {
        const response = await this.$axios.$get('/PhotographerbyId', {
          params : {
            id : this.photographer
          },
          headers : { Authorization : 'Bearer ' + localStorage.tokenC }
        });
        //console.log(response)
        this.photoName = response.data.Photographerid[0].name + ' ' + response.data.Photographerid[0].lname;
      } catch (error) {
        this.photoName = 'Desconocido';
        //console.log(error.response)
      }
    },
    getMonth( month ){

      let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months[ parseInt(month -1) ];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
