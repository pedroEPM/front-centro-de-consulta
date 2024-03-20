<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="primary" dark>
          <v-card-title class="pb-0">
            <v-icon class="mr-3">mdi-magnify</v-icon>
            Búsqueda:
            <v-chip label color="white" class="ml-2 primary--text">{{
              searchElement
            }}</v-chip>
            <v-spacer />
            <v-spacer />

            {{ totalResult }} de {{ elementsCounter }} Resultados
          </v-card-title>

          <v-card-text class="pa-0" id="nav">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex v-if="enableNotes">
                  <v-btn
                    :depressed="selected[0].pressed"
                    :outlined="!selected[0].pressed"
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

                <v-flex v-if="enableImages">
                  <v-btn
                    :depressed="selected[1].pressed"
                    :outlined="!selected[1].pressed"
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

                <v-flex v-if="enablePDF">
                  <v-btn
                    :depressed="selected[2].pressed"
                    :outlined="!selected[2].pressed"
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

                <v-flex style="text-align: center" v-if="false">
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
       <v-flex xs12 md3 style="padding-left:1px; padding-right:2px;" v-if="searchadvanceextend && loading == false">
        <v-card elevation="2">
          <v-card-text style="padding-top: 5px; padding-bottom:0px" >
            <center>
        <p>Estás navegando en búsqueda extendida. <span><a style="text-decoration-line: underline;" @click="cancelextend()">CANCELAR</a></span></p>
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
            <v-btn dense color="primary" height="38" @click="changeSort()" v-else>
              <v-icon left>{{
                sort == -1 ? "mdi-sort-descending" : "mdi-sort-ascending"
              }}</v-icon
              ><b class="mr-1">Orden:</b
              >{{ sort == -1 ? "Descendente" : "Ascendente" }}
            </v-btn>
          </v-card>
        </v-row>-->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon>
                {{
                  sort == 10
                    ? ""
                    : sort == -1
                    ? "mdi-sort-ascending"
                    : "mdi-sort-descending"
                }}
              </v-icon>
              {{
                sort == 10
                  ? "Ordenar por"
                  : sort == -1
                  ? "De Reciente a Antiguo"
                  : "De Antiguo a Reciente"
              }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="changeSort(1)">
              <v-list-item-title> De Antiguo a Reciente </v-list-item-title>
            </v-list-item>

            <v-list-item @click="changeSort(-1)">
              <v-list-item-title> De Reciente a Antiguo </v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeSort(10)">
              <v-list-item-title> Sin orden </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-show="loading" justify-center v-if="!canceled">
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
      v-show="showNotFound"
      v-if="!noPermissions && !canceled"
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

    <v-layout justify-center v-show="cancelSearched" v-if="!noPermissions">
      <v-flex xs12 md4>
        <v-card class="text-center mt-2 mb-2">
          <v-card-text>
            <v-icon size="80" class="mb-2">mdi-text-box-search-outline</v-icon>
            <h1 class="mb-5">Se ha cancelado la busqueda</h1>
            <h1 class="mb-5"></h1>
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

    <v-layout row wrap v-show="mode == 1 && !loading" v-if="enableNotes">
      <v-flex
        xs12
        :md6="isGrid"
        v-for="(item, index) in searched"
        v-bind:key="index"
      >
        <Search-Note-Card
          :title="item.title != undefined ? item.title : null"
          :subTitle="item.subTitle != undefined ? item.subTitle : null"
          :content="
            item.content != undefined ? item.content.substring(0, 400) : null
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
          :id="item._id"
          :clave="item.isNewId"
          @click.native="
            prepareContentDialog(item, 1, index, 'simple', item.date)
          "
        />
      </v-flex>
    </v-layout>

    <v-layout row wrap v-show="mode == 2 && !loading" v-if="enableImages">
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
      >
        <Search-Image-Card
          :image="imgPath + item.imageSrc"
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
            item.date != undefined
              ? new Date(item.date).toISOString().substring(0, 10)
              : null
          "
          @click.native="
            prepareContentDialog(item, 2, index, 'simple', item.date)
          "
        />
      </v-flex>
    </v-layout>

    <v-layout row wrap v-show="mode == 3 && !loading" v-if="enablePDF">
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
          :image="imgPath + item.imageSrc"
          :title="item.title.substring(0, 20)"
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
            item.dateCreation != undefined
              ? new Date(item.dateCreation).toISOString().substring(0, 10)
              : null
          "
          @click.native="
            prepareContentDialog(item, 3, index, 'simple', item.dateCreation)
          "
        />
      </v-flex>
    </v-layout>
      <v-layout row wrap justify-center v-if="!showCanceledSearch">
        <v-flex xs12 md12 v-if="viewextendsearch && !loading && searchadvanceextend == false">
       <center>
       <div>
        <p style="margin-bottom:10px;font-size:17px">Para que veas los resultados más relevantes, omitimos ciertas entradas a las {{elementsCounter}}, que te hemos mostrado.</p>
       <p style="margin-bottom:10px;font-size:17px">¿Quieres extender búsqueda, con los resultados omitidos?</p>
        <v-btn
          color="blue-grey"
          dark
          @click="searchAdvanceExtended()"
        >
          Extender búsqueda
        </v-btn>
       </div>
       </center>
      </v-flex>
    </v-layout>

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
          <v-card-text style="padding-top: 5px; padding-bottom:0px">
            <center>
        <p>Estás navegando en búsqueda extendida. <span><a style="text-decoration-line: underline;" @click="cancelextend()">CANCELAR</a></span></p>
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

    <Content-Dialog ref="contentDialog" />
    <Search-Report-Dialog ref="reportDialog" />
  </div>
</template>
    <!-- CDN of mark.js -->
<!--- <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
        integrity=
"sha512-5CYOlHXGh6QpOFA/TeTylKLWfB3ftPsde7AnmhuitiTX4K5SqCLBeKro6sPS8ilsz1Q4NRx3v8Ko2IBiszzdww=="
        crossorigin="anonymous"></script>---->

<script>
import { mapState, mapMutations } from 'vuex'
import SearchNoteCard from "~/components/SearchNoteCard";
import SearchImageCard from "~/components/SearchImageCard";
import SearchPDFCard from "~/components/SearchPDFCard";
import ContentDialog from "~/components/ContentDialog";
import SearchReportDialog from "~/components/SearchReportDialog";
export default {
  components: {
    ContentDialog,
    SearchNoteCard,
    SearchImageCard,
    SearchPDFCard,
    SearchReportDialog,
  },
  data: () => ({
    dialog: false,
    canceled: false,
    page: 1,
    pages: [],
    totalPages: 5,
    viewextendsearch: false,
    searchadvanceextend: false,
    cancelSearchAdvanceExtend: null,
    loading: true,
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
    notesCounter: null,
    imagesCounter: null,
    pdfsCounter: null,
    imgPath: process.env.imgPath,
    isGrid: false,
    advObj: null,
    tempSearch: null,
    selected: [
      { pressed: true, color: "white", text: "#004D9C" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
      { pressed: false, color: "white", text: "white" },
    ],
    sort: 10,
    enableNotes: false,
    enableImages: false,
    enablePDF: false,
    noPermissions: false,
    showNotFound: false,
    cancelSearched: false,
    requests: [],
    request: null,
    requestI: null,
    requestP: null,
    request2: null,
    date: "00 : 00 : 00 : 00",
    isMarch: false,
    acumularTime: 0,
    timeInicial: null,
    control: null,
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
    activeButton: false,
    filter: "",
    counterFor: 1899,
    cancelFor: false,
  }),
  watch: {
    async $route(to, from) {
      if (this.$route.query.advSearch == undefined) {
        if (this.searchElement != this.$route.query.searched) {
          setTimeout(() => {
            this.elementsCounter = '"Contando"';
            this.loading = true;
          }, 1);
          await this.getPermissions();
          this.getMode();
          this.showNotFound = false;
          this.changeMode(this.mode);
          //console.log("Here is second");
          await this.getPagination();
          this.searchElement = this.$route.query.searched;
          //console.log("Searching");
          setTimeout(() => {
            this.showCanceledSearch = false;
            this.canceled = false;
            this.activeButton = false;
          }, 1);
          this.$route.query.workbench = false;
        } else if (this.$route.query.workbench != undefined) {
          //console.log("WORKBENCH");
          if (this.$route.query.workbench == "true") {
            this.openContentDialog();
          }
        }
      }
    },
    totalResult(newValue) {
      //console.log(newValue);
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
    mode(val, oldValue) {
      this.showNotFound = false;
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
      setTimeout(() => {
        this.elementsCounter = '"Contando"';
      }, 1);
      this.hasElements = false;
      this.enableNotes = false;
      this.enableImages = false;
      this.enablePDF = false;
      this.cancelSearched = false;
      this.noPermissions = false;
      if (process.browser) {
        if (this.$route.query.advSearch == undefined) {
          this.searchElement = this.$route.query.searched;
          this.cancelSearchAdvanceExtend = true;
          setTimeout(() => {
            this.start();
            this.loading = true;
          }, 1);
        }
      }
      await this.getPermissions();
      this.getMode();
      this.changeMode(Number(this.mode));
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
  methods: {
    ...mapMutations('search', ['setSearched']),
    goToPagetop() {
      var elmnt = document.getElementById("nav");
      elmnt.scrollIntoView({ behavior: "smooth" });
    },
    print() {
      window.print();
    },
    validateSessionP1(){
      if (localStorage.tokenC != null && localStorage.tokenC != undefined) {
        this.validateSessionP2();
        this.$store.commit("logIn");
      } else {
        this.$store.commit("logOut");
        this.$router.push("/login");
      }
    },
    async validateSessionP2() {
      try {
        const response = await this.$axios
          .$get("/authentication", {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$store.commit("logOut");
              this.$router.push("/login");
            }
          });
          await this.getUser();
          this.$parent.$parent.getTAPuses();
      } catch (error) {
        this.$store.commit("openSnack", "Ha ocurrido un error, por favor intente de nuevo");
        this.$store.commit("logOut");
        this.$router.push("/login");
      }
    },
    waitChangeMode(mode) {
      //this.validateSessionP1();
      if (this.loading) {
        this.previusMode = this.mode;
        this.mode = mode;
        this.dialog = true;
      } else {
        this.changeMode(mode);
      }
    },
    async changeMode(mode) {
      this.showNotFound = false;
      if (this.counterFor < 1899) {
        this.cancelFor = true;
      }
      this.page = 1;
      switch (mode) {
        case 1:
          this.filter = "Notas";
          this.mode = 1;
          this.cancelSearchAdvanceExtend = true;
          await this.getSearch();
          await this.getPagination();
          break;
        case 2:
          this.filter = "Imagenes";
          this.mode = 2;
          this.cancelSearchAdvanceExtend = true;
          await this.getImages();
          await this.getPagination();
          break;
        case 3:
          this.mode = 3;
          this.filter = "PDFs";
          this.cancelSearchAdvanceExtend = true;
          await this.getPDFs();
          await this.getPagination();
          break;
      }
      this.elementsCounter = '"Contando"';
      this.page = 1;
      this.totalPages = 0;
      // setTimeout(async () => {
        const data = await this.getPagination();
      // }, 2000);
    },
    async getSearch() {
       if(this.cancelSearchAdvanceExtend == true){
        this.searchadvanceextend = false;
        this.viewextendsearch = false;
      }
      try {
        console.log(this.filter);
        this.searched = [];
        this.images = [];
        this.pdfs = [];
        //console.log("------ESTE ES EL ORDENAMIENTO: " + this.sort);
        this.loading = true;
        this.showNotFound = false;
        this.start();
        const axiosSource = this.$axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
          //AdvanceSearch   SampleSearch
          /**sentence: this.$route.query.searched,
            filter: "",
            quantity: this.page,
            ordenamiento: this.sort,
            searchId: localStorage.user_idC,
            totalResults: this.totalResult, */
          console.log('searchadvanceextend es ', this.searchadvanceextend);
        const response = await this.$axios.$get("/AdvanceSearch", {
          params: {
               x: 0,
          search: this.filter,
          allwords: null,
          keywords: this.$route.query.searched,
          keysentence: null,
          publicationRef: null,
          noteBookRef: null,
          date: null,
          dateRange: null,
          key: null,
          firstTimeSearch: false,
          extended : this.searchadvanceextend,
          // firstTimeSearch: false,
          quantity:this.page,
          ordenamiento: this.sort,
          searchId: localStorage.user_idC,
          totalResults: this.totalResult,
          ignoredwords: null,
          },
          // cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        const regex =
          /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
        let searchString = this.$route.query.searched;
        searchString = searchString.replace(/ +(?= )/g, "");
        let result = searchString.replace(regex, "");
        let words = result.split(" ");
        for (var i = 0; i < words.length; i++) {
          if (words[i] == "") {
            words.splice(i, 1);
          }
        }
       // console.log(response.data.foundItems);
        if (this.searchElement != "" && this.searchElement != null) {
          response.data.foundItems.map((el) => {
            el.content = el.content.replaceAll("%F1", "ñ");
            let position = ["", false];
            words.forEach((element) => {
              if (!position[1]) {
                position = this.superSubstring(el.content, element);
                el.content = position[0];
              }
              el.content = this.addStrongText(el.content, element);
             // var respuestamark = this.markapi();
            });
          });
        }
        this.backSearched = response.data.foundItems;
        this.searched = response.data.foundItems;
        if (this.searched.length < 1) {
          this.showNotFound = true;
        }
        //---intentando forzar vuex
        let formated = this.searched.map(el => {
          return {id: el._id, date: el.date}
        })
        this.setSearched(formated)
        //---intentado forzar vuex
        this.loading = false;
        this.stop();
        this.request = null;
      } catch (error) {
        //console.log(error);
        //console.log("Error en search");
        this.logResponseErrors(error);
        //console.log(" ah ok notes");
        this.showNotFound = true;
        this.stop();
      }
    },
    async getImages() {
      console.log(this.filter);
      this.searched = [];
      this.images = [];
      this.pdfs = [];
      this.loading = true;
      this.showNotFound = false;
      this.start();
       if(this.cancelSearchAdvanceExtend == true){
        this.searchadvanceextend = false;
        this.viewextendsearch = false;
      }
      try {
        const axiosSource = this.$axios.CancelToken.source();
        this.requestI = { cancel: axiosSource.cancel, msg: "Loading..." };
          console.log('searchadvanceextend es ', this.searchadvanceextend);
           const response = await this.$axios.$get("/AdvanceSearch", {
          params: {
               x: 0,
          search: this.filter,
          allwords: null,
          keywords: this.$route.query.searched,
          keysentence: null,
          publicationRef: null,
          noteBookRef: null,
          date: null,
          dateRange: null,
          key: null,
          firstTimeSearch: false,
          extended : this.searchadvanceextend,
          // firstTimeSearch: false,
          quantity:this.page,
          ordenamiento: this.sort,
          searchId: localStorage.user_idC,
          totalResults: this.totalResult,
          ignoredwords: null,
          },
          cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
       /* const response = await this.$axios.$get("/SampleSearch", {
          params: {
            sentence: this.$route.query.searched,
            filter: "Imagenes",
            quantity: this.page,
            ordenamiento: this.sort,
            searchId: localStorage.user_idC,
            totalResults: this.totalResult,
          },
          cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });*/
        const regex =
          /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
        let searchString = this.$route.query.searched;
        searchString = searchString.replace(/ +(?= )/g, "");
        let result = searchString.replace(regex, "");
        let words = result.split(" ");
        for (var i = 0; i < words.length; i++) {
          if (words[i] == "") {
            words.splice(i, 1);
          }
        }
        if (this.searchElement != "" && this.searchElement != null) {
          response.data.foundItems.map((el) => {
            el.description = el.description.replaceAll("%F1", "ñ");
            let position = ["", false];
            words.forEach((element) => {
              if (!position[1]) {
                position = this.superSubstring(el.description, element);
                el.description = position[0];
              }
              el.description = this.addStrongText(el.description, element);
              //var respuestamark = this.markapi();
            });
          });
        }
        this.backImages = response.data.foundItems;
        this.images = response.data.foundItems;
       // console.log('data de img',this.images);
        if (this.images.length < 1) {
          this.showNotFound = true;
        }
        //---intentando forzar vuex
        let formated = response.data.foundItems.map(el => {
          return {id: el._id, date: el.date}
        })
        this.setSearched(formated)
        //---intentado forzar vuex
        //console.log("img 1");
        this.loading = false;
        //console.log("img 2");
        this.stop();
        this.requestI = null;
      } catch (error) {
        //console.log(error);
        this.logResponseErrors(error);
        //console.log("Error en img");
        this.stop();
        //console.log(" ah ok img");
      }
    },
    async getPDFs() {
       console.log(this.filter);
      this.searched = [];
      this.images = [];
      this.pdfs = [];
      this.loading = true;
      this.showNotFound = false;
      this.start();
       if(this.cancelSearchAdvanceExtend == true){
        this.searchadvanceextend = false;
        this.viewextendsearch = false;
      }
      try {
        const axiosSource = this.$axios.CancelToken.source();
        this.requestP = { cancel: axiosSource.cancel, msg: "Loading..." };
        console.log('searchadvanceextend es ', this.searchadvanceextend);
            const response = await this.$axios.$get("/AdvanceSearch", {
          params: {
               x: 0,
          search: this.filter,
          allwords: null,
          keywords: this.$route.query.searched,
          keysentence: null,
          publicationRef: null,
          noteBookRef: null,
          date: null,
          dateRange: null,
          key: null,
          firstTimeSearch: false,
          extended : this.searchadvanceextend,
          // firstTimeSearch: false,
          quantity:this.page,
          ordenamiento: this.sort,
          searchId: localStorage.user_idC,
          totalResults: this.totalResult,
          ignoredwords: null,
          },
          cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        /*const response = await this.$axios.$get("/SampleSearch", {
          params: {
            sentence: this.$route.query.searched,
            filter: "PDFs",
            quantity: this.page,
            ordenamiento: this.sort,
            searchId: localStorage.user_idC,
            totalResults: this.totalResult,
          },
          cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });*/
        //-----ordenando por publicacion y pagina----------------
        let separedindex = {}
        let auxPublicationList = []
        let auxPublicationListIndex = {}
        let foundItems = response.data.foundItems
        foundItems = foundItems.sort(function(a, b) {
            return a.page - b.page;
        });
        foundItems.forEach(item=>{
            if(item.notebook){
                if(auxPublicationList.indexOf(item.notebook._id+'') == -1){
                    auxPublicationList.push(item.notebook._id+'')
                }
            }else {
                auxPublicationList.push('No tiene')
            }
        })
        auxPublicationList.forEach(publi=>{
            foundItems.forEach((item,i)=>{
                item = (item != undefined && item != null) ? item : {notebook:{_id: 'No tiene'}}
                item.notebook =  (item.notebook != undefined && item.notebook != null) ? item.notebook : {_id: 'No tiene'}
                if(publi == item.notebook._id+''){
                    if(!separedindex['pdf'+item.notebook._id]){
                        separedindex['pdf'+item.notebook._id] = []
                        auxPublicationListIndex['pdf'+item.notebook._id] = []
                    }
                    separedindex['pdf'+item.notebook._id].push(item)
                    auxPublicationListIndex['pdf'+item.notebook._id].push(Number(item.page))
                }
            })
        })
        let finalpdfarr = []
        auxPublicationList.forEach(publi=>{
            auxPublicationListIndex['pdf'+publi].sort(function(a, b) {
                return a - b;
              });
            auxPublicationListIndex['pdf'+publi].forEach(x=>{
                let n = separedindex['pdf'+publi].findIndex(obj => obj.page === x)
                if (separedindex['pdf'+publi][n]){
                    finalpdfarr.push(separedindex['pdf'+publi][n])
                }
                separedindex['pdf'+publi].splice(n,1)
            })
        })
        finalpdfarr = finalpdfarr.sort(function(a, b) {
            return new Date(a.dateCreation) - new Date(b.dateCreation);
        });
        //finalpdfarr.forEach(i=>{//console.log(i.page+" "+i.publication.publicationName +" "+i.notebook.NoteBookName +" "+i.dateCreation)})
        response.data.foundItems = finalpdfarr
        //-----ordenando por publicacion y pagina----------------
        this.backpdfs = response.data.foundItems;
        this.pdfs = response.data.foundItems;
        if (this.pdfs.length < 1) {
          this.showNotFound = true;
        }
        //---intentando forzar vuex
        let formated = response.data.foundItems.map(el => {
          return {id: el._id, date: el.dateCreation}
        })
        this.setSearched(formated)
        //---intentado forzar vuex
        //console.log("pdf 1");
        this.loading = false;
        //console.log("pdf 2");
        this.stop();
        this.requestP = null;
      } catch (error) {
        //console.log(error);
        this.logResponseErrors(error);
        //console.log("Error en pdf");
        this.stop();
        //console.log(" ah ok pdf");
      }
    },
    async getPagination() {
       if(this.cancelSearchAdvanceExtend == true){
        this.searchadvanceextend = false;
        this.viewextendsearch = false;
      }
      try {
        this.page = 1;
        this.elementsCounter = '"100 o más"';
        const axiosSource = this.$axios.CancelToken.source();
        this.request2 = { cancel: axiosSource.cancel, msg: "Loading..." };
        let total = 0;
        let response
          try{
            response = await this.$axios.$get("/AdvanceSearch", {
              params: {
                    x: 0,
                    search: this.filter,
                    allwords: null,
                    keywords: this.$route.query.searched,
                    keysentence: null,
                    publicationRef: null,
                    noteBookRef: null,
                    date: null,
                    dateRange: null,
                    key: null,
                    firstTimeSearch: true,
                    extended : this.searchadvanceextend,
                    // firstTimeSearch: false,
                    quantity: "",
                    ordenamiento: this.sort,
                    searchId: localStorage.user_idC,
                    totalResults: this.totalResult,
                    ignoredwords: null,
              },
              headers: { Authorization: "Bearer " + localStorage.tokenC },
              cancelToken: axiosSource.token
            });
          }catch(e){
            console.log('se pide el total de nuevo por ultimo intento')
            response = await this.$axios.$get("/AdvanceSearch", {
              params: {
                    x: 0,
                    search: this.filter,
                    allwords: null,
                    keywords: this.$route.query.searched,
                    keysentence: null,
                    publicationRef: null,
                    noteBookRef: null,
                    date: null,
                    dateRange: null,
                    key: null,
                    firstTimeSearch: true,
                    extended : this.searchadvanceextend,
                    // firstTimeSearch: false,
                    quantity: "",
                    ordenamiento: this.sort,
                    searchId: localStorage.user_idC,
                    totalResults: this.totalResult,
                    ignoredwords: null,
              },
              headers: { Authorization: "Bearer " + localStorage.tokenC },
              cancelToken: axiosSource.token
            });
          }


        /*const response = await this.$axios.$get("/SampleSearch", {
          params: {
            search: this.filter,
            sentence: this.$route.query.searched,
            filter: this.filter,
            firstTimeSearch: true,
            quantity: "",
            ordenamiento: this.sort,
            searchId: localStorage.user_idC,
            totalResults: this.totalResult,
            dateSearch: null,
          },
          cancelToken: axiosSource.token,
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });*/
        console.log('respuesta del contador', response.data)
        //this.totalResult = (this.totalResult>this.elementsCounter) ? this.totalResult : this.elementsCounter
        switch (this.mode) {
          case 1:
            this.notesCounter =
            response.data.CountNotes != null &&
              response.data.CountNotes != undefined
                ? response.data.CountNotes
                : 0;
            total = this.notesCounter + total;
            this.elementsCounter = total;
            this.totalPages = Math.ceil(total / this.totalResult);
            break;
          case 2:
            this.imagesCounter =
            response.data.CountImages != undefined &&
              response.data.CountImages != null
                ? response.data.CountImages
                : 0;
            total = this.imagesCounter + total;
            this.elementsCounter = total;
            this.totalPages = Math.ceil(total / this.totalResult);
            break;
          case 3:
            this.pdfsCounter =
             response.data.Countpdfs != undefined &&
              response.data.Countpdfs != null
                ? response.data.Countpdfs
                : 0;
            total = this.pdfsCounter + total;
            this.elementsCounter = total;
            this.totalPages = Math.ceil(total / this.totalResult);
            break;
        }
        if (this.elementsCounter > 0) {
          this.hasElements = true;
        } else {
          this.hasElements = false;
        }
        //console.log(total + " <--- this is the total");
        //console.log(this.totalPages);
        this.generateArrayPages(this.totalPages);
        //console.log("ya cancelé el coso " + this.cancelFor);
        this.cancelFor = false;
        this.counterFor = 1899;
           console.log('pages get pagination');
         // console.log('total pages', this.totalPages);
        return;
      } catch (error) {
        //console.log("Error en pagination");
        //console.log(error);
      }
    },
    generateArrayPages(total) {
      try {
        this.pages = Array.from(Array(total + 1).keys());
        this.pages.shift();
      } catch (e) {
        //console.log("falla en array de paginas");
        //console.log(e);
      }
    },
    nextPage() {
       console.log('nextPage simple');
       if(this.page == this.totalPages ){
         this.viewextendsearch = true;
         this.cancelSearchAdvanceExtend = false;
       }else{
          this.viewextendsearch = false;
       }
      //this.validateSessionP1();
      this.goToPagetop();
      switch (this.mode) {
        case 1:
          this.getSearch();
          break;
        case 2:
          this.getImages();
          break;
        case 3:
          this.getPDFs();
          break;
      }
    },
     async searchAdvanceExtended(){
      console.log('searchAdvanceExtended');
      this.searchadvanceextend = true;
      this.page = 1;
      this.viewextendsearch = false;
       switch (this.mode) {
        case 1:
          this.getSearch();
          break;
        case 2:
          this.getImages();
          break;
        case 3:
          this.getPDFs();
          break;
      }
      await this.getPagination();
    },
     async cancelextend(){
       this.page = 1;
      this.cancelSearchAdvanceExtend = true;
      switch (this.mode) {
        case 1:
          this.getSearch();
          break;
        case 2:
          this.getImages();
          break;
        case 3:
          this.getPDFs();
          break;
      }
      await this.getPagination();
    },
    changeSort(sort) {
      this.sort = sort;
      switch (this.mode) {
        case 1:
          this.getSearch();
          break;
        case 2:
          this.getImages();
          break;
        case 3:
          this.getPDFs();
          break;
      }
    },
    openContentDialog() {
      //this.validateSessionP1();
      if (this.$route.query.content != undefined) {
        switch (this.$route.query.mode) {
          case "1":
            this.$refs.contentDialog.getPermissions(
              this.$route.query.content,
              4
            );
            break;
          case "2":
            this.$refs.contentDialog.getPermissions(
              this.$route.query.content,
              5
            );
            break;
          case "3":
            this.$refs.contentDialog.getPermissions(
              this.$route.query.content,
              6
            );
            break;
        }
      }
    },
    async getPermissions() {
      try {
        const response = await this.$axios.$get(
          "/users/" + localStorage.user_idC,
          {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          }
        );
        response.data.permissions[0].permissions.forEach((x) => {
          if (x == "60d47ee00f82f40014419ae5") {
            this.enableNotes = true;
            this.enableImages = true;
            this.enablePDF = true;
          }
          switch (x) {
            case "60d47eec0f82f40014419ae6":
              this.enableNotes = true;
              break;
            case "60d47ef70f82f40014419ae7":
              this.enableImages = true;
              break;
            case "60d47f290f82f40014419ae8":
              this.enablePDF = true;
              break;
          }
        });
      } catch (error) {
        //console.log(error.response);
      }
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
     // console.log('texto original', text);
      //console.log('texto texto encontrar', simpleText);
     // return text
      text = !text ? "" : text;
      const key2 = this.removeAccents(simpleText);
      const key = new RegExp(key2, "ig");
      const text2 = this.removeAccents(text);
      let getParaph = text2.split(/(\s+)/);
      let getParaph2 = text.split(/(\s+)/);
      getParaph.forEach((x, index) => {
        if (x.search(key) != -1) {
          let i = x.search(key);
          let text = getParaph2[index].substring(i, i + simpleText.length);
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
          searched = true;
        }
      });
      let iftextshort = 0
      iftextshort = getParaph2.length - i;
      if(iftextshort <= 15){
        let ni = 0
        ni = i - 10;
        if(ni < 0){
          //console.log('ES negativo');
          ni = 0;
        }
         return [getParaph2.slice(ni, getParaph2.length).join(""), searched];
      }
      else{
          return [getParaph2.slice(i, getParaph2.length).join(""), searched];
      }
      //return [getParaph2.slice(i, getParaph2.length).join(""), searched];
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
      setTimeout(() => {
        this.activeButton = true;
        this.foundItems = false;
        this.elementsCounter = 0;
      }, 1);
      this.searched = [];
      this.images = [];
      this.pdfs = [];
      if (this.request2 != null) {
        this.request2.cancel();
      }
      try {
        switch (type) {
          case 1:
            if (this.request != null) {
              this.request.cancel();
              this.clearOldRequest("Cancelled", 1);
            }
            break;
          case 2:
            if (this.requestI != null) {
              this.requestI.cancel();
              this.clearOldRequest("Cancelled", 2);
            }
            break;
          case 3:
            if (this.requestP != null) {
              this.requestP.cancel();
              this.clearOldRequest("Cancelled", 3);
            }
            break;
        }
        this.showNotFound = false;
        if (again) {
          this.showCanceledSearch = true;
          this.canceled = true;
        }
        if (!again) {
          setTimeout(() => {
            this.changeMode(this.mode);
            this.activeButton = false;
          }, 2);
        }
      } catch (error) {
        //console.log(error);
      }
    },
    clearOldRequest(msg, type) {
      this.showNotFound = false;
      this.request2 = null;
      try {
        switch (type) {
          case 1:
            this.request.msg = msg;
            this.requests.push(this.request);
            this.request = null;
            break;
          case 2:
            this.requestI.msg = msg;
            this.requests.push(this.requestI);
            this.requestI = null;
            break;
          case 3:
            this.requestP.msg = msg;
            this.requests.push(this.requestP);
            this.requestP = null;
            break;
        }
      } catch (error) {
        //console.log(error);
      }
    },
    logResponseErrors(err) {
      if (this.$axios.isCancel(err)) {
        //console.log("Request cancelled");
      }
    },
    changeTotalResult(newVal) {
      //console.log("newVal" + newVal);
      this.totalResult = newVal;
      this.getPagination();
      this.changeMode(this.mode);
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    cancelarPro() {
      if (this.request2 != null) {
        this.request2.cancel();
        this.request2 = null;
      }
      this.counterFor = 1899;
    },
    prepareContentDialog(item, type, index, mode, year){

      this.$refs.contentDialog.getPermissions(item, type, index, mode, year)
      let formated = null
      switch (this.mode) {
        case 1:
          formated = this.searched.map(el => {
            return {id: el._id, date: el.date}
          })
          this.setSearched(formated)
          break;
        case 2:
          formated = this.images.map(el => {
            return {id: el._id, date: el.date}
          })
          this.setSearched(formated)
          break;
        case 3:
          formated = this.pdfs.map(el => {
            return {id: el._id, date: el.dateCreation}
          })
          this.setSearched(formated)
          break;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.card-hover {
}
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
