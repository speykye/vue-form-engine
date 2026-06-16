<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});
const submitted = ref({});

const schema: FormSchema = {
  sections: [
    {
      title: 'Async Validation Debounce',
      description: 'Type admin to trigger an async validation error after debounce.',
      items: [
        {
          key: 'username', type: 'input', label: 'Username', validateDebounce: 600,
          rules: [{ type: 'uniqueUsername', trigger: 'onChange', message: 'Username is already taken' }]
        }
      ]
    }
  ]
};
</script>

<template>
  <DynamicFormEngine v-model="model" :schema="schema" @submit="submitted = $event" />
  <div class="panel"><b>Model</b><pre>{{ model }}</pre></div>
  <div class="panel"><b>Submit payload</b><pre>{{ submitted }}</pre></div>
</template>
