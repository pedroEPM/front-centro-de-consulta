export const state = () => ({
    enableNotes: true,
    enableImages: true,
    enablePDF: true,
    isLogged: false
  })
  
  export const mutations = {
    hasUser(state, log){
        state.isLogged = log;
    },
    async getPermissions(state) {
        try {
            const response = await this.$axios.$get("/users/" + localStorage.user_idC, {
                headers: { Authorization: "Bearer " + localStorage.tokenC }});
            response.data.permissions[0].permissions.forEach((x) => {
            if (x == "60d47ee00f82f40014419ae5") {
                state.enableNotes = true;
                state.enableImages = true;
                state.enablePDF = true;
            }
            switch (x) {
                case "60d47eec0f82f40014419ae6":
                state.enableNotes = true;
                break;
                case "60d47ef70f82f40014419ae7":
                state.enableImages = true;
                break;
                case "60d47f290f82f40014419ae8":
                state.enablePDF = true;
                break;
            }
            });
            state.isLogged = true;
        } catch (error) {
            console.log(error);
        }
    },
  }