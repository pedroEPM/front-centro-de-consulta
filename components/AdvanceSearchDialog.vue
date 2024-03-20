<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card class="adv-form pa-5 rounded-xl">
      <v-card-title
        >Búsqueda avanzada <v-spacer />
        <v-btn icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <label>Tipo de archivo</label>
        <v-chip-group
          class="mb-2"
          active-class="primary--text"
          column
          center-active
          v-model="type"
        >
          <v-chip
            v-for="(item, index) in tags"
            :key="index"
            outlined
            label
            large
            class="custom-chip justify-center"
            :class="chips[index]"
            :style="'flex-grow: 1; ' + chipsColor[index]"
          >
            <v-icon left>
              {{ item.icon }}
            </v-icon>
            {{ item.value }}
          </v-chip>
        </v-chip-group>

        <v-divider class="mb-1"></v-divider>

        <v-form ref="form" class="form">
          <v-container fluid>
            <v-layout row wrap>
              <!--
              <v-flex xs12>
                <v-text-field
                  outlined
                  dense
                  label="Clave"
                  placeholder="Ingrese el número de nota"
                  append-icon="mdi-numeric"
                  v-model="advData.key"
                  class="custom-field"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-divider class="mb-6"></v-divider>
              </v-flex>
              -->
              <v-flex xs12>
                <v-text-field
                  :disabled="isGrahics"
                  :color="borderColor"
                  outlined
                  dense
                  :label="labelTPalabras"
                  :placeholder="labelTPalabras"
                  append-icon="mdi-text"
                  v-model="advData.keywords"
                  class="custom-field"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  :disabled="isGrahics"
                  :color="borderColor"
                  outlined
                  dense
                  :label="labelFExacta"
                  :placeholder="labelFExacta"
                  append-icon="mdi-text"
                  v-model="advData.keysentence"
                  class="custom-field"
                ></v-text-field>
              </v-flex>
              <!--
              <v-flex xs12>
                <v-text-field
                  :color="borderColor"
                  outlined
                  dense
                  label="Todas las palabras"
                  placeholder="Ingrese una frase"
                  append-icon="mdi-text"
                  v-model="advData.allwords"
                  class="custom-field"
                ></v-text-field>
              </v-flex>  -->

              <v-flex xs12>
                <v-text-field
                  :disabled="isGrahics"
                  :color="borderColor"
                  outlined
                  dense
                  :label="labelPExcluidas"
                  :placeholder="labelPExcluidas"
                  v-model="advData.ignoredwords"
                  class="custom-field"
                ></v-text-field>
              </v-flex>

              <v-flex
                xs12
                md6
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
              >
                <v-select
                  :disabled="isGrahics"
                  :color="borderColor"
                  :items="publications"
                  label="Publicación"
                  placeholder="Seleccione una opción"
                  item-text="publicationName"
                  item-value="_id"
                  outlined
                  dense
                  v-model="advData.publicationRef"
                  class="custom-field"
                  item-disabled="disable"
                >
                  <template v-slot:item="{ item, attrs, on }">
                    <v-list-item
                      v-on="on"
                      v-bind="attrs"
                      :style="colorstant(item)"
                    >
                      <v-list-item-content
                        :style="
                          item.disable == true ? '' : 'padding-left : 10px'
                        "
                      >
                        <v-list-item-title
                          v-if="item.disable"
                          :class="
                            !item.disable == true
                              ? 'listItemTitleFalse'
                              : 'listItemTitleTrue'
                          "
                        >
                          {{ item.publicationName }}
                        </v-list-item-title>
                        <v-list-item-title v-else>
                          <span
                            >{{ item.publicationName }}
                            <!--span style ="background: #80808059; border-radius:20px; padding: 0px 5px">{{activoinactivotexto(item.status)}}</span--></span
                          >
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-flex>

              <v-flex xs12 md6>
                <v-select
                  :disabled="isGrahics || advData.publicationRef == null"
                  :color="borderColor"
                  :items="
                    advData.publicationRef != null
                      ? sectionSelect2
                      : sectionSelect
                  "
                  label="Sección"
                  placeholder="Seleccione una opción"
                  item-text="NoteBookName"
                  item-value="_id"
                  outlined
                  dense
                  v-model="advData.noteBookRef"
                  class="custom-field"
                  item-disabled="disable"
                >
                  <template v-slot:item="{ item, attrs, on }">
                    <v-list-item
                      ripple
                      v-on="on"
                      v-bind="attrs"
                      :style="
                        item.disable == true ? 'background-color : #b3b3b3' : ''
                      "
                    >
                      <v-list-item-content
                        :style="
                          item.disable == true ? 'padding-left : 2px' : ''
                        "
                      >
                        <v-list-item-title
                          :class="
                            item.disable == true
                              ? 'listItemTitleTrue'
                              : 'listItemTitleFalse'
                          "
                        >
                          {{ item.NoteBookName }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-flex>

              <v-flex
                xs12
                md6
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
              >
                <v-select
                  :disabled="isGrahics"
                  :color="borderColor"
                  :items="select2"
                  label="Cuando"
                  placeholder="Seleccione una opción"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  v-model="dateOption"
                  class="custom-field"
                ></v-select>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  :disabled="isGrahics"
                  :color="borderColor"
                  outlined
                  dense
                  label="Clave"
                  placeholder="Ingrese el número de nota"
                  append-icon="mdi-numeric"
                  v-model="advData.key"
                  class="custom-field"
                ></v-text-field>
              </v-flex>

              <v-flex
                xs12
                md6
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                v-if="dateOption == 9"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :color="borderColor"
                      v-model="oldDateMega"
                      label="Elija una fecha"
                      append-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                      class="custom-field"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="advData.date"
                    :min="minDate"
                    :max="maxDate"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex
                xs12
                md6
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                v-if="dateOption == 7"
              >
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :color="borderColor"
                      v-model="advData.dateRange"
                      label="Elija la fecha inicial"
                      append-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                      class="custom-field"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="advData.dateRange"
                    :min="minDate"
                    :max="maxDate"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 md6 v-if="dateOption == 7">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :color="borderColor"
                      v-model="advData.date"
                      label="Elija la fecha final"
                      append-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                      class="custom-field"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="advData.date"
                    :min="minDate"
                    :max="maxDate"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex
                xs12
                md6
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                v-if="dateOption == 8"
              >
                <v-select
                  :disabled="isGrahics"
                  :color="borderColor"
                  :items="years"
                  label="Año"
                  placeholder="Seleccione un año"
                  outlined
                  dense
                  v-model="selectYear"
                  class="custom-field"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="hidden-sm-and-down">
              <v-spacer />
              <v-btn
                color="secondary"
                :disabled="isGrahics"
                class="mr-2"
                @click="$refs.form.reset()"
              >
                Limpiar formulario
              </v-btn>
              <v-btn
                :disabled="isGrahics"
                :class="$vuetify.breakpoint.mdAndUp ? 'pl-10 pr-10' : ''"
                color="primary"
                @click="search()"
              >
                Buscar
              </v-btn>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="hidden-md-and-up">
        <v-spacer />
        <v-btn color="secondary" class="mr-2" @click="$refs.form.reset()">
          Limpiar formulario
        </v-btn>
        <v-btn
          :class="$vuetify.breakpoint.mdAndUp ? 'pl-10 pr-10' : ''"
          color="primary"
          @click="search()"
        >
          Buscar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    isGrahics: false,
    labelTPalabras: "Todas las palabras",
    labelFExacta: "Frase exacta",
    labelPExcluidas: "Palabras excluidas",
    dialog: false,
    type: 0,
    dateOption: null,
    menu1: false,
    menu2: false,
    tags: [
      { icon: "mdi-text-box", value: "Notas" },
      { icon: "mdi-image", value: "Fotos" },
      { icon: "mdi-file", value: "Páginas" },
      // { icon: "mdi-chart-timeline-variant", value: "Gráfica" },
    ],
    select1: ["Diario de Yucatán", "Revista de Mérida", "Revista de Yucatán"],
    select2: [
      { text: "Cualquier fecha", value: "11" },
      { text: "Este año", value: "1" },
      { text: "Año anterior", value: "3" },
      { text: "Este més", value: "2" },
      { text: "Esta semana", value: "4" },
      { text: "Ayer", value: "5" },
      { text: "Hoy", value: "6" },
      { text: "Elegir periodo", value: "7" },
      { text: "Elegir año", value: "8" },
      { text: "Elegir día", value: "9" },
      { text: "Un día como", value: "10" },
    ],
    sectionSelect: [],
    sectionSelect2: [],
    publications: [],
    years: [],
    selectYear: null,
    advData: {
      search: "Notas",
      ignoredwords: null,
      allwords: null,
      keywords: null,
      keysentence: null,
      publicationRef: null,
      noteBookRef: null,
      date: null,
      dateRange: null,
      key: null,
      firstTimeSearch: null,
      quantity: 1,
      cancelSearchExtend: null,
    },
    chips: ["active-chip", "", "", ""],
    chipsColor: [],
    minDate: "1864-01-01",
    maxDate: new Date().getFullYear() + "-12-31",
    firstTime: false,
    borderColor: "#001689",

    oldDateMega: null,
  }),
  watch: {
    type(val) {
      switch (val) {
        case 0:
          this.isGrahics = false;
          this.labelTPalabras = "Todas las palabras";
          this.labelFExacta = "Frase exacta";
          this.labelPExcluidas = "Palabras excluidas";
          this.advData.search = "Notas";
          this.chips[0] = "active-chip";
          this.chipsColor[0] =
            "color: #001689 !important; caret-color: #001689 !important;";
          this.borderColor = "#001689";
          this.chips[1] = "";
          this.chipsColor[1] = "";
          this.chips[2] = "";
          this.chipsColor[2] = "";
          this.chips[3] = "";
          this.chipsColor[3] = "";
          break;
        case 1:
          this.isGrahics = false;
          this.labelTPalabras = "Todas las palabras";
          this.labelFExacta = "Frase exacta";
          this.labelPExcluidas = "Palabras excluidas";
          this.advData.search = "Imagenes";
          this.chips[0] = "";
          this.chipsColor[0] = "";
          this.chips[1] = "active-chipI";
          this.chipsColor[1] =
            "color: #59b477 !important; caret-color: #59b477 !important;";
          this.borderColor = "#59b477";
          this.chips[2] = "";
          this.chipsColor[2] = "";
          this.chips[3] = "";
          this.chipsColor[3] = "";
          break;

        case 2:
          this.isGrahics = false;
          this.labelTPalabras = "Todas las palabras";
          this.labelFExacta = "Frase exacta";
          this.labelPExcluidas = "Palabras excluidas";
          this.advData.search = "PDFs";
          this.chips[0] = "";
          this.chipsColor[0] = "";
          this.chips[1] = "";
          this.chipsColor[1] = "";
          this.chips[2] = "active-chipP";
          this.chipsColor[2] =
            "color: #c03a30 !important; caret-color: #c03a30 !important;";
          this.borderColor = "#c03a30";
          this.chips[3] = "";
          this.chipsColor[3] = "";
          break;

        case 3:
          this.isGrahics = true;
          this.labelTPalabras = "Pronto Disponible";
          this.labelFExacta = "Pronto Disponible";
          this.labelPExcluidas = "Pronto Disponible";
          this.advData.search = "Notas";
          this.chips[0] = "";
          this.chipsColor[0] = "";
          this.chips[1] = "";
          this.chipsColor[1] = "";
          this.chips[2] = "";
          this.chipsColor[2] = "";
          this.chips[3] = "active-chipG";
          this.chipsColor[3] =
            "color: #f8a73e !important; caret-color: #f8a73e !important;";
          this.borderColor = "#f8a73e";
          break;
      }
    },
    dateOption(val) {
      this.advData.date = null;
      this.advData.dateRange = null;

      switch (val) {
        default:
          this.advData.dateRange = null;
          this.advData.date = null;
          break;
        case "1":
          //console.log(new Date().getFullYear() + "-01-" + "01");
          //console.log(new Date().getFullYear() + "-12-" + "31");
          this.advData.dateRange = new Date().getFullYear() + "-01-" + "01";
          this.advData.date = new Date().getFullYear() + "-12-" + "31";
          break;

        case "2":
          /*
          console.log(
            new Date(new Date().getFullYear(), new Date().getMonth())
              .toISOString()
              .substr(0, 10)
          );
          console.log(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              .toISOString()
              .substr(0, 10)
          );*/

          this.advData.dateRange = new Date(
            new Date().getFullYear(),
            new Date().getMonth()
          )
            .toISOString()
            .substr(0, 10);
          this.advData.date = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          )
            .toISOString()
            .substr(0, 10);
          break;

        case "3":
          //console.log(new Date().getFullYear() - 1 + "-12-" + "31");
          this.advData.dateRange = new Date().getFullYear() - 1 + "-01-" + "01";
          this.advData.date = new Date().getFullYear() - 1 + "-12-" + "31";
          break;

        case "4":
          //console.log(moment().startOf("week").toISOString().substr(0, 10));
          //console.log(moment().endOf("week").toISOString().substr(0, 10));
          this.advData.dateRange = moment()
            .startOf("week")
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advData.date = moment()
            .endOf("week")
            .toISOString()
            .substr(0, 10)
            .toString();
          break;

        case "5":
          //console.log(moment().subtract(1, "days").toISOString().substr(0, 10));
          this.advData.dateRange = moment()
            .subtract(1, "days")
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advData.date = moment()
            .subtract(1, "days")
            .toISOString()
            .substr(0, 10);
          break;

        case "6":
          //console.log(moment().toISOString().substr(0, 10));
          this.advData.dateRange = moment()
            .toISOString()
            .substr(0, 10)
            .toString();
          this.advData.date = moment().toISOString().substr(0, 10).toString();
          break;

        case "8":
          ////console.log(this.selectYear + "-01-" + "01")
          //this.advData.dateRange = this.selectYear + "-01-" + "01";
          //this.advData.date = this.selectYear + "-12-" + "31";
          break;

        case "9":
          //this.advData.dateRange = this.advData.date;
          break;
        case "11":
          this.advData.dateRange = null;
          this.advData.date = null;
          break;
      }
    },
    selectYear(val) {
      if (val != undefined) {
        this.advData.dateRange = val + "-01-" + "01";
        this.advData.date = val + "-12-" + "31";
      }
    },
    "advData.key": function (newVal) {
      const oneLetter = newVal?.toLowerCase().substring(0, 1) ?? false;
      if (oneLetter) {
        console.log(oneLetter)
        console.log('.....')
        switch (oneLetter) {
          case "n":
            this.type = 0;
            break;
          case "i":
            this.type = 1;
            break;
          case "p":
            this.type = 2;
            break;
        }
      }
    },
    "advData.date": function (val) {
      if (this.dateOption == "9") {
        this.advData.dateRange = val;
      }
      if (this.advData.date != undefined && this.advData.date != null) {
        this.oldDateMega = this.formatDate(this.advData.date);
        // //console.log(this.oldDateMega)
      }
    },
    "advData.publicationRef": function (newValue) {
      this.getYears();
      this.advData.noteBookRef = null;
      for (let i = 0; i < this.publications.length; i++) {
        if (newValue == this.publications[i]._id) {
          this.icon = this.publications[i].icon;
        }
      }
      this.sectionSelect2 = [];
      this.sectionSelect.forEach((x) => {
        if (x.PublicationReference && x.PublicationReference._id == newValue) {
          this.sectionSelect2.push(x);
        }
      });
      if (this.sectionSelect2.length == 0) {
        this.sectionSelect2.push({
          NoteBookName: "No se encontraron cuadernos",
          status: true,
          _id: "NO-VALIDO",
          disable: true,
        });
      } else {
        const newNotebooksOrder = {
          isCurrent: [],
          isNotCurrent: [],
        };
        this.sectionSelect2.forEach((notebook) => {
          if (
            notebook?.vigente === false ||
            notebook?.vigente === undefined ||
            notebook?.vigente === null
          ) {
            newNotebooksOrder.isNotCurrent.push(notebook);
          } else {
            newNotebooksOrder.isCurrent.push(notebook);
          }
        });

        newNotebooksOrder.isCurrent = newNotebooksOrder.isCurrent.sort(
          function (a, b) {
            if (a.order > b.order) {
              return 1;
            }
            if (a.order < b.order) {
              return -1;
            }
            return 0;
          }
        );

        const removeSpecialCharacters = (str) => {
          if (str === undefined || str === null) str = "";

          return str.replace(/[^a-zA-Z0-9 ]/g, "");
        };

        newNotebooksOrder.isNotCurrent = newNotebooksOrder.isNotCurrent.sort(
          function (a, b) {
            a = a.NoteBookName ?? "";
            b = b.NoteBookName ?? "";

            a = removeSpecialCharacters(a.trim());
            b = removeSpecialCharacters(b.trim());
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          }
        );

        this.sectionSelect2 = [];
        this.sectionSelect2.push({
          NoteBookName: "Todos los cuadernos",
          status: true,
          _id: null,
        });

        if (newNotebooksOrder.isCurrent.length > 0) {
          this.sectionSelect2.push({
            NoteBookName: "Vigentes",
            status: true,
            _id: "Vigentes",
            disable: true,
          });
          newNotebooksOrder.isCurrent.forEach((notebook) => {
            this.sectionSelect2.push(notebook);
          });
        }
        if (newNotebooksOrder.isNotCurrent.length > 0) {
          this.sectionSelect2.push({
            NoteBookName: "No vigentes",
            status: true,
            _id: "No vigentes",
            disable: true,
          });
          newNotebooksOrder.isNotCurrent.forEach((notebook) => {
            this.sectionSelect2.push(notebook);
          });
        }
      }
    },
  },
  methods: {
    activoinactivotexto(item) {
      let texto = item ? "vigente" : "no vigente";
      return texto;
    },
    openDialog() {
      this.dialog = !this.dialog;
      this.getEditorial();
      this.getYears();
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
    colorstant(item) {
      if (item.subtittle == true) {
        return "background-color : #b3b3b3";
      }
      if (item.disable == true) {
        return "background-color : #b3b3b3";
      }
      return "";
    },
    search() {
      this.advData.allwords =
        this.advData.allwords != null &&
        this.advData.allwords != undefined &&
        this.advData.allwords.trim() != ""
          ? this.advData.allwords
          : null;
      this.advData.keywords =
        this.advData.keywords != null &&
        this.advData.keywords != undefined &&
        this.advData.keywords.trim() != ""
          ? this.advData.keywords
          : null;
      this.advData.keysentence =
        this.advData.keysentence != null &&
        this.advData.keysentence != undefined &&
        this.advData.keysentence.trim() != ""
          ? this.advData.keysentence
          : null;
      this.advData.publicationRef =
        this.advData.publicationRef != null &&
        this.advData.publicationRef != undefined &&
        this.advData.publicationRef.trim() != ""
          ? this.advData.publicationRef
          : null;
      this.advData.noteBookRef =
        this.advData.noteBookRef != null &&
        this.advData.noteBookRef != undefined &&
        this.advData.noteBookRef.trim() != ""
          ? this.advData.noteBookRef
          : null;
      this.advData.date =
        this.advData.date != null &&
        this.advData.date != undefined &&
        this.advData.date.trim() != ""
          ? this.advData.date
          : null;
      this.advData.dateRange =
        this.advData.dateRange != null &&
        this.advData.dateRange != undefined &&
        this.advData.dateRange.trim() != ""
          ? this.advData.dateRange
          : null;
      this.advData.key =
        this.advData.key != null &&
        this.advData.key != undefined &&
        this.advData.key.trim() != ""
          ? this.advData.key
          : null;
      this.advData.ignoredwords =
        this.advData.ignoredwords != null &&
        this.advData.ignoredwords != undefined &&
        this.advData.ignoredwords.trim() != ""
          ? this.advData.ignoredwords
          : null;
      this.advData.cancelSearchExtend = true;
      //this.advData.firstTimeSearch = this.advData.firstTimeSearch != null && this.advData.firstTimeSearch != undefined && this.advData.firstTimeSearch.trim() != '' ? this.advData.firstTimeSearch : null;
      //this.advData.keywords = this.advData.keywords != null && this.advData.keywords != undefined && this.advData.keywords.trim() != '' ? this.advData.keywords : null;

      /*= {
        search: "Notas",


        firstTimeSearch: null,
        quantity: 1,
      },*/
      // console.log({ search: this.advData })

      this.$router.push({
        path: "/advSearch",
        query: { search: btoa(JSON.stringify(this.advData)) },
      });
      //console.log('DATA URL', this.advData)
      this.dialog = false;
      //this.$refs.form.reset();
      this.firstTime = true;
      //console.log('estas en search wey ',JSON.stringify(this.advData));
    },

    orderAllPublications(lastOrder, cPublications, staticPublication, group) {
      lastOrder.push({
        publicationName: staticPublication,
        status: false,
        _id: staticPublication,
        disable: true,
      });
      cPublications.forEach((publication) => {
        if (publication?.group === group) lastOrder.push(publication);
      });
      return lastOrder;
    },
    async getEditorial() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      this.publications = response.data?.publicaciones?.sort(function (a, b) {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });

      let lastOrder = [];
      lastOrder.push({
        publicationName: "Todas las publicaciones",
        status: true,
        _id: null,
      });
      lastOrder = this.orderAllPublications(
        lastOrder,
        this.publications,
        "Medios tradicionales",
        1
      );
      lastOrder = this.orderAllPublications(
        lastOrder,
        this.publications,
        "Medios ligeros",
        2
      );
      lastOrder = this.orderAllPublications(
        lastOrder,
        this.publications,
        "La Factoría",
        3
      );
      lastOrder = this.orderAllPublications(
        lastOrder,
        this.publications,
        "Otras publicaciones",
        4
      );
      this.publications = lastOrder;

      const response2 = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      this.sectionSelect = response2.data?.notebooks;
    },
    isGraphics(item) {},
    getYears() {
      // if (this.advData.publicationRef == null) {
      //   const years = (back) => {
      //     const year = new Date().getFullYear();
      //     return Array.from({ length: back }, (v, i) => year - back + i + 1);
      //   };
      //   this.years = years(153);
      //   // this.years = years(152);
      //   // //console.log(this.years)
      //   this.years = this.years.reverse();
      //
      // } else {
      //   try {
      //     //console.log(this.publications)
      //     const temp = this.publications.find(
      //       (el) => el._id == this.advData.publicationRef
      //     );
      //     //console.log(temp);
      //     this.minDate = new Date(temp.minDate).toISOString().substring(0, 10);
      //     const oldYear = new Date(temp.minDate).getFullYear();
      //     const years = (back) => {
      //       const year = new Date().getFullYear();
      //       return Array.from({ length: back }, (v, i) => year - back + i + 1 );
      //     };
      //     this.years = years(new Date().getFullYear() - oldYear);
      //     this.years = this.years.reverse();
      //   } catch (error) {
      //     //console.log('This is error from publicationRef');
      //     //console.log(error);
      //   }
      // }
      this.years = [];
      for (let i = new Date().getFullYear(); i >= 1800; i--) {
        this.years.push(i);
      }
    },
  },
};
</script>

