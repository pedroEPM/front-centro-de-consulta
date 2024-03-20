<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app height="80" v-if="showElements">
      <v-btn
        rounded
        elevation="1"
        class="hidden-md-and-up"
        color="primary"
        @click="drawer = true"
        ><v-icon>mdi-menu</v-icon></v-btn
      >

      <v-spacer class="hidden-md-and-up" />

      <v-toolbar-title @click="goToHome()" class="logo">
        <v-img
          src="/logo_mega.png"
          lazy-src="/logo_mega.png"
          max-width="200"
        ></v-img>
      </v-toolbar-title>

      <v-spacer />
      <v-text-field
        solo-inverted
        hide-details
        color="white"
        flat
        type="text"
        placeholder="Búsqueda rápida"
        class="hidden-sm-and-down"
        append-icon="mdi-magnify"
        @click:append="search"
        @keyup.enter.native="search"
        v-model.trim="searchElement"
        :rules="validations.fieldRules"
      ></v-text-field>

      <!-- <v-btn
        icon
        color="black"
        class="hidden-sm-and-down"
        @click="search"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
      <v-spacer />

      <v-btn
        dark
        color="primary"
        class="hidden-sm-and-down mr-3"
        @click="$refs.advanceSearch.openDialog()"
        >Busqueda avanzada</v-btn
      >

      <v-btn
        dark
        color="primary"
        class="hidden-sm-and-down mr-3"
        @click="$refs.fileDialog.openDialog()"
        >Solicitud de archivo</v-btn
      >

      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" class="user-btn">
              <span class="hidden-sm-and-down" style="margin-right: 0.5rem">{{
                username ? username.split(" ")[0] : ''
              }}</span>
              <v-avatar color="primary">
                <v-icon v-if="!img" color="white">mdi-account</v-icon>
                <v-img v-else :src="img"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$refs.userProfileDialog.openDialog()">
              <v-list-item-icon>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Usuario</v-list-item-title>
            </v-list-item>

             <v-list-item @click="setWorkbench(true)">
              <v-list-item-icon>
                <v-icon>mdi-folder-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mesa de trabajo</v-list-item-title>
            </v-list-item>

            <!--v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Soporte</v-list-item-title>
            </v-list-item-->

            <v-list-item @click="logout()">
              <v-list-item-icon>
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <!-- <v-btn
        rounded
        class="hidden-md-and-up"
        color="primary"
        @click="enableSearch()"
        ><v-icon>mdi-magnify</v-icon></v-btn
      > -->
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      temporary
      class="hidde-md-and-up"
    >
      <v-list nav>
        <v-list-item two-line>
          <v-list-item-avatar size="50">
            <v-icon class="grey darken-2" dark> mdi-account </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ username ? username.split(" ")[0] : '' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group>
          <v-btn
            block
            color="primary"
            class="pa-2 mt-2 mb-2"
            @click="$refs.advanceSearch.openDialog()"
            >Busqueda Avanzada</v-btn
          >

          <v-btn
            block
            color="primary"
            class="pa-2 mt-2 mb-2"
            @click="$refs.fileDialog.openDialog()"
            >Solicitud de archivo</v-btn
          >

          <v-divider></v-divider>

          <v-list-item @click="$refs.userProfileDialog.openDialog()">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Usuario</v-list-item-title>
          </v-list-item>

          <v-list-item @click="setWorkbench(true)">
            <v-list-item-icon>
              <v-icon>mdi-folder-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Mesa de trabajo</v-list-item-title>
          </v-list-item>

          <!--v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Soporte</v-list-item-title>
          </v-list-item-->
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn color="grey darken-4" dark block @click="logout()"
            >Cerrar sesión</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>

    <Workbench-Drawer @openresumen="openResumenDialog"/>

    <v-main id="nav">
      <!-- <v-card v-if="mobileSearch" class="hidden-md-and-up">
        <v-card-text>
          <v-text-field
            solo-inverted
            outlined
            hide-details
            color="white"
            flat
            placeholder="Búsqueda rápida"
            append-icon="mdi-magnify"
            @keyup.enter.native="searchMobile"
            v-model="searchElement"
          ></v-text-field>
        </v-card-text>
      </v-card> -->
      <!--
      <transition name="fade">
        <v-alert
          v-model="alert"
          close-text="Close Alert"
          color="primary"
          dark
          dismissible
          style="
            text-align: center;
            border-radius: 0px;
            background-image: url('/login_background.webp');
            background-size: cover;
          "
        >
          <span style="font-weight: 600"
            >BIENVENIDO A TU CENTRO DE CONSULTA</span
          ><br />
          <span style="font-size: 14px"
            >CONTENIDO DE INFORMACIÓN QUE TENEMOS DISPONIBLE PARA CONSULTA</span
          >
        </v-alert>
      </transition>
      -->
      <transition name="fade" v-if="logged">
        <v-container grid-list-xl>
          <nuxt />
        </v-container>
      </transition>
        <div id="myModal" class="modal" v-if="isLoadingElements">
          <!-- Modal content -->
          <div class="modal-content">
            <p>Cargando sistema</p>
            <v-progress-circular
                indeterminate
                :size="100"
                :width="15"
                color="primary darken-2"
            ></v-progress-circular>
          </div>

        </div>
        <!-- <v-dialog v-model="isLoadingElements" max-width="300" persistent>
          hoaolalala
          <v-card>
            <v-card-title></v-card-title>
            <v-card-text style="text-align: center;">
              <p>Cargando sistema</p>
              <v-progress-circular
                indeterminate
                :size="100"
                :width="15"
                color="primary darken-2"
              ></v-progress-circular>
            </v-card-text>
          </v-card>
        </v-dialog> -->
    </v-main>

    <v-footer color="primary" style="height: 6em" v-if="logged && showElements">
      <v-container style="padding: 4px 0px 2px 0px">
        <v-layout
          row
          wrap
          align-center
          align-content-center
          justify-center
          style="text-align: center"
        >
        <v-row>
          <v-col class="sin-padding">
            <center>
               <v-img
              src="/logo_white.png"
              lazy-src="/logo_white.png"
              contain
              width="120"
              style="margin: auto; margin-bottom:5px"
            ></v-img>
            <h1
              class="mt-2"
              style="color: white; font-size: 16px; font-weight: 400"
            >
              Desarrollado por MEGAMEDIA
            </h1>
            </center>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="1" class="sin-padding"></v-col>
          <v-col cols="5" class="sin-padding">
                <v-btn @click="$refs.TACusesDialog.openDialog(TAPuses[0])" text dark>{{TAPuses[0].title}}</v-btn>
          </v-col>
          <v-col class="sin-padding">
               <v-flex @click="$refs.TACusesDialog.openDialog(TAPuses[1])" xs12 md2><v-btn text dark>{{ TAPuses[1].title }}</v-btn></v-flex>
          </v-col>
          <v-col cols="1" class="sin-padding"></v-col>
        </v-row> -->
        <!--
          <v-flex xs12 md2>
            <v-btn @click="$refs.TACusesDialog.openDialog(TAPuses[0])" text dark>{{TAPuses[0].title}}</v-btn>
          </v-flex>
          <v-flex xs12 md3
            ><v-img
              src="/logo_white.png"
              lazy-src="/logo_white.png"
              contain
              width="150"
              style="margin: auto"
            ></v-img>
            <h1
              class="mt-2"
              style="color: white; font-size: 16px; font-weight: 400"
            >
              Desarrollado por MEGAMEDIA
            </h1>
          </v-flex>
          <v-flex @click="$refs.TACusesDialog.openDialog(TAPuses[1])" xs12 md2><v-btn text dark>{{ TAPuses[1].title }}</v-btn></v-flex>
          --->
        </v-layout>
      </v-container>
    </v-footer>

    <!--
    <v-btn
      fixed
      dark
      :fab="!hover"
      :rounded="hover"
      x-large
      bottom
      right
      color="primary"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      style="height: 72px"
      v-if="logged"
    >
      <v-icon>mdi-apps-box</v-icon>
      <span v-if="hover" class="ml-3">Mesa de trabajo</span>
    </v-btn>
    -->

    <!---<v-snackbar v-model="snackBar">
      {{ snackText }}
    </v-snackbar>--->
    <!--mensaje login-->
    <div>
      <v-dialog
        transition="dialog-top-transition"
        max-width="400"
        v-model="snackBar"
      >
          <v-card>
            <v-toolbar
              color="primary"
              dark
              class="tittle1"
            >
          <div class="tittle1">
              Mensaje
          </div>
            </v-toolbar>
            <v-card-text>
              <div>
                <v-container>
                  <div class="mensaje">
              {{ snackText }}
                  </div>
                </v-container>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
            </v-card-actions>
          </v-card>
      </v-dialog>
    </div>

    <v-btn color="primary" fab bottom right fixed @click="goToPagetop()">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

    <Advance-Search-Dialog ref="advanceSearch" />
    <File-Dialog ref="fileDialog" />
    <Event-Dispacher />
    <UserProfileDialog ref="userProfileDialog" />
    <TACusesDialog ref="TACusesDialog" />
    <Resumen-Tables ref="ResumenTables" />

  </v-app>
