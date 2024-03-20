<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title
          ><v-avatar color="primary" class="mr-2"
            ><v-icon color="white">mdi-folder-multiple</v-icon></v-avatar
          >
          Mesa de trabajo
        </v-toolbar-title>

        <v-spacer />
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-card-text v-if="!loading">
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(item, i) in workbenchs" v-bind:key="i">
            <v-expansion-panel-header class="workbench-title">{{
              item.name
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container grid-list-xl style="">
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-card outlined class="pa-2">
                      <label class="ma-2">Acciones</label> <br />
                      <v-container grid-list-md>
                        <v-layout row wrap>
                          <v-flex>
                            <v-btn disabled outlined block> Editar </v-btn>
                          </v-flex>

                          <v-flex>
                            <v-btn
                              outlined
                              block
                              color="red"
                              @click="openDelDialog(item._id)"
                            >
                              Eliminar
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-flex>

                  <v-flex xs12 v-if="item.notes.length > 0">
                    <label>Notas</label>
                    <v-divider />
                  </v-flex>

                  <v-flex
                    xs12
                    v-for="item2 in item.notes"
                    v-bind:key="item2._id"
                  >
                    <v-card outlined class="pointer">
                      <v-card-text>
                        <v-layout row wrap>
                          <v-flex
                            xs8
                            md10
                            v-ripple
                            @click="goToContent(item2, 1)"
                          >
                            <v-icon class="mr-2">mdi-text-box</v-icon
                            >{{ item2.title }}
                          </v-flex>

                          <v-flex xs2>
                            <v-btn
                              icon
                              @click="
                                removeElement(item._id, 'note', item2._id)
                              "
                              ><v-icon>mdi-delete</v-icon></v-btn
                            >
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12 v-if="item.images.length > 0">
                    <label>Imágenes</label>
                    <v-divider />
                  </v-flex>

                  <v-flex
                    xs12
                    class="pa-2"
                    v-for="item2 in item.images"
                    v-bind:key="item2._id"
                  >
                    <v-card outlined v-ripple class="pointer">
                      <v-card-text>
                        <v-layout row wrap>
                          <v-flex
                            xs8
                            md10
                            v-ripple
                            @click="goToContent(item2, 2)"
                          >
                            <v-icon class="mr-2">mdi-image</v-icon
                            >{{ item2.ImageTitle.substring(0, 50) }}
                          </v-flex>

                          <v-flex xs2>
                            <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12 v-if="item.pdfs.length > 0">
                    <label>PDFs</label>
                    <v-divider />
                  </v-flex>

                  <v-flex
                    xs12
                    class="pa-2"
                    v-for="item2 in item.pdfs"
                    v-bind:key="item2._id"
                  >
                    <v-card outlined v-ripple class="pointer">
                      <v-card-text>
                        <v-layout row wrap>
                          <v-flex
                            xs8
                            md10
                            v-ripple
                            @click="goToContent(item2, 3)"
                          >
                            <v-icon class="mr-2">mdi-file</v-icon
                            >{{ item2.title.substring(0, 50) }}
                          </v-flex>

                          <v-flex xs2>
                            <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-text v-if="loading" class="text-center">
        <h1 class="headline mb-3">Cargando mesas de trabajo</h1>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-card-text>
    </v-card>

    <v-dialog max-width="300" v-model="delDialog">
      <v-card>
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!deleting"
          >¿Está seguro de querer eliminar la mesa de trabajo?</v-card-text
        >
        <v-card-text v-if="deleting">Eliminando la mesa de trabajo</v-card-text>

        <v-card-actions v-if="!deleting">
          <v-spacer />
          <v-btn outlined @click="delDialog = false">Cancelar</v-btn>
          <v-btn outlined color="red" @click="deleteWorkbench(delId)"
            >Eliminar</v-btn
          >
        </v-card-actions>

        <v-progress-linear
          v-if="deleting"
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    workbenchs: [],
    loading: false,
    delDialog: false,
    delId: null,
    deleting: false,
  }),
  methods: {
    openDialog() {
      this.dialog = true;
      this.getWorkBenchs();
    },
    openDelDialog(id) {
      this.delId = id;
      this.delDialog = true;
    },
    async getWorkBenchs() {
      this.loading = true;
      //console.log("Getting Workbenchs 2");
      let tableworkmemory = null
      tableworkmemory = JSON.parse(localStorage.getItem("tableWork"))
      if (tableworkmemory){
        this.workbenchs = localStorage.getItem("tableWork")
        this.loading = false;
      }else{
        const response = await this.$axios.$get(
          "/tableWork/?user_id=" + localStorage.user_idC,
          {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          }
        );
        for(let j=0;j<response.data.length;j++){
          for(let i=0;i<response.data[j].images.length;i++){
            //console.log(i)
            response.data[j].images[i]["hoverb"] = false
          }
          for(let i=0;i<response.data[j].pdfs.length;i++){
            response.data[j].pdfs[i]["hoverb"] = false
          }
        }
        //console.log(response);
        localStorage.setItem("tableWork", JSON.stringify(response.data));
        //console.log(localStorage.getItem("tableWork"))
        this.workbenchs = response.data;
        this.loading = false;
      }
    },
    async deleteWorkbench(id) {
      this.deleting = true;
      const response = await this.$axios.$delete(/tableWork/ + id);
      //console.log(response);
      localStorage.removeItem("tableWork")
      this.getWorkBenchs();
      this.$store.commit(
        "openSnack",
        "La mesa de tabajo se ha eliminado exitosamente"
      );
      this.deleting = false;
      this.delDialog = false;
    },

    async removeElement(workbenchId, type, elementId) {
      const response = await this.$axios.$put("/removeFromTable", {
        table_id: workbenchId,
        kind: type,
        item_id: elementId,
      });
      //console.log("Elemento removido");
      this.$store.commit(
        "openSnack",
        "El elemento se ha removido exitosamente"
      );
      localStorage.removeItem("tableWork")
      this.getWorkBenchs();
    },

    goToContent(item, mode) {
      //console.log(item);
      this.$router.push(
        "/search?searched=&content=" + item._id + "&mode=" + mode + "&workbench=true"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.workbench-title {
  //font-weight: 600;
  font-size: 16px;
}

.note-title {
  color: black;
}
</style>
