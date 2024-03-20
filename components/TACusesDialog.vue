<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="white" flat>
          <v-spacer />
          <v-toolbar-title style="color : black">{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon color="grey"> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text v-html="content"></v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data(){
      return {
        dialog : false,
        title : null,
        content : null,
      }
    },
    methods : {
      openDialog( item ){
        this.content = item.content;
        this.title = item.title;
        this.dialog = true;
      }
    }
  }
</script>

<style>

</style>
