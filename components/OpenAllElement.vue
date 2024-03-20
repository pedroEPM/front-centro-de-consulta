<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <!--<div class="container" id="app">

      <div class="list-group-wrapper">
        <transition name="fade">
          <div class="loading" v-show="loading">
            <span class="fa fa-spinner fa-spin"></span> Loading
          </div>
        </transition>
        <ul class="list-group" id="infinite-list">
          <li class="list-group-item" v-for="(item, index) in items" v-text="item" :key="index"></li>
        </ul>
      </div>

    </div>-->
    <v-card color="#F5F5F5">
      <v-card-title class="pa-0">
        <v-toolbar dark color="secondary">
          <v-icon>mdi-newspaper-variant-outline</v-icon>
          <v-spacer />
          {{ elementsCounter }} Resultados
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card flat v-if="loading" color="#F5F5F5" >
        <v-card-text class=text-center>Cargando</v-card-text>
        <v-card-text class=text-center>
          <v-progress-circular
            :rotate="-90"
            :size="100"
            :width="15"
            :value="value"
            color="primary"
          > {{ Math.ceil(value) }}</v-progress-circular>
        </v-card-text>
      </v-card>

      <v-card-text id="infinite-list">
        <v-container grid-list-xl>
          <ContentNoteCardPrint v-for="(item, index) in notes" :key="index"

            :title="item.title"
            :content="item.content"
            :id="item.id"
            :publishDate="item.publishDate"
            :section="item.section"
            :taked="item.taked"
            :agency="item.agency"
            :page="item.page"
            :material="item.material"
            :published="item.published"
            :selleable="item.selleable"
            :relatedPDFs="item.relatedPDFs != undefined || item.relatedPDFs != null ? item.relatedPDFs : []"
            :fontSize="item.fontSize"
            :fontColor="item.textColor"
            :icon="item.icon"
            :subTitle="item.subTitleN"
            :author="item.author"
            :observations="item.observations"
            :locationChanged="item.locationChanged"
            :isPrint="false"
          />
        </v-container>
        <v-container grid-list-xl>
          <ContentImageCardPrint v-for="(item, index) in images" :key="index"
            :forceOpen="true"
            :description="item.description"
            :id="item.id"
            :section="item.section"
            :taked="item.taked"
            :location="item.location"
            :agency="item.agency"
            :clasification="item.clasification"
            :photographer="item.photographer"
            :page="item.page"
            :material="item.material"
            :published="item.published"
            :selleable="item.selleable"
            :pixel="item.pixel"
            :observations="item.observations"
            :image="item.image"
            :imageTitle="item.description != undefined ? item.description : ''"
            :publicationName="
              item.publicationRef != undefined
                ? item.publicationRef.publicationName
                : null
            "
            :notebookName="item.section"
            :icon="item.icon"
            :publishDate="
              item.publishDate != undefined
                ? new Date(item.publishDate).toISOString().substring(0, 10)
                : null
            "
            :isPrint="false"
            :relatedPDFs="item.relatedPDFs != undefined || item.relatedPDFs != null ? item.relatedPDFs : []"
          />
        </v-container>
        <v-container grid-list-xl>
          <ContentPDFCardPrint v-for="(item, index) in pdfs" :key="index"
            :forceOpen="true"
            :title="item.title"
            :image="imgPath + item.imageSrc"
            :id="item._id"
            :publishDate="item.dateCreation"
            :section="
              item.notebook != undefined
                ? item.notebook.NoteBookName
                : null
            "
            :taked="null"
            :agency="
              item.publication != undefined
                ? item.publication.publicationName
                : ''
            "
            :page="item.page"
            :material="null"
            :published="item.published"
            :selleable="item.selleable"
            :relatedPDFs="item.relatedPDFs != undefined || item.relatedPDFs != null ? item.relatedPDFs : []"
            :icon="
              item.publication != undefined
                ? item.publication.icon
                : ''
            "
            :catalogingInstitution="item.catalogingInstitution != undefined || item.catalogingInstitution != null ? item.catalogingInstitution : '' "
            :language="item.language != undefined || item.language != null ? item.language : '' "
            :imprint="item.imprint != undefined || item.imprint != null ? item.imprint : '' "
            :director="item.director != undefined || item.director != null ? item.director : '' "
            :localSeries="item.localSeries != undefined || item.localSeries != null ? item.localSeries : '' "
            :isPrint="false"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

  //if (this.$route.path == "/advSearch")
  import ContentNoteCardPrint from '~/components/ContentNoteCardPrint.vue';
  import ContentImageCardPrint from '~/components/ContentImageCardPrint.vue';
  import ContentPDFCardPrint from '~/components/ContentPDFCardPrint.vue';
  export default {
    components : {
      ContentNoteCardPrint,
      ContentImageCardPrint,
      ContentPDFCardPrint
    },
    data(){
      return {
        imgPath: process.env.imgPath,
        dialog : false,
        loading: false,
        value : 0,
        nextItem: 1,

        page2 : null,
        index2 : null,

        enable : true,
        firstTime : false,
        listElm : null,
        items: [],

        notes : [],
        images : [],
        pdfs : [],
        elementsCounter : 0,
      }
    },
    props : {
      index : {
        type : Number
      },
      page : {
        type : Number
      },
      mode : {

      },
      advSearch : {

      }
    },
    watch : {
      dialog( newV, oldV ){
        if( !newV && oldV ){

        }
      }
    },
    methods: {
      async openDialog(){
        this.loading = true;
        this.value = 0;
        this.elementsCounter = 0;
        this.items = [];
        this.notes = [];
        this.images = [];
        this.pdfs = [];
        this.firstTime = false;
        this.enable = true;
        this.page2 = this.page;
        this.index2 = this.index;


        this.nextItem = 1;
        this.dialog = true;
        if( this.$route.path == "/advSearch" ){
          await this.getAdvSearch();
        }else if( this.$route.query.searched != undefined ){
          await this.getSearch();
        }
        this.loading = false;
        /*setTimeout(() => {
          this.enableInfiniteScroll();
        }, 100);*/
      },
      async getSearch(){
        try {
          let mode = '';
          switch(Number(this.$route.query.mode)){
            case 2:
              mode = 'Imagenes';
            break;
            case 3:
              mode = 'PDFs';
            break;
          }
          const response = await this.$axios.$get("/SampleSearch", {
            params: {
              sentence: this.$route.query.searched,
              filter: mode,
              quantity: this.page2,
              ordenamiento: 10,
              searchId : localStorage.user_idC,
            },
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          });

          const datas = response.data.foundItems;
          if(datas.length == 0){
            this.enable = false;
          }

          switch(Number(mode)){
            default:
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getNote(datas[i]);
                this.elementsCounter = this.notes.length;
              }
            break;
            case 2:
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getImage(datas[i]);
                this.elementsCounter = this.images.length;
              }
            break;
            case 3:
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getPDF(datas[i]);
                this.elementsCounter = this.pdfs.length;
              }
            break;
          }
          this.loading = false;

          this.index2 = 0;
          this.page2 = this.page2 + 1;
          //this.loading = false;

          if( this.enable && this.dialog ){
            await this.getSearch()

          }
        } catch (error) {

        }
      },
      async getAdvSearch() {
        try {
          //console.log(this.advSearch)
          const response = await this.$axios.$get("/AdvanceSearch", {
            params: {
              x: 0,
              search: this.advSearch.search,
              allwords: this.advSearch.allwords,
              keywords: this.advSearch.keywords,
              keysentence: this.advSearch.keysentence,
              publicationRef: this.advSearch.publicationRef,
              noteBookRef: this.advSearch.noteBookRef,
              date: this.advSearch.date,
              dateRange: this.advSearch.dateRange,
              key: this.advSearch.key,
              firstTimeSearch: this.advSearch.firstTimeSearch,
              quantity: this.page2,
              ordenamiento: this.sort,
              searchId : localStorage.user_idC,
            },
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          });

          const datas = response.data.foundItems;
          if(datas.length == 0){
            this.enable = false;
          }
          /*datas.forEach( ( item, index ) => {
            this.getNote( item );
          });*/

          //console.log(this.index2 + ' ' + this.page2)
          switch(this.advSearch.search){
            case "Notas":
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getNote(datas[i]);
                this.elementsCounter = this.notes.length;
              }
            break;
            case "Imagenes":
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getImage(datas[i]);
                this.elementsCounter = this.images.length;
              }
            break;
            case "PDFs":
              for(let i = this.index2; i < datas.length; i++){
                this.value = ( ( i + 1 ) * 100 ) / ( datas.length + 1 );
                await this.getPDF(datas[i]);
                this.elementsCounter = this.pdfs.length;
              }
            break;
          }

          this.index2 = 0;
          this.page2 = this.page2 + 1;
          this.loading = false;

          if( this.enable && this.dialog ){
            await this.getAdvSearch()

          }

        } catch (error) {
          //console.log('This is the error')
          //console.log(error)
        }

      },
      async getPDF( data ){
        try {
          const pdf = {};
          const response = await this.$axios.$get("/pdfs/" + data._id, {
            headers: { Authorization: "Bearer " + localStorage.tokenC },
          });
          pdf.title = response.data.pdf.title;
          pdf.imageSrc = response.data.pdf.imageSrc;
          pdf._id = response.data.pdf._id;
          pdf.dateCreation = response.data.pdf.dateCreation;
          pdf.notebook = response.data.pdf.notebook;
          pdf.publication = response.data.pdf.publication;
          pdf.page = response.data.pdf.page;
          pdf.published = response.data.pdf.published;
          pdf.selleable = response.data.pdf.selleable;
          pdf.publication = response.data.pdf.publication;
          pdf.catalogingInstitution = response.data.pdf.catalogingInstitution;
          pdf.language = response.data.pdf.language;
          pdf.imprint = response.data.pdf.imprint;
          pdf.director = response.data.pdf.director;
          pdf.localSeries = response.data.pdf.localSeries;
          pdf.relatedPDFs = response.data.relatedPDFs;

          this.pdfs.push(pdf);
        } catch (error) {

        }
      },
      async getImage( data ) {
        const img = {};
        const response = await this.$axios.$get("/images/" + data._id, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        const datas = response.data;
        //console.log(datas)

        img.observations = datas.image.observations;
        img.title = datas.image.ImageTitle;
        img.description = datas.image.description;
        img.image = datas.image.imageSrc;

        img.id = datas.image._id;
        img.publishDate = datas.image.publicationDate;
        img.section = datas.image.noteBookRef != undefined
                  ? datas.image.noteBookRef.NoteBookName
                  : null;
        img.taked = datas.image.date != undefined
                  ? new Date(datas.image.date).toISOString().substring(0, 10)
                  : null;
        img.location = datas.image.place;
        img.photographer = datas.image.photographer;
        img.clasification = datas.image.clasification;
        img.agency = datas.image.publicationRef != undefined
                  ? datas.image.publicationRef.publicationName
                  : null;
        img.page = datas.image.page;
        img.icon = datas.image.publicationRef != undefined
                  ? datas.image.publicationRef.icon
                  : null;

        img.selleable = datas.image.isSelleable;
        img.published = datas.image.isPublished;


        img.pixelS = datas.image.pixels != undefined ? datas.image.pixels : await this.getPixel();
        img.relatedPDFs = datas.relatedPDF != undefined || datas.relatedPDF != null ? datas.relatedPDF : [];

        this.images.push(img);
      },
      async getNote( data ) {

        let note = {};
        const response = await this.$axios.$get("/notes/" + data._id, {
          headers: { Authorization: "Bearer " + localStorage.tokenC },
        });
        note.id = response.data.note._id;

        note.author = response.data.note.originalAuthor;
        note.observations = response.data.note.observations;
        note.published = response.data.note.isPublished;
        note.selleable = response.data.note.isSelleable;

        note.title = response.data.note.title;
        // note.title = this.$parent.$parent.$parent.getPlainText( response.data.note.title );
        note.title = note.title.replaceAll('</b>', '""');
        note.title = note.title.replaceAll('<b>', '""');

        if (response.data.note.content != undefined) {

          var tempContent = response.data.note.content;
          tempContent = tempContent.replaceAll(
            /\n/g, '<br>'
          );

          if (this.$route.path == "/advSearch") {
            let advSearch = JSON.parse(atob(this.$route.query.search));

            const regex = /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
            let searchString =
              advSearch.allwords != undefined ? advSearch.allwords : "";
            searchString = searchString.replace(/ +(?= )/g, "");
            let result = searchString.replace(regex, "");
            let words = result.split(" ");
            for (var i = 0; i < words.length; i++) {
              if (words[i] == "") {
                words.splice(i, 1);
              }
            }

            if (advSearch.keysentence != undefined) {
              note.author = this.$parent.$parent.$parent.addStrongKeySetence( note.author, advSearch.keysentence );
              tempContent = this.$parent.$parent.$parent.addStrongKeySetence( tempContent, advSearch.keysentence );
            }

            if(advSearch.keywords != undefined) {

                note.author = this.$parent.$parent.$parent.addStrongText( note.author, advSearch.keywords );
                tempContent = this.$parent.$parent.$parent.addStrongText( tempContent, advSearch.keywords );
            }

            words.forEach((element) => {
              note.author = this.$parent.$parent.$parent.addStrongText( note.author, element );

              tempContent = this.$parent.$parent.$parent.addStrongText( tempContent, element );
            });

            note.content = tempContent;

          } else if (this.$route.query.searched != undefined) {
            const regex = /(?:(a|en|por|de|el|la|los|las|un|uno|unas|unos|una|lo|al|del) +)/gi;
            let searchString = this.$route.query.searched;
            searchString = searchString.replace(/ +(?= )/g, "");
            let result = searchString.replace(regex, "");
            let words = result.split(" ");
            for (var i = 0; i < words.length; i++) {
              if (words[i] == "") {
                words.splice(i, 1);
              }
            }

            words.forEach((element) => {

              var regEx = new RegExp(element, "ig");
              note.author = this.$parent.$parent.$parent.addStrongText( note.author, element );
              tempContent = this.$parent.$parent.$parent.addStrongText( tempContent, element );
            });

            note.content = tempContent;
          } else {
            note.content = tempContent;
          }
        }
        note.publishDate = response.data.note.date;

        if (response.data.note.noteBookRef != undefined) {
          note.section = response.data.note.noteBookRef.NoteBookName.toUpperCase();
        }
        if (response.data.note.publicationRef != undefined) {
          note.agency = response.data.note.publicationRef.publicationName.toUpperCase();
          note.icon = response.data.note.publicationRef.icon;
        }
        note.page = response.data.note.page;

        note.relatedPDFs = response.data.relatedPDF;



        note.content = note.content;
        // note.content = this.$parent.$parent.$parent.getPlainText( note.content );
        // note.content = this.$parent.$parent.$parent.getParaph(note.content);
        // note.content = note.content.replaceAll('<br><br>', '<br>');
        note.subTitleN = response.data.note.subTitle ;
        // note.subTitleN = this.$parent.$parent.$parent.getPlainText( response.data.note.subTitle );

        this.notes.push(note);
      },

      async getPixel( imageSrc ){
        const img = new Image();
        let pixelS = '';
        try {
          img.src = this.imgPath + imageSrc;
          img.onload = () => {
            pixelS = img.width + ' x ' + img.height;
          }
        } catch (error) {
          //console.log(error);
        }
        return pixelS;
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
