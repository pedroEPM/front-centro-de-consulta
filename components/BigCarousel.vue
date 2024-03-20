<template>
  <carousel
    :perPageCustom="[
      [375, 1],
      [768, 2],
      [1024, 3],
      [1264, 3],
      [1904, 4],
    ]"
    autoplay
    :autoplayTimeout="watchingTime"
    :loop="true"
  >
    <slide
      v-for="(item, index) in events"
      v-bind:key="index"
      style="padding: 1rem"
    >
      <div v-if="loading">
        <v-skeleton-loader
          class="mb-3"
          max-width="400"
          height="300"
          type="card"
          elevation="2"
        ></v-skeleton-loader>
      </div>

      <div v-if="!loading">
        <v-hover v-slot="{ hover }">
          <v-card
            class="mb-2 slider-card text-center"
            style="overflow: hidden"
            :color="monthsColors[index]"
            elevation="4"
            @click="openTimeline(index)"
          >
            <div>
              <img
                :src="imgPath + item.imageSrc"
                loading="lazy"
                height="270"
                :style="!hover ? 'flex-shrink: 0; min-width: 100%; min-height: 100%' : 'flex-shrink: 0; min-width: 100%; min-height: 100%;filter: blur(1px);'"
              />
              <v-card-text :style="!hover ? 'color: white;' : 'color: white; opacity: 0.7; back'" class="pa-1 pt-0">
                <h3 class="headline carousel-month">
                  <!-- {{ item.date.substring(5,7) }} -->
                  {{ months[parseInt(item.date.substring(5,7)) - 1] }}
                  <!-- {{ months[new Date(item.date).getMonth()] }} -->
                  <!-- {{ new Date(item.date).getMonth()}} -->
                </h3>
              </v-card-text>
            </div>
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out v-card--reveal display-3 white--text pa-2 "
                style="height: 100%; opacity: 0.89;"
              >
                <h1 :style="'background-color: ' + monthsColors[index]" class="display-1 showText">{{ item.titleEvent }}</h1>
              </div>
            </v-expand-transition>
          </v-card>
        </v-hover>
      </div>
    </slide>
  </carousel>
</template>

<script>
import Carousel from "vue-carousel/src/Carousel.vue";
import Slide from "vue-carousel/src/Slide.vue";

export default {
  components: {
    Carousel,
    Slide,
  },
  data: () => ({
    slidesPerView: 1,
    imgPath: process.env.imgPath,
    watchingTime:4500,
    monthsColors : [
      '#317872',//'#4e0b6c',
      '#317872',//'#4e0b6c',
      '#317872',//'#4e0b6c',
      '#f9ac42',//'#ef3636',
      '#f9ac42',//'#ef3636',
      '#f9ac42',//'#ef3636',
      '#614051',//'#d78d11',
      '#614051',//'#d78d11',
      '#614051',//'#d78d11',
      '#87371f',//'#1dd3cf',
      '#87371f',//'#1dd3cf',
      '#87371f',//'#1dd3cf',
    ],
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  }),
  props: {
    //monthsColors:{
    //  type: Array,
    //},
    events: {
      type: Array,
    },
    //watchingTime:{
    //  type: Number,
    //},
    loading: {
      type: Boolean,
    },
  },
  methods: {
    openTimeline(index) {
      this.$parent.openTimeline(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-carousel {
  height: 200px;
  width: 20vw;
  @media screen and (min-width: 0px) and (max-width: 768px) {
    width: 92vw;
  }
}

.slider-card {
  @media screen and (max-width: 599px) {
    max-width: 319px;
  }
  @media screen and (min-width: 600px) and (max-width: 959px) {
    max-width: 340px;
  }
  @media screen and (min-width: 960px) and (max-width: 1263px) {
    max-width: 260px;
  }
  @media screen and (min-width: 1264px) and (max-width: 1903px) {
    max-width: 355px;
  }
  @media screen and (min-width: 1904px) {
    max-width: 400px;
  }
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  //opacity: .8;
  position: absolute;
  width: 100%;
}

.carousel-month {
  letter-spacing: 5px !important;
}

::v-deep .VueCarousel-dot-container {
  margin-top: 0px !important;
}

::v-deep .VueCarousel-dot {
  margin-top: 0px !important;
}

  .showText{
    opacity: 0.9;
    width : 100%;
    border-radius: 8px;
    font-size: 1.3rem !important;
  }
</style>
