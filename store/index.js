export const strict = false

export const state = () => ({
  isLoadingElements: true,
  showElements: false,
  logged: false,
  snackText: "",
  snackBar: false,
  username: "",
  img : "",
  isFromMensajero : false,


  colorText: "#000000",
  fontSize: '16',
  locationIsChanged: false,
  response : '',
  params : {},
})

export const mutations = {
  changeLocation(state, isChanged){
    state.locationIsChanged = isChanged;
  },
  changeColorAndFontSize( state, settings ){
    state.colorText = settings.colorText;
    state.fontSize = settings.fontSize;
  },
  createdAndShow( state ){
    state.showElements = true;
  },
  logIn (state) {
    state.isLoadingElements = false;
    state.logged = true
  },
  logOut (state) {
    state.showElements = false;
    state.isLoadingElements = false;
    state.username = "";
    state.img  = "";
    state.isFromMensajero  = false;
    state.response  = '';
    state.params  = {};
    // localStorage.clear();
    state.logged = false
  },
  openSnack(state, text){
    state.snackText = text
    state.snackBar = true
    setTimeout(() => {
      state.snackBar = false
    }, 3000)
  },
  setUsername(state, text){
    state.username = text
  },
  setUserimg(state, img){
    state.img = img
  },
  setIsMensajer( state, isFrom ){
    state.isFromMensajero = isFrom;
  },
  setResponse( state, response ){
    state.response = response;
  },
  setParams( state, params ){
    state.params = params;
  }
}

export const actions = {
  async getUser( context ){

    try {
      const response = await this.$axios.$get('/users/' + localStorage.user_idC, {
        headers : { Authorization : 'Bearer ' + localStorage.tokenC }
      });
      context.commit('setUsername', response.data.name );
      context.commit('setUserimg', response.data.img );
    } catch (error) {
      //console.log( error )
    }
  },
  async getData( context ){
    try {
      const response = await this.$axios.$get("/AdvanceSearch", {
        params: context.state.params,
        headers: { Authorization: "Bearer " + localStorage.tokenC },
        // cancelToken : axiosSource.token,
      });
      context.commit('setResponse', response.data )

    } catch (error) {
      //console.log(error)
      //console.log('Error de index js')
    }
  },
  async getCount( context ){
    try {
      const response = await this.$axios.$get("/AdvanceSearch", {
        params: context.state.params,
        headers: { Authorization: "Bearer " + localStorage.tokenC },
        // cancelToken : axiosSource.token,
      });
      context.commit('setResponse', response )

    } catch (error) {
      //console.log(error)
      //console.log('Error de index js')
    }
  }
}
