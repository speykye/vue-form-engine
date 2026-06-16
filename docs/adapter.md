# Adapter Protocol

A field adapter is a Vue component registered by field type.

## Field props

Every field component should accept:

```ts
field: FormFieldSchema
modelValue: any
model: FormModel
disabled?: boolean
readonly?: boolean
errorMessage?: string
```

## Field emits

Every field component should emit:

```ts
update:modelValue(value)
change(value)
blur()
```

## Register a field

```ts
engine.registerField('input', InputField);
```

or with default behavior:

```ts
engine.registerField('mapPicker', {
  component: MapPickerField,
  defaultValue: null,
  submitTransform(value) {
    return {
      address: value?.formattedAddress,
      position: value?.position
    };
  }
});
```

## Register many components

```ts
engine.registerComponents({
  fields: {
    input: InputField,
    select: SelectField
  },
  blocks: {
    invitationCode: InvitationCodeBlock
  }
});
```

For larger integrations, use a plugin/preset:

```ts
engine.use(antdvAdapter());
engine.use(createBusinessFormPreset());
```
