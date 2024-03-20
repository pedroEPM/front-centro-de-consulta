<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="primary" dark>
          <v-card-title class="pb-0">
            <v-layout row wrap justify="space-between">
              <v-flex xs12 md9>
                <!--REPARAR ESTO -->
                <AdvSearchChips
                  :chips="chips"
                  :isWhiteText="false"
                  :color="'white'"
                  :title="'Resultados de:'"
                  v-if="showChips"
                />
              </v-flex>
              <v-flex xs12 md3>
                {{
                  totalResult > elementsCounter
                    ? `${elementsCounter} de ${elementsCounter} Resultados`
                    : `${totalResult} de ${elementsCounter} Resultados`
                }}
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-text class="pa-0" id="nav">
            <v-container grid-list-md>
              <v-layout row wrap justify-center>
                <v-flex v-if="enableNotes && total != 0">
                  <v-btn
                    :depressed="mode == 1"
                    :outlined="mode != 1"
                    :style="'color:' + selected[0].text"
                    color="white"
                    block
                    class="buttonText"
                    @click="waitChangeMode(1)"
                    :disabled="activeButton"
                  >
                    Notas
                  </v-btn>
                </v-flex>

                <v-flex v-if="enableImages && total != 0">
                  <v-btn
                    :depressed="mode == 2"
                    :outlined="mode != 2"
                    :style="'color:' + selected[1].text"
                    color="white"
                    block
                    class="buttonText"
                    @click="waitChangeMode(2)"
                    :disabled="activeButton"
                  >
                    Fotos
                  </v-btn>
                </v-flex>

                <v-flex v-if="enablePDF && total != 0">
                  <v-btn
                    :depressed="mode == 3"
                    :outlined="mode != 3"
                    :style="'color:' + selected[2].text"
                    color="white"
                    block
                    class="buttonText"
                    @click="waitChangeMode(3)"
                    :disabled="activeButton"
                  >
                    Páginas
                  </v-btn>
                </v-flex>

                <!--v-flex>
                  <v-btn :disabled="activeButton" class="buttonText" outlined block> Gráficas </v-btn>
                </v-flex-->

                <v-flex style="text-align: center" v-show="false">
                  <div>
                    <v-btn outlined class="mr-2" @click="isGrid = false"
                      ><v-icon>mdi-view-list</v-icon></v-btn
                    >
                    <v-btn outlined class="ml-2" @click="isGrid = true"
                      ><v-icon>mdi-view-grid</v-icon></v-btn
                    >
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center v-if="!showCanceledSearch">
      <v-flex class="" xs12 md4 v-show="!loading">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="$vuetify.breakpoint.mobile ? 5 : 7"
          @input="nextPage()"
        ></v-pagination>
      </v-flex>

      <v-flex class="" xs12 md2 v-show="!loading">
        <v-select
          solo
          dense
          :items="pages"
          v-model="page"
          @input="nextPage()"
          hide-details
          style="width: 100px; margin: auto"
        ></v-select>
      </v-flex>
      <v-flex
        xs12
        md3
        style="padding-left: 1px; padding-right: 2px"
        v-if="searchadvanceextend && loading == false"
      >
        <v-card elevation="2">
          <v-card-text style="padding-top: 5px; padding-bottom: 0px">
            <center>
              <p>
                Estás navegando en búsqueda extendida.
                <span
                  ><a
                    style="text-decoration-line: underline"
                    @click="cancelextend()"
                    >CANCELAR</a
                  ></span
                >
              </p>
            </center>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        :xs12="$vuetify.breakpoint.smAndDown"
        :class="$vuetify.breakpoint.smAndDown ? 'mt-2 mb-2' : ''"
        class="pa-3"
        v-show="!loading"
      >
        <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center' : 'end'">
          <v-btn
            v-for="(item, index) in totalResults"
            :key="index"
            class="mr-1"
            fab
            dark
            small
            :style="'color : ' + totalResultSelected[index].text"
            :color="totalResultSelected[index].color"
            @click="changeTotalResult(item)"
          >
            {{ item }}
          </v-btn>
        </v-row>
      </v-flex>

      <v-flex
        xs12
        :md3="sort != 10"
        :md2="sort == 10"
        class="pa-3 text-center"
        :class="$vuetify.breakpoint.smAndDown ? 'mr-5' : ''"
        v-show="!loading"
      >
        <!--<v-row justify="end">
          <v-card elevation="2">
            <v-btn dense color="primary" height="38" @click="changeSort()" v-if="sort == 10">Ordenar por</v-btn>
            <v-btn dense color="primary" height="38"  @click="changeSort()" v-else>
              <v-icon left>{{
                sort == -1 ? "mdi-sort-d escending" : "mdi-so rt-ascending"
              }}</v-icon
              ><b class="mr-1">Orden:</b
              >{{ sort == -1 ? "Descend ente" : "Ascenden te" }}
            </v-btn>
          </v-card>
        </v-row>-->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>
                {{
                  sort == true ? "mdi-sort-ascending" : "mdi-sort-descending"
                }}
              </v-icon>
              {{
                sort == true ? "De Reciente a Antiguo" : "De Antiguo a Reciente"
              }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="changeSort(false)">
              <v-list-item-title> De Antiguo a Reciente </v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeSort(true)">
              <v-list-item-title> De Reciente a Antiguo </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="changeSort(true)">
              <v-list-item-title> Sin orden </v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-show="loading"
      justify-center
      v-if="!canceled && elementsCounter !== 0"
    >
      <v-flex xs12 md4>
        <v-card class="text-center mt-2 mb-2">
          <v-card-text>
            <v-icon size="80" class="mb-2"
              >mdi-newspaper-variant-outline</v-icon
            >
            <h1 class="mb-5">Cargando información</h1>
            <h1 class="mb-5">Por favor, espere...</h1>
            <v-progress-linear
              color="primary"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
            <h2 class="mt-3">{{ date }}</h2>
            <v-btn outlined color="primary" @click="cancel(mode)" class="mt-3">
              Cancelar búsqueda
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout
      justify-center
      v-if="!noPermissions && !canceled && elementsCounter === 0"
    >
      <v-flex xs12 md4>
        <v-card class="text-center mt-2 mb-2">
          <v-card-text>
            <v-icon size="80" class="mb-2">mdi-text-box-search-outline</v-icon>
            <h1 class="mb-5">No se han encontrado resultados disponibles</h1>
            <h1 class="mb-5"></h1>

            <v-btn
              outlined
              color="primary"
              @click="$refs.reportDialog.openDialog()"
            >
              Realizar una solicitud
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout justify-center v-show="showCanceledSearch" v-if="!noPermissions">
      <v-flex xs12 md4>
        <v-card class="text-center mt-2 mb-2">
          <v-card-text>
            <v-icon size="80" class="mb-2">mdi-cancel</v-icon>
            <h1 class="mb-5">Se ha cancelado la búsqueda</h1>
            <h1 class="mb-5"></h1>
            <h3 class="mb-5">Realice una nueva búsqueda</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout justify-center v-if="noPermissions">
      <v-flex xs12 md4>
        <v-card class="text-center mt-2 mb-2">
          <v-card-text>
            <v-icon size="80" class="mb-2">mdi-text-box-search-outline</v-icon>
            <h1 class="mb-5">No cuenta con los permisos necesarios</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-show="mode == 1 && !loading"
      v-if="enableNotes && total != 0"
    >
      <v-flex
        xs12
        :md6="isGrid"
        v-for="(item, index) in searched"
        v-bind:key="index"
      >
        <Search-Note-Card
          :subTitle="item.subTitle"
          :title="item.title != undefined ? item.title : null"
          :content="
            item.content != undefined ? item.content.substring(0, 300) : null
          "
          :image="
            item.publicationRef != undefined
              ? imgPath + item.publicationRef.icon
              : null
          "
          :date="
            item.date != undefined
              ? new Date(item.date).toISOString().substring(0, 10)
              : null
          "
          :notebookName="
            item.noteBookRef != undefined ? item.noteBookRef.NoteBookName : null
          "
          :page="item.page"
          :clave="item.isNewId"
          :id="item._id"
          @click.native="
            prepareContentDialog(item, 1, index, 'advance', item.date)
          "
        />
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-show="mode == 2 && !loading"
      v-if="enableImages && total != 0"
    >
      <v-flex
        :class="
          $vuetify.breakpoint.mdAndUp
            ? 'xs2'
            : $vuetify.breakpoint.smAndUp
            ? 'xs3'
            : 'xs6'
        "
        v-for="(item, index) in images"
        v-bind:key="index"
        @click="prepareContentDialog(item, 2, index, 'advance', item.date)"
      >
        <Search-Image-Card
          :item="item"
          :page="item.page"
          :image="item.newSRCThumbnail !== undefined ? imgPath + item.newSRCThumbnail : imgPath + item.imageSrc"
          :imageTitle="item.description != undefined ? item.description : ''"
          :publicationName="
            item.publicationRef != undefined
              ? item.publicationRef.publicationName
              : null
          "
          :notebookName="
            item.noteBookRef != undefined ? item.noteBookRef.NoteBookName : null
          "
          :icon="
            item.publicationRef != undefined
              ? imgPath + item.publicationRef.icon
              : null
          "
          :date="
            item.publicationDate != undefined
              ? new Date(item.publicationDate).toISOString().substring(0, 10)
              : null
          "
          @click.native="
            prepareContentDialog(item, 2, index, 'advance', item.publicationDate)
          "
        />
      </v-flex>
    </v-layout>

    <v-layout
      row
      wrap
      v-show="mode == 3 && !loading"
      v-if="enablePDF && total != 0"
    >
      <v-flex
        :class="
          $vuetify.breakpoint.mdAndUp
            ? 'xs2'
            : $vuetify.breakpoint.smAndUp
            ? 'xs3'
            : 'xs6'
        "
        v-for="(item, index) in pdfs"
        v-bind:key="index"
      >
        <Search-PDF-Card
          :image="item.newSRCPDFThumbnail ? imgPath + item.newSRCPDFThumbnail : imgPath + item.imageSrc"
          :title="item.title !== null ? item.title.substring(0, 20) : ''"
          :page="item.page"
          :notebookName="
            item.notebook != undefined ? item.notebook.NoteBookName : null
          "
          :icon="
            item.publication != undefined
              ? imgPath + item.publication.icon
              : null
          "
          :date="
            item.datePublication != undefined
              ? new Date(item.datePublication).toISOString().substring(0, 10)
              : null
          "
          @click.native="
            prepareContentDialog(item, 3, index, 'advance', item.datePublication)
          "
        />
      </v-flex>
    </v-layout>
    <!-- <v-layout row wrap justify-center v-if="!showCanceledSearch">
      <v-flex
        xs12
        md12
        v-if="viewextendsearch && !loading && searchadvanceextend == false"
      >
        <center>
          <div>
            <p style="margin-bottom: 10px; font-size: 17px">
              Para que veas los resultados más relevantes, omitimos ciertas
              entradas a las {{ elementsCounter }}, que te hemos mostrado.
            </p>
            <p style="margin-bottom: 10px; font-size: 17px">
              ¿Quieres extender búsqueda, con los resultados omitidos?
            </p>
            <v-btn color="blue-grey" dark @click="searchAdvanceExtended()">
              Extender búsqueda
            </v-btn>
          </div>
        </center>
      </v-flex>
    </v-layout> -->

    <v-layout row wrap justify-center v-if="!showCanceledSearch">
      <v-flex xs12 md4 v-show="!loading">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="$vuetify.breakpoint.mobile ? 5 : 7"
          @input="nextPage()"
        ></v-pagination>
      </v-flex>
      <v-flex xs12 md2 v-show="!loading">
        <v-select
          solo
          dense
          :items="pages"
          v-model="page"
          @input="nextPage()"
          hide-details
          style="width: 100px; margin: auto"
        ></v-select>
      </v-flex>
      <v-flex xs12 md3 v-if="searchadvanceextend && loading == false">
        <v-card elevation="2">
          <v-card-text style="padding-top: 5px; padding-bottom: 0px">
            <center>
              <p>
                Estás navegando en búsqueda extendida.
                <span
                  ><a
                    style="text-decoration-line: underline"
                    @click="cancelextend()"
                    >CANCELAR</a
                  ></span
                >
              </p>
            </center>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        :xs12="$vuetify.breakpoint.smAndDown"
        :class="$vuetify.breakpoint.smAndDown ? 'mt-2 mb-2' : ''"
        class="pa-5"
        v-show="!loading"
      >
        <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center' : 'end'">
          <v-btn
            v-for="(item, index) in totalResults"
            :key="index"
            class="mr-1"
            fab
            dark
            small
            :style="'color : ' + totalResultSelected[index].text"
            :color="totalResultSelected[index].color"
            @click="changeTotalResult(item)"
          >
            {{ item }}
          </v-btn>
        </v-row>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" max-width="365">
      <v-card>
        <v-card-title>¿Seguro de cancelar la búsqueda?</v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-spacer />
            <v-btn
              color="secondary"
              @click="(dialog = false), (mode = previusMode)"
              >Esperar</v-btn
            >
            <v-btn
              color="primary"
              @click="cancel(previusMode, false), (dialog = false)"
              class="ml-2"
              >Aceptar</v-btn
            >
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <Content-Dialog ref="contentDialog" :advSearch="chips" />
    <Search-Report-Dialog ref="reportDialog" />
    <CounterComponet ref="counterComponet" />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import SearchNoteCard from "~/components/SearchNoteCard";
import SearchImageCard from "~/components/SearchImageCard";
import SearchPDFCard from "~/components/SearchPDFCard";
import ContentDialog from "~/components/ContentDialog";
import SearchReportDialog from "~/components/SearchReportDialog";
import AdvSearchChips from "~/components/advSearchChips.vue";
import CounterComponet from "~/components/CounterComponent.vue";
export default {
  components: {
    ContentDialog,
    SearchNoteCard,
    SearchImageCard,
    SearchPDFCard,
    SearchReportDialog,
    AdvSearchChips,
    CounterComponet,
  },
  data: () => ({
    dialog: false,
    canceled: false,
    page: 1,
    pages: [],
    total: null,
    totalPages: null,
    viewextendsearch: false,
    searchadvanceextend: false,
    cancelSearchAdvanceExtend: null,
    loading: false,
    mode: 1,
    searchElement: null,
    searched: [],
    backSearched: [],
    images: [],
    backImages: [],
    pdfs: [],
    backpdfs: [],
    elementsCounter: '"Contando"',
    hasElements: false,
    imgPath: process.env.imgPath,
    isGrid: false,
    advObj: null,
    advObjNotMove: null,
    tempSearch: null,
    selected: [
      { pressed: true, color: "white", text: "#004D9C" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
    ],
    chips: {
      search: null,
      publication: null,
      notebook: null,
      initDate: null,
      finalDate: null,
      keywords: null,
      keysentence: null,
      key: null,
      ignoredwords: null,
    },
    sort: true,
    noPermissions: false,
    showNotFound: false,
    date: "00 : 00 : 00 : 00",
    isMarch: false,
    acumularTime: 0,
    timeInicial: null,
    control: null,
    cancelSearched: false,
    requests: [],
    request: null,
    request2: null,
    previusMode: null,
    totalResultSelected: [
      { pressed: false, color: "white", text: "black" },
      { pressed: true, color: "primary", text: "white" },
      { pressed: false, color: "white", text: "black" },
      { pressed: false, color: "white", text: "black" },
    ],
    totalResults: [10, 20, 50, 100],
    totalResult: 20,
    showCanceledSearch: false,
    activeButton: false, //
    cancelFor: false,
    counterFor: 0,
    showChips: false,

    notebooksO: [],
  }),
  watch: {
    async $route(to, from) {
      if (this.$route.query.content == undefined) {
        if (this.$route.query.search != undefined) {
          this.elementsCounter = '"Contando"';
          this.loading = true;
          this.showNotFound = false;
          this.searchElement = null;
          this.advObj = null;
          this.advObjNotMove = null;
          this.searchElement = JSON.parse(atob(this.$route.query.search));
          this.advObj = JSON.parse(atob(this.$route.query.search));

          this.advObjNotMove = JSON.parse(atob(this.$route.query.search));
          //console.log("This is searched");
          if (this.request != null || this.request2 != null) {
            this.cancel();
            // //console.log('HOla---------------------')
          }
          setTimeout(() => {
            this.showCanceledSearch = false;
            this.canceled = false;
            this.activeButton = false;
          }, 1);
          // //console.log(this.searchElement)
          // //console.log(this.advObj)
          switch (this.searchElement.search) {
            case "Notas":
              this.mode = 1;
              break;
            case "Imagenes":
              this.mode = 2;
              break;
            case "PDFs":
              this.mode = 3;
              break;
          }
          //this.getMode();
          // if (this.$route.query.workbench === "true") {

            this.changeMode(this.mode);
            this.getSearchChips(JSON.parse(atob(this.$route.query.search)));
        }
      }
      /*await this.getPermissions();
      this.getMode();
      this.changeMode(this.mode);
      this.changeModeButton(this.mode); */
    },
    totalResult(newValue) {
      // //console.log( newValue )
      switch (newValue) {
        case 10:
          this.totalResultSelected[0] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 20:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 50:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          this.totalResultSelected[3] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          break;
        case 100:
          this.totalResultSelected[0] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[1] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[2] = {
            pressed: false,
            color: "white",
            text: "black",
          };
          this.totalResultSelected[3] = {
            pressed: true,
            color: "primary",
            text: "white",
          };
          break;
      }
    },
    mode(val) {
      this.elementsCounter = '"Contando"';
      switch (val) {
        case 1:
          this.selected[0] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[1] = { pressed: false, color: "white", text: "white" };
          this.selected[2] = { pressed: false, color: "white", text: "white" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          break;
        case 2:
          this.selected[0] = { pressed: false, color: "white", text: "white" };
          this.selected[1] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[2] = { pressed: false, color: "white", text: "white" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          break;
        case 3:
          this.selected[0] = { pressed: false, color: "white", text: "white" };
          this.selected[1] = { pressed: false, color: "white", text: "white" };
          this.selected[2] = { pressed: true, color: "white", text: "#004D9C" };
          this.selected[3] = { pressed: false, color: "white", text: "white" };
          break;
      }
    },
  },
  async created() {
    if (process.browser) {
      this.loading = true;
      this.showNotFound = false;
      this.hasElements = false;
      this.enableNotes = false;
      this.enableImages = false;
      this.enablePDF = false;
      this.noPermissions = false;
      if (process.browser) {
        if (this.$route.query.search != undefined) {
          this.searchElement = JSON.parse(atob(this.$route.query.search));
          this.advObj = JSON.parse(atob(this.$route.query.search));
          this.advObjNotMove = JSON.parse(atob(this.$route.query.search));
          this.cancelSearchAdvanceExtend =
            this.advObjNotMove.cancelSearchExtend;
          switch (this.searchElement.search) {
            case "Notas":
              if (this.enableNotes) {
                this.mode = 1;
              }
              break;
            case "Imagenes":
              if (this.enableImages) {
                this.mode = 2;
              }
              break;
            case "PDFs":
              if (this.enablePDF) {
                this.mode = 3;
              }
              break;
          }
          this.getSearchChips(JSON.parse(atob(this.$route.query.search)));
        }
      }
      if (!this.enableNotes && this.mode == 1) {
        this.getMode();
      }
      this.changeMode(Number(this.mode));

      console.log(this.advObj)
      console.log('mmmmmmmmmmmmmmmmmm')
      // if (this.$route.query.workbench === "true") {

      //this.changeModeButton(this.mode);
    }
  },
  mounted() {
    if (this.$route.query.content != undefined) {
      switch (this.$route.query.mode) {
        case "1":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 4);
          break;
        case "2":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 5);
          break;
        case "3":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 6);
          break;
      }
    }
  },
  computed: {
    ...mapState("permissions", ["enableNotes", "enableImages", "enablePDF"]),
  },
  methods: {
    ...mapActions(["getData", "getCount"]),
    ...mapMutations("search", ["setSearched"]),
    goToPagetop() {
      var elmnt = document.getElementById("nav");
      elmnt.scrollIntoView({ behavior: "smooth" });
    },
    print() {
      window.print();
    },
    waitChangeMode(mode) {
      //this.validateSessionP1();
      if (this.loading) {
        this.previusMode = this.mode;
        this.mode = mode;
        this.dialog = true;
      } else {
        if (this.request2 != null) {
          this.cancelarPro();
        }
        this.changeMode(mode);
      }
    },

    async changeMode(mode) {
      this.page = 1;
      this.advObjNotMove.quantity = this.page;
      this.advObj = null;
      // this.advObj.quantity = 1;
      this.advObj = this.advObjNotMove;
      switch (mode) {
        case 1:
          this.mode = 1;
          this.advObj.search = "Notas";
          this.cancelSearchAdvanceExtend = true;
          this.getAdvSearch();
          await this.getPagination();
          break;
        case 2:
          this.mode = 2;
          this.advObj.search = "Imagenes";
          this.cancelSearchAdvanceExtend = true;
          this.getAdvSearch();
          await this.getPagination();
          break;
        case 3:
          this.mode = 3;
          this.advObj.search = "PDFs";
          this.cancelSearchAdvanceExtend = true;
          await this.getAdvSearch();
          await this.getPagination();

          // new pagination here


          break;
      }
    },
    async changeModeButton(mode) {
      this.loading = true;
      switch (mode) {
        case 1:
          this.mode = 1;
          this.advObj.search = "Notas";
          this.cancelSearchAdvanceExtend = true;
          this.getAdvSearch();
          await this.getPagination();
          break;
        case 2:
          console.clear()
          console.log(`\n\n aaaaaaaaa \n\n`)
          this.mode = 2;
          this.advObj.search = "Imagenes";
          this.cancelSearchAdvanceExtend = true;
          this.getAdvSearch();
          await this.getPagination();
          break;
        case 3:
          this.mode = 3;
          this.advObj.search = "PDFs";
          this.cancelSearchAdvanceExtend = true;
          await this.getAdvSearch();
          await this.getPagination();
          // await this.getPagination();
          // new pagination here
          break;
      }
    },
    async getAdvSearch(newQuantity) {
      this.advObjNotMove.quantity = newQuantity
        ? Number(this.advObjNotMove.quantity) + 1
        : this.advObjNotMove.quantity;
      if (this.cancelSearchAdvanceExtend == true) {
        //console.log('no se ejecuto AdvanceExtend getAdvSearch');
        this.searchadvanceextend = false;
        this.viewextendsearch = false;
      }
      try {
        this.searched = [];
        this.images = [];
        this.pdfs = [];
        this.start();
        const params = {
          x: 0,
          search: this.advObjNotMove.search,
          allwords: this.advObjNotMove.allwords,
          keywords: this.advObjNotMove.keywords,
          keysentence: this.advObjNotMove.keysentence,
          publicationRef: this.advObjNotMove.publicationRef,
          noteBookRef: this.advObjNotMove.noteBookRef,
          date: this.advObjNotMove.date,
          dateRange: this.advObjNotMove.dateRange,
          key: this.advObjNotMove.key,
          firstTimeSearch: false,
          extended: this.searchadvanceextend,
          // firstTimeSearch: false,
          quantity: this.advObjNotMove.quantity,
          ordenamiento: this.sort,
          searchId: localStorage.user_idC,
          totalResults: this.totalResult,
          ignoredwords: this.advObjNotMove.ignoredwords,
        };

        this.loading = true;
        this.showNotFound = false;
        const response = await this.$axios.$get("/AdvanceSearch", {
          params: params,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
          // cancelToken : axiosSource.token,
        });
        //-----ordenando por publicacion y pagina----------------
        /*if (this.mode == 3) {
          let separedindex = {};
          let auxPublicationList = [];
          let auxPublicationListIndex = {};
          let foundItems = response.data.foundItems;
          foundItems = foundItems.sort(function (a, b) {
            return a.page - b.page;
          });
          foundItems.forEach((item) => {
            if (item.notebook) {
              if (auxPublicationList.indexOf(item.notebook._id + "") == -1) {
                auxPublicationList.push(item.notebook._id + "");
              }
            } else {
              auxPublicationList.push("No tiene");
            }
          });
          auxPublicationList.forEach((publi) => {
            foundItems.forEach((item, i) => {
              item =
                item != undefined && item != null
                  ? item
                  : { notebook: { _id: "No tiene" } };
              item.notebook =
                item.notebook != undefined && item.notebook != null
                  ? item.notebook
                  : { _id: "No tiene" };
              if (publi == item.notebook._id + "") {
                if (!separedindex["pdf" + item.notebook._id]) {
                  separedindex["pdf" + item.notebook._id] = [];
                  auxPublicationListIndex["pdf" + item.notebook._id] = [];
                }
                separedindex["pdf" + item.notebook._id].push(item);
                auxPublicationListIndex["pdf" + item.notebook._id].push(
                  Number(item.page)
                );
              }
            });
          });
          let finalpdfarr = [];
          auxPublicationList.forEach((publi) => {
            auxPublicationListIndex["pdf" + publi].sort(function (a, b) {
              return a - b;
            });
            auxPublicationListIndex["pdf" + publi].forEach((x) => {
              let n = separedindex["pdf" + publi].findIndex(
                (obj) => obj.page === x
              );
              if (separedindex["pdf" + publi][n]) {
                finalpdfarr.push(separedindex["pdf" + publi][n]);
              }
              separedindex["pdf" + publi].splice(n, 1);
            });
          });
          finalpdfarr = finalpdfarr.sort(function (a, b) {
            return new Date(a.dateCreation) - new Date(b.dateCreation);
          });
          //finalpdfarr.forEach(i=>{//console.log(i.page+" "+i.publication.publicationName +" "+i.notebook.NoteBookName +" "+i.dateCreation)})
          response.data.foundItems = finalpdfarr;
        }*/
        //-----ordenando por publicacion y pagina----------------
        // acutliazno de manera forzada vuex-------------
        let formated = response.data.foundItems.map((el) => {
          return { id: el._id, date: el.date || el.dateCreation };
        });
        //console.log('se acutaliza forzado el vueex')
        //console.log(formated)
        this.setSearched(formated);
        // fin acutliazno de manera forzada vuex-------------
        switch (this.mode) {
          case 1:
            response.data.foundItems.map((el) => {
              let isMoved = false;
              if (el.content != undefined) {
                el.content = el.content.replaceAll("%F1", "ñ");
                /*el.content = el.content.replaceAll("<", "");
                el.content = el.content.replaceAll("<b>", "");
                el.content = el.content.replaceAll("</b>", "");*/
                const regex =
                  /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
                let searchString =
                  this.advObj.allwords != undefined ? this.advObj.allwords : "";
                searchString = searchString.replace(/ +(?= )/g, "");
                let result = searchString.replace(regex, "");
                let words = result.split(" ");
                if (this.advObj.keysentence != undefined) {
                  if (!isMoved) {
                    let index = this.superSubstringSetence(
                      el.content,
                      this.advObj.keysentence
                    );
                    if (index > 0) {
                      index = index - parseInt(Math.random() * (150 - 50) + 50);
                    }
                    const cContent = el.content.split("");
                    const cContent2 = cContent.reverse().join("");
                    el.content = el.content.substring(index, el.content.length);
                    isMoved = true;
                  }
                  // let position = el.content.indexOf(this.advObj.keysentence);
                  // el.content = el.content.substring(position, el.content.length);
                  // let keysentence = new RegExp(this.advObj.keysentence, "ig");
                  el.content = this.addStrongKeySetence(
                    el.content,
                    this.advObj.keysentence
                  );
                }
                if (this.advObj.keywords != undefined) {
                  if (!isMoved) {
                    el.content = this.superSubstring(
                      el.content,
                      this.advObj.keywords
                    );
                    isMoved = true;
                  }
                  // let position = el.content.indexOf(this.advObj.keywords);
                  // el.content = el.content.substring(position, el.content.length);
                  // let keywords = new RegExp(this.advObj.keywords, "ig");
                  el.content = this.addStrongKeySetence(
                    el.content,
                    this.advObj.keywords
                  );
                  // el.content = this.addStrongText( el.content, this.advObj.keywords );
                }
                for (var i = 0; i < words.length; i++) {
                  if (words[i] == "") {
                    words.splice(i, 1);
                  }
                }
                if (this.advObj.keysentence == undefined) {
                  words.every(function (element, index) {
                    let position = el.content.indexOf(element);
                    if (position > -1) {
                      el.content = el.content.substring(
                        position,
                        el.content.length
                      );
                    }
                  });
                }
                words.forEach((element) => {
                  el.content = this.addStrongText(el.content, element);
                });
              }
            });
            //console.log("This is all searched");
            this.searched = [];
            this.images = [];
            this.pdfs = [];
            //console.log("This is the notes <>");
            //console.log(response.data.foundItems);
            this.backSearched = response.data.foundItems;
            this.searched = response.data.foundItems;

            if (this.searched.length < 1) {
              this.showNotFound = true;
            }
            this.loading = false;
            break;
          case 2:
            this.backImages = response.data.foundItems;
            this.backImages.map((el) => {
              let isMoved = false;
              if (el.description != undefined) {
                el.description = el.description.replaceAll("%F1", "ñ");
                /*el.description = el.description.replaceAll("<", "");
                el.description = el.description.replaceAll("<b>", "");
                el.description = el.description.replaceAll("</b>", "");*/
                // el.prueba = el.description;
                const regex =
                  /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
                let searchString =
                  this.advObj.allwords != undefined ? this.advObj.allwords : "";
                searchString = searchString.replace(/ +(?= )/g, "");
                let result = searchString.replace(regex, "");
                let words = result.split(" ");
                if (this.advObj.keysentence != undefined) {
                  if (!isMoved) {
                    let index = this.superSubstringSetence(
                      el.description,
                      this.advObj.keysentence
                    );
                    if (index > 0) {
                      index = index - parseInt(Math.random() * (150 - 50) + 50);
                    }
                    el.description = el.description.substring(
                      index,
                      el.description.length
                    );
                    // el.description = this.superSubstring( el.description, this.advObj.keysentence );
                    isMoved = true;
                  }
                  // let position = el.description.indexOf(this.advObj.keysentence);
                  // el.description = el.description.substring(position, el.description.length);
                  // let keysentence = new RegExp(this.advObj.keysentence, "ig");
                  el.description = this.addStrongKeySetence(
                    el.description,
                    this.advObj.keysentence
                  );
                }
                if (this.advObj.keywords != undefined) {
                  if (!isMoved) {
                    el.description = this.superSubstring(
                      el.description,
                      this.advObj.keywords
                    );
                    isMoved = true;
                  }
                  // let position = el.description.indexOf(this.advObj.keywords);
                  // el.description = el.description.substring(position, el.description.length);
                  // let keywords = new RegExp(this.advObj.keywords, "ig");
                  el.description = this.addStrongKeySetence(
                    el.description,
                    this.advObj.keywords
                  );
                  // el.description = this.addStrongText( el.description, this.advObj.keywords );
                }
                for (var i = 0; i < words.length; i++) {
                  if (words[i] == "") {
                    words.splice(i, 1);
                  }
                }
                if (this.advObj.keysentence == undefined) {
                  words.every(function (element, index) {
                    let position = el.description.indexOf(element);
                    if (position > -1) {
                      el.description = el.description.substring(
                        position,
                        el.description.length
                      );
                    }
                  });
                }
                words.forEach((element) => {
                  el.description = this.addStrongText(el.description, element);
                });
              }
            });
            this.images = this.backImages;
            //console.log(response.data.foundItems);
            if (this.images.length < 1) {
              this.showNotFound = true;
            }
            this.loading = false;
            break;
          case 3:
            this.backpdfs = response.data.foundItems;
            // const auxPdfs = response.data.foundItems || [];
            // let auxPdfsOrder = {};
            // let indexOrder = [];
            // let sortedPDfs = [];
            // auxPdfs.forEach((pdf) => {
            //   if (auxPdfsOrder[pdf.publication._id + "_" + pdf.notebook._id]) {
            //     auxPdfsOrder[pdf.publication._id + "_" + pdf.notebook._id].push(
            //       pdf
            //     );
            //   } else {
            //     auxPdfsOrder[pdf.publication._id + "_" + pdf.notebook._id] = [
            //       pdf,
            //     ];
            //   }
            //   if (
            //     indexOrder.findIndex(
            //       (obj) =>
            //         obj.id == pdf.publication._id + "_" + pdf.notebook._id
            //     ) == -1
            //   ) {
            //     indexOrder.push({
            //       id: pdf.publication._id + "_" + pdf.notebook._id,
            //       date: pdf.dateCreation,
            //     });
            //   }
            // });
            // // console.log("auxPdfsOrder------------------------------------");
            // indexOrder = indexOrder.sort(function (a, b) {
            //   if (a.date > b.date) {
            //     return 1;
            //   }
            //   if (a.date < b.date) {
            //     return -1;
            //   }
            //   return 0;
            // });

            // // console.log(auxPdfsOrder);
            // // console.log(indexOrder);
            // // console.log("indexOrder------------------------------------------");
            // indexOrder.forEach((i) => {
            //   auxPdfsOrder[i.id] = auxPdfsOrder[i.id].sort(function (a, b) {
            //     if (a.dateCreation > b.dateCreation) {
            //       return -1;
            //     }
            //     if (a.dateCreation < b.dateCreation) {
            //       return 1;
            //     }
            //     return 0;
            //   });
            //   auxPdfsOrder[i.id].forEach((pdf) => {
            //     sortedPDfs.push(pdf);
            //   });
            // });
            // // console.log(auxPdfsOrder);
            // // console.log(sortedPDfs);
            // // console.log("sortedPDfs------------------------------------------");
            // this.pdfs = sortedPDfs;

            // this.pdfs = this.pdfs.reduce(function (acc, curr) {
            //   if (!acc.includes(curr)) acc.push(curr);
            //   return acc;
            // }, []);

            // console.log(this.pdfs);
            // if (this.pdfs.length < 1) {
            //   this.showNotFound = true;
            // }
            const pdfNotebooks = [];

            // this.pdfs.forEach(x => {
            //   if(!pdfNotebooks.find(element => element === x.notebook?.NoteBookName)){
            //     pdfNotebooks.push(x.notebook?.NoteBookName);
            //   }
            // });

            // page order
            // console.log();
            // this.pdfs.sort(function(a, b) {
            //     let nameA = a.page;
            //     let nameB = b.page;
            //     return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            // });

            // this.pdfs.sort(function(a, b) {
            //     let nameA = new Date(a.dateCreation);
            //     let nameB = new Date(b.dateCreation);
            //     if(this.sort === -1){
            //       console.log('- 1');
            //       return (nameA > nameB) ? -1 : (nameA < nameB) ? 1 : 0;
            //     }else {
            //       console.log('- 2');
            //       return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            //     }

            // });

            // const cPdfs = this.pdfs;
            // this.pdfs = [];
            // for(let i = 0; i < this.notebooksO.length; i++){
            //   cPdfs.forEach(x => {
            //     if(x?.notebook?._id === this.notebooksO[i]._id){
            //       this.pdfs.push(x);
            //       console.log(this.notebooksO[i].NoteBookName);
            //     }
            //   });
            // }

            // cPdfs.forEach(x => {
            //   let isAdded = false;
            //   this.pdfs.forEach(y => {
            //     if(x._id === y._id) isAdded = true;
            //   });
            //   if(!isAdded) this.pdfs.push(x);
            // });

            // this.pdfs.sort(function(a, b) {
            //     let nameA = a.notebook?.NoteBookName.toUpperCase();
            //     let nameB = b.notebook?.NoteBookName.toUpperCase();
            //     return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            // });

            this.pdfs = response.data.foundItems;
            this.loading = false;
            break;
        }
        this.stop();
        this.request = null;
      } catch (error) {
        this.stop();
        this.logResponseErrors(error);
        this.loading = false;
        //console.log(error);
        // this.showNotFound = true;
      }
    },
    cancelarPro() {
      this.request2.cancel();
      this.request2 = null;
      this.counterFor = 100;
      // alert(1)
      this.cancelFor = false;
    },
    async getPagination(isChangeTotal = false) {
      let response;

      try {
        if (!isChangeTotal) {
          let busquedaAnterior = this.advObj;
          this.page = 1;
          this.elementsCounter = '"100 o más"';
          try {
            response = await this.$axios.$get("/AdvanceSearch", {
              params: {
                x: 0,
                search: this.advObjNotMove.search,
                allwords: this.advObjNotMove.allwords,
                keywords: this.advObjNotMove.keywords,
                keysentence: this.advObjNotMove.keysentence,
                publicationRef: this.advObjNotMove.publicationRef,
                noteBookRef: this.advObjNotMove.noteBookRef,
                date: this.advObjNotMove.date,
                dateRange: this.advObjNotMove.dateRange,
                key: this.advObjNotMove.key,
                firstTimeSearch: true,
                extended: this.searchadvanceextend,
                quantity: "",
                ordenamiento: this.sort,
                searchId: localStorage.user_idC,
                totalResults: this.totalResult,
                ignoredwords: this.advObjNotMove.ignoredwords,
              },
              // timeout: 30,
              headers: { Authorization: "Bearer " + localStorage.tokenC },
            });
          } catch (e) {
            console.log(e);
            console.log("error in get counter");
          }
        }
        //}
        switch (this.mode) {
          case 1:
            if (!isChangeTotal) {
              this.elementsCounter =
                response.data.CountNotes != null &&
                response.data.CountNotes != undefined
                  ? response.data.CountNotes
                  : 0;
            }
            if (this.elementsCounter > 0) {
              this.hasElements = true;
            } else {
              this.hasElements = false;
            }
            //this.totalPages = Math.ceil(response.data.CountNotes / 20);
            this.totalPages =
              this.elementsCounter > this.totalResult
                ? Math.ceil(this.elementsCounter / this.totalResult)
                : 1;
            this.totalPages =
              this.totalPages != null && this.totalPages != undefined
                ? this.totalPages
                : 1;
            this.generateArrayPages(this.totalPages);
            break;
          case 2:
            if (!isChangeTotal) {
              this.elementsCounter =
                response.data.CountImages != undefined &&
                response.data.CountImages != null
                  ? response.data.CountImages
                  : 0;
            }
            if (this.elementsCounter > 0) {
              this.hasElements = true;
            } else {
              this.hasElements = false;
            }
            this.totalPages =
              this.elementsCounter > this.totalResult
                ? Math.ceil(this.elementsCounter / this.totalResult)
                : 1;
            //this.totalPages = Math.ceil(response.data.CountImages / this.totalResult);
            this.totalPages =
              this.totalPages != null && this.totalPages != undefined
                ? this.totalPages
                : 1;
            this.generateArrayPages(this.totalPages);
            break;
          case 3:
            if (!isChangeTotal) {
              this.elementsCounter =
                response.data.Countpdfs != undefined &&
                response.data.Countpdfs != null
                  ? response.data.Countpdfs
                  : 0;
            }
            if (this.elementsCounter > 0) {
              this.hasElements = true;
            } else {
              this.showNotFound = true;
              this.hasElements = false;
            }
            this.totalPages =
              this.elementsCounter > this.totalResult
                ? Math.ceil(this.elementsCounter / this.totalResult)
                : 1;
            //this.totalPages = Math.ceil(response.data.Countpdfs / this.totalResult);
            this.totalPages =
              this.totalPages != null && this.totalPages != undefined
                ? this.totalPages
                : 1;
            this.generateArrayPages(this.totalPages);
            break;
        }
        this.cancelFor = false;
        // console.log("pages get pagination");
        setTimeout(() => {
          this.advObj = busquedaAnterior;
        }, 1);
      } catch (error) {
        //console.log(error);
        //console.log(error.response);
        this.cancelFor = false;
      }
    },
    //async getPagination() {
    //  this.$refs.counterComponet.getPagination();
    //},
    nextPage() {
      if (this.page == this.totalPages) {
        this.viewextendsearch = true;
        this.cancelSearchAdvanceExtend = false;
      } else {
        this.viewextendsearch = false;
      }
      //this.validateSessionP1();
      // //console.log(this.advObjNotMove)
      // //console.log('----------- advNot')
      // //console.log(this.advObj)
      // //console.log('----------- adv')
      this.goToPagetop();
      switch (this.mode) {
        case 1:
          this.advObjNotMove.quantity = this.page;
          this.getAdvSearch();
          break;
        case 2:
          this.advObjNotMove.quantity = this.page;
          this.getAdvSearch();
          break;
        case 3:
          this.advObjNotMove.quantity = this.page;
          this.getAdvSearch();
          break;
      }
    },
    async searchAdvanceExtended() {
      console.log("searchAdvanceExtended");
      this.searchadvanceextend = true;
      this.page = 1;
      this.viewextendsearch = false;
      this.getAdvSearch();
      await this.getPagination();
      // new pagination here

    },
    async cancelextend() {
      this.page = 1;
      this.cancelSearchAdvanceExtend = true;
      this.getAdvSearch();
      await this.getPagination();
      // new pagination here

    },
    async generateArrayPages(total) {
      this.total = total != undefined || total != null ? total : 1;
      // alert(total)
      // //console.log(total)
      // //console.log('-----------')
      this.pages = Array.from(Array(this.total + 1).keys());
      // alert(total)
      setTimeout(() => {
        this.pages.shift();
      }, 1);
    },
    async getSearchChips(chips) {
      // //console.log(chips)
      // //console.log('-- Object --')q
      // console.log(chips);
      // console.log("---------- ----------");
      this.chips = [];
      this.showChips = false;
      if (
        chips.allwords != undefined &&
        chips.allwords != null &&
        chips.allwords.trim() != ""
      ) {
        this.chips.search = chips.allwords;
      }
      /**
      this.chips.push({
        value:
          chips.keysentence != undefined ? chips.keysentence : null,
        label: "Frase",
      });
      this.chips.push({
        value: chips.keywords != undefined ? chips.keywords : null,
        label: "P. Clave",
      });
      this.chips.push({
        value:
          chips.ignoredwords != undefined
            ? chips.ignoredwords
            : null,
        label: "P. Excluidas",
      });
      */
      if (
        chips.noteBookRef != undefined &&
        chips.noteBookRef != null &&
        chips.noteBookRef.trim() != ""
      ) {
        await this.getNotebookName(chips.noteBookRef);
      }
      if (
        chips.publicationRef != undefined &&
        chips.publicationRef != null &&
        chips.publicationRef.trim() != ""
      ) {
        await this.getPublicationName(chips.publicationRef);
        // alert(this.chips.publication)
      }
      /**
      this.chips.push({
        value: chips.key != undefined ? chips.key : null,
        label: "Clave",
      });
      */
      if (
        chips.keywords != undefined &&
        chips.keywords != null &&
        chips.keywords.trim() != ""
      ) {
        this.chips.keywords = chips.keywords;
      }
      if (
        chips.keysentence != undefined &&
        chips.keysentence != null &&
        chips.keysentence.trim() != ""
      ) {
        this.chips.keysentence = chips.keysentence;
      }
      if (
        chips.dateRange != undefined &&
        chips.dateRange != null &&
        chips.dateRange.trim() != undefined
      ) {
        this.chips.initDate =
          chips.dateRange.substring(8, 10) +
          "-" +
          this.getMonth(chips.dateRange.substring(5, 7)) +
          "-" +
          chips.dateRange.substring(0, 4);
      }
      if (
        chips.date != undefined &&
        chips.date != null &&
        chips.date.trim() != ""
      ) {
        this.chips.finalDate =
          chips.date.substring(8, 10) +
          "-" +
          this.getMonth(chips.date.substring(5, 7)) +
          "-" +
          chips.date.substring(0, 4);
      }
      if (
        chips.key != undefined &&
        chips.key != null &&
        chips.key.trim() != ""
      ) {
        this.chips.key = chips.key;
      }
      if (
        chips.ignoredwords != undefined &&
        chips.ignoredwords != null &&
        chips.ignoredwords.trim() != ""
      ) {
        this.chips.ignoredwords = chips.ignoredwords;
      }
      setTimeout(() => {
        this.showChips = true;
      }, 1);
    },
    async getNotebookName(id) {
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      const notebook = response.data.notebooks.find((el) => el._id == id);
      this.chips.notebook = notebook.NoteBookName;
    },
    async getPublicationName(id) {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      const publication = response.data.publicaciones.find(
        (el) => el._id == id
      );
      try {
        this.chips.publication = publication.publicationName;
      } catch (e) {}
    },
    changeSort(sort) {
      this.sort = sort;
      this.advObj.quantity = 1;
      this.page = 1;
      this.getAdvSearch();
    },
    getMode() {
      if (!this.enableNotes) {
        if (!this.enableImages) {
          if (!this.enablePDF) {
          } else {
            this.mode = 3;
          }
        } else {
          this.mode = 2;
        }
      } else {
        this.mode = 1;
      }
      if (!this.enableNotes && !this.enableImages && !this.enablePDF) {
        this.noPermissions = true;
      } else {
        this.noPermissions = false;
      }
    },
    addStrongText(text, simpleText) {
      text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");
      const text2 = this.removeAccents(text);
      let getParaph = text2.split(/(\s+)/);
      let getParaph2 = text.split(/(\s+)/);
      getParaph.forEach((x, index) => {
        if (x.search(key) != -1) {
          ////console.log(x)
          let i = x.search(key);
          ////console.log(i + ' ' + x + ' ' + x.search(key) );
          let text = getParaph2[index].substring(i, i + simpleText.length);
          ////console.log(text)
          getParaph2[index] = getParaph2[index].replaceAll(
            text,
            '<b style="color: #315DAD">' + text + "</b>"
          );
        }
      });
      return getParaph2.join("");
    },
    superSubstring(text, simpleText) {
      text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");
      const text2 = this.removeAccents(text);
      let getParaph = text2.split(/(\s+)/);
      let getParaph2 = text.split(/(\s+)/);
      let i = 0;
      let searched = false;
      getParaph.forEach((x, index) => {
        if (x.search(key) != -1 && i == 0) {
          i = index;
          /* if (i > 0) {
            // i = i - parseInt(Math.random()  * ( 90 - 50 ) + 50);
            // i = i - parseInt(Math.random()  * ( 90 - 50 ) + 50);
          }*/
          // searched = true;
        }
      });
      let iftextshort = 0;
      iftextshort = getParaph2.length - i;
      if (iftextshort <= 15) {
        let ni = 0;
        ni = i - 10;
        if (ni < 0) {
          //console.log('ES negativo');
          ni = 0;
        }
        return getParaph2.slice(ni, getParaph2.length).join("");
      } else {
        return getParaph2.slice(i, getParaph2.length).join("");
      }
      /* console.log('superSubstring result advance', getParaph2.slice(i, getParaph2.length).join(""));
      return getParaph2.slice(i, getParaph2.length).join("");*/
    },
    superSubstringSetence(text, simpleText) {
      text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");
      const text2 = this.removeAccents(text);
      return text2.search(key);
    },
    addStrongKeySetence(text, simpleText) {
      text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");
      const text2 = this.removeAccents(text);
      let index = text2.search(key);
      //console.log('index', index);
      if (index != -1) {
        text =
          text.substring(0, index) +
          '<b style="color: #315DAD">' +
          text.substring(index, index + simpleText.length) +
          "</b>" +
          text.substring(index + simpleText.length, text.length);
      }

      return text;
    },
    start() {
      if (this.isMarch == false) {
        this.timeInicial = new Date();
        this.control = setInterval(() => {
          this.cronometro();
        }, 10);
        this.isMarch = true;
      }
    },
    cronometro() {
      let timeActual = new Date();
      this.acumularTime = timeActual - this.timeInicial;
      let acumularTime2 = new Date();
      acumularTime2.setTime(this.acumularTime);
      let cc = Math.round(acumularTime2.getMilliseconds() / 10);
      let ss = acumularTime2.getSeconds();
      let mm = acumularTime2.getMinutes();
      let hh = acumularTime2.getHours() - 18;
      if (cc < 10) {
        cc = "0" + cc;
      }
      if (ss < 10) {
        ss = "0" + ss;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      if (hh < 10) {
        hh = "0" + hh;
      }
      this.date = hh + " : " + mm + " : " + ss + " : " + cc;
    },
    stop() {
      if (this.isMarch == true) {
        clearInterval(this.control);
        this.isMarch = false;
        this.date = "00 : 00 : 00 : 00";
      }
    },
    cancel(type, again = true) {
      this.counterFor = 100;
      try {
        //console.log("This is for canceling");
        this.cancelFor = true;
        setTimeout(() => {
          this.activeButton = true;
        }, 1);
        this.searched = [];
        this.images = [];
        this.pdfs = [];
        this.elementsCounter = 0;
        if (this.request != null) {
          this.request.cancel();
        }
        if (this.request2 != null) {
          this.request2.cancel();
        }
        this.clearOldRequest("Cancelled", this.mode);
        this.foundItems = false;
        this.showNotFound = false;
        if (again) {
          this.showCanceledSearch = true;
          this.canceled = true;
        }
        if (!again) {
          setTimeout(() => {
            this.counterFor = 0;
            this.changeMode(this.mode);
            this.activeButton = false;
          }, 2);
        }
      } catch (error) {
        //console.log(error);
      }
      //this.cancelSearched = true;
    },
    clearOldRequest(msg, type) {
      try {
        this.activeButton = false;
        this.request = null;
        this.request2 = null;
        this.$forceUpdate();
      } catch (error) {
        //console.log(error);
      }
    },
    logResponseErrors(err) {
      if (this.$axios.isCancel(err)) {
        //console.log("Request cancelled");
      }
    },
    async changeTotalResult(newVal) {
      this.totalResult = newVal;
      this.advObj.quantity = 1;
      this.page = 1;
      await this.getAdvSearch();
      await this.getPagination(true);
      // new pagination here

    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    getMonth(month) {
      let months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return months[parseInt(month - 1)];
    },
    prepareContentDialog(item, type, index, mode, year) {
      //this.validateSessionP1();
      this.$refs.contentDialog.getPermissions(item, type, index, mode, year);
      // this.getSearchChips(JSON.parse(atob(this.$route.query.search)));
      let formated = null;
      switch (this.mode) {
        case 1:
          formated = this.searched.map((el) => {
            return { id: el._id, date: el.date };
          });
          this.setSearched(formated);
          break;
        case 2:
          formated = this.images.map((el) => {
            return { id: el._id, date: el.date };
          });
          this.setSearched(formated);
          break;
        case 3:
          formated = this.pdfs.map((el) => {
            return { id: el._id, date: el.dateCreation };
          });
          this.setSearched(formated);
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.img-title {
  font-weight: 600;
}
.img-label {
  font-weight: 500;
}
.buttonText {
  letter-spacing: 7px;
}
</style>
