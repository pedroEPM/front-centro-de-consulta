<template>
  <v-list dense>

    <v-list-item class="list" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Clave:</b> {{ idMegamedia }}</v-list-item-title
        ><!--b style="color: black">Clave:</b> {{ id }}</v-list-item-title
        -->
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="date != undefined && date != null && date.trim() != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Publicada:</b> {{ date.substring(8, 10) + '-' + getMonth(date.substring(5, 7)) + '-' + date.substring(0, 4) }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="taked != undefined && taked != null && taked.trim() != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Tomada:</b> {{ taked.substring(8, 10) + '-' + getMonth(taked.substring(5, 7))+ '-' + taked.substring(0, 4) }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="section != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Sección:</b> {{ section }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images' && location != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Lugar:</b> {{ location }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images' && place != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Lugar:</b> {{ place }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item  v-if="type === 'images' && agency !== null" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Agencia</b>: {{ agency }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item  style="min-height: 25px" v-if="clasification != undefined && clasification != null && clasification.trim() != ''">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Clasificación</b>: {{ clasification }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Página:</b> {{ typeof(page) == typeof(1) ? page : 'Desconocido' }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>


    <v-list-item v-if="director != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Director</b>: {{ director }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="catalogingInstitution != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Intitución catalogadora</b>: {{ catalogingInstitution }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="language != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Lenguaje</b>: {{ language }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="imprint != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Píe de imprenta</b>: {{ imprint }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="localSeries != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Serie local</b>: {{ localSeries }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="author != '' && type != 'notes'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Autor: </b> {{ author }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images' && photographer != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Fotógrafo:</b> {{ photoName }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item  style="min-height: 25px" v-if="type == 'images' && material != '' ">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Material:</b>
          {{ material }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images' && format != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Formato:</b> {{ format }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <!--<v-list-item v-if="type == 'images' && size != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Medidas:</b> {{ size }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>-->

    <v-list-item style="min-height: 25px" v-if="type !== 'pdfs'">
      <v-list-item-content style="padding: 4px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Publicada:</b>
          {{ published == true ? 'Sí' : 'No' }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <!--<v-list-item v-if="type != 'notes' " style="min-height: 25px">
      <v-list-item-content style="padding: 4px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">Vendible: </b>
          {{ selleable == true ? 'Sí' : 'No' }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>-->

    <v-list-item v-if="type == 'images' && descriptors != '' && descriptors !== '000'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400; white-space: normal; "><b style="color: black">Observaciones:</b> {{ descriptors }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!--v-list-item v-if="type == 'images' && descriptors != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400; white-space: normal; "
          ><b style="color: black">Enviado a shell: No</b> {{ descriptors }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item-->

    <!-- <v-list-item v-if="type == 'images' && descriptors != '' && descriptors !== '000'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400; white-space: normal; "><b style="color: black"> Material digital: </b>si</v-list-item-title>
        <b style="color: black">Material digital: Si</b> {{ descriptors }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->

    <v-list-item class="list" style="min-height: 25px" @click="setIDMongo()">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;"
          ><b style="color: black">ID:</b> {{ cReplaceElement(id) }}</v-list-item-title
        ><!--b style="color: black">Clave:</b> {{ id }}</v-list-item-title
        -->
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="fromMensajero" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; font-weight: 400;  white-space: normal;"
          >Imagen obtenida del <b style="color: black">Mensajero</b></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data(){
    return {
      photoName : null,
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
    date: {
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
    idMegamedia:{},
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
    publicationName : {
      type : String,
      default : null
    },
    fromMensajero : {
      type : Boolean,
      default : false
    }
  },
  methods : {
    // async getPhotografer(){
    //   //console.log('Here starts the getPhotographer')
    //   try {
    //     const response = await this.$axios.$get('/PhotographerbyId', {
    //       params : {
    //         id : this.photographer
    //       },
    //       headers : { Authorization : 'Bearer ' + localStorage.tokenC }
    //     });
    //     //console.log(response)
    //     this.photoName = response.data.Photographerid[0].name + ' ' + response.data.Photographerid[0].lname;
    //   } catch (error) {
    //     // if(isNaN(this.photographer)){
    //     // }else{
    //     //   this.photoName = 'Desconocido';
    //     // }
    //     this.photoName = this.photographer;
    //     //console.log(error.response)
    //   }
    // },

    cReplaceElement(id) {
      return id.replace('cIDM-', '')
    },
    setIDMongo() {
      try {
        navigator.clipboard.writeText(this.id.replace('cIDM-', ''));
      } catch (error) {
        console.log(error)
        console.log('error by copy setIDMongo')
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
