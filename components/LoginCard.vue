<template>
  <v-card flat color="transparent" max-width="350">
    <v-img
      src="/logo_white.png"
      lazy-src="/logo_white.png"
      width="300px"
      style="margin: 1rem"
    ></v-img>

    <v-card-text v-if="!loading">
      <v-text-field
        id="user"
        append-icon="mdi-account"
        name="user"
        label="Correo electronico"
        v-model="email"
        solo
        elevation="12"
      ></v-text-field>

      <v-text-field
        id="password"
        append-icon="mdi-lock"
        name="password"
        label="Contraseña"
        type="password"
        v-model="password"
        solo
      ></v-text-field>
    </v-card-text>

    <v-card-text v-if="loading">
      <v-progress-circular
        :size="150"
        :width="7"
        color="white"
        indeterminate
      ></v-progress-circular>

      <h1 class="display-1 mt-5" style="color: white">Iniciando sesión</h1>
      <h2 class="display-1" style="color: white">Por favor, espere</h2>
    </v-card-text>

    <v-btn
      v-if="!loading"
      color="primary"
      style="width: 300px; background-image: linear-gradient(#014e97, #00284e)"
      @click="login()"
      >Acceder</v-btn
    >
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    email: null,
    password: null,
    loading: false,
    browser : null,
    device: null,
  }),
  methods: {
    async login() {
      this.loading = true;
      try {
        this.showUserAgent();
        const response = await this.$axios
          .$post("/login", {
            email: this.email,
            password: this.password,
            browser : this.browser,
            device : this.device
          })
          .catch((error) => {
            if (error.response.status == 400) {
              this.$store.commit(
                "openSnack",
                "El nombre de usuario o la contraseña ingresada son incorrectas"
              );
              this.loading = false;
            }
          });
        ////console.log(response);
        if (response) {
          sessionStorage.setItem("sessionC", true);
          localStorage.setItem("usernameC", response.data.user.name);
          localStorage.setItem("tokenC", response.data.access_token);
          localStorage.setItem("user_idC", response.data.user._id);
          sessionStorage.setItem("imgC", response.data.user.img);
          this.$store.commit("setUsername", localStorage.getItem("usernameC"));
          this.$store.commit("setUserimg", response.data.user.img);
          this.$store.commit("createdAndShow");
          this.$router.push("/");
          this.$store.commit("logIn");
        }
      } catch (error) {
        this.$store.commit("openSnack", "Ha ocurrido un error, por favor intente de nuevo");
        this.loading = false
      }
    },
    showUserAgent(){
      const sUsrAg = navigator.userAgent;

      var x = '';
      if(sUsrAg.indexOf("Chrome") > -1) {
          this.browser = "Google Chrome";
      } else if (sUsrAg.indexOf("Safari") > -1) {
          this.browser = "Apple Safari";
      } else if (sUsrAg.indexOf("Opera") > -1) {
          this.browser = "Opera";
      } else if (sUsrAg.indexOf("Firefox") > -1) {
          this.browser = "Mozilla Firefox";
      } else if (sUsrAg.indexOf("MSIE") > -1) {
          this.browser = "Microsoft Internet Explorer";
      }
      sUsrAg.indexOf('Mobile') != -1 ? this.device = 'Mobile' : this.device = 'Escritorio'
      localStorage.setItem("deviceC", this.device);
    }
  },
};
</script>

<style>
</style>
