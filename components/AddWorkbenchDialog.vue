<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        Agregar a una mesa de trabajo
        <v-spacer />
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text>
        <label class="mb-2">Crear nueva mesa</label>
        <v-text-field
          dense
          outlined
          label="Nombre de la mesa"
          v-model="workbenchName"
          :rules="validations.fieldRules"
          required
        >
        </v-text-field>
        <v-btn block outlined color="primary" @click="createWorkbench()">
          Crear una mesa
        </v-btn>
      </v-card-text>

      <v-card-text v-if="!loading">
        <label class="mb-2">Agregar a una existente</label>
        <v-list class="list-container">
          <template v-for="(item, index) in workbenchs">
            <v-divider :key="index" v-if="index != 0"></v-divider>

            <v-list-item :key="item.name">
              <v-list-item-avatar>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.name"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  outlined
                  :disabled="item.exists"
                  @click="updateWorkbench(item._id)"
                >
                  <v-icon left> mdi-plus </v-icon>
                  Agregar
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>

      <v-card-text v-if="loading" class="text-center">
        <h1 class="headline mb-3">Cargando mesas de trabajo</h1>
        <v-progress-linear
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
      validations: {
      fieldRules: [(v) => !!v || "Campo requerido"]
    },
    dialog: false,
    workbenchs: [],
    workbenchName: null,
    type: null,
    id: null,
    loading: true,
    date:null
  }),
  methods: {
    openDialog(type, id, date) {
      this.loading = true;
      this.type = type;
      this.date = date;
      this.id = id;
      this.dialog = true;
      this.getWorkBenchs();
    },
    async getWorkBenchs() {
      this.loading = true;

        const response = await this.$axios.$get(
          "/tableWork/?user_id=" + localStorage.user_idC,
          {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          }
        );
        console.log('mesas de trabajo antes y depues')
        console.log(response)
        for(let j=0;j<response.data.length;j++){
          for(let i=0;i<response.data[j].images.length;i++){
            //console.log(i)
            response.data[j].images[i]["hoverb"] = false
          }
          for(let i=0;i<response.data[j].pdfs.length;i++){
            response.data[j].pdfs[i]["hoverb"] = false
          }
        }
        console.log(response);

        this.validateWorkbench(response.data);
      //}
    },
    async createWorkbench() {
      //console.log("Creating Workbench");
      console.log(this.workbenchName);
      if(this.workbenchName != null){
              const response = await this.$axios.$post("/tableWork", {
        name: this.workbenchName,
        user: localStorage.user_idC,
        kind: this.type,
        item_id: this.id,
        date: this.date,
      });
      //console.log(response);
      if (response.status == 200) {
        this.$store.commit(
          "openSnack",
          "El contenido se ha agregado exitosamente en la nueva mesa de trabajo"
        );
       // localStorage.removeItem("tableWork")
        this.getWorkBenchs();
        this.workbenchName = null;
      }
      }
    },

    async updateWorkbench(id) {
      //console.log("id -------------==="+id)
      const response = await this.$axios.$put("/tableWork", {
        table_id: id,
        kind: this.type,
        item_id: this.id,
        date: this.date,
      });
      if (response.status == 200) {
        this.$store.commit(
          "openSnack",
          "El contenido se ha agregado exitosamente"
        );
      }else {
        this.$store.commit(
          "openSnack",
          "intete lo de nuevo"
        );
      }
     // localStorage.removeItem("tableWork")
      this.getWorkBenchs();
    },

    async validateWorkbench(workbenchs) {
      const response = await this.$axios.$get("/knowTable/", {
        params: {
          user_id: localStorage.user_idC,
          item_id: this.id,
        },
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      workbenchs.forEach((element) => {
        response.data.forEach((elementb) => {
          if (element._id == elementb._id) {
            //console.log("EXISTE EN ESTA MESA");
            element.exists = true;
          }
        });
      });
      this.workbenchs = workbenchs;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.workbench-title {
  font-weight: 600;
  font-size: 18px;
}

.list-container {
  border-style: solid;
  border-color: #b2b2b2;
  border-radius: 5px;
  border-width: thin;
}
</style>
