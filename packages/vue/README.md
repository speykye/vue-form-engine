# @speykye/vue-form-engine

A lightweight UI-agnostic schema-driven form engine for Vue 3.

> Status: Experimental / 0.x. The API may change before 1.0.

Vue Form Engine is designed for complex business forms that involve conditional fields, custom business blocks, array fields, async validation, hidden payload strategies, and UI adapter requirements.

Use native UI form components for simple forms. Use Vue Form Engine when your forms need a reusable runtime protocol and schema-driven behavior.

## Why

Vue has many excellent UI form components, such as Ant Design Vue, Element Plus, Vant, Naive UI, and others.

However, complex business forms often need more than UI components:

- Conditional field visibility
- Conditional disabled state
- Hidden field payload strategy
- Async validation with debounce
- Custom field registration
- Custom business block registration
- Array fields
- UI-library-independent schema
- Reusable form behavior across projects

Vue Form Engine provides a small runtime layer between your schema and your UI library.

```text
Schema
  ↓
Core Runtime
  ↓
Vue Renderer
  ↓
UI Adapter
  ↓
Ant Design Vue / Custom Components
```

## Install

With Ant Design Vue adapter:

```bash
pnpm add @speykye/vue-form-engine @speykye/vue-form-engine-adapter-antdv ant-design-vue
```

Or with npm:

```bash
npm install @speykye/vue-form-engine @speykye/vue-form-engine-adapter-antdv ant-design-vue
```

## Basic setup

```ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import App from './App.vue';
import { createVueFormEngine } from '@speykye/vue-form-engine';
import { antdvAdapter } from '@speykye/vue-form-engine-adapter-antdv';

const app = createApp(App);

app.use(Antd);

app.use(
  createVueFormEngine({
    plugins: [antdvAdapter()]
  })
);

app.mount('#app');
```

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { FormSchema } from '@speykye/vue-form-engine';

const model = ref({});

const schema: FormSchema = {
  sections: [
    {
      title: 'Account',
      items: [
        {
          key: 'username',
          type: 'input',
          label: 'Username',
          placeholder: 'Please enter username',
          rules: [
            { required: true, message: 'Username is required' }
          ]
        },
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
  ],
  hiddenValueStrategy: 'submitVisibleOnly'
};

function handleSubmit(values: Record<string, any>) {
  console.log('submit values:', values);
}
</script>

<template>
  <DynamicFormEngine
    v-model="model"
    :schema="schema"
    @submit="handleSubmit"
  />
</template>
```

## Features

- UI-agnostic form runtime
- Schema-driven rendering
- Core / renderer / adapter architecture
- Field registry
- Block registry
- Custom field support
- Custom business block support
- Conditional visibility
- Conditional disabled state
- Hidden value strategy
- Array field support
- Async validation debounce
- Ant Design Vue adapter
- TypeScript support

## Hidden value strategy

Complex forms often hide fields based on user choices.

For example, when `userType` changes from `enterprise` to `normal`, the `companyName` field may become hidden. Without a payload strategy, the hidden value may still be submitted.

Vue Form Engine supports:

```ts
hiddenValueStrategy: 'keep' | 'clear' | 'submitVisibleOnly'
```

Recommended default for business forms:

```ts
hiddenValueStrategy: 'submitVisibleOnly'
```

This keeps values in the local model but excludes hidden fields from the submitted payload.

## Custom fields

You can register custom field components through the form engine.

```ts
formEngine.registerField('captcha', CaptchaField);
```

Then use it in schema:

```ts
{
  key: 'captcha',
  type: 'captcha',
  label: 'Captcha'
}
```

A field component should follow the standard field component protocol:

- Props: `field`, `modelValue`, `model`, `disabled`, `readonly`, `errorMessage`
- Emits: `update:modelValue`, `change`, `blur`

## Custom blocks

Use custom blocks for business components that control multiple model keys.

```ts
formEngine.registerBlock('invitationCode', InvitationCodeBlock);
```

Schema example:

```ts
{
  kind: 'block',
  key: 'invitationCodeBlock',
  type: 'invitationCode',
  props: {
    invitationCodeKey: 'invitationCode',
    confirmedInvitationCodeKey: 'confirmedInvitationCode',
    invitationVerifiedKey: 'invitationVerified'
  }
}
```

Blocks are useful for scenarios such as:

- Invitation code verification
- Captcha groups
- Address picker with coordinate output
- Upload widgets
- Complex business-specific form sections

## Array fields

Array fields are useful for repeated object groups.

```ts
{
  kind: 'array',
  key: 'contacts',
  type: 'array',
  label: 'Contacts',
  minItems: 1,
  maxItems: 5,
  itemFields: [
    {
      key: 'name',
      type: 'input',
      label: 'Name'
    },
    {
      key: 'phone',
      type: 'input',
      label: 'Phone'
    }
  ]
}
```

Submitted model:

```ts
{
  contacts: [
    {
      name: 'Alice',
      phone: '123456'
    }
  ]
}
```

## When should you use this?

Use Vue Form Engine when your form has:

- Complex conditional logic
- Many reusable business fields
- Custom widgets or blocks
- Dynamic array fields
- Async validation
- Hidden value cleanup requirements
- Multiple UI library targets
- Internal platform or SaaS form requirements

## When should you not use this?

Do not use this engine for very simple forms.

For example, if your form only has a few static fields, native UI library forms are usually simpler and better:

```vue
<el-form>
  <el-input />
</el-form>
```

## Packages

- `@speykye/vue-form-engine-core` — core protocol and runtime utilities
- `@speykye/vue-form-engine` — Vue renderer and plugin
- `@speykye/vue-form-engine-adapter-antdv` — Ant Design Vue adapter

## Links

- GitHub: https://github.com/speykye/vue-form-engine

## License

MIT