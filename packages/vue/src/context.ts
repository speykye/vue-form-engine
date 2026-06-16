import type { InjectionKey } from 'vue';
import type { FormEngine } from '@speykye/vue-form-engine-core';

export const FORM_ENGINE_KEY: InjectionKey<FormEngine> = Symbol('FORM_ENGINE_KEY');
