<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});
const submitted = ref({});

const schema: FormSchema = {
  hiddenValueStrategy: 'submitVisibleOnly',
  sections: [
    {
      title: 'Basic Form',
      description: 'Basic fields, validation, conditional visibility, and clean submit payload.',
      items: [
        { key: 'username', type: 'input', label: 'Username', placeholder: 'Enter username', rules: [{ required: true, message: 'Username is required' }] },
        { key: 'age', type: 'number', label: 'Age', props: { min: 0, max: 120 } },
        {
          key: 'userType', type: 'select', label: 'User Type', options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Enterprise', value: 'enterprise' }
          ]
        },
        {
          key: 'companyName', type: 'input', label: 'Company Name', placeholder: 'Visible for enterprise users',
          visibleWhen: { deps: ['userType'], predicate: model => model.userType === 'enterprise' },
          rules: [{ required: true, message: 'Company name is required' }]
        },
        { key: 'enabled', type: 'switch', label: 'Enabled' }
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