<style lang="scss" >
.custom-chip {
  border-width: 2px !important;
  border-color: #9b9b9b !important;
  height: 2.8rem !important;
}

.active-chip {
  border-width: 2px !important;
  border-color: #004d9c !important;
}

.active-chipI {
  border-width: 2px !important;
  border-color: #59b477 !important;
}
.active-chipP {
  border-width: 2px !important;
  border-color: #c03a30 !important;
}
.active-chipG {
  border-width: 2px !important;
  border-color: #f8a73e !important;
}

.custom-field {
  //border-color: #f8a73e !important;
  border-color: #202020 !important;
}

.theme--light.v-input.custom-field input::placeholder {
  border-color: #202020 !important;
  //color: #615757 !important;
  color: #757575;
  //color: #757575 !important;
}

.v-text-field.custom-field label {
  color: #615757 !important;
}

.v-text-field.custom-field fieldset {
  border-width: 2px !important;
  //border: #59b477 !important;
}

.v-list--dense .v-list-item {
  min-height: 25px;
}

.v-list-item--dense .v-list-item__content,
.v-list--dense .v-list-item .v-list-item__content {
  padding: 2px 0;
}
.listItemTitleTrue {
  text-align: left !important;
  color: White !important;
  font-size: 15px !important;
}

.listItemTitleTrueSubtittle {
  text-align: left !important;
  color: White !important;
  font-size: 15px !important;
}
.listItemTitleFalse {
  padding-left: 12px !important;
}

.v-application .pa-5 {
  padding: 0px !important;
}

/*.v-application .primary--text {
    color: #f8a73e !important;
    //caret-color: #f8a73e !important;
  }*/
/*.v-label .v-label--active .theme--light .primary--text{
    color: #f8a73e !important;
  }*/
.v-list .v-list-item:hover {
  background-color: #acc7f3 !important;
}
</style>