</template>

<script>
import EventDispacher from "~/components/EventDispacher";
import AdvanceSearchDialog from "~/components/AdvanceSearchDialog";
import FileDialog from "~/components/FileDialog";
import WorkbenchDialog from "~/components/WorkbenchDialog";
import UserProfileDialog from '~/components/UserProfileDialog.vue';
import WorkbenchDrawer from '~/components/WorkbenchDrawer.vue'
import TACusesDialog from '~/components/TACusesDialog.vue';
import ResumenTables from "~/components/ResumenTables.vue";

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    AdvanceSearchDialog,
    FileDialog,
    EventDispacher,
    WorkbenchDialog,
    UserProfileDialog,
    WorkbenchDrawer,
    ResumenTables,
    TACusesDialog
  },
  head : {
    link : [
      { rel : 'stylesheet', href : "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" }
    ]
  },
  data: () => ({
    loadingElements: true,
    clipped: false,
    drawer: false,
    fixed: false,
    items: [
      {
        icon: "mdi-apps",
        title: "Welcome",
        to: "/",
      },
      {
        icon: "mdi-chart-bubble",
        title: "Inspire",
        to: "/inspire",
      },
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Vuetify.js",
    alert: true,
    hover: false,
    searchElement: "",
    mobileSearch: false,
    validations: {
      fieldRules : [
        ( v ) => !!v
      ]
    },
    TAPuses : [{title:'Terminos de uso'},{title:'Politicas de uso'}]
  }),
  computed: mapState(["logged", "snackText", "snackBar", "username", 'img', 'isLoadingElements', 'showElements']),
  methods: {
    ...mapMutations('layout', ['setWorkbench']),
    openResumenDialog(item){
      console.log(item)
      this.$refs.ResumenTables.openDialog(item)
    },
    async getTAPuses(){
      try {
        const response = await this.$axios.$get('/TAPuses', {
          headers : { Athorization : 'Beare ' + localStorage.tokenC }
        });

        this.TAPuses = response.data;
        if (this.TAPuses.length<1){
          this.TAPuses.push({title:'Terminos de uso'})
        }
        if (this.TAPuses.length==1){
          this.TAPuses.push({title:'Politicas de uso'})
        }
      } catch (error) {
        //console.log(error.response)
      }
    },
    logout() {
      localStorage.clear();
      this.$store.commit("logOut");
      this.$store.commit("openSnack", "Su sesión ha finalizado con éxito");
      this.$router.push("/login");
    },
    search() {
      if(this.searchElement != ''){
        this.$router.push({
          path: "/search",
          query: { searched: this.searchElement },
        });
      }
    },
    searchMobile() {
      this.mobileSearch = false;
      this.$router.push({
        path: "/search",
        query: { searched: this.searchElement },
      });
    },
    goToHome() {
      this.$router.push("/");
    },
    enableSearch() {
      this.mobileSearch = true;
      var elmnt = document.getElementById("nav");
      elmnt.scrollIntoView({ behavior: "smooth" });
    },
    goToPagetop() {
      var elmnt = document.getElementById("nav");
      elmnt.scrollIntoView({ behavior: "smooth" });
    },

  },
};
</script>

<style lang="scss">
@import "assets/variables";


.btn-gradient {
  margin-right: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.sin-padding{
  padding: 0px !important;

}

.logo {
  cursor: pointer;
}

.modal {
  display: block;/* Hidden by default */
  position: absolute; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.modal-content {
  text-align: center;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 15px;
}

.user-btn {
  padding-right: 0px;
  padding-left: 0;
}

.mensaje{
  text-align: center !important;
  vertical-align: middle;
  font-size:21px;
  padding-top:12px;
  font-weight: 400;
}
.tittle1{
  text-align: center !important;
  vertical-align: middle;
  font-size: 25px;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
