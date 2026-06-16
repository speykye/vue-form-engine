import type { FormContext, FormEngine, FormFieldSchema, FormModel, FormRule, FormSchema, FormTrigger } from './types';
import { getAllItems, isArrayItem, isFieldItem } from './model';
import { isItemVisible } from './visibility';

export function registerDefaultValidators(engine: FormEngine) {
  engine.registerValidators({
    required(value) {
      const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
      return empty ? false : true;
    },
    email(value) {
      if (!value) return true;
      return /^\S+@\S+\.\S+$/.test(String(value));
    }
  });
}

function shouldRunRule(rule: FormRule, trigger: FormTrigger) {
  if (!rule.trigger) return trigger === 'onSubmit';
  return Array.isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger;
}

function normalizeValidationResult(result: boolean | string, fallbackMessage: string) {
  if (result === true) return '';
  if (typeof result === 'string') return result;
  return fallbackMessage;
}

export async function validateField(field: FormFieldSchema, value: any, model: FormModel, engine: FormEngine, context: FormContext = {}, trigger: FormTrigger = 'onSubmit'): Promise<string[]> {
  const errors: string[] = [];
  const rules = field.rules ?? [];

  for (const rule of rules) {
    if (!shouldRunRule(rule, trigger)) continue;
    const message = rule.message ?? `${field.label ?? field.key} is invalid`;

    if (rule.required) {
      const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
      if (empty) errors.push(message);
      if (empty) continue;
    }

    if (rule.validator) {
      const result = await rule.validator(value, model, context);
      const error = normalizeValidationResult(result, message);
      if (error) errors.push(error);
      continue;
    }

    if (rule.type) {
      const validator = engine.validators.get(rule.type);
      if (!validator) {
        console.warn(`[vue-form-engine] Unknown validator: ${rule.type}`);
        continue;
      }
      const result = await validator(value, model, context);
      const error = normalizeValidationResult(result, message);
      if (error) errors.push(error);
    }
  }

  return errors;
}

export async function validateForm(schema: FormSchema, model: FormModel, engine: FormEngine, context: FormContext = {}, trigger: FormTrigger = 'onSubmit') {
  const errors: Record<string, string[]> = {};
  const items = getAllItems(schema);

  for (const item of items) {
    if (schema.validateVisibleOnly !== false && !isItemVisible(item, model, engine, context)) continue;

    if (isFieldItem(item)) {
      const fieldErrors = await validateField(item, model[item.key], model, engine, context, trigger);
      if (fieldErrors.length) errors[item.key] = fieldErrors;
      continue;
    }

    if (isArrayItem(item)) {
      const rows = Array.isArray(model[item.key]) ? model[item.key] : [];
      for (let index = 0; index < rows.length; index += 1) {
        for (const child of item.itemFields) {
          const fieldErrors = await validateField(child, rows[index]?.[child.key], rows[index] ?? {}, engine, context, trigger);
          if (fieldErrors.length) errors[`${item.key}.${index}.${child.key}`] = fieldErrors;
        }
      }
    }
  }

  return errors;
}
