import Dexie from 'dexie'
import uuid from 'uuid/v4'

import * as TYPES from './types'

// const task = [
//   '++id',
//   'projectId',
//   'parentTaskId',
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
//   'order',
//   'createdAt',
//   'updatedAt',
// ]

const db = new Dexie('estimator')
db.version(1).stores({
  projects: '++id',
  tasks: '++id,projectId',
})

export const state = () => ({
  isLoading: false,
  projects: [],
  tasks: [],
})

export const getters = {
  [TYPES.GET_LOADING]: (state) => state.isLoading,
  [TYPES.GET_PROJECTS]: (state) => state.projects,
  [TYPES.GET_PROJECT_BY_ID]: (state) => (id) => {
    return state.projects.find((project) => project.id === id)
  },
  [TYPES.GET_TASKS]: (state) => state.tasks,
  [TYPES.GET_TASK_BY_ID]: (state) => (id) => {
    return state.tasks.find((task) => task.id === id)
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

  [TYPES.SET_TASKS]: (state, payload) => {
    payload.sort((a, b) => a.order - b.order)
    state.tasks = payload
  },
}

export const actions = {
  fetchProjects({ commit }) {
    db.projects.toArray((res) => {
      commit(TYPES.SET_PROJECTS, res)
    })
  },

  saveProject({ dispatch }, project) {
    const newProject = mergeRequiredKeys(project)

    db.projects
      .put(newProject)
      .then(() => {
        dispatch('fetchProjects')
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('createProject: ' + error)
      })
  },

  deleteProject({ dispatch }, id) {
    db.projects.delete(id)
    dispatch('fetchProjects')
  },

  fetchTasks({ commit }, projectId) {
    db.tasks
      .where('projectId')
      .equals(projectId)
      .toArray((res) => {
        commit(TYPES.SET_TASKS, res)
      })
  },

  saveTask({ dispatch }, task) {
    const newTask = mergeRequiredKeys(task)

    db.tasks
      .put(newTask)
      .then(() => {
        dispatch('fetchTasks')
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('saveTask: ' + error)
      })
  },

  deleteTask({ dispatch }, id) {
    db.tasks.delete(id)
    dispatch('fetchTasks')
  },
}

function mergeRequiredKeys(obj) {
  const now = new Date().toUTCString()

  const newObj = {
    ...obj,
    updatedAt: now,
  }

  if (!newObj.createdAt) {
    newObj.createdAt = now
  }

  if (!newObj.id) {
    newObj.id = uuid()
  }

  return newObj
}
