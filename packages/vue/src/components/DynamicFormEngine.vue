<script setup lang="ts">
import { inject, reactive, ref, watch } from 'vue';
import {
  buildInitialModel,
  collectSubmitValues,
  validateField,
  validateForm,
  type FormContext,
  type FormFieldSchema,
  type FormModel,
  type FormSchema,
  type FormTrigger
} from '@speykye/vue-form-engine-core';
import { FORM_ENGINE_KEY } from '../context';
import DynamicFormSection from './DynamicFormSection.vue';

const props = withDefaults(defineProps<{
  schema: FormSchema;
  modelValue?: FormModel;
  context?: FormContext;
  submitText?: string;
}>(), {
  modelValue: () => ({}),
  submitText: 'Submit'
});

const emit = defineEmits<{
  'update:modelValue': [value: FormModel];
  submit: [value: FormModel];
  validate: [valid: boolean, errors: Record<string, string[]>];
  fieldChange: [key: string, value: any, model: FormModel];
}>();

const engine = inject(FORM_ENGINE_KEY);
if (!engine) throw new Error('[vue-form-engine] Form engine is not provided. Use createVueFormEngine().');

const model = reactive<FormModel>(buildInitialModel(props.schema, engine, props.modelValue));
const errors = ref<Record<string, string[]>>({});
const validateTimerMap = new Map<string, number>();

watch(
  () => props.modelValue,
  next => {
    Object.assign(model, buildInitialModel(props.schema, engine, next ?? {}));
  },
  { deep: true }
);

watch(
  model,
  () => emit('update:modelValue', { ...model }),
  { deep: true }
);

function setError(key: string, fieldErrors: string[]) {
  errors.value = {
    ...errors.value,
    [key]: fieldErrors
  };
  if (!fieldErrors.length) {
    const next = { ...errors.value };
    delete next[key];
    errors.value = next;
  }
}

async function runFieldValidation(field: FormFieldSchema, trigger: FormTrigger) {
  const fieldErrors = await validateField(field, model[field.key], model, engine!, props.context ?? {}, trigger);
  setError(field.key, fieldErrors);
  return fieldErrors;
}

function scheduleFieldValidation(field: FormFieldSchema, trigger: FormTrigger) {
  const delay = field.validateDebounce ?? Math.max(0, ...(field.rules ?? []).map(rule => rule.debounce ?? 0));
  if (trigger !== 'onChange' || delay <= 0) {
    void runFieldValidation(field, trigger);
    return;
  }

  const oldTimer = validateTimerMap.get(field.key);
  if (oldTimer) window.clearTimeout(oldTimer);

  const timer = window.setTimeout(() => {
    void runFieldValidation(field, trigger);
    validateTimerMap.delete(field.key);
  }, delay);
  validateTimerMap.set(field.key, timer);
}

function handleUpdate(key: string, value: any, field: FormFieldSchema) {
  // Array child fields emit dotted keys. They already updated nested row state.
  if (!key.includes('.')) model[key] = value;
  emit('fieldChange', key, value, { ...model });
  scheduleFieldValidation(field, 'onChange');
}

function handleBlur(field: FormFieldSchema) {
  scheduleFieldValidation(field, 'onBlur');
}

async function validate() {
  errors.value = await validateForm(props.schema, model, engine!, props.context ?? {}, 'onSubmit');
  const valid = Object.keys(errors.value).length === 0;
  emit('validate', valid, errors.value);
  return valid;
}

async function handleSubmit() {
  const valid = await validate();
  if (!valid) return;
  const values = collectSubmitValues(props.schema, model, engine!, props.context ?? {});
  emit('submit', values);
}

defineExpose({
  model,
  errors,
  validate,
  submit: handleSubmit
});
</script>

<template>
  <form class="vfe-form" @submit.prevent="handleSubmit">
    <DynamicFormSection
      v-for="(section, index) in schema.sections"
      :key="section.key ?? index"
      :section="section"
      :model="model"
      :errors="errors"
      :context="context"
      @update="handleUpdate"
      @blur="handleBlur"
    />

    <slot name="actions" :submit="handleSubmit" :validate="validate" :model="model">
      <button type="submit" class="vfe-submit">{{ submitText }}</button>
    </slot>
  </form>
</template>

<style scoped>
.vfe-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.vfe-submit {
  align-self: flex-start;
  border: 1px solid #1677ff;
  background: #1677ff;
  color: #fff;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
