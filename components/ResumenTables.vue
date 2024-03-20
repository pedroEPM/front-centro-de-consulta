<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
        <v-card color="#F5F5F5" id="printable">
        <v-card-title class="pa-0">
          <v-toolbar dark color="primary">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <!--v-list>
                  <v-list-item @click="print()">
                    <v-list-item-title>Imprimir</v-list-item-title>
                  </v-list-item>
                </v-list-->
            </v-menu>

            <v-spacer class="hidden-md-and-up" />

            <v-icon class="hidden-sm-and-down">
              mdi-newspaper-variant-outline
            </v-icon>
            <v-spacer class="hidden-sm-and-down" />
            <div class="hidden-sm-and-down">

              <!--v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    dark
                    outlined
                    :class="$vuetify.breakpoint.mdAndUp ? 'mr-4' : 'mr-2'"
                    @click="print()"
                  >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir</span>
              </v-tooltip-->
            </div>

            <v-toolbar-title>
              <center>
              Mesa de trabajo: {{workname}}
              </center>
              </v-toolbar-title>

            <v-spacer class="hidden-sm-and-down" />

            <v-btn
              icon
              dark
              @click="dialog = false"
              :class="$vuetify.breakpoint.mdAndUp ? 'ml-15' : ''"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

          <v-card-text id="toPrint">
            <br>
            <v-layout row wrap justify-center  >
                <v-flex>
                  <div style="padding:10px">
                    <v-btn block large @click="changeMode('Notas')"
                        :depressed="selected[1].pressed"
                        :color="selected[1].color"
                      ><v-icon left>mdi-newspaper-variant-outline</v-icon>
                          Notas
                      </v-btn>
                  </div>

                </v-flex>
                <v-flex>
                  <div style="padding:10px">
                <v-btn block large @click="changeMode('Imagenes')"
                        :depressed="selected[2].pressed"
                        :color="selected[2].color"
                      ><v-icon left>mdi-image</v-icon>
                          Imagenes
                      </v-btn>
                  </div>

                </v-flex>
                <v-flex>
                  <div style="padding:10px">
                    <v-btn block large @click="changeMode('Paginas')"
                        :depressed="selected[3].pressed"
                        :color="selected[3].color"
                      ><v-icon left>mdi-image</v-icon>
                          Paginas
                      </v-btn>
                  </div>
                </v-flex>
            </v-layout>
            <br>
            <v-layout row wrap justify-center v-if="mode == 'Notas'">
                <v-flex>
                  <div style="margin:10px">
      <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      :disabled="loading"
      @click="printResume(1)"
    >
      Imprimir
      <v-icon
        right
        dark
      >
        mdi-printer
      </v-icon>
    </v-btn>
                  </div>
                  <v-card>
                    <v-card-text>
             <div style="padding:10px"  id="toPrint1">
                  <h2>Resumen de {{workname}} en notas </h2>

                 <v-data-table
                  :headers="historialNotesLogsHeaders"
                  :items="TableNotesInformation"
                  :items-per-page="5"
                  >
                    <template v-slot:[`item.date`]="{ item }">
                      <span>
                        {{ new Date(item.date).toISOString().substring(0,10) }}
                      </span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn>
                        <v-icon>mdi-eye-refresh</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>

                      </div>
                    </v-card-text>
                  </v-card>

                </v-flex>

                </v-layout>
            <v-layout row wrap justify-center v-if="mode == 'Imagenes'">
                 <v-flex>
                  <div style="margin:10px">
      <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      :disabled="loading"
      @click="printResume(2)"

    >
      Imprimir
      <v-icon
        right
        dark
      >
        mdi-printer
      </v-icon>
    </v-btn>
            </div>

            <v-card>
              <v-card-text>
                <div style="padding:10px"  id="toPrint2">
                <h2>Resumen de {{workname}} en imágenes </h2>
                 <v-data-table

                  :headers="historialImagesLogsHeaders"
                  :items="TableImagesInformation"
                  :items-per-page="5"
                  >
                  <template v-slot:[`item.imgSrc`]="{ item }">
                      <v-avatar class="mr-1" style="width: 130px; height: 130px;">
                          <img
                            :src="item.newSRCThumbnail !== undefined 
                            ? imgPath + item.newSRCThumbnail
                              : item.newSRC !== undefined
                                ? imgPath + item.newSRC 
                                : imgPath + item.imageSrc"
                            >
                        </v-avatar>
                    </template>
                    <template v-slot:[`item.publicationDate`]="{ item }">
                      <span>
                        {{ new Date(item.publicationDate).toISOString().substring(0,10) }}
                      </span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn>
                        <v-icon>mdi-eye-refresh</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-card>
              </v-flex>

            </v-layout>
            <v-layout row wrap justify-center v-if="mode == 'Paginas'">
                    <v-flex>
        <div style="margin:10px">
      <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      :disabled="loading"
      @click="printResume(3)"
    >
      Imprimir
      <v-icon
        right
        dark
      >
        mdi-printer
      </v-icon>
    </v-btn>
         </div>
         <v-card>
             <v-card-text>
           <div style="padding:10px"  id="toprint3">
              <h2>Resumen de {{workname}} en páginas </h2>
               <v-data-table
                  :headers="historialPDFSLogsHeaders"
                  :items="TablePDFSInformation"
                  :items-per-page="5"
                  >
                    <template v-slot:[`item.datePublication`]="{ item }">
                      <span>
                        {{ new Date(item.datePublication).toISOString().substring(0,10) }}
                      </span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn>
                        <v-icon>mdi-eye-refresh</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
           </div>
         </v-card-text>
         </v-card>
              </v-flex>
            </v-layout>

          </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="notePrint" max-width="800">
      <v-card flat>
        <v-container grid-list-xl>
        </v-container>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import PHE from "print-html-element";

