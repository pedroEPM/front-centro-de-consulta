export const state = () => ({
  currentItem: null,
  searchedItems: [],
});

export const mutations = {
  setCurrent(state, id) {
    state.currentNote = id;
  },
  setSearched(state, payload) {
    //console.log(payload)
    state.searchedItems = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
