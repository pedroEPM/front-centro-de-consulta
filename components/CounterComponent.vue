<template>

</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    // props : {
    //   advObj : {
    //     type : Object,
    //     default : {}
    //   }
    // },
    methods : {
    ...mapActions([ 'getData', 'getCount' ]),

      async getPagination() {
        try {
          let busquedaAnterior = this.$parent.advObj;
          this.$parent.pages = [];
          this.$parent.totalPages = 1;
          this.$parent.page = 1;
          this.$parent.elementsCounter = '"Contando"';
          const axiosSource = this.$axios.CancelToken.source();
          this.$parent.request2 = { cancel: axiosSource.cancel, msg: "Loading..." };

          //this.$parent.hasElements = true;
          ////console.log(JSON.parse(atob(this.$parent.$route.query.search)));

          //guardando fecha------------
          //cambiando fecha a fecha de busqueda---------
          let response
          if ( (this.$parent.advObj.allwords || this.$parent.advObj.keysentence || this.$parent.advObj.keywords || this.$parent.advObj.ignoredwords ) && this.$parent.mode != 2){

            let auxdate = this.$parent.advObj.date
            let auxdaterange = this.$parent.advObj.dateRange
            this.$parent.advObj.date = (this.$parent.advObj.date) ? this.$parent.advObj.date : null //new Date('2015-12-31')
            this.$parent.advObj.dateRange = (this.$parent.advObj.dateRange) ? this.$parent.advObj.dateRange : null // new Date('2015-01-01')
            const aux0 = (auxdate)? auxdate.split('-') : ['2015']
            let auxdate2 = aux0[0]
            let totalfound = 0
            let fianlresponse
            let forend = (auxdaterange) ? auxdaterange.split('-') : [1988]
            for(this.$parent.counterFor = 100; this.$parent.counterFor <100; this.$parent.counterFor = this.$parent.counterFor + 1 ){

              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }

              this.$parent.advObj.date = auxdate2+'-12-31'
              this.$parent.advObj.dateRange = auxdate2+'-01-01'

              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }
              const params = {
                  x: 0,
                  search: this.$parent.advObj.search,
                  allwords: this.$parent.advObj.allwords,
                  keywords: this.$parent.advObj.keywords,
                  keysentence: this.$parent.advObj.keysentence,
                  publicationRef: this.$parent.advObj.publicationRef,
                  noteBookRef: this.$parent.advObj.noteBookRef,
                  date: this.$parent.advObj.date,
                  dateRange: this.$parent.advObj.dateRange,
                  key: this.$parent.advObj.key,
                  firstTimeSearch: true,
                  quantity: "",
                  ordenamiento: this.$parent.sort,
                  searchId : localStorage.user_idC,
                  totalResults : this.$parent.totalResult,
                  ignoredwords : this.$parent.advObj.ignoredwords,
                  searchCompleted : this.$parent.cancelFor || this.$parent.counterFor == 100 ? true : false
                };
              this.$store.commit('setParams', params);
              await this.getCount();
              //console.log(this.$store.state.response);
              //console.log('Conteo rápido')
              let responseaux = this.$store.state.response;
              // let responseaux = await this.$axios.$get("/AdvanceSearch", {
              //   params: params,
              //   headers: { Authorization: "Bearer " + localStorage.tokenC },
              //   cancelToken : axiosSource.token,
              // });

              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }

              //responseaux
              //e.data.CountNotes) { fianlresponse.data.CountNotes + (responseaux.data.CountNotes || 0 ) }
              //e.data.CountImages) { fianlresponse.data.CountImages + (responseaux.data.CountImages || 0 ) }
              //if (fianlresponse.data.Countpdfs) { fianlresponse.data.Countpdfs + (responseaux.data.Countpdfs || 0 ) }
              totalfound = Number(totalfound) + (Number(responseaux.data.CountNotes) || 0)

              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }

              totalfound = Number(totalfound) + (Number(responseaux.data.CountImages) || 0)
              totalfound = Number(totalfound) + (Number(responseaux.data.Countpdfs) || 0)
              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }
              this.$parent.elementsCounter = totalfound + ' Buscando '

              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }

              auxdate2 = auxdate2 - 1
              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }
              this.$parent.totalPages = Math.ceil(Number(totalfound) / this.$parent.totalResult) > 0 ? Math.ceil(Number(totalfound) / this.$parent.totalResult) : 1;
              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }
              this.$parent.generateArrayPages(this.$parent.totalPages);
              // this.$parent.generateArrayPages(Number(totalfound))
              this.$parent.counterFor = (auxdate2 < Number(forend[0]) ) ? 101 : this.$parent.counterFor
              if( this.$parent.cancelFor ){
                this.$parent.cancelarPro();
                break;
              }
            }
            response = {
              data:{
                CountImages: totalfound,
                CountNotes: totalfound,
                Countpdfs: totalfound,
              }
            }
            this.$parent.advObj.dateRange = auxdaterange
            this.$parent.advObj.date = auxdate
          } else {
            response = await this.$axios.$get("/AdvanceSearch", {
              params: {
                x: 0,
                search: this.$parent.advObjNotMove.search,
                allwords: this.$parent.advObjNotMove.allwords,
                keywords: this.$parent.advObjNotMove.keywords,
                keysentence: this.$parent.advObjNotMove.keysentence,
                publicationRef: this.$parent.advObjNotMove.publicationRef,
                noteBookRef: this.$parent.advObjNotMove.noteBookRef,
                date: this.$parent.advObjNotMove.date,
                dateRange: this.$parent.advObjNotMove.dateRange,
                key: this.$parent.advObjNotMove.key,
                firstTimeSearch: true,
                quantity: "",
                ordenamiento: this.$parent.sort,
                searchId : localStorage.user_idC,
                totalResults : this.$parent.totalResult,
                ignoredwords : this.$parent.advObjNotMove.ignoredwords
              },
              // timeout: 30,
              headers: { Authorization: "Bearer " + localStorage.tokenC },
              cancelToken : axiosSource.token,
            });
          }
          switch (this.$parent.mode) {
            case 1:
              this.$parent.elementsCounter = response.data.CountNotes != null && response.data.CountNotes != undefined ? response.data.CountNotes : 0;

              if (this.$parent.elementsCounter > 0) {
                this.$parent.hasElements = true;
              }else{
                this.$parent.hasElements = false;
              }
              //this.$parent.totalPages = Math.ceil(response.data.CountNotes / 20);
              this.$parent.totalPages = (this.$parent.elementsCounter > this.$parent.totalResult) ? Math.ceil(this.$parent.elementsCounter / this.$parent.totalResult) : 1;
              this.$parent.totalPages = this.$parent.totalPages != null && this.$parent.totalPages != undefined ? this.$parent.totalPages : 1;
              this.$parent.generateArrayPages(this.$parent.totalPages);
              break;

            case 2:
              this.$parent.elementsCounter = response.data.CountImages != undefined && response.data.CountImages != null ? response.data.CountImages : 0;
              if (this.$parent.elementsCounter > 0) {
                this.$parent.hasElements = true;
              }else{
                this.$parent.hasElements = false;
              }
              this.$parent.totalPages = (this.$parent.elementsCounter > this.$parent.totalResult) ? Math.ceil(this.$parent.elementsCounter / this.$parent.totalResult) : 1;
              //this.$parent.totalPages = Math.ceil(response.data.CountImages / this.$parent.totalResult);
              this.$parent.totalPages = this.$parent.totalPages != null && this.$parent.totalPages != undefined ? this.$parent.totalPages : 1;
              this.$parent.generateArrayPages(this.$parent.totalPages);
              break;

            case 3:
              this.$parent.elementsCounter = response.data.Countpdfs != undefined && response.data.Countpdfs != null ? response.data.Countpdfs : 0;
              if (this.$parent.elementsCounter > 0) {
                this.$parent.hasElements = true;
              }else{
                this.$parent.hasElements = false;
              }
              this.$parent.totalPages = (this.$parent.elementsCounter > this.$parent.totalResult) ? Math.ceil(this.$parent.elementsCounter / this.$parent.totalResult) : 1;
              //this.$parent.totalPages = Math.ceil(response.data.Countpdfs / this.$parent.totalResult);
              this.$parent.totalPages = this.$parent.totalPages != null && this.$parent.totalPages != undefined ? this.$parent.totalPages : 1;
              this.$parent.generateArrayPages(this.$parent.totalPages);
              break;
          }
          this.$parent.cancelFor = false;
          setTimeout(() => {
            this.$parent.advObj = busquedaAnterior;
          }, 1);
        } catch (error) {
          //console.log(error)
          //console.log(error.response)
          this.$parent.cancelFor = false;
          // this.elementsCounter = 0;
        }
      },
    }
  }
</script>

<style>

</style>
