import Dexie from 'dexie'
import uuid from 'uuid/v4'

import * as TYPES from './types'

// const fields = [
//   '++id',
//   'name',
//   'description',
//   'milestone',
//   'date',
//   'valuationTimeMin',
//   'valuationTimeMax',
//   'factTime',
//   'hourCost',
//   'status',
//   'comments',
//   'screenshots',
//   'createdAt',
//   'updatedAt',
// ]

const db = new Dexie('estimator')
db.version(1).stores({
  projects: '++id',
  estimations: '++id',
})

export const state = () => ({
  isLoading: false,
  projects: [],
})

export const getters = {
  [TYPES.GET_LOADING]: (state) => state.isLoading,
  [TYPES.GET_PROJECTS]: (state) => state.projects,
  [TYPES.GET_PROJECT_BY_ID]: (state) => (id) => {
    return state.projects.find((project) => project.id === id)
  },
}

export const mutations = {
  [TYPES.SET_LOADING]: (state, payload) => {
    state.isLoading = payload
  },

  [TYPES.SET_PROJECTS]: (state, payload) => {
    payload.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    state.projects = payload
  },
}

export const actions = {
  fetchProjects({ commit }) {
    db.projects.toArray((res) => {
      commit(TYPES.SET_PROJECTS, res)
    })
  },

  saveProject({ dispatch }, project) {
    const now = new Date().toUTCString()

    const newProject = {
      ...project,
      updatedAt: now,
    }

    if (!newProject.createdAt) {
      newProject.createdAt = now
    }

    if (!newProject.id) {
      newProject.id = uuid()
    }

    db.projects
      .put(newProject)
      .then(() => {
        // Then when data is stored, read from it
        dispatch('fetchProjects')
      })
      .catch(function (error) {
        // eslint-disable-next-line no-console
        console.error('createProject: ' + error)
      })
  },

  deleteProject({ dispatch }, id) {
    db.projects.delete(id)
    dispatch('fetchProjects')
  },
}
