<template>
  <div
    ref="list"
    :class="classes"
    @dragover.prevent
    @drop.stop.prevent="handleDrop"
  >
    <div v-if="visibleTasks" class="tasks__list">
      <TaskGap :index="0" :active="newIndex === 0" :hidden="!isDragActive" />

      <template v-for="(task, index) in visibleTasks">
        <Task
          :key="index * 2 + 1"
          :index="index"
          :value="task"
          :active="index === parentIndex"
          :protected="isDragActive"
          @edit="save"
          @delete="remove"
        />

        <TaskGap
          :key="index * 2 + 2"
          :index="index + 1"
          :active="newIndex === index + 1 || parentIndex === index"
          :hidden="!isDragActive"
        />
      </template>
    </div>

    <br />
    <br />

    <form v-if="editedTask" @submit.prevent="save(editedTask)">
      <div>
        <input v-model="editedTask.name" placeholder="name" />
      </div>

      <div>
        <input v-model="editedTask.description" placeholder="description" />
      </div>

      <div>
        <input v-model="editedTask.hourCost" type="number" placeholder="cost" />
      </div>

      <button type="submit">saveTask</button>
    </form>
  </div>
</template>

<script>
import Task from '@/components/shared/Tasks/Task'
import TaskGap from '@/components/shared/Tasks/Gap'
import { mapActions, mapGetters } from 'vuex'
import { GET_TASKS, GET_TASK_BY_ID } from '~/store/projects/types'

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
  name: 'TasksList',

  components: {
    Task,
    TaskGap,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isDropZoneActive: false,
      taskIndex: null,
      parentIndex: null,
      newIndex: null,
      isDragActive: false,
      editedTask: null,
    }
  },

  computed: {
    ...mapGetters('projects', {
      tasks: GET_TASKS,
      task: GET_TASK_BY_ID,
    }),

    classes() {
      return [
        'tasks dropzone',
        // { tasks_active: this.isDropZoneActive },
      ]
    },

    visibleTasks() {
      return [...this.tasks]
    },
  },

  watch: {
    project: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) {
          return
        }

        this.fetchTasks(this.project.id)
      },
    },

    visibleTasks: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }

        this.clear()

        if (process.client) {
          this.$nextTick(() => {
            this.removeListeners()
            this.addListeners()
          })
        }
      },
    },
  },

  beforeMount() {
    this.$nextTick(() => {
      this.removeListeners()
      this.addListeners()
    })
  },

  beforeDestroy() {
    this.removeListeners()
  },

  methods: {
    ...mapActions('projects', [
      'saveTask',
      'deleteTask',
      'fetchTasks',
      'updateTasks',
    ]),

    addListeners() {
      document.addEventListener(
        'dragstart',
        (event) => this.handleDrag(event, true),
        false
      )

      document.addEventListener(
        'dragend',
        (event) => this.handleDrag(event, false),
        false
      )

      document.addEventListener(
        'dragenter',
        (event) => this.handleDropZone(event, true),
        false
      )

      document.addEventListener(
        'dragleave',
        (event) => this.handleDropZone(event, false),
        false
      )
    },

    removeListeners() {
      document.removeEventListener(
        'dragstart',
        (event) => this.handleDrag(event, true),
        false
      )

      document.removeEventListener(
        'dragend',
        (event) => this.handleDrag(event, false),
        false
      )

      document.removeEventListener(
        'dragenter',
        (event) => this.handleDropZone(event, true),
        false
      )

      document.removeEventListener(
        'dragleave',
        (event) => this.handleDropZone(event, false),
        false
      )
    },

    handleDrag(event, state) {
      this.isDragActive = state
      let taskIndex
      if (state) {
        taskIndex = Number(event.target.dataset.task)
      }
      this.taskIndex = taskIndex
    },

    handleDropZone(event, state) {
      if (event.target.className.includes('task-zone')) {
        if (!state) {
          this.parentIndex = null
          return
        }
        this.isDropZoneActive = state
        this.parentIndex = Number(event.target.dataset.task)
      } else if (event.target.className.includes('space-zone')) {
        if (!state) {
          this.newIndex = null
          return
        }
        this.isDropZoneActive = state
        this.newIndex = Number(event.target.dataset.index)
      }
    },

    handleDrop() {
      if (this.newIndex !== null) {
        if (this.taskIndex || this.taskIndex === 0) {
          const task = this.visibleTasks[this.taskIndex]
          if (this.taskIndex < this.newIndex) {
            this.visibleTasks.splice(this.newIndex, 0, task)
            this.visibleTasks.splice(this.taskIndex, 1)
          } else {
            this.visibleTasks.splice(this.taskIndex, 1)
            this.visibleTasks.splice(this.newIndex, 0, task)
          }
          this.updateTasks(this.visibleTasks)
        }
      }

      if (this.parentIndex !== null) {
        if (this.taskIndex || this.taskIndex === 0) {
          // const parentTask = this.visibleTasks[this.parentIndex]
          const task = this.visibleTasks[this.taskIndex]

          // if (!parentTask.parentTaskId) {
          //   task.parentTaskId = parentTask.id
          // }

          this.visibleTasks.splice(this.taskIndex, 1)
          this.visibleTasks.splice(this.parentIndex, 0, task)
          this.updateTasks(this.visibleTasks)
        }
      }

      this.$nextTick(() => {
        this.$emit('clear')
        this.taskIndex = null
        this.parentIndex = null
        this.newIndex = null
        this.isDropZoneActive = false
      })
    },

    save(task) {
      this.saveTask(task)
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

      if (!this.project) {
        return
      }

      this.editedTask.hourCost = this.project.hourCost
      this.editedTask.projectId = this.project.id
      this.editedTask.order = (this.visibleTasks.length + 1) * 10
    },
  },
}
</script>

<style lang="scss">
$block: '.tasks';

#{$block} {
  overflow: hidden;
  padding: 4px 0;

  &__list {
    display: block;
  }
}
</style>
