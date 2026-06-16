import type { FormArrayFieldSchema, FormFieldSchema, FormItemSchema, FormModel, FormSchema } from './types';
import type { FormEngine } from './types';
export declare function isFieldItem(item: FormItemSchema): item is FormFieldSchema;
export declare function isArrayItem(item: FormItemSchema): item is FormArrayFieldSchema;
export declare function getAllItems(schema: FormSchema): FormItemSchema[];
export declare function getAllFields(schema: FormSchema): FormFieldSchema[];
export declare function cloneDefaultValue(value: any): any;
export declare function getFieldDefaultValue(field: FormFieldSchema, engine: FormEngine): any;
export declare function createArrayItemModel(field: FormArrayFieldSchema, engine: FormEngine): FormModel;
export declare function buildInitialModel(schema: FormSchema, engine: FormEngine, initialValue?: FormModel): FormModel;
export declare function getValue(model: FormModel, key: string): any;
export declare function setValue(model: FormModel, key: string, value: any): void;
export declare function clearField(model: FormModel, key: string): void;
//# sourceMappingURL=model.d.ts.map