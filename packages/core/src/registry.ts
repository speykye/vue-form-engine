import type { Component } from 'vue';
import type { BlockRegistration, ConditionOperator, FieldRegistration, FormValidator } from './types';

function normalizeFieldRegistration(input: Component | FieldRegistration): FieldRegistration {
  if (typeof input === 'object' && input !== null && 'component' in input) return input as FieldRegistration;
  return { component: input as Component };
}

function normalizeBlockRegistration(input: Component | BlockRegistration): BlockRegistration {
  if (typeof input === 'object' && input !== null && 'component' in input) return input as BlockRegistration;
  return { component: input as Component };
}

export function createFormRegistry() {
  const fields = new Map<string, FieldRegistration>();
  const blocks = new Map<string, BlockRegistration>();
  const validators = new Map<string, FormValidator>();
  const conditionOperators = new Map<string, ConditionOperator>();

  function registerField(type: string, input: Component | FieldRegistration) {
    fields.set(type, normalizeFieldRegistration(input));
  }

  function registerFields(inputs: Record<string, Component | FieldRegistration>) {
    Object.entries(inputs).forEach(([type, input]) => registerField(type, input));
  }

  function registerBlock(type: string, input: Component | BlockRegistration) {
    blocks.set(type, normalizeBlockRegistration(input));
  }

  function registerBlocks(inputs: Record<string, Component | BlockRegistration>) {
    Object.entries(inputs).forEach(([type, input]) => registerBlock(type, input));
  }

  function registerComponents(input: { fields?: Record<string, Component | FieldRegistration>; blocks?: Record<string, Component | BlockRegistration> }) {
    if (input.fields) registerFields(input.fields);
    if (input.blocks) registerBlocks(input.blocks);
  }

  function registerValidator(type: string, validator: FormValidator) {
    validators.set(type, validator);
  }

  function registerValidators(inputs: Record<string, FormValidator>) {
    Object.entries(inputs).forEach(([type, validator]) => registerValidator(type, validator));
  }

  function registerConditionOperator(type: string, operator: ConditionOperator) {
    conditionOperators.set(type, operator);
  }

  function registerConditionOperators(inputs: Record<string, ConditionOperator>) {
    Object.entries(inputs).forEach(([type, operator]) => registerConditionOperator(type, operator));
  }

  return {
    fields,
    blocks,
    validators,
    conditionOperators,
    registerField,
    registerFields,
    registerBlock,
    registerBlocks,
    registerComponents,
    registerValidator,
    registerValidators,
    registerConditionOperator,
    registerConditionOperators
  };
}
