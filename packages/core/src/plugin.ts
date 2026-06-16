import { createFormRegistry } from './registry';
import { registerDefaultConditionOperators } from './condition';
import { registerDefaultValidators } from './validation';
import type { FormEngine, FormPlugin } from './types';

export function createFormEngine(): FormEngine {
  const registry = createFormRegistry();

  const engine = {
    ...registry,
    use(plugin: FormPlugin) {
      if (plugin.fields) registry.registerFields(plugin.fields);
      if (plugin.blocks) registry.registerBlocks(plugin.blocks);
      if (plugin.validators) registry.registerValidators(plugin.validators);
      if (plugin.conditionOperators) registry.registerConditionOperators(plugin.conditionOperators);
      plugin.install?.(engine);
    }
  } as FormEngine;

  registerDefaultConditionOperators(engine);
  registerDefaultValidators(engine);

  return engine;
}
