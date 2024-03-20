<template>
  <v-dialog max-width="300" v-model="dialog">
    <v-card class="rounded-lg">
      <v-card-title>Ajustes de letra</v-card-title>

      <v-card-text>
        <v-select
          outlined
          label="Tamaño de la letra"
          v-model="size"
          :items="sizes"
        ></v-select>
      </v-card-text>
      <v-card-text>
        <v-color-picker
          v-model="textColor"
          dot-size="25"
          hide-inputs
          hide-mode-switch
          mode="hexa"
          swatches-max-height="100"
        ></v-color-picker>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">Cerrar</v-btn>
        <v-btn color="primary" @click="applyFontSize()">Aplicar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    sizes: ["12", "14", "16", "18", "20"],
    size: 16,
    textColor: null,
  }),
  /*watch : {
    textColor( newValue ){
      //console.log(newValue.hex);
    }
  },*/
  methods: {
    openDialog() {
      this.dialog = true;
    },
    applyFontSize() {
      this.$store.commit("changeColorAndFontSize", {
        fontSize: this.size,
        colorText: this.textColor.hexa,
      });
      // console.log('valor del color',this.textColor)
      // this.$parent.$parent.$parent.setFontSize(this.size);
      // this.$parent.$parent.$parent.setFontColor(this.textColor);
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>
