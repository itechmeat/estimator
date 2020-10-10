<template>
  <div :class="classes">
    <div
      v-if="value"
      class="task__box task-zone"
      draggable="true"
      :data-task="index"
    >
      <div class="task__content">
        <div class="task__lever" />

        <div class="task__text" contenteditable @blur="handleTextBlur">
          {{ value.name }}
        </div>

        <button @click="$emit('edit', value.id)">Edit</button>
        <button @click="$emit('delete', value.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { clearText } from '@/libs/utils'

export default {
  name: 'TasksItem',

  props: {
    value: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    active: Boolean,
    protected: Boolean,
  },

  computed: {
    classes() {
      return [
        'task',
        // { task_active: this.active },
        // { task_child: this.value.parentTaskId },
        { task_protected: this.protected },
      ]
    },
  },

  methods: {
    handleTextBlur(e) {
      const newText = clearText(e.target.innerHTML)
      if (newText === this.value.name) {
        return
      }
      this.$emit('edit', {
        ...this.value,
        name: clearText(e.target.innerHTML),
      })
    },
  },
}
</script>

<style lang="scss">
$block: '.task';

#{$block} {
  position: relative;
  height: 40px;
  cursor: move;

  &_child {
    margin-left: 32px;
  }

  &__box {
    @extend %fill;

    border: 1px solid var(--color-border);
    background: var(--color-light);
    transition: background 0.1s, box-shadow 0.1s;
    will-change: background, box-shadow;

    #{$block}_active & {
      border-style: dotted;
      background: rgba(#06f, 0.1);
      box-shadow: inset 0 0 6px rgba(#000, 0.4);
    }
  }

  &__content {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    padding: 2px 8px;
    cursor: default;

    #{$block}_protected & {
      pointer-events: none;
    }

    //&:focus-within {
    //  background: var(--color-text-hint);
    //}

    button {
      margin-left: 8px;
    }
  }

  &__lever {
    flex: 0 0 16px;
    height: 16px;
    margin: 0 8px 0 0;
    background: #dadada;
    cursor: move;
  }

  &__text {
    flex: 1;
  }
}
</style>
