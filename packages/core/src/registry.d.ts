import type { Component } from 'vue';
import type { BlockRegistration, ConditionOperator, FieldRegistration, FormValidator } from './types';
export declare function createFormRegistry(): {
    fields: Map<string, FieldRegistration>;
    blocks: Map<string, BlockRegistration>;
    validators: Map<string, FormValidator>;
    conditionOperators: Map<string, ConditionOperator>;
    registerField: (type: string, input: Component | FieldRegistration) => void;
    registerFields: (inputs: Record<string, Component | FieldRegistration>) => void;
    registerBlock: (type: string, input: Component | BlockRegistration) => void;
    registerBlocks: (inputs: Record<string, Component | BlockRegistration>) => void;
    registerComponents: (input: {
        fields?: Record<string, Component | FieldRegistration>;
        blocks?: Record<string, Component | BlockRegistration>;
    }) => void;
    registerValidator: (type: string, validator: FormValidator) => void;
    registerValidators: (inputs: Record<string, FormValidator>) => void;
    registerConditionOperator: (type: string, operator: ConditionOperator) => void;
    registerConditionOperators: (inputs: Record<string, ConditionOperator>) => void;
};
//# sourceMappingURL=registry.d.ts.map