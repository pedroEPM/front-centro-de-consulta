<template>
<v-dialog max-width="500" v-model="dialog">
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card class="rounded-lg">
        <v-card-title class="pa-0">
        <v-toolbar flat>
          <v-toolbar-title>Enviar email</v-toolbar-title>
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
            ></v-text-field>
            <v-text-field
              outlined
              label="Email"
              v-model="email"
            ></v-text-field>
            <v-text-field
              outlined
              label="Tu mensaje"
              v-model="text"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="sendMail()">Enviar</v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>
  </div>
</v-dialog>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      name:"",
      email:"",
      text:"",
      type:"",
      file:"",
      url:"url de preuna aun sin especificar",
      body:{
        name:"",
        email:"",
        url:"",
        text:"",
        type:"",
        file:""
      }
    }),
  mounted() {
    this.name= localStorage.usernameC
  },
  methods: {
    async sendMail() {
      //this.$route
      this.body.name = this.name
      this.body.email = this.email
      this.body.text = this.text
      this.body.type = this.type
      this.body.file = this.file
      this.body.url = "https://megateca.megamedia.com.mx"+this.$route.fullPath
      const response = await  this.$axios.$post("/mail/friend", this.body, {headers : { Authorization : 'Bearer ' + localStorage.tokenC }});
      this.dialog = false;
    },
    openDialog(type, file) {
            this.type = type
            this.file = file
            this.dialog = true;
    },
    applyFontSize(){
      //console.log(this.textColor.hex)
      this.$parent.$parent.$parent.setFontSize(this.size);
      this.$parent.$parent.$parent.setFontColor(this.textColor.hex);
      this.dialog = false;
    }
  },
  }
</script>