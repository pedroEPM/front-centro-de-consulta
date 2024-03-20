<template>
  <v-dialog :max-width="showMore == true ? 1100 : 350"  v-model="dialog">
    <v-card>
      <v-card-title>
        <!--
        <v-spacer />
        <v-btn icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
          -->
      </v-card-title>

      <v-card-text class="text-center" v-if="checking">
        <v-icon size="80" class="mb-2">mdi-download</v-icon>
        <h1 class="mb-5">Verificando permisos</h1>
        <v-progress-linear
          color="primary"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-card-text>

      <v-flex v-if="!checking && !showMore">
        <v-card-text class="text-center" v-if="!valid">
          <v-icon size="80" class="mb-2">mdi-cancel</v-icon>
          <h1 class="mb-5">No cuenta con los permisos necesarios</h1>
          <v-btn block color="primary" @click="dialog = false">Cerrar</v-btn>
        </v-card-text>

        <v-card-text class="text-center" v-if="valid">
          <v-icon size="80" class="mb-2">mdi-check-circle-outline</v-icon>
          <h1 class="mb-5">Permisos verificados</h1>
          <!-- <v-btn block color="primary" @click="downloadDocument()">Descargar</v-btn> -->
        </v-card-text>
      </v-flex>
      <v-card-text v-if="showMore">
        <v-layout row wrap>
          <v-flex xs12 md9 class="pt-5 pl-2 pr-5">
            <v-card outlined>
              <v-card-text class="pa-5 hidden-sm-and-down">
                <v-img :src="urlFile"></v-img>
              </v-card-text>
              <v-img class="hidden-md-and-up" :src="urlFile"></v-img>

            </v-card>
          </v-flex>
          <v-flex xs12 md2 class="pt-5 pl-2 pr-5">
            <v-card outlined class="pa-5">
              <v-btn block large color="primary" elevation="0" height="50" @click="modeSelect != 3 ? downloadDocument() : pdfDialog = true">
                  <div class="hidden-sm-and-down">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Descargar archivo</label></p>
                  </div>
                </v-btn>
                <!-- <v-card-text class="pa-3" style="cursor : pointer">
                  <p><label class="font-weight-black">Grande • </label><label>4096 x 2160 píxeles</label></p>
                </v-card-text> -->

                 <!--- <div class="hidden-md-and-up">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Grande</label></p>
                    <p><label class="mousePointer">4096 x 2160 píxeles</label></p>
                  </div>--_>
                </v-btn>

                <!--v-btn block large color="white" elevation="0" height="70" @click="modeSelect != 3 ? downloadDocument() : pdfDialog = true">
                  <div class="hidden-sm-and-down">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Mediano • </label><label class="mousePointer">1000 x 527 píxeles</label></p>
                    <p><label class="mousePointer">8.5 x 4.5 cm • 300 DPI • JPEG</label></p>
                  </div>
                  <div class="hidden-md-and-up">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Mediano</label></p>
                    <p><label class="mousePointer">1000 x 527 píxeles</label></p>
                  </div>
                </v-btn>

                <v-btn block large color="white" elevation="0" height="70" @click="modeSelect != 3 ? downloadDocument() : pdfDialog = true">
                  <div class="hidden-sm-and-down">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Pequeño • </label><label class="mousePointer">500 x 264 píxeles</label></p>
                    <p><label class="mousePointer">4.2 x 2.2 cm • 300 DPI • JPEG</label></p>
                  </div>
                  <div class="hidden-md-and-up">
                    <p class="pt-4"><label class="font-weight-black mousePointer">Pequeño</label></p>
                    <p><label class="mousePointer">500 x 264 píxeles</label></p>
                  </div>
                </v-btn-->

            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="pdfDialog" max-width="300">
      <v-card>
        <v-card-title>Elija el formato</v-card-title>
        <v-card-text>
          <v-btn v-if="pdfImage" block color="primary" class="mb-3" @click="downloadDocument()">Formato Imagen</v-btn>
          <v-btn v-if="pdfPdf" block color="secondary" @click="downloadPDF()">Formato PDf</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
  import FS from 'file-saver';
