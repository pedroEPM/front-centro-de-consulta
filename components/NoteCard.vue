<template>
  <v-card
    ripple
    color="grey lighten-3"
    @click="$refs.contentDialog.dialog = true"
  >
    <v-card-title>{{ item.subtitle }}</v-card-title>

    <v-card-text>
      <v-container grid-list-xl>
        <v-layout row wrap>
          <v-flex xs12 md10
            ><span>{{ item.content }}</span></v-flex
          >

          <v-flex xs12 md2>
            <v-img src="/ddy_logo.png"></v-img>
            <label style="font-size: 12px">Titulo: {{ item.title }}</label
            ><br />
            <label style="font-size: 12px">Sección: {{ item.section }}</label
            ><br />
            <label style="font-size: 12px">Página: {{ item.page }}</label
            ><br />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    subtitle: String,
    content: String,
    title: String,
    section: String,
    page: String,
    logo: String,
  },
};
</script>

<style>
</style>