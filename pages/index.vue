<template>
  <div>
    <v-layout row wrap justify-space-between justify-center>
      <v-flex xs12 md4 class="pb-0">
        <v-card max-width="295px">
          <v-toolbar
            dark
            color="secondaryalice"
            dense
            height="35"
            class="section-title"
          >
            <v-toolbar-title> Acontecimientos destacados </v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-flex>

      <v-flex xs12 class="pt-0">
        <big-carousel :events="events" :loading="loading" />
      </v-flex>

      <v-flex xs12 md4 class="pb-0">
        <v-card max-width="295px">
          <v-toolbar
            dark
            color="secondaryalice"
            dense
            height="35"
            class="section-title"
          >
            <v-toolbar-title> Te recomendamos </v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-flex>

      <v-flex xs12 class="pl-7 pr-7">
        <v-card elevation="4">
          <v-img height="270" :src=" imgPath + backgrounBanner">
            <v-carousel cycle hide-delimiters height="270px">
              <v-carousel-item v-for="(item, i) in news" :key="i">
                <v-row class="fill-height" align="center" justify="center">
                  <v-card @click="openDialog(item)" color="transparent" elevation="0" :class="'animate__animated ' + animation[Math.floor(Math.random() * (11 + 1))]">

                    <img :src="imgPath + item.imgUrl" loading="lazy" alt="news-image" class="carousel-news-image">
                  </v-card>
                </v-row>
              </v-carousel-item>
            </v-carousel>
          </v-img>
        </v-card>
      </v-flex>

      <!--
    <v-flex xs5 align-self-center>
      <hr class="hr-line" />
    </v-flex>

    <v-flex xs2 style="text-align: center">
      <img
        src="https://dev-axon.com/centro-consulta/assets/icons/favicon.ico"
        height="24"
        width="24"
      />
    </v-flex>

    <v-flex xs5 align-self-center>
      <hr class="hr-line" />
    </v-flex>
    -->
      <!--
      <v-flex xs12 md3 class="pl-2 pr-2">
        <v-btn x-large color="primary">
          <v-icon color="white" left>mdi-information-outline</v-icon>
          ¿Quienes somos?
        </v-btn>
      </v-flex>

      <v-flex xs12 md3 class="pl-2 pr-2">
        <v-btn x-large color="primary">
          <v-icon color="white" left>mdi-folder-multiple</v-icon>
          Nuestras colecciones
        </v-btn>
      </v-flex>

      <v-flex xs12 md3 class="pl-2 pr-2">
        <v-btn x-large color="primary">
          <v-icon color="white" left>mdi-folder-star-multiple</v-icon>
          Carpetas Destacadas
        </v-btn>
      </v-flex>
      -->
    </v-layout>

    <Time-Line-Dialog ref="timeline" />
    <CarouselItemDialog ref="carouselItemDialog" />
    <Content-Dialog ref="contentDialog"  />
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
import BigCarousel from "~/components/BigCarousel.vue";
import TimeLineDialog from "~/components/TimeLineDialog";
import CarouselItemDialog from '~/components/CarouseItemlDialog.vue';
import ContentDialog from "~/components/ContentDialog";

export default {
  components: {
    Logo,
    VuetifyLogo,
    BigCarousel,
    TimeLineDialog,
    CarouselItemDialog,
    ContentDialog
  },
  mounted() {
    if (this.$route.query.content != undefined) {
      switch (this.$route.query.mode) {
        case "1":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 4, undefined, undefined, this.$route.query.year+'');
          break;
        case "2":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 5, undefined, undefined, this.$route.query.year+'');
          break;
        case "3":
          this.$refs.contentDialog.getPermissions(this.$route.query.content, 6, undefined, undefined, this.$route.query.year+'');
          break;
      }
    }
  },
  data: () => ({
    imgPath: process.env.imgPath,
    events: [],
    loading: false,
    news : [],
    backgrounBanner : null,
    animation : [
      'animate__bounce',
      'animate__flash',
      'animate__pulse',
      'animate__rubberBand',
      'animate__shakeX',
      'animate__shakeY',
      'animate__headShake',
      'animate__swing',
      'animate__tada',
      'animate__wobble',
      'animate__jello',
      'animate__heartBeat',
    ]
  }),
  async created(){
    if (process.browser) {
      try {
        const values = await Promise.allSettled([
          this.getFeatured(),
          this.getBanners(),
          this.getBackgroundBanner(),
        ]);
        console.log(values);
      } catch (error) {
        console.log(error);
        console.log('errors promise all settled');
      }
    }
  },
  methods: {
    async getFeatured() {
      this.loading = true;
      const response = await this.$axios.$get("/FeaturedEvents", {
        headers: { Authorization: "Bearer " + localStorage.tokenC },
      });
      this.events = response.data.FeaturedEvents;

      // //console.log(response);
      //console.log('These are events')
      //console.log( this.events)
      //console.log('XXXXXXXXXXXXXXX')
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    openTimeline(month) {
      this.$refs.timeline.openDialog(month);
    },
    async getBanners(){
      const response = await this.$axios.$get('/banner', {
        headers : { Authorization : 'Bearer ' + localStorage.tokenC }
      });

      response.data.forEach( x => {
        if ( x.active ){
          this.news.push(x);
        }
      });
      this.news.sort(function (a, b) {
        if (parseInt(a.order) > parseInt(b.order)) {

          return 1;
        }
        if (parseInt(a.order) < parseInt(b.order)) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    },
    async getBackgroundBanner(){
      const response = await this.$axios.$get('/backgroundbanner', {
        headers : { Authorization : 'Bearer ' + localStorage.tokenC }
      });

      response.data.forEach( x => {
        if( x.active ){
          this.backgrounBanner = x.imgUrl;
        }
      });
    },
    openDialog( item ){
      this.$refs.carouselItemDialog.openDialog( item );
    },
  },
};
</script>

<style lang="scss" scoped>
.hr-line {
  border-top: 2px dashed lightgray;
}

.section-title ::v-deep .v-toolbar__content {
  justify-content: center;
}

.carousel-news-image {
  height: 250px;
  margin-top: 6px;
  width: auto;
  object-fit: contain;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.75);
}
</style>
