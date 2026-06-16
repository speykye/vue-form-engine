# Vue Form Engine

A lightweight UI-agnostic schema-driven form engine for Vue 3.

This project is not a low-code form builder. It is a small form protocol and runtime for complex business forms that need conditional fields, custom widgets, array fields, async validation, hidden payload strategies, and UI adapter rendering.

## When to use it

Use native UI-library forms directly for simple forms.

Use Vue Form Engine when your project has:

- many repeated business forms;
- conditional visibility or disabled rules;
- hidden fields that should not be submitted;
- custom business blocks such as captcha, invitation code, map picker, uploader;
- async validation with debounce;
- dynamic object arrays;
- a need to reuse form behavior across different UI libraries.

## Packages

```text
packages/core          schema protocol, registry, condition, validation, submit utilities
packages/vue           Vue renderer and plugin
packages/adapter-antdv Ant Design Vue field adapter
playground             runnable demos
```

## Quick start

```ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import { createVueFormEngine } from '@speykye/vue-form-engine';
import { antdvAdapter } from '@speykye/vue-form-engine-adapter-antdv';

const app = createApp(App);
app.use(Antd);
app.use(createVueFormEngine({ plugins: [antdvAdapter()] }));
app.mount('#app');
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});

const schema: FormSchema = {
  hiddenValueStrategy: 'submitVisibleOnly',
  sections: [
    {
      title: 'Account',
      items: [
        { key: 'username', type: 'input', label: 'Username', rules: [{ required: true }] },
        {
          key: 'userType',
          type: 'select',
          label: 'User Type',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Enterprise', value: 'enterprise' }
          ]
        },
        {
          key: 'companyName',
          type: 'input',
          label: 'Company Name',
          visibleWhen: {
            deps: ['userType'],
            predicate: model => model.userType === 'enterprise'
          }
        }
      ]
    }
  ]
};
</script>

<template>
  <DynamicFormEngine v-model="model" :schema="schema" @submit="console.log" />
</template>
```

## Custom field

```ts
engine.registerField('captcha', CaptchaField);
```

The field component receives `field`, `modelValue`, `model`, `disabled`, `readonly`, `errorMessage`, and emits `update:modelValue`, `change`, `blur`.

## Custom block

Use blocks when one component controls multiple model keys.

```ts
engine.registerBlock('invitationCode', InvitationCodeBlock);
```

```ts
{
  kind: 'block',
  key: 'invitationBlock',
  type: 'invitationCode',
  props: {
    invitationCodeKey: 'invitationCode',
    invitationVerifiedKey: 'invitationVerified'
  }
}
```

## Status

Experimental 0.1.0. The current goal is to validate the protocol, runtime, adapter architecture, and playground demos.
