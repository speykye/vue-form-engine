import type { App } from 'vue';
import { createFormEngine, type FormEngine, type FormPlugin } from '@speykye/vue-form-engine-core';
import { FORM_ENGINE_KEY } from './context';
import DynamicFormEngine from './components/DynamicFormEngine.vue';

export interface VueFormEngineOptions {
  engine?: FormEngine;
  plugins?: FormPlugin[];
}

export function createVueFormEngine(options: VueFormEngineOptions = {}) {
  const engine = options.engine ?? createFormEngine();
  options.plugins?.forEach(plugin => engine.use(plugin));

  return {
    engine,
    install(app: App) {
      app.provide(FORM_ENGINE_KEY, engine);
      app.component('DynamicFormEngine', DynamicFormEngine);
    }
  };
}
