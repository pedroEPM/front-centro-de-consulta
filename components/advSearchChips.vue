<template>
  <div>
    <v-icon v-if="icon" class="mr-3 mb-1">mdi-feature-search</v-icon>
    <span>{{title}}</span>
    <client-only>
      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.keywords != null && chips.keywords != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">Todas las Palabras: </b> {{ chips.keywords }}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.keysentence != null && chips.keysentence != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">Frase exacta: </b> {{ chips.keysentence }}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.key != null && chips.key != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">Clave: </b> {{ chips.key }}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.ignoredwords != null && chips.ignoredwords != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">Excluidas: </b
        >{{ chips.ignoredwords }}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="allWords ? chips.allwords != null && chips.allwords != undefined : chips.search != null && chips.search != undefined"
        ><b :style="!isWhiteText ? 'color: black' : 'color: white'"></b>{{ allWords ? chips.allwords : chips.search }}</v-chip
      >

      <!--v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.publication != null && chips.publication != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'"></b>{{ chips.publication}}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.notebook != null && chips.notebook != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'"></b>{{ chips.notebook }}</v-chip
      -->
      
      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'"></b>{{ chips.publication || "Todas las Publicaciones"}}</v-chip
      >

      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'"></b>{{ chips.notebook || "Todos los Cuadernos"}}</v-chip
      >
      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.initDate != null && chips.initDate != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">F. Inicial: </b
        >{{ chips.initDate }}</v-chip
      >
      <v-chip
        label
        :color="color"
        :class=" !isWhiteText ? 'ma-1 primary--text' : 'ma-1'"
        small
        v-show="chips.finalDate != null && chips.finalDate != undefined"
        ><b class="mr-1" :style="!isWhiteText ? 'color: black' : 'color: white'">F. Final: </b
        >{{ chips.finalDate }}</v-chip
      >
    </client-only>
  </div>
</template>

<script>
  export default {
    props : {
      title : {
        type : String
      },
      icon : {
        type : Boolean,
        default : true,
      },
      isWhiteText : {
        type : Boolean,
        default : false
      },
      color : {
        type : String
      },
      chips : {

      },
      allWords : {
        type : Boolean,
        default : false
      }
    },
  }
</script>

<style scoped>
  blackLetter{
    color: black;
  }
  whiteLetter{
    color: white;
  }
</style>
