import { evaluateCondition } from './condition';
import type { FormContext, FormEngine, FormItemSchema, FormModel, FormSchema } from './types';

export function isItemVisible(item: FormItemSchema, model: FormModel, engine: FormEngine, context: FormContext = {}) {
  return evaluateCondition(item.visibleWhen, model, engine, context);
}

export function isItemDisabled(item: FormItemSchema, model: FormModel, engine: FormEngine, context: FormContext = {}) {
  if ('disabled' in item && item.disabled) return true;
  return !evaluateCondition(item.disabledWhen, model, engine, context);
}

export function getVisibleItems(schema: FormSchema, model: FormModel, engine: FormEngine, context: FormContext = {}) {
  return schema.sections.flatMap(section => section.items).filter(item => isItemVisible(item, model, engine, context));
}
