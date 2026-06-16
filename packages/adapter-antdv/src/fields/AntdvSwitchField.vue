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
    <a-switch
      :checked="Boolean(modelValue)"
      :disabled="disabled || readonly"
      v-bind="field.props"
      @update:checked="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
      @blur="emit('blur')"
    />
  </a-form-item>
</template>
