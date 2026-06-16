<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});
const submitted = ref({});

const schema: FormSchema = {
  sections: [
    {
      title: 'Array Field',
      description: 'Simple object array support for dynamic rows.',
      items: [
        {
          kind: 'array', key: 'contacts', type: 'array', label: 'Contacts', minItems: 1, maxItems: 5,
          addText: 'Add contact', removeText: 'Remove',
          itemFields: [
            { key: 'name', type: 'input', label: 'Name', rules: [{ required: true, message: 'Name is required' }] },
            { key: 'phone', type: 'input', label: 'Phone' }
          ]
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
