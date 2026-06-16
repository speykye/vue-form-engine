<script setup lang="ts">
import type { FormFieldSchema, FormModel } from '@speykye/vue-form-engine-core';

defineProps<{
  field: FormFieldSchema;
  modelValue: any;
  model: FormModel;
  disabled?: boolean;
  readonly?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  change: [value: any];
  blur: [];
}>();
</script>

<template>
  <a-form-item :label="field.label" :validate-status="errorMessage ? 'error' : undefined" :help="errorMessage || undefined">
    <a-select
      :value="modelValue"
      :placeholder="field.placeholder"
      :disabled="disabled || readonly"
      style="width: 100%"
      v-bind="field.props"
      @update:value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
      @blur="emit('blur')"
    >
      <a-select-option v-for="option in field.options ?? []" :key="String(option.value)" :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>
