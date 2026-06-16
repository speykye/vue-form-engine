<script setup lang="ts">
import { computed, inject } from 'vue';
import { FORM_ENGINE_KEY } from '../context';
import { isItemDisabled, type FormBlockSchema, type FormContext, type FormModel } from '@speykye/vue-form-engine-core';

const props = defineProps<{
  block: FormBlockSchema;
  model: FormModel;
  context?: FormContext;
}>();

const engine = inject(FORM_ENGINE_KEY);
if (!engine) throw new Error('[vue-form-engine] Form engine is not provided. Use createVueFormEngine().');

const registration = computed(() => engine.blocks.get(props.block.type));
const component = computed(() => registration.value?.component);
const disabled = computed(() => isItemDisabled(props.block, props.model, engine, props.context ?? {}));
</script>

<template>
  <component
    v-if="component"
    :is="component"
    :block="block"
    :model="model"
    :disabled="disabled"
    v-bind="block.props"
  />
  <div v-else class="vfe-missing-block">
    Unknown block type: {{ block.type }}
  </div>
</template>

<style scoped>
.vfe-missing-block {
  padding: 8px 12px;
  color: #b42318;
  border: 1px dashed #f04438;
  border-radius: 6px;
}
</style>
