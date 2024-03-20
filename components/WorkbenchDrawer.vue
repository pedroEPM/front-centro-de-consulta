<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    right
    class="workbench-drawer"
  >
    <div v-if="!loading">
      <v-card class="workbench-header" color="primary" dark>
        <v-toolbar color="primary">
          <v-toolbar-title
            ><v-avatar color="primary" class="mr-2"
              ><v-icon color="white">mdi-folder-multiple</v-icon></v-avatar
            >
            Mesa de trabajo
          </v-toolbar-title>

          <v-spacer />
          <v-btn icon @click="setWorkbench(false)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
      </v-card>

      <v-expansion-panels focusable class="workbench-expansions">
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
                          <v-btn @click="openDialogResumenTable(item)"> Resumen </v-btn>
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

                <v-flex xs12 v-if="verifyObject(item.notes).length > 0">
                  <label>Notas</label>
                  <v-divider />
                </v-flex>

                <v-flex xs12 v-for="(item2) in verifyObject(item.notes)" v-bind:key="getUniqueId(item2,'N')">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">


                      <v-card outlined class="pointer" v-bind="attrs"
                        v-on="on">
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex
                              xs8
                              md10
                              class="workbench-item"
                              v-ripple
                              @click="goToContent(item2, 1, item2.date, 'Notas')"
                            >
                              <v-icon class="mr-2">mdi-text-box</v-icon
                              >{{ item2.title }}
                            </v-flex>

                            <v-flex xs2>
                              <v-btn
                                icon
                                @click="removeElement(item._id, 'notes', item2._id)"
                                ><v-icon>mdi-delete</v-icon></v-btn
                              >
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>

                    </template>
                    <span>{{getTextFromContent(item2)}}</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 v-if="verifyObject(item.images).length > 0">
                  <label>Imágenes</label>
                  <v-divider />
                </v-flex>

                <v-flex
                  xs12
                  class="pa-2"
                  v-for="item2 in verifyObject(item.images)"
                  v-bind:key="getUniqueId(item2, 'I')"
                >
                  <!--v-hover v-slot="{ hover }" close-delay="250"!-->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">

                      <v-card outlined v-ripple class="pointer" v-bind="attrs"
                        v-on="on">
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex
                              xs8
                              md10
                              class="workbench-item"
                              v-ripple
                              style="cursor : pointer"
                              @click="item2.hoverb = !item2.hoverb"
                            >
                              <!--<v-icon class="mr-2">mdi-image</v-icon> goToContent(item2, 2)-->
                              <v-avatar v-if="!item2.hoverb" class="mr-1">
                                <img
                                  :src="item2.newSRCThumbnail !== undefined 
                                  ? imgPath + item2.newSRCThumbnail
                                  : item2.newSRC !== undefined
                                    ? imgPath + item2.newSRC 
                                    : imgPath + item2.imageSrc"
                                >
                              </v-avatar>
                              {{ item2.description ? item2.description.substring(0, 20) : '' }}
                            </v-flex>

                            <v-flex xs1 class="mr-4">
                              <v-btn
                              @click="removeElement(item._id, 'images', item2._id)"
                              icon><v-icon>mdi-delete</v-icon></v-btn>
                            </v-flex>
                            <v-flex xs1 v-if="device == 'Mobile'">
                              <v-btn icon @click="item2.hoverb = !item2.hoverb"><v-icon>mdi-arrow-expand</v-icon></v-btn>
                            </v-flex>
                          </v-layout>
                          <v-expand-transition>
                            <v-layout
                              v-if="item2.hoverb"
                              class="fade-transition"
                              @click="goToContent(item2, 2, item2.publicationDate, 'Imagenes')"
                              wrap
                              style="cursor : pointer"
                            >
                              <v-img
                                height="150"
                                :src="item2.newSRCThumbnail !== undefined 
                                  ? imgPath + item2.newSRCThumbnail
                                  : item2.newSRC !== undefined
                                    ? imgPath + item2.newSRC 
                                    : imgPath + item2.imageSrc"
                              ></v-img>
                              <v-container>
                                {{item2.description ? item2.description.substring(0, 50) : 'Sin descripción' }}
                              </v-container>
                            </v-layout>
                          </v-expand-transition>
                        </v-card-text>
                      </v-card>
                  <!--/v-hover!-->
                    </template>
                    <span>{{item2.description ? item2.description.substring(0, 80) : 'Sin descripción'}}...</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12 v-if="verifyObject(item.pdfs).length > 0">
                  <label>PDFs</label>
                  <v-divider />
                </v-flex>

                <v-flex
                  xs12
                  class="pa-2"
                  v-for="item2 in verifyObject(item.pdfs)"
                  v-bind:key="getUniqueId(item2, 'P')"
                >
                  <!--v-hover v-slot="{ hover }" close-delay="250"-->
                    <v-card outlined v-ripple class="pointer">
                      <v-card-text>
                        <v-layout row wrap>
                          <v-flex
                            xs8
                            md10
                            class="workbench-item"
                            v-ripple
                            style="cursor : pointer"
                            @click="item2.hoverb = !item2.hoverb"
                          >
                            <!--<v-icon class="mr-2">mdi-image</v-icon> goToContent(item2, 3)-->
                            <v-avatar v-if="!item2.hoverb" class="mr-1">
                              <img
                                :src="item2.newSRCPDFThumbnail !== undefined 
                                ? imgPath + item2.newSRCPDFThumbnail 
                                : item2.newSRCPDF !== undefined 
                                  ? imgPath + item2.newSRCPDF
                                  : imgPath + item2.imageSrc"
                              > 
                            </v-avatar>
                            {{ item2.title ? item2.title.substring(0, 50) : item2.isNewId }}
                          </v-flex>

                          <v-flex xs1 class="mr-4">
                            <v-btn
                            @click="removeElement(item._id, 'pdfs', item2._id)"
                            icon><v-icon>mdi-delete</v-icon></v-btn>
                          </v-flex>
                          <v-flex xs1 v-if="device == 'Mobile'">
                            <v-btn icon @click="item2.hoverb = !item2.hoverb"><v-icon>mdi-arrow-expand</v-icon></v-btn>
                          </v-flex>
                        </v-layout>
                        <v-expand-transition>
                          <v-layout
                            v-if="item2.hoverb"
                            class="fade-transition"
                            @click="goToContent(item2, 3, item2.datePublication, 'PDFs')"
                            wrap
                            style="cursor : pointer"
                          >
                            <v-img
                              height="150"
                              :src="item2.newSRCPDFThumbnail !== undefined 
                                ? imgPath + item2.newSRCPDFThumbnail 
                                : item2.newSRCPDF !== undefined 
                                  ? imgPath + item2.newSRCPDF
                                  : imgPath + item2.imageSrc"
                            ></v-img>
                          </v-layout>
                        </v-expand-transition>
                      </v-card-text>
                    </v-card>
                  <!--/v-hover-->
                </v-flex>
              </v-layout>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div v-if="loading">
      <v-card outlined>
        <v-card-text class="text-center">
          <h1 class="title mb-3">Cargando mesas de trabajo</h1>
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </div>

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
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  components: {
  },
  data: () => ({
    imgPath: process.env.imgPath,
    drawer: false,
    workbenchs: [],
    loading: false,
    delDialog: false,
    delId: null,
    deleting: false,
    device : '',

  }),
  watch: {
    workbenchDrawer(val) {
      this.drawer = val;
    },
    drawer(val) {
      if (!val) {
        this.setWorkbench(false);
      } else {
        this.getWorkBenchs();
      }
    },
  },
  computed: {
    ...mapState("layout", ["workbenchDrawer"] ),
  },
  methods: {
    ...mapMutations("layout", ["setWorkbench"]),
    verifyObject(item){
      // return item[0] !== null ? item : [] :D
      return item.filter(Boolean);
    },
    getTextFromContent(item){
      if(!item?.content) return 'Sin contenido...'
      return item?.content.substring(0,80) + '...';
    },
    getUniqueId(item, type){
      //return a new id
      return Date.now() + type;
    },
    openDelDialog(id) {
      this.delId = id;
      this.delDialog = true;
    },
    openDialogResumenTable(item){
      console.log(item)
      console.log('item1')
      this.$emit("openresumen", item)
    },
    async getWorkBenchs() {
      console.log('entro a getWorkBenchs')
      this.loading = true;
      this.device = localStorage.getItem("deviceC");

        console.log("entro al metodo de data bd");
        const response = await this.$axios.$get(
          "/tableWork/?user_id=" + localStorage.user_idC,
          {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          }
        );
        console.log('data mesa de trabajo')
        console.log(response.data)
        for(let j=0;j<response.data?.length;j++){
          for(let i=0;i<response.data[j]?.images?.length;i++){
            //console.log(i)
            response.data[j].images[i]["hoverb"] = false
          }
          for(let i=0;i<response.data[j]?.pdfs?.length;i++){
            response.data[j].pdfs[i]["hoverb"] = false
          }
        }

        this.workbenchs = response.data || [];
        this.loading = false;
      //}
    },
    async deleteWorkbench(id) {
      console.log('id eliminar', id);
      this.deleting = true;
      const response = await this.$axios.$delete(/tableWork/ + id);

      if(response.status == 200){
     // localStorage.removeItem("tableWork");
      this.getWorkBenchs();
      this.$store.commit(
        "openSnack",
        "La mesa de trabajo se ha eliminado exitosamente!"
      );
      this.deleting = false;
      this.delDialog = false;
      }
      else{
          this.$store.commit(
        "openSnack",
        "Error para eliminar la mesa de trabajo "

      );

      }

    },

    async removeElement(workbenchId, type, elementId) {
      console.log('removeElement',workbenchId, type, elementId );
      const response = await this.$axios.$put("/removeFromTable", {
        table_id: workbenchId,
        kind: type,
        item_id: elementId,
      });
      console.log("Elemento removido");
      if(response.status == 200){
      //localStorage.removeItem("tableWork");
       this.getWorkBenchs();
      this.$store.commit(
        "openSnack",
        "El elemento se ha removido exitosamente!"
      );

      }
      else{
        this.$store.commit(
        "openSnack",
        "Error para eliminar el elemento"
      );

      }

    },

    goToContent(item, mode, date, type) {
      //console.log(item);
      const cYear = new Date(date).getFullYear();
      const cObject = {
        quantity: 1,
        key: item.isNewId,
        search: type
      }
      this.$router.push(
        `/advSearch?search=${ btoa(JSON.stringify(cObject)) }&content=` +
        // "/advSearch?searched=&content=" +
          item._id +
          "&mode=" +
          mode +
          "&workbench=true&index=-99&year=" + cYear
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.workbench-drawer {
  @media screen and (min-width: 768px) {
    width: 356px !important;
  }
  @media screen and (max-width: 767px) {
    width: 100% !important;
  }
}

.workbench-header {
  border-radius: 0;
}

.workbench-expansions {
  border-radius: 0;
}

.workbench-item {
  align-self: center;
}

.workbench-expansions ::v-deep .v-expansion-panel-content__wrap {
  padding: 0 10px 16px;
}
</style>
