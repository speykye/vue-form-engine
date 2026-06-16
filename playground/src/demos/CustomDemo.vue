<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});
const submitted = ref({});

const schema: FormSchema = {
  hiddenValueStrategy: 'submitVisibleOnly',
  sections: [
    {
      title: 'Custom Field & Block',
      items: [
        { key: 'email', type: 'input', label: 'Email', rules: [{ type: 'email', message: 'Invalid email', trigger: ['onBlur', 'onSubmit'] }] },
        { key: 'captcha', type: 'captcha', label: 'Captcha', placeholder: 'Input fake captcha', rules: [{ required: true, message: 'Captcha is required' }] },
        {
          kind: 'block', key: 'invitationBlock', type: 'invitationCode', props: {
            invitationCodeKey: 'invitationCode', invitationVerifiedKey: 'invitationVerified'
          }
        },
        {
          key: 'serviceArea', type: 'select', label: 'Service Area', options: [
            { label: 'US', value: 'US' }, { label: 'EU', value: 'EU' }
          ],
          visibleWhen: { deps: ['invitationVerified'], predicate: model => model.invitationVerified === true }
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
