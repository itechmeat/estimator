<template>
  <div class="project-page">
    <header v-if="projectData">
      <h1>{{ projectData.name }}</h1>
      <p>{{ projectData.description }}</p>
    </header>

    <TasksList v-if="projectData" :project="projectData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TasksList from '@/components/shared/Tasks/List'
import { GET_PROJECT_BY_ID } from '~/store/projects/types'

export default {
  name: 'ProjectPage',

  components: {
    TasksList,
  },

  data: () => ({
    editedTask: null,
  }),

  computed: {
    ...mapGetters('projects', {
      project: GET_PROJECT_BY_ID,
    }),

    projectData() {
      return this.project(this.$route.params.project)
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
}
</style>
