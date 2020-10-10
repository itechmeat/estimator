<template>
  <div :class="classes">
    <div class="gap__dilator space-zone" :data-index="index" />
  </div>
</template>

<script>
export default {
  name: 'TasksGap',

  props: {
    index: {
      type: Number,
      required: true,
    },
    active: Boolean,
    hidden: Boolean,
  },

  computed: {
    classes() {
      return ['gap', { gap_active: this.active }, { gap_hidden: this.hidden }]
    },
  },
}
</script>

<style lang="scss">
$block: '.gap';

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  height: 8px;
  margin: -5px 0 -4px;
  transition: height 0.2s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: calc(50% - 2px);
    right: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s;
    will-change: opacity;
  }

  &::before {
    border-bottom: 5px dotted var(--color-info);
  }

  &::after {
    margin: 2px;
    border-bottom: 1px solid var(--color-info);
    box-shadow: 0 0 4px var(--color-info);
  }

  &_active {
    height: 16px;

    &::before,
    &::after {
      opacity: 1;
    }
  }

  &_hidden {
    pointer-events: none;
  }

  &__dilator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
