<script setup lang="ts">
import { computed, inject } from 'vue';
import { FORM_ENGINE_KEY } from '../context';
import { isItemDisabled, type FormContext, type FormFieldSchema, type FormModel } from '@speykye/vue-form-engine-core';

const props = defineProps<{
  field: FormFieldSchema;
  model: FormModel;
  errors?: Record<string, string[]>;
  context?: FormContext;
}>();

const emit = defineEmits<{
  update: [key: string, value: any, field: FormFieldSchema];
  blur: [field: FormFieldSchema];
}>();

const engine = inject(FORM_ENGINE_KEY);
if (!engine) throw new Error('[vue-form-engine] Form engine is not provided. Use createVueFormEngine().');

const registration = computed(() => engine.fields.get(props.field.type));
const component = computed(() => registration.value?.component);
const disabled = computed(() => isItemDisabled(props.field, props.model, engine, props.context ?? {}));
const errorMessage = computed(() => props.errors?.[props.field.key]?.[0] ?? '');

function handleUpdate(value: any) {
  const normalizeValue = registration.value?.normalizeValue;
  const nextValue = normalizeValue
    ? normalizeValue(value, { field: props.field, model: props.model, context: props.context ?? {} })
    : value;
  emit('update', props.field.key, nextValue, props.field);
}
</script>

<template>
  <component
    v-if="component"
    :is="component"
    :field="field"
    :model-value="model[field.key]"
    :model="model"
    :disabled="disabled"
    :readonly="field.readonly"
    :error-message="errorMessage"
    @update:model-value="handleUpdate"
    @change="handleUpdate"
    @blur="emit('blur', field)"
  />
  <div v-else class="vfe-missing-field">
    Unknown field type: {{ field.type }}
  </div>
</template>

<style scoped>
.vfe-missing-field {
  padding: 8px 12px;
  color: #b42318;
  border: 1px dashed #f04438;
  border-radius: 6px;
}
</style>
