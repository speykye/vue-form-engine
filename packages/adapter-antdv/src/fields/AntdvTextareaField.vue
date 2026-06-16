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

function handleDomChange(event: Event) {
  emit('change', (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <a-form-item :label="field.label" :validate-status="errorMessage ? 'error' : undefined" :help="errorMessage || undefined">
    <a-textarea
      :value="modelValue"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="field.props"
      @update:value="emit('update:modelValue', $event)"
      @change="handleDomChange"
      @blur="emit('blur')"
    />
  </a-form-item>
</template>