export default {
  data: () =>  ({
    imgPath: process.env.imgPath,

    workname: null,
     loader: null,
    loading: false,
    notePrint: false,
    mode: 'Notas',
    dialog:false,
    historialNotesLogsHeaders: [
      { text : 'Clave', value : 'isNewId' },
      { text : 'Titulo', value : 'title' },
      { text : 'Subtítulo', value : 'subTitle' },
      { text : 'Fecha de Publicacion', value : 'date', align : 'center', sortable : true, width : '10%'},
      { text : 'Publicacion', value : 'publicationRef.publicationName' },
      { text : 'Cuaderno', value : 'noteBookRef.NoteBookName' },
      { text : 'Pagina', value : 'page' },
      // { text: "Ver", value: "actions", width: '25%', sortable: false },
    ],
    TableNotesInformation: [{
        'title':'N/a',
        'date':'12-25-22',
        'publicationRef':{'publicationName':'n/a'},
        'noteBookRef':{'NoteBookName':'n/a'},
        'page':0
    }],

    historialImagesLogsHeaders: [
      { text : 'Imagen', value : 'imgSrc', width : '20%' },
      { text : 'Clave', value : 'isNewId', width : '20%' },
      { text : 'Píe de página', value : 'description' },
      { text : 'Fecha de Publicacion', value : 'publicationDate', align : 'center', sortable : true, width : '20%'},
      { text : 'Publicacion', value : 'publicationRef.publicationName' },
      { text : 'Cuaderno', value : 'noteBookRef.NoteBookName' },
      { text : 'Pagina', value : 'page' },
      { text : 'Titulo', value : 'ImageTitle' },
      // { text: "Ver", value: "actions", width: '25%', sortable: false },
    ],
    TableImagesInformation: [{
        'title':'N/a',
        'date':'12-12-12',
        'publicationRef':{'publicationName':'n/a'},
        'noteBookRef':{'NoteBookName':'n/a'},
        'page':0
    }],

    historialPDFSLogsHeaders: [
      { text : 'Clave', value : 'isNewId' },
      { text : 'Fecha de Publicacion', value : 'datePublication', align : 'center', sortable : true, width : '20%'},
      { text : 'Publicacion', value : 'publication.publicationName' },
      { text : 'Cuaderno', value : 'notebook.NoteBookName' },
      { text : 'Pagina', value : 'page' },
      { text : 'Titulo', value : 'title' },
      // { text: "Ver", value: "actions", width: '25%', sortable: false },
    ],
    TablePDFSInformation: [{
        'title':'N/a',
        'date':'12-25-22',
        'publicationRef':{'publicationName':'n/a'},
        'noteBookRef':{'NoteBookName':'n/a'},
        'page':0
    }],
    selected: [
      { pressed: false, text: "black", color: 'primary' },
      { pressed: true, text: "black", color: ''},
      { pressed: false, text: "black", color: 'primary' },
      { pressed: false, text: "black", color: 'primary' },
      { pressed: false, text: "black", color: 'primary' },
    ],
  }),
  watch: {

  },
  computed: {
  },
  methods:{
    changeMode(mode){
      this.mode=mode
      switch( mode ){
        case 'Notas':
          this.selected[1].pressed = true;
          this.selected[1].text = 'black';
          this.selected[1].color = '';
          this.selected[0].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';

          this.selected[0].pressed =false;
          this.selected[2].pressed =false;
          this.selected[3].pressed =false;
          this.selected[4].pressed =false;
        break;
        case 'Imagenes':
          this.selected[2].pressed = true;
          this.selected[2].text = 'black';
          this.selected[2].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';

          this.selected[0].pressed = false;
          this.selected[1].pressed = false;
          this.selected[3].pressed = false;
          this.selected[4].pressed = false;
        break;
        case 'Paginas':
          this.selected[3].pressed = true;
          this.selected[3].text = 'black';
          this.selected[3].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[4].color = 'primary';

          this.selected[0].pressed = false
          this.selected[1].pressed = false
          this.selected[2].pressed = false
          this.selected[4].pressed = false
        break;
      }
    },
    openDialog(item) {
      console.log(item)
      console.log('item3')
      this.dialog=true,
      this.workname = item.name;
      this.TableNotesInformation = item.notes || []
      this.TableImagesInformation = item.images || []
      this.TablePDFSInformation = item.pdfs || []
    },
    print() {
      this.dialog = true;
      //this.locationChanged = true;
      this.notePrint = true;
    },
    async printResume(type){
      this.loading = true;
      switch (type) {
        case 1:
      setTimeout(() => {
        PHE.printElement( document.getElementById('toPrint1'));
      }, 200);
          break;

       case 3:
          setTimeout(() => {
        PHE.printElement( document.getElementById('toprint3'));
      }, 200);
       break;
      case 2:
        setTimeout(() => {
        PHE.printElement( document.getElementById('toPrint2'));
      }, 200);
         break;
      }
       this.loading = false;
    },
  },
};
</script>
