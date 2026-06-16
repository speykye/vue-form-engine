# Design Notes

Vue Form Engine is a lightweight form runtime, not a UI component library and not a low-code builder.

## Core idea

The project is split into three layers:

```text
Schema protocol
↓
Form runtime
↓
UI adapter
```

The core package owns schema, registry, conditions, validation, model initialization, array helpers, and submit payload collection. It must not import Ant Design Vue, Vant, Element Plus, or any other UI library.

The Vue package owns rendering and Vue plugin integration. It reads the engine registry and renders registered field/block components.

The adapter package owns UI-library-specific field components. The first adapter is Ant Design Vue.

## Field vs Block

A field maps one schema item to one model key.

A block is a business component that may control multiple model keys. Examples: invitation code verification, captcha group, address picker, map picker, uploader with metadata.

## Hidden value strategy

`submitVisibleOnly` is the default strategy for business safety. A hidden field may keep its value in the model, but it is removed from the submit payload.

`keep` submits the full model.

`clear` is reserved for a later release.

## Why not JSON Schema first

JSON Schema compatibility is useful but not the first goal. This project prioritizes business-form ergonomics: custom blocks, UI adapters, condition dependencies, validation triggers, and submit transforms.
