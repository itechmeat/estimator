export const actions = {
  async nuxtClientInit({ dispatch }) {
    await dispatch('projects/fetchProjects')
  },
  //
  // async nuxtServerInit({ dispatch }) {
  //   await dispatch('auth/fetchUser', null, { root: true })
  // },
}
