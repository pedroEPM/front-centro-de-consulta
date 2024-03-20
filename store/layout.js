export const state = () => ({
    workbenchDrawer: false,
  })
  
  export const mutations = {
    setWorkbench(state, mode) {
        state.workbenchDrawer = mode
    },
  }