# @speykye/vue-form-engine-adapter-antdv

Ant Design Vue adapter for Vue Form Engine.

> Status: Experimental / 0.x. The API may change before 1.0.

This package registers Ant Design Vue field components for `@speykye/vue-form-engine`.

It is an adapter package, not a standalone form engine. You should use it together with `@speykye/vue-form-engine` and `ant-design-vue`.

## Install

```bash
pnpm add @speykye/vue-form-engine @speykye/vue-form-engine-adapter-antdv ant-design-vue
```

Or:

```bash
npm install @speykye/vue-form-engine @speykye/vue-form-engine-adapter-antdv ant-design-vue
```

## Setup

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

## Registered fields

This adapter currently registers the following field types:

- `input`
- `textarea`
- `number`
- `select`
- `switch`

Example:

```ts
const schema = {
  sections: [
    {
      title: 'Basic Form',
      items: [
        {
          key: 'username',
          type: 'input',
          label: 'Username',
          placeholder: 'Please enter username'
        },
        {
          key: 'bio',
          type: 'textarea',
          label: 'Bio'
        },
        {
          key: 'age',
          type: 'number',
          label: 'Age'
        },
        {
          key: 'role',
          type: 'select',
          label: 'Role',
          options: [
            { label: 'User', value: 'user' },
            { label: 'Admin', value: 'admin' }
          ]
        },
        {
          key: 'enabled',
          type: 'switch',
          label: 'Enabled'
        }
      ]
    }
  ]
};
```

## Usage with DynamicFormEngine

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
          rules: [{ required: true, message: 'Username is required' }]
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
  console.log(values);
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

## Field props

Field schema `props` are passed to the underlying Ant Design Vue component where applicable.

Example:

```ts
{
  key: 'username',
  type: 'input',
  label: 'Username',
  props: {
    allowClear: true,
    size: 'large'
  }
}
```

## Custom fields

You are not limited to the built-in Ant Design Vue fields.

You can still register your own custom fields:

```ts
formEngine.registerField('captcha', CaptchaField);
```

Or register a business preset:

```ts
formEngine.use({
  name: 'business-fields',
  fields: {
    captcha: CaptchaField,
    mapPicker: MapPickerField
  }
});
```

## Custom blocks

Custom business blocks are also supported through the main engine:

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
    invitationVerifiedKey: 'invitationVerified'
  }
}
```

## Peer dependencies

This package expects the host application to install:

- `vue`
- `ant-design-vue`
- `@speykye/vue-form-engine`

## Links

- GitHub: https://github.com/speykye/vue-form-engine

## License

MIT