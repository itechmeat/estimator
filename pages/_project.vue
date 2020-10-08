<template>
  <pre class="block">{{ projectData }}</pre>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_PROJECT_BY_ID, GET_PROJECTS } from '~/store/projects/types'

export default {
  name: 'ProjectPage',

  computed: {
    ...mapGetters('projects', {
      projects: GET_PROJECTS,
      project: GET_PROJECT_BY_ID,
    }),

    projectData() {
      return this.project(this.$route.params.project)
    },
  },
}
</script>

<style lang="scss" scoped>
$block: '.block';

#{$block} {
  display: block;
}
</style>
