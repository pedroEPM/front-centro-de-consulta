<template>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
export default {
  data(){
    return {
      dialog: true,
    }
  },
  watch: {
    $route(to, from) {
      if (process.browser) {
        if (localStorage.tokenC != null && localStorage.tokenC != undefined) {
          this.validateSession();

          //console.log("There is a session");
        } else {
          //console.log("There isn't a session");
          this.dialog = false;
          this.$store.commit("openSnack", "Bienvenido al archivo megateca");
          this.$store.commit("logOut");
          this.$store.commit("logIn");
          this.$router.push("/login");
          this.hasUser(false);
        }
      }
    },
  },
  created() {
    if (process.client) {
      this.$store.commit("setUsername", localStorage.getItem("usernameC"));
    }
  },
  mounted() {
    //console.log('validando usuario al entrar a la pagina ')
    //this.$nextTick(() => {
      if (localStorage.tokenC != null && localStorage.tokenC != undefined) {
        this.validateSession();
        this.$store.commit("logIn");
      } else {
        this.dialog = false;
        this.$store.commit("logOut");
        this.$store.commit("logIn");
        this.$router.push("/login");
        this.hasUser(false);
      }
    //})
  },
  computed: {
    ...mapState('permissions', ['isLogged', 'enableNotes', 'enableImages', 'enablePDF']),
  },
  methods: {
    ...mapActions([ 'getUser' ]),
    ...mapMutations('permissions', ['getPermissions', 'hasUser']),
    async validateSession() {
      try {
        if (this.isLogged === false) this.dialog = true;
        console.log('this is from session 2')
        const response = await this.$axios.$get("/authentication",
          { headers: { Authorization: "Bearer " + localStorage.tokenC }})
          .catch((error) => {
            console.log(error)
            console.log('error is above of me')
            if (error.response.status == 401) {
              this.dialog = false;
              this.$store.commit("logOut");
              this.$store.commit("logIn");
              this.$router.push("/login");
              this.hasUser(false);
            }
          });
          if (this.isLogged === false){
            this.$store.commit("createdAndShow");
            await this.getPermissions();
            await this.getUser();
            this.$parent.$parent.getTAPuses();
            this.dialog = false;
            this.hasUser(true);
          }

      } catch (error) {
        console.log(error.response)
        // console.log('error is above of me x2')
        this.dialog = false;
        this.$store.commit("openSnack", "Ha ocurrido un error, por favor intente de nuevo");
        this.$store.commit("logOut");
        this.$store.commit("logIn");
        this.$router.push("/login");
        this.hasUser(false);
      }
    },
  },
};
</script>

<style scoped>
  
</style>
