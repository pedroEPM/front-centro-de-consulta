<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="rounded-lg">
      <v-card-title class="pa-0">
        <v-toolbar flat>
          <v-toolbar-title>Reportar errores</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" class="mt-5">
          <v-text-field
            outlined
            label="Nombre"
            v-model="name"
            readonly
            :rules="validations.fieldRules"
          ></v-text-field>
          <v-text-field
            outlined
            label="Email"
            v-model="email"
            readonly
            :rules="validations.fieldRules"
          ></v-text-field>
          <v-textarea
            outlined
            label="Descripción del error"
            height="150"
            v-model="description"
            :rules="validations.fieldRules"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="validate()">Enviar reporte</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title> Aviso </v-card-title>
        <v-card-text v-if="!loading">¿Desera enviar el reporte?</v-card-text>
        <v-card-text v-else>Enviando reporte</v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn @click="confirm = false">No</v-btn>
          <v-btn color="primary" @click="addReport()">Si</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    confirm : false,
    loading : false,
    name : null,
    name2 : null,
    email : null,
    email2 : null,
    description : null,
    validations : {
      fieldRules : [ ( v ) => !!v || 'Campo requerido']
    }
  }),
  methods: {
    openDialog() {
      this.getUser();
      this.dialog = true;

    },
    async getUser(){
      try {
        //console.log(localStorage.user_idC)
        const response = await this.$axios.$get('/users/' + localStorage.user_idC, {
          headers : { Authorization : 'Bearer ' + localStorage.tokenC }
        });
        this.email = response.data.email;
        this.email2 = response.data.email;
        this.name = response.data.name;
        this.name2 = response.data.name;
      } catch (error) {
        //console.log(error.response)
      }
    },
    async addReport(){
      this.loading = true;

      try {
        //this.loading = false;

        const body = {
          name : this.name2,
          email : this.email2,
          description : this.description,
          userId : localStorage.user_idC,
          fileId : this.$parent.$parent.$parent._Id,
          mode : this.selectMode(),
          path : this.$route.fullPath
        }

        const response = await this.$axios.$post('/addReport', body, {
          headers : { Authorization : 'Bearer ' + localStorage.tokenC }
        });
        this.loading = false;
        this.cleanAndClose();
        this.$store.commit(
          'openSnack',
          'Se ha enviado exitosamente el reporte'
        );

      } catch (error) {
        this.loading = false;
        //console.log(error.response)
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, vuelva a intentarlo'
        );
      }
    },
    validate(){
      if(this.$refs.form.validate()){
        this.confirm = true;
      }
    },
    cleanAndClose(){
      this.loading = false;
      this.confirm = false;
      this.dialog = false;

      this.$refs.form.reset();
    },
    selectMode(){
      switch( Number(this.$parent.$parent.$parent.mode) ){
        case 1:
          return 'Notas'
        case 2:
          return 'Imagenes'
        case 3:
          return 'PDF'
      }
    }
  },
};
</script>

<style>
</style>
