# @speykye/vue-form-engine-core

Core protocol and runtime utilities for Vue Form Engine.

> Status: Experimental / 0.x. The API may change before 1.0.

This package contains the UI-agnostic core layer of Vue Form Engine.

It defines the schema protocol, registry system, condition evaluation, validation helpers, visibility helpers, model utilities, submit value collection, and plugin interfaces.

Most users should install and use `@speykye/vue-form-engine` instead.

## Install

```bash
pnpm add @speykye/vue-form-engine-core
```

Or:

```bash
npm install @speykye/vue-form-engine-core
```

## What is inside

This package provides the core building blocks for a schema-driven form runtime:

- Form schema types
- Field schema types
- Block schema types
- Array field schema types
- Form condition types
- Form rule types
- Hidden value strategy
- Field registry
- Block registry
- Validator registry
- Condition operator registry
- Plugin system
- Visibility evaluation
- Disabled state evaluation
- Validation helpers
- Model initialization helpers
- Submit value collection helpers

## Architecture

Vue Form Engine is split into multiple layers:

```text
@speykye/vue-form-engine-core
  ↓
@speykye/vue-form-engine
  ↓
@speykye/vue-form-engine-adapter-antdv
```

This package does not depend on any UI component library.

It should not import Ant Design Vue, Element Plus, Vant, Naive UI, or any other UI library.

## Basic engine creation

```ts
import { createFormEngine } from '@speykye/vue-form-engine-core';

const engine = createFormEngine();

engine.registerField('input', InputField);
engine.registerBlock('captcha', CaptchaBlock);
```

## Batch registration

You can register multiple components at once:

```ts
engine.registerComponents({
  fields: {
    input: InputField,
    select: SelectField,
    switch: SwitchField
  },
  blocks: {
    captcha: CaptchaBlock,
    invitationCode: InvitationCodeBlock
  }
});
```

## Plugin registration

Adapters and business presets can be registered as plugins.

```ts
engine.use({
  name: 'business-form-preset',
  fields: {
    captcha: CaptchaField
  },
  blocks: {
    invitationCode: InvitationCodeBlock
  },
  validators: {
    uniqueEmail: async value => {
      return true;
    }
  },
  conditionOperators: {
    isVerified: actual => actual === true
  }
});
```

## Schema types

Example schema:

```ts
import type { FormSchema } from '@speykye/vue-form-engine-core';

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
```

## Conditions

Conditions can be declared with operators:

```ts
{
  field: 'userType',
  operator: 'eq',
  value: 'enterprise'
}
```

Or with a predicate:

```ts
{
  deps: ['userType'],
  predicate: model => model.userType === 'enterprise'
}
```

## Hidden value strategy

The core supports hidden value strategies:

```ts
type HiddenValueStrategy = 'keep' | 'clear' | 'submitVisibleOnly';
```

Recommended strategy for business forms:

```ts
hiddenValueStrategy: 'submitVisibleOnly'
```

This prevents hidden fields from leaking into the submitted payload.

## Custom validators

Register a named validator:

```ts
engine.registerValidator('uniqueEmail', async value => {
  const available = await checkEmail(value);
  return available || 'Email is already taken';
});
```

Use it in schema:

```ts
{
  key: 'email',
  type: 'input',
  label: 'Email',
  rules: [
    {
      type: 'uniqueEmail',
      trigger: 'onBlur'
    }
  ]
}
```

## Custom condition operators

Register a condition operator:

```ts
engine.registerConditionOperator('isVerified', actual => {
  return actual === true;
});
```

Use it in schema:

```ts
{
  key: 'serviceArea',
  type: 'select',
  visibleWhen: {
    field: 'invitationVerified',
    operator: 'isVerified'
  }
}
```

## Intended users

This package is mainly intended for:

- Adapter authors
- Advanced Vue developers
- Internal platform developers
- Developers building custom form runtimes
- Developers who need direct access to the core protocol

For normal application usage, use:

```bash
pnpm add @speykye/vue-form-engine
```

## Links

- GitHub: https://github.com/speykye/vue-form-engine

## License

MIT