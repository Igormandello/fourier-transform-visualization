<template>
  <div class="column field">
    <label class="label">
      {{ label }}:
      <span class="tag is-primary">{{ modelValue }}</span>
    </label>
    <input
      v-model="inputValue"
      class="slider is-circle is-primary"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script setup>
import { ref, toRef, watch } from 'vue'

const props = defineProps({
  modelValue: String | Number,
  label: String,
  min: String | Number,
  max: String | Number,
  step: String
})

const emit = defineEmits(['update:modelValue', 'change'])

const modelValue = toRef(props, 'modelValue')
const inputValue = ref(modelValue.value)

watch(inputValue, value => emit('update:modelValue', Number.parseFloat(value)))
</script>

<style lang="scss" scoped>
input[type='range'].slider {
  margin: 0;
}

.label {
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  > .tag {
    margin-left: 6px;
    font-size: 0.6rem;
    line-height: 0.8rem;
    min-width: 2.2rem;
  }
}
</style>
