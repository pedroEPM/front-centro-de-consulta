export const state = () => ({
  currentNote: null,
})

export const mutations = {
  setCurrent(state, id) {
    //console.log(id)
      state.currentNote = id
  },
}