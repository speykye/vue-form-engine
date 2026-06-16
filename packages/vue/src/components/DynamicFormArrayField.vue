<script setup lang="ts">
import { computed, inject } from 'vue';
import { FORM_ENGINE_KEY } from '../context';
import { addArrayItem, removeArrayItem, type FormArrayFieldSchema, type FormContext, type FormFieldSchema, type FormModel } from '@speykye/vue-form-engine-core';
import DynamicFormField from './DynamicFormField.vue';

const props = defineProps<{
  field: FormArrayFieldSchema;
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

const rows = computed<FormModel[]>(() => Array.isArray(props.model[props.field.key]) ? props.model[props.field.key] : []);
const canAdd = computed(() => props.field.maxItems === undefined || rows.value.length < props.field.maxItems);
const canRemove = computed(() => props.field.minItems === undefined || rows.value.length > props.field.minItems);

function handleAdd() {
  addArrayItem(props.model, props.field, engine!);
}

function handleRemove(index: number) {
  removeArrayItem(props.model, props.field, index);
}

function handleChildUpdate(index: number, key: string, value: any, field: FormFieldSchema) {
  const currentRows = Array.isArray(props.model[props.field.key]) ? props.model[props.field.key] : [];
  if (!currentRows[index]) currentRows[index] = {};
  currentRows[index][key] = value;
  emit('update', `${props.field.key}.${index}.${key}`, value, field);
}

function rowErrors(index: number) {
  const result: Record<string, string[]> = {};
  Object.entries(props.errors ?? {}).forEach(([key, value]) => {
    const prefix = `${props.field.key}.${index}.`;
    if (key.startsWith(prefix)) result[key.slice(prefix.length)] = value;
  });
  return result;
}
</script>

<template>
  <div class="vfe-array-field">
    <div class="vfe-array-header">
      <div>
        <div class="vfe-array-title">{{ field.label }}</div>
        <div v-if="field.placeholder" class="vfe-array-description">{{ field.placeholder }}</div>
      </div>
      <button type="button" class="vfe-array-add" :disabled="!canAdd" @click="handleAdd">
        {{ field.addText ?? 'Add' }}
      </button>
    </div>

    <div v-for="(row, index) in rows" :key="index" class="vfe-array-item">
      <div class="vfe-array-item-header">
        <span>#{{ index + 1 }}</span>
        <button type="button" class="vfe-array-remove" :disabled="!canRemove" @click="handleRemove(index)">
          {{ field.removeText ?? 'Remove' }}
        </button>
      </div>
      <DynamicFormField
        v-for="child in field.itemFields"
        :key="child.key"
        :field="child"
        :model="row"
        :errors="rowErrors(index)"
        :context="context"
        @update="(key, value, childField) => handleChildUpdate(index, key, value, childField)"
        @blur="emit('blur', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.vfe-array-field {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
}
.vfe-array-header,
.vfe-array-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.vfe-array-title {
  font-weight: 600;
}
.vfe-array-description {
  font-size: 12px;
  color: #667085;
}
.vfe-array-item {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.vfe-array-add,
.vfe-array-remove {
  border: 1px solid #d0d5dd;
  background: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.vfe-array-add:disabled,
.vfe-array-remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