export default {
  data: () => ({
    dialog: false,
    checking: false,
    valid: false,
    showMore : false,
    pdfDialog : false,
    modeSelect : null,

    pdfImage : false,
    pdfPdf : false,
  }),
  props : {
    urlFile : {
      type : String
    },
    modeAux:{
      type:Number
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.pdfPdf = false;
      this.pdfImage = false;
      this.checking = true;
      this.showMore = false;
      this.pdfDialog = false;
      this.modeSelect = Number(this.$parent.$parent.$parent.mode);
      this.modeSelect = (!this.modeSelect)? this.modeAux:this.modeSelect
      this.verifyAccount();
    },
    async verifyAccount() {


      //console.log("this.urlFile-**--*--**-*--**-*-")
      //console.log(this.urlFile)
      try {
        //console.log('----------------localStorage.user_idC---------------------')
        //console.log('/users/' + localStorage.user_idC)
        //console.log(localStorage)
        const response = await this.$axios.$get('/users/' + localStorage.user_idC, {
          headers : { Authorization : 'Beaerer ' + localStorage.tokenC }
        });

        //console.log(response)
        //console.log("Number(this.$parent.$parent.$parent.mode)")
        //console.log(Number(this.$parent.$parent.$parent.mode))
        let permissions = response.data.permissions[0].permissions;
        let vericated = false;
        permissions.forEach( x => {
          switch(Number(this.$parent.$parent.$parent.mode)){
            case 2:
              //images
              if( x == '60d47ee00f82f40014419ae5' || x == '60d48ee60f82f40014419aec'){
                vericated = true;
              }
            break;
            case 3:
              //pdf
              if( x == '60d47ee00f82f40014419ae5' || x == '60d483fe0f82f40014419aeb'){
                vericated = true;
                this.pdfPdf = true;
              }
              if( x == '60d47ee00f82f40014419ae5' || x == '60d47f460f82f40014419ae9'){
                vericated = true;
                this.pdfImage = true;
              }
            break;
          }
          if (this.modeAux==3){
            //console.log("modeAux")
            //console.log( this.modeAux )
            //por si el de arriba falla
            //pdf
              if( x == '60d47ee00f82f40014419ae5' || x == '60d483fe0f82f40014419aeb'){
                vericated = true;
                this.pdfPdf = true;
              }
              if( x == '60d47ee00f82f40014419ae5' || x == '60d47f460f82f40014419ae9'){
                vericated = true;
                this.pdfImage = true;
              }
          }
          if (this.modeAux==2){
              //images
              if( x == '60d47ee00f82f40014419ae5' || x == '60d48ee60f82f40014419aec'){
                vericated = true;
              }
          }
        });

        this.checking = false;
        if(vericated){
          this.valid = true;
          setTimeout(() => {
            this.showMore = true;
          }, 1000);
        }else{
          this.valid = false;
        }
      } catch (error) {
        //console.log(error)
        //console.log(error.response)
      }


      // this.checking = false;
      // this.valid = true;
      /*setTimeout(() => {
        this.checking = false;
        this.showMore = false;
        var temp = Math.floor(Math.random() * Math.floor(2));
        //console.log(temp);
        if (temp > 0) {

        } else {

        }
      }, 100);*/
    },
    showMoreDetails(msj){
      alert(msj);
    },
    async downloadDocument(){
      const body = {
        userId : localStorage.user_idC,
        fileId : this.$parent.$parent.$parent._Id,
        date : new Date().toISOString().substring(0,10),
        fileType : "Download",
        mode : this.selectMode(this.$parent.$parent.$parent.mode) || this.modeAux
      }

      const response = await this.$axios.$post('/addChartFile', body, {
        headers : { Authorization : 'Bearer ' + localStorage.tokenC }
      });

      /*if( this.selectMode(this.$parent.$parent.$parent.mode) == 'PDF'){
        this.urlFile = this.urlFile.substring(0, this.urlFile.length - 3) + 'pdf';
      }*/

      //console.log("this.urlFile-**--*--**-*--**-*-")
      //console.log(this.urlFile)

      let fileName = this.getFileName(this.urlFile);
      //console.log(fileName)
      FS.saveAs(this.urlFile, fileName);

      //console.log(response);

      this.dialog = false;

      try {

      } catch (error) {
        //console.log(error.response);
        dialog = false
      }
    },
   async downloadPDF(){
      let urlFile = '';
      if( this.selectMode(this.$parent.$parent.$parent.mode) == 'PDF'){
        urlFile = this.urlFile.substring(0, this.urlFile.length - 3) + 'pdf';
      } else if( this.selectMode(this.modeAux) == 'PDF'){
        urlFile = this.urlFile.substring(0, this.urlFile.length - 3) + 'pdf';
      }
        //rastrear pdf descargado
        const body = {
        userId : localStorage.user_idC,
        fileId : this.$parent.$parent.$parent._Id,
        date : new Date().toISOString().substring(0,10),
        fileType : "Download",
        mode : this.selectMode(this.$parent.$parent.$parent.mode) || this.modeAux
      }

      const response = await this.$axios.$post('/addChartFile', body, {
        headers : { Authorization : 'Bearer ' + localStorage.tokenC }
      });
      console.log('SE TRAKEO LA DESCARGAR', response.data);
      let fileName = this.getFileName(urlFile);
      //console.log(fileName)
      FS.saveAs(urlFile, fileName);

      this.dialog = false;
    },
    selectMode( mode ){
      switch( Number(mode) ){
        case 1:
          return 'Notas'

        case 2:
          return 'Imagenes'
        case 3:
          return 'PDF'
      }
    },
    getFileName(str) {
      return str.substring(str.lastIndexOf('/') + 1)
    }
  },
};
</script>

<style scoped>
  .mousePointer{
    cursor: pointer;
  }
</style>
