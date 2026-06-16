import type { FormCondition, FormContext, FormEngine, FormModel } from './types';
export declare function registerDefaultConditionOperators(engine: FormEngine): void;
export declare function evaluateCondition(condition: FormCondition | undefined, model: FormModel, engine: FormEngine, context?: FormContext): boolean;
//# sourceMappingURL=condition.d.ts.map