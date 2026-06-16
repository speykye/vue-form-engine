<script setup lang="ts">
import type { FormFieldSchema, FormModel } from '@speykye/vue-form-engine';

defineProps<{
  field: FormFieldSchema;
  modelValue: any;
  model: FormModel;
  disabled?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  blur: [];
}>();
</script>

<template>
  <a-form-item :label="field.label" :validate-status="errorMessage ? 'error' : undefined" :help="errorMessage || undefined">
    <a-input-group compact>
      <a-input
        style="width: calc(100% - 96px)"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="field.placeholder"
        @update:value="emit('update:modelValue', $event)"
        @blur="emit('blur')"
      />
      <a-button disabled>8K4P</a-button>
    </a-input-group>
  </a-form-item>
</template>
