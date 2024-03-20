<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="white" style="height: 50px">
          <v-spacer />
          <v-toolbar-title style="color: black; height: 40px"
            >Solicitud de archivos</v-toolbar-title
          >
          <v-spacer />
          <v-btn icon color="black" class="mb-3" dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <h4 class="mt-2" style="text-align: center">
        Llena este formulario con tu solicitud y será atendido a la brevedad.
      </h4>
      <div>
        <p class="mt-1" style="text-align: center">" * " campo requerido.</p>
      </div>
      <v-card-text class="cardText">
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-card flat class="pa-5">
                <label>Datos de la persona</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="userForm" lazy-validation>
                  <v-text-field
                    outlined
                    dense
                    label="Nombre"
                    placeholder="Ingrese su nombre *"
                    append-icon="mdi-account"
                    class="custom-field mb-4"
                    v-model="name"
                    :rules="validations.fieldRules"
                    hide-details
                  ></v-text-field>
                  <v-combobox
                    :items="positions"
                    label="Puesto"
                    placeholder="Seleccione el puesto (solo internos)"
                    item-text="position"
                    item-value="_id"
                    outlined
                    dense
                    class="custom-field mb-4"
                    hide-details
                    v-model="position"
                  ></v-combobox>
                  <v-combobox
                    :items="select1"
                    label="Tipo de archivo solicitado"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    class="custom-field mb-4"
                    v-model="fileType"
                    hide-details
                  ></v-combobox>
                  <v-combobox
                    :items="departments"
                    outlined
                    dense
                    label="Departamento"
                    placeholder="Ingrese su Departamento O Empresa"
                    append-icon="mdi-map-marker"
                    class="custom-field mb-4"
                    v-model="address"
                    hide-details
                  ></v-combobox>
                  <v-text-field
                    outlined
                    dense
                    label="Número de teléfono o extensión"
                    placeholder="Ingrese su número"
                    append-icon="mdi-phone"
                    class="custom-field mb-4"
                    type="tel"
                    v-model="telephone"
                    hide-details
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Correo electrónico"
                    placeholder="Ingrese su correo electrónico *"
                    append-icon="mdi-email"
                    class="custom-field mb-4"
                    v-model="email"
                    :rules="validations.fieldRules"
                    hide-details
                  ></v-text-field>

                  <v-combobox
                    :items="fileUses"
                    label="Uso de archivos"
                    placeholder="Seleccione el uso"
                    outlined
                    dense
                    class="custom-field mb-4"
                    hide-details
                    v-model="fileUse"
                  ></v-combobox>

                  <v-combobox
                    :items="tiempoestimadoitem"
                    outlined
                    dense
                    label="Tiempo estimado para recibir la información"
                    placeholder="Ingresa en cuanto tiempo lo necesitas"
                    append-icon="clipboard-text-clock-outline"
                    class="custom-field"
                    v-model="tiempoestimado"
                  ></v-combobox>

                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datesolicitud"
                        label="Fecha de solicitud"
                        placeholder="Elija la fecha de solicitud *"
                        append-icon="mdi-calendar"
                        dense
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field mb-4"
                        :rules="validations.fieldRules"
                        hide-details
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      locale="es-MX"
                      ref="picker"
                      v-model="datesolicitud"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="dateMininum"
                      class="custom-field"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>

                </v-form>
              </v-card>
            </v-flex>

            <v-flex xs12 md6>
              <v-card flat class="pa-5">
                <label>Archivo a solicitar</label>
                <v-divider class="mb-4"></v-divider>

                <v-form ref="dataForm" lazy-validation>
                  <v-text-field
                    outlined
                    dense
                    label="Clave de archivo"
                    placeholder="Ingrese la clave"
                    append-icon="mdi-numeric"
                    class="custom-field mb-4"
                    hide-details
                    v-model="id"
                  ></v-text-field>

                  <v-combobox
                    :items="select2"
                    label="Otros recursos informativos"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    class="custom-field mb-4"
                    v-model="use"
                    hide-details
                  ></v-combobox>

                  <v-text-field
                    outlined
                    dense
                    label="Publicación"
                    placeholder="Ingrese nombre de la publicación"
                    class="custom-field mb-4"
                    hide-details
                    v-model="publication"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Tema solicitado"
                    placeholder="Ingrese el tema *"
                    append-icon="mdi-forum"
                    class="custom-field mb-4"
                    v-model="topic"
                    :rules="validations.fieldRules"
                    hide-details
                  ></v-text-field>

                  <v-menu
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-combobox
                        v-model="dates"
                        multiple
                        chips
                        hide-details
                        hide-selected
                        label="Fecha o multiples fechas de publicación"
                        placeholder="Clic para elegir multiples fechas"
                        append-icon="mdi-calendar-range"
                        outlined
                        readonly
                        class="mb-4"
                        v-bind="attrs"
                        v-on="on"
                      ></v-combobox>
                    </template>
                    <v-date-picker v-model="dates" multiple></v-date-picker>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu3 = false">
                      Listo
                    </v-btn>
                  </v-menu>
                  <v-text-field
                    outlined
                    dense
                    label="Cantidad de archivos"
                    placeholder="Ingrese la cantidad"
                    append-icon="mdi-numeric-1-box"
                    class="custom-field mb-4"
                    v-model="amount"
                    hide-details
                  ></v-text-field>

                  <!------------------------<v-flex xs12 md4>--------------------//-->

                  <!--------------------------------------------//-->

                  <v-textarea
                    outlined
                    name="input-7-4"
                    label="Descripción del material solicitado"
                    class="custom-field mb-2"
                    height="80"
                    v-model="description"
                    hide-details
                  ></v-textarea>

                  <v-textarea
                    outlined
                    name="input-7-4"
                    label="Comentarios"
                    class="custom-field mb-2"
                    height="50"
                    v-model="comentarios"
                    hide-details
                  ></v-textarea>

                  <v-layout row wrap>
                    <v-spacer />
                    <v-btn
                      class="justify-end"
                      color="primary"
                      @click="makeRequest"
                    >
                      Solicitar
                    </v-btn>
                  </v-layout>
                </v-form>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <!-- <v-card-actions>
        <v-spacer />
        <v-btn outlined color="primary" @click="makeRequest"> Solicitar </v-btn>
      </v-card-actions> -->
    </v-card>

    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title> Aviso </v-card-title>
        <div v-if="loading2">
          <v-card-text v-if="!loading">¿Desea enviar la solicitud?</v-card-text>
          <v-card-text v-else>Enviando solicitud</v-card-text>
        </div>
        <div v-else>
          <v-card-text
            >Su solicitud ha sido enviada <br />
            ¿Desea enviar otra solicitud?
          </v-card-text>
        </div>
        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn @click="loading2 == true ? (confirm = false) : closeAll()"
            >No</v-btn
          >
          <v-btn
            color="primary"
            @click="loading2 == true ? addRequest() : cleanAndContinue()"
            >Si</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    menu2: false,
    menu3: false,
    loading: false,
    loading2: true,
    dialog: false,
    confirm: false,

    name: null,
    telephone: null,
    address: null,
    email: null,
    position: null,
    fileUse: null,
    tiempoestimado: null,
    comentarios: null,

    id: null,
    fileType: null,
    use: null,
    publication: null,
    topic: null,
    datepetitiontext: null,
    dates: [],
    datesolicitud: null,
    amount: null,
    description: null,

    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
    departments: [
      "Central 9",
      "Dirección Comercial",
      "Dirección Editorial",
      "Edición Web",
      "Mercadotecnia",
      "Sección espectáculos",
      "Sección Imagen",
      "Sección Local",
      "Sección Yucatán",
      "Ventas Mostrador",
    ],
    tags: [
      { icon: "mdi-text-box", value: "Texto" },
      { icon: "mdi-image", value: "Imagen" },
      { icon: "mdi-file", value: "PDF" },
    ],
    select1: ["Foto", "Página", "Gráfica", "Información", "Todos los archivos"],
    select2: ["Libro", "Revista", "Periódico", "Todos"],
    fileUses: [
      "Campaña mercadotecnia",
      "Exposición fotográfica",
      "Fotogalería",
      "Nota",
      "Otros",
      "Reportaje especial",
      "Testigo",
      "Venta",
      "Vídeo",
    ],
    tiempoestimadoitem: [
      "Urgente",
      "No urgente",
      " * ingrese la especificación *",
    ],
    publications: [],
    positions: [],
    menu: false,
    menu2: false,
    notebook: null,
    dateMininum: "1864-01-01",
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    notebook(val) {
      this.getYears();
    },
  },
  methods: {
    openDialog() {
      this.dialog = !this.dialog;
      this.getPublications();
      this.getPositions();
    },
    makeRequest() {
      if (this.$refs.userForm.validate() && this.$refs.dataForm.validate()) {
        this.confirm = true;
      }
    },
    limpiardatapicker() {},
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      this.publications = response.data.publicaciones;
      this.publications.push({
        publicationName: "Todas las publicaciones",
        _id: null,
      });
    },
    async addRequest() {
      this.loading = true;
      let body = {
        idcustomer: localStorage.user_id,

        nombre: this.name,
        telefono: this.telephone,
        direccion: this.address,
        email: this.email,
        position: this.position,
        useFile: this.fileUse,
        tiempo_estimado: this.tiempoestimado,

        clave: this.id,
        tipoArchivo: this.fileType,
        uso: this.use,
        publication: this.publication,
        tema: this.topic,
        cantidad: this.amount,
        fecha_peticion: this.dates,
        fecha_creacion_solicitud: this.datesolicitud,
        comentarios: this.comentarios,
        descripcion: this.description,

        spendTime: "00:00",
        employee: null,
        state: "Comenzar",
      };
      try {
        const response = await this.$axios.$post("/requestdocuments", body, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });

        this.loading = false;
        this.loading2 = false;

        this.$store.commit(
          "openSnack",
          "La solicitud se ha enviado correctamente!"
        );
      } catch (error) {
        this.loading = false;
        if (response.message) {
          this.$store.commit(
            "openSnack",
            "Error: " + response.message + ", intente de nuevo"
          );
        } else {
          this.$store.commit(
            "openSnack",
            "Ha ocurrido un error interno" + error
          );
        }
      }
      //console.log(body)
    },
    closeAll() {
      this.cleanAndContinue();
      this.dialog = false;
    },
    cleanAndContinue() {
      this.$refs.userForm.reset();
      this.$refs.dataForm.reset();
      this.confirm = false;
      this.loading = false;
      this.loading2 = true;
    },
    getYears() {
      if (this.notebook == null) {
        this.dateMininum = "1864-01-01";
      } else {
        const temp = this.publications.find((el) => el._id == this.notebook);

        this.dateMininum = new Date(temp.minDate)
          .toISOString()
          .substring(0, 10);
      }
    },
    async getPositions() {
      const response = await this.$axios.$get("/position", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      this.positions = response.data;
    },
  },
};
</script>

<style lang="scss">
.custom-field {
  border-color: #202020 !important;
}

.theme--light.v-input.custom-field input::placeholder {
  border-color: #202020 !important;
  color: #757575;
}

.v-text-field.custom-field label {
  color: #757575;
}

.v-text-field.custom-field fieldset {
  border-width: 2px !important;
}

.cardColor {
  background-color: transparent !important;
}

.cardText {
  max-height: 550 !important;
  // max-width: 1360 !important;
}
</style>
