import type { Component } from 'vue';
export type FormModel = Record<string, any>;
export type FormTrigger = 'onChange' | 'onBlur' | 'onSubmit';
export type HiddenValueStrategy = 'keep' | 'clear' | 'submitVisibleOnly';
export interface FormContext {
    services?: Record<string, any>;
    [key: string]: any;
}
export interface FormSchema {
    sections: FormSectionSchema[];
    hiddenValueStrategy?: HiddenValueStrategy;
    validateVisibleOnly?: boolean;
}
export interface FormSectionSchema {
    key?: string;
    title?: string;
    description?: string;
    items: FormItemSchema[];
}
export type FormItemSchema = FormFieldSchema | FormArrayFieldSchema | FormBlockSchema;
export interface FormFieldSchema<TProps extends Record<string, any> = Record<string, any>, TMeta extends Record<string, any> = Record<string, any>> {
    kind?: 'field';
    key: string;
    type: string;
    label?: string;
    placeholder?: string;
    defaultValue?: any;
    options?: FormOption[];
    props?: TProps;
    meta?: TMeta;
    readonly?: boolean;
    disabled?: boolean;
    visibleWhen?: FormCondition;
    disabledWhen?: FormCondition;
    rules?: FormRule[];
    validateDebounce?: number;
    span?: number;
}
export interface FormArrayFieldSchema extends Omit<FormFieldSchema, 'kind' | 'type' | 'defaultValue'> {
    kind: 'array';
    type: 'array';
    minItems?: number;
    maxItems?: number;
    addText?: string;
    removeText?: string;
    itemFields: FormFieldSchema[];
}
export interface FormBlockSchema<TProps extends Record<string, any> = Record<string, any>> {
    kind: 'block';
    key: string;
    type: string;
    component?: string;
    props?: TProps;
    visibleWhen?: FormCondition;
    disabledWhen?: FormCondition;
    span?: number;
}
export interface FormOption {
    label: string;
    value: any;
    disabled?: boolean;
    [key: string]: any;
}
export type FormCondition = SimpleCondition | GroupCondition | FunctionCondition | ((model: FormModel) => boolean);
export interface SimpleCondition {
    field: string;
    operator: string;
    value?: any;
}
export interface GroupCondition {
    logic: 'and' | 'or';
    conditions: FormCondition[];
}
export interface FunctionCondition {
    deps?: string[];
    predicate: (model: FormModel) => boolean;
}
export interface FormRule {
    type?: string;
    required?: boolean;
    message?: string;
    trigger?: FormTrigger | FormTrigger[];
    debounce?: number;
    validator?: (value: any, model: FormModel, ctx: FormContext) => boolean | string | Promise<boolean | string>;
}
export interface FieldRuntimeContext {
    field: FormFieldSchema;
    model: FormModel;
    context: FormContext;
}
export interface BlockRuntimeContext {
    block: FormBlockSchema;
    model: FormModel;
    context: FormContext;
}
export interface FieldRegistration {
    component: Component;
    defaultValue?: any | (() => any);
    normalizeValue?: (value: any, ctx: FieldRuntimeContext) => any;
    submitTransform?: (value: any, ctx: FieldRuntimeContext) => any | Record<string, any>;
    clearWhenHidden?: boolean;
}
export interface BlockRegistration {
    component: Component;
    defaultModel?: () => FormModel;
    submitTransform?: (model: FormModel, ctx: BlockRuntimeContext) => Record<string, any>;
}
export type FormValidator = (value: any, model: FormModel, ctx: FormContext) => boolean | string | Promise<boolean | string>;
export type ConditionOperator = (actual: any, expected: any, model: FormModel, ctx: FormContext) => boolean;
export interface FormPlugin {
    name: string;
    fields?: Record<string, Component | FieldRegistration>;
    blocks?: Record<string, Component | BlockRegistration>;
    validators?: Record<string, FormValidator>;
    conditionOperators?: Record<string, ConditionOperator>;
    install?: (engine: FormEngine) => void;
}
export interface FormEngine {
    fields: Map<string, FieldRegistration>;
    blocks: Map<string, BlockRegistration>;
    validators: Map<string, FormValidator>;
    conditionOperators: Map<string, ConditionOperator>;
    registerField(type: string, component: Component | FieldRegistration): void;
    registerFields(fields: Record<string, Component | FieldRegistration>): void;
    registerBlock(type: string, component: Component | BlockRegistration): void;
    registerBlocks(blocks: Record<string, Component | BlockRegistration>): void;
    registerComponents(registry: {
        fields?: Record<string, Component | FieldRegistration>;
        blocks?: Record<string, Component | BlockRegistration>;
    }): void;
    registerValidator(type: string, validator: FormValidator): void;
    registerValidators(validators: Record<string, FormValidator>): void;
    registerConditionOperator(type: string, operator: ConditionOperator): void;
    registerConditionOperators(operators: Record<string, ConditionOperator>): void;
    use(plugin: FormPlugin): void;
}
export interface FieldComponentProps {
    field: FormFieldSchema;
    modelValue: any;
    model: FormModel;
    disabled?: boolean;
    readonly?: boolean;
    errorMessage?: string;
}
//# sourceMappingURL=types.d.ts.map