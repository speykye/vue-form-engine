import type { FormCondition, FormContext, FormEngine, FormModel } from './types';

export function registerDefaultConditionOperators(engine: FormEngine) {
  engine.registerConditionOperators({
    eq: (actual, expected) => actual === expected,
    neq: (actual, expected) => actual !== expected,
    in: (actual, expected) => Array.isArray(expected) && expected.includes(actual),
    notIn: (actual, expected) => Array.isArray(expected) && !expected.includes(actual),
    empty: actual => actual === undefined || actual === null || actual === '' || (Array.isArray(actual) && actual.length === 0),
    notEmpty: actual => !(actual === undefined || actual === null || actual === '' || (Array.isArray(actual) && actual.length === 0)),
    gt: (actual, expected) => Number(actual) > Number(expected),
    gte: (actual, expected) => Number(actual) >= Number(expected),
    lt: (actual, expected) => Number(actual) < Number(expected),
    lte: (actual, expected) => Number(actual) <= Number(expected),
    includes: (actual, expected) => Array.isArray(actual) ? actual.includes(expected) : String(actual ?? '').includes(String(expected ?? '')),
    matches: (actual, expected) => new RegExp(String(expected)).test(String(actual ?? ''))
  });
}

export function evaluateCondition(condition: FormCondition | undefined, model: FormModel, engine: FormEngine, context: FormContext = {}): boolean {
  if (!condition) return true;

  if (typeof condition === 'function') {
    return Boolean(condition(model));
  }

  if ('predicate' in condition) {
    return Boolean(condition.predicate(model));
  }

  if ('logic' in condition) {
    const checks = condition.conditions.map(item => evaluateCondition(item, model, engine, context));
    return condition.logic === 'and' ? checks.every(Boolean) : checks.some(Boolean);
  }

  if ('field' in condition) {
    const operator = engine.conditionOperators.get(condition.operator);
    if (!operator) {
      console.warn(`[vue-form-engine] Unknown condition operator: ${condition.operator}`);
      return false;
    }
    return Boolean(operator(model[condition.field], condition.value, model, context));
  }

  return true;
}
