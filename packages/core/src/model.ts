import type { FormArrayFieldSchema, FormFieldSchema, FormItemSchema, FormModel, FormSchema } from './types';
import type { FormEngine } from './types';

export function isFieldItem(item: FormItemSchema): item is FormFieldSchema {
  return item.kind !== 'block' && item.kind !== 'array';
}

export function isArrayItem(item: FormItemSchema): item is FormArrayFieldSchema {
  return item.kind === 'array' || item.type === 'array';
}

export function getAllItems(schema: FormSchema): FormItemSchema[] {
  return schema.sections.flatMap(section => section.items);
}

export function getAllFields(schema: FormSchema): FormFieldSchema[] {
  return getAllItems(schema).filter(isFieldItem);
}

export function cloneDefaultValue(value: any) {
  if (typeof value === 'function') return value();
  if (Array.isArray(value)) return [...value];
  if (value && typeof value === 'object') return { ...value };
  return value;
}

export function getFieldDefaultValue(field: FormFieldSchema, engine: FormEngine) {
  if (field.defaultValue !== undefined) return cloneDefaultValue(field.defaultValue);
  const registration = engine.fields.get(field.type);
  if (registration?.defaultValue !== undefined) return cloneDefaultValue(registration.defaultValue);
  switch (field.type) {
    case 'switch':
      return false;
    case 'number':
      return undefined;
    default:
      return '';
  }
}

export function createArrayItemModel(field: FormArrayFieldSchema, engine: FormEngine): FormModel {
  const item: FormModel = {};
  field.itemFields.forEach(child => {
    item[child.key] = getFieldDefaultValue(child, engine);
  });
  return item;
}

export function buildInitialModel(schema: FormSchema, engine: FormEngine, initialValue: FormModel = {}): FormModel {
  const model: FormModel = { ...initialValue };
  getAllItems(schema).forEach(item => {
    if (item.kind === 'block') {
      const blockRegistration = engine.blocks.get(item.type);
      if (blockRegistration?.defaultModel) {
        Object.assign(model, { ...blockRegistration.defaultModel(), ...model });
      }
      return;
    }
    if (isArrayItem(item)) {
      if (!Array.isArray(model[item.key])) {
        const min = item.minItems ?? 0;
        model[item.key] = Array.from({ length: min }, () => createArrayItemModel(item, engine));
      }
      return;
    }
    if (!(item.key in model)) model[item.key] = getFieldDefaultValue(item, engine);
  });
  return model;
}

export function getValue(model: FormModel, key: string) {
  return model[key];
}

export function setValue(model: FormModel, key: string, value: any) {
  model[key] = value;
}

export function clearField(model: FormModel, key: string) {
  delete model[key];
}
