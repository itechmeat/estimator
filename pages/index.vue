<template>
  <section>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <n-link :to="project.id">
          {{ project.name }}
        </n-link>
        <span />
        <button @click="edit(project.id)">Edit</button>
        <button @click="remove(project.id)">Delete</button>
      </li>
    </ul>

    <form v-if="editedProject" @submit.prevent="save">
      <div>
        <input v-model="editedProject.name" />
      </div>

      <div>
        <input v-model="editedProject.description" />
      </div>

      <div>
        <input v-model="editedProject.hourCost" type="number" />
      </div>

      <button type="submit">saveProject</button>
    </form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_PROJECTS, GET_PROJECT_BY_ID } from '@/store/projects/types'

const EMPTY_PROJECT = {
  name: null,
  description: null,
  logo: null,
  hourCost: null,
}

export default {
  name: 'HomePage',

  data: () => ({
    editedProject: null,
  }),

  computed: {
    ...mapGetters('projects', {
      projects: GET_PROJECTS,
      project: GET_PROJECT_BY_ID,
    }),
  },

  mounted() {
    this.clear()
  },

  methods: {
    ...mapActions('projects', ['saveProject', 'deleteProject']),

    save() {
      this.saveProject(this.editedProject)
      this.clear()
    },

    edit(id) {
      this.editedProject = { ...this.project(id) }
    },

    remove(id) {
      this.deleteProject(id)
      this.clear()
    },

    clear() {
      this.editedProject = { ...EMPTY_PROJECT }
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  margin: 40px 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 3px rgba(#000, 0.2);

  span {
    flex: 1;
  }

  button {
    margin-left: 4px;
  }
}
</style>
