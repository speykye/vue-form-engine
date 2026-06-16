import type { FormArrayFieldSchema, FormEngine, FormModel } from './types';
import { createArrayItemModel } from './model';

export function addArrayItem(model: FormModel, field: FormArrayFieldSchema, engine: FormEngine) {
  const rows = Array.isArray(model[field.key]) ? model[field.key] : [];
  if (field.maxItems !== undefined && rows.length >= field.maxItems) return rows;
  const next = [...rows, createArrayItemModel(field, engine)];
  model[field.key] = next;
  return next;
}

export function removeArrayItem(model: FormModel, field: FormArrayFieldSchema, index: number) {
  const rows = Array.isArray(model[field.key]) ? model[field.key] : [];
  if (field.minItems !== undefined && rows.length <= field.minItems) return rows;
  model[field.key] = rows.filter((_item: unknown, currentIndex: number) => currentIndex !== index);
  return model[field.key];
}
