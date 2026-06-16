import type { FormContext, FormEngine, FormItemSchema, FormModel, FormSchema } from './types';
export declare function isItemVisible(item: FormItemSchema, model: FormModel, engine: FormEngine, context?: FormContext): boolean;
export declare function isItemDisabled(item: FormItemSchema, model: FormModel, engine: FormEngine, context?: FormContext): boolean;
export declare function getVisibleItems(schema: FormSchema, model: FormModel, engine: FormEngine, context?: FormContext): FormItemSchema[];
//# sourceMappingURL=visibility.d.ts.map