import type { FormContext, FormEngine, FormFieldSchema, FormModel, FormSchema, FormTrigger } from './types';
export declare function registerDefaultValidators(engine: FormEngine): void;
export declare function validateField(field: FormFieldSchema, value: any, model: FormModel, engine: FormEngine, context?: FormContext, trigger?: FormTrigger): Promise<string[]>;
export declare function validateForm(schema: FormSchema, model: FormModel, engine: FormEngine, context?: FormContext, trigger?: FormTrigger): Promise<Record<string, string[]>>;
//# sourceMappingURL=validation.d.ts.map