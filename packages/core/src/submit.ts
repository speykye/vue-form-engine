import type { FormContext, FormEngine, FormModel, FormSchema } from './types';
import { getAllItems, isArrayItem, isFieldItem } from './model';
import { isItemVisible } from './visibility';

export function collectSubmitValues(schema: FormSchema, model: FormModel, engine: FormEngine, context: FormContext = {}): FormModel {
  const strategy = schema.hiddenValueStrategy ?? 'submitVisibleOnly';
  if (strategy === 'keep') return { ...model };

  const values: FormModel = {};

  for (const item of getAllItems(schema)) {
    const visible = isItemVisible(item, model, engine, context);
    if (!visible) continue;

    if (isFieldItem(item)) {
      const registration = engine.fields.get(item.type);
      if (registration?.submitTransform) {
        const transformed = registration.submitTransform(model[item.key], { field: item, model, context });
        if (transformed && typeof transformed === 'object' && !Array.isArray(transformed)) Object.assign(values, transformed);
        else values[item.key] = transformed;
      } else {
        values[item.key] = model[item.key];
      }
      continue;
    }

    if (isArrayItem(item)) {
      values[item.key] = Array.isArray(model[item.key]) ? model[item.key] : [];
      continue;
    }

    const registration = engine.blocks.get(item.type);
    if (registration?.submitTransform) {
      Object.assign(values, registration.submitTransform(model, { block: item, model, context }));
    }
  }

  return values;
}
