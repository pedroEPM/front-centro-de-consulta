<template>
 <v-hover v-slot="{ hover }">
    <v-card
      ripple
      :color="currentNote == id ? '#BFCFED' : hover ? '#BFCFED' : 'grey lighten-4'"
      :elevation="currentNote == id ? '5' : ''"
      style="cursor: pointer"
      @click.native="setCurrent(id)"
    >
      <v-card-text class="">
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 md10 v-if="content != null" class="pa-1">
              <v-card-title class="pa-0 pb-2" style="color: black"
                v-html="getPlainText(title).substring(0, 100)">
              </v-card-title>
              <div class="subtitle-2 ml-5 subtitle-text" v-html="subTitle"></div>
              <!-- <v-card-title class="pa-0 pb-2" style="color: black">{{ subTitle }} </v-card-title> -->
              <!-- <span v-html="content"></span> -->
              <span v-html="getPlainText2(content) + '...'" class="note-text"></span>
            </v-flex>

            <v-flex xs12 md2 class="pa-1">
              <v-img
                class="mb-3"
                :src="image"
                :lazy-src="image"
                contain
                height="35"
                v-if="image != null"
                style="margin: auto !important"
              ></v-img>
              <label
                class="property-text"
                v-if="date != null || date != undefined"
                ><b>Fecha:</b>
                {{
                  date != undefined
                    ? date.substring(8, 10) +
                      "-" +
                      getMonth(date.substring(5, 7)) +
                      "-" +
                      date.substring(0, 4)
                    : date
                }}</label
              ><br />
              <label class="property-text" v-if="notebookName != null"
                ><b>Sección:</b> {{ notebookName }}</label
              ><br />
              <label class="property-text"><b>Página:</b> {{ page }}</label><br>
              <label class="property-text"><b>Clave:</b> {{ clave }}</label>
              <br />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    date: {
      type: String,
    },
    notebookName: {
      type: String,
    },
    page: {
      type: Number,
    },
    id: {
      type: String,
    },
    clave: {
      type: String,
    }
  },
  computed: {
    ...mapState("notes", ["currentNote"]),
  },
  methods: {
    ...mapMutations("notes", ["setCurrent"]),
    getPlainText(text) {
      if (this.content != null) {
        text = !text ? "" : text;
        ////console.log(text);
        let plainText = text.split(/(\s+)/);
        let diccionario = [
          /\\n/g,
          "<b>",
          "</b>",
          "@",
          "�",
          /■/gi,
          "[",
          "]",
          "^",
          /-/gi,
          /—/gi,
          "±",
          "«",
          "...",
          "*",
          /™/gi,
          "|",
          /_/gi,
        ];
        //%F1
        for (let i = 0; i < plainText.length; i++) {
          for (let j = 0; j < diccionario.length; j++) {
            plainText[i] = plainText[i].replace(diccionario[j], "");
            plainText[i] = plainText[i].replace("%F1", "ñ");
            if (plainText[i].trim() == "" && plainText[i].length > 1) {
              plainText.splice(i, 1);
            }
          }
        }
        // this.content = tempContent;
        /*//console.log('Aquí esta unido')
        //console.log(plainText.join(""));*/
        /*if(this.content){
          alert('Esto viene de la nota \n'+ plainText.join(""))
        }*/
        return plainText.join("");
      }
    },
    getPlainText2(text) {
      if (this.content != null) {
        text = !text ? "" : text;
        ////console.log(text);
        let plainText = text.split(/(\s+)/);
        let diccionario = [
          /\\n/g,
          "@",
          "�",
          /■/gi,
          "[",
          "]",
          "^",
          /-/gi,
          /—/gi,
          "±",
          "«",
          "...",
          "*",
          /™/gi,
          "|",
          /_/gi,
        ];
        //%F1
        for (let i = 0; i < plainText.length; i++) {
          for (let j = 0; j < diccionario.length; j++) {
            plainText[i] = plainText[i].replace(diccionario[j], "");
            plainText[i] = plainText[i].replace("%F1", "ñ");
            if (plainText[i].trim() == "" && plainText[i].length > 1) {
              plainText.splice(i, 1);
            }
          }
        }
        // this.content = tempContent;
        /*//console.log('Aquí esta unido')
        //console.log(plainText.join(""));*/
        /*if(this.content){
          alert('Esto viene de la nota \n'+ plainText.join(""))
        }*/
        return plainText.join("");
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
.note-text {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
}

.subtitle-text {
  font-size: 16px !important;
  color: rgba(0, 0, 0, 0.7);
}

.property-text {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.7);
}
</style>
