<template>
  <div class="project-page">
    <header v-if="projectData">
      <h1>{{ projectData.name }}</h1>
      <p>{{ projectData.description }}</p>
    </header>

    <ul>
      <draggable v-model="visibleTasks">
        <transition-group>
          <li v-for="task in visibleTasks" :key="task.id">
            <b>{{ task.name }}</b>
            <span />
            <button @click="edit(task.id)">Edit</button>
            <button @click="remove(task.id)">Delete</button>
          </li>
        </transition-group>
      </draggable>
    </ul>

    <form v-if="editedTask" @submit.prevent="save">
      <div>
        <input v-model="editedTask.name" />
      </div>

      <div>
        <input v-model="editedTask.description" />
      </div>

      <div>
        <input v-model="editedTask.hourCost" type="number" />
      </div>

      <button type="submit">saveTask</button>
    </form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions, mapGetters } from 'vuex'
import {
  GET_PROJECT_BY_ID,
  GET_TASKS,
  GET_TASK_BY_ID,
} from '~/store/projects/types'

const EMPTY_TASK = {
  projectId: null,
  parentTaskId: null,
  order: 0,
  name: null,
  description: null,
  date: null,
  valuationTimeMin: null,
  valuationTimeMax: null,
  factTime: null,
  hourCost: null,
  status: null,
  comments: null,
  screenshots: null,
}

export default {
  name: 'ProjectPage',

  components: {
    draggable,
  },

  data: () => ({
    editedTask: null,
  }),

  computed: {
    ...mapGetters('projects', {
      project: GET_PROJECT_BY_ID,
      tasks: GET_TASKS,
      task: GET_TASK_BY_ID,
    }),

    projectData() {
      return this.project(this.$route.params.project)
    },

    visibleTasks: {
      get() {
        return this.tasks
      },
      set(value) {
        this.updateTasks(value)
      },
    },
  },

  watch: {
    projectData: {
      immediate: true,
      handler(val) {
        if (!val || !val.id) {
          return
        }

        this.fetchTasks(val.id)
      },
    },

    tasks: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }

        this.clear()
      },
    },
  },

  methods: {
    ...mapActions('projects', [
      'saveTask',
      'deleteTask',
      'fetchTasks',
      'updateTasks',
    ]),

    save() {
      this.saveTask(this.editedTask)
      this.clear()
    },

    edit(id) {
      this.editedTask = { ...this.task(id) }
    },

    remove(id) {
      this.deleteTask(id)
      this.clear()
    },

    clear() {
      this.editedTask = { ...EMPTY_TASK }

      if (!this.projectData) {
        return
      }

      this.editedTask.hourCost = this.projectData.hourCost
      this.editedTask.projectId = this.projectData.id
      this.editedTask.order = (this.visibleTasks.length + 1) * 10
    },
  },
}
</script>

<style lang="scss" scoped>
$block: '.project-page';

#{$block} {
  display: block;

  header {
    margin: 40px 0;
  }

  h1 {
    margin: 0;
    font-size: 2em;
  }

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
}
</style>
