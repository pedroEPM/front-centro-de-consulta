<template>
  <v-dialog max-width="1000" v-model="dialog">
    <v-card>
      <!--
      <v-card-text
        style="position: -webkit-sticky; position: sticky; top: 0; z-index: 100"
      >
        <v-tabs fixed-tabs background-color="white" color="primary">
          <v-tab
            v-for="(item, index) in events"
            v-bind:key="index"
            @click="scrollTo(item.year)"
            >{{ item.year }}</v-tab
          >
        </v-tabs>
      </v-card-text>-->
      <v-card-title class="justify-center">
        <h3 class="whiteTextOverride">Efemérides</h3>
      </v-card-title>
      <v-card-text>
        <v-timeline :dense="$vuetify.breakpoint.smAndDown ? true : false">
          <v-timeline-item
            v-for="(item, index) in events"
            :key="index"
            color="primary"
            small
            :id="item.year"
          >
            <template v-slot:opposite>
              <span
                :class="`headline font-weight-bold primary--text`"
                v-text="item.year"
              ></span>
            </template>
            <v-hover v-slot="{ hover }">
              <v-card
                outlined
                :elevation="hover ? 12 : 0"
                :class="{ 'on-hover': hover }"
              >
                <v-card-text
                  v-for="(event, index2) in item.items"
                  v-bind:key="index2"
                >
                  <!--
                  <v-img :src="imgPath + event.imageSrc"> </v-img>
                  -->
                  <div v-if="event.active">
                    <h2
                      :class="` font-weight-light mb-4 primary--text`"
                    >
                      {{ event.titleEvent }}
                    </h2>
                    <div>
                      <!--b>{{
                        new Date(event.date).toLocaleDateString("es-US")
                      }}</b-->

                      <b>{{ event.date }}</b>
                    </div>
                    <div>
                      {{ event.Description }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    imgPath: process.env.imgPath,
    count: 0,
    years: [
      {
        color: "cyan",
        year: "1960",
      },
      {
        color: "green",
        year: "1970",
      },
      {
        color: "pink",
        year: "1980",
      },
      {
        color: "red",
        year: "1980",
      },
      {
        color: "amber",
        year: "1985",
      },
      {
        color: "orange",
        year: "1990",
      },
      {
        color: "red",
        year: "1995",
      },
      {
        color: "amber",
        year: "2000",
      },
      {
        color: "orange",
        year: "2005",
      },
    ],
    events: [],
  }),
  methods: {
    getdateevent(event) {
      ////console.log("cambia la fecha de " + event.date);
      ////console.log("a " + event.date);
      let dateaux = new Date(event.date);
      dateaux.setDate(dateaux.getDate() + 1);
      event.date = dateaux;
      return (
        new Date(event.date).getDate() +
        "-" +
        (new Date(event.date).getMonth() + 1) +
        "-" +
        new Date(event.date).getFullYear()
      );
    },
    openDialog(month) {
      this.events = [];
      this.dialog = true;
      this.getEvents(month);
      this.count = 0;
      //console.log("estas en dialog efemerides");
    },
    scrollTo(id) {
      var elmnt = document.getElementById(id);
      elmnt.scrollIntoView({ behavior: "smooth" });
    },
    async getEvents(month) {
      //console.log("Getting efemerides");
      //console.log(month);
      const response = await this.$axios.$get("/Efemerides", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });

      //console.log(response.data.Efemerides["m" + month]);

      let dataInfo = response.data.Efemerides["m" + month].reverse();
      //console.log(dataInfo)

      let tempEvents = []

      dataInfo.forEach((x) => {
        x.items.forEach((y) => {
          if (y.active == false) {
            this.count = this.count + 1;
          }
        });

        if (x.items.length == this.count) {
          x.items.active = false;
        } else {
          x.items.active = true;
        }

        if (x.items.active == true) {
          tempEvents.push(x);
        }

        this.count = 0;
      });

      this.events = tempEvents?.map(el => {
        return {
          items: el.items?.map(item => {
            item.date = this.getdateevent(item)
            return item
          }),
          year: el.year
        }
      })

      //console.log("Date format fixed")
      //console.log(this.events)
    },
  },
};
</script>

<style scoped>
.whiteTextOverride {
  color: #1e2899 !important;
}
</style>
