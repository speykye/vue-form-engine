<script setup lang="ts">
import { inject } from 'vue';
import { FORM_ENGINE_KEY } from '../context';
import { isArrayItem, isFieldItem, isItemVisible, type FormContext, type FormFieldSchema, type FormModel, type FormSectionSchema } from '@speykye/vue-form-engine-core';
import DynamicFormField from './DynamicFormField.vue';
import DynamicFormArrayField from './DynamicFormArrayField.vue';
import DynamicFormBlock from './DynamicFormBlock.vue';

const props = defineProps<{
  section: FormSectionSchema;
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
</script>

<template>
  <section class="vfe-section">
    <header v-if="section.title || section.description" class="vfe-section-header">
      <h3 v-if="section.title">{{ section.title }}</h3>
      <p v-if="section.description">{{ section.description }}</p>
    </header>

    <template v-for="item in section.items" :key="item.key">
      <DynamicFormField
        v-if="isFieldItem(item) && isItemVisible(item, model, engine, context ?? {})"
        :field="item"
        :model="model"
        :errors="errors"
        :context="context"
        @update="(key, value, field) => emit('update', key, value, field)"
        @blur="emit('blur', $event)"
      />
      <DynamicFormArrayField
        v-else-if="isArrayItem(item) && isItemVisible(item, model, engine, context ?? {})"
        :field="item"
        :model="model"
        :errors="errors"
        :context="context"
        @update="(key, value, field) => emit('update', key, value, field)"
        @blur="emit('blur', $event)"
      />
      <DynamicFormBlock
        v-else-if="item.kind === 'block' && isItemVisible(item, model, engine, context ?? {})"
        :block="item"
        :model="model"
        :context="context"
      />
    </template>
  </section>
</template>

<style scoped>
.vfe-section {
  margin-bottom: 24px;
}
.vfe-section-header {
  margin-bottom: 16px;
}
.vfe-section-header h3 {
  margin: 0;
  font-size: 18px;
}
.vfe-section-header p {
  margin: 4px 0 0;
  color: #667085;
}
</style>
