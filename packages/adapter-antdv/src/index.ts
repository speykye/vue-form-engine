import type { FormPlugin } from '@speykye/vue-form-engine-core';
import AntdvInputField from './fields/AntdvInputField.vue';
import AntdvTextareaField from './fields/AntdvTextareaField.vue';
import AntdvNumberField from './fields/AntdvNumberField.vue';
import AntdvSelectField from './fields/AntdvSelectField.vue';
import AntdvSwitchField from './fields/AntdvSwitchField.vue';

export function antdvAdapter(): FormPlugin {
  return {
    name: 'antdv-adapter',
    fields: {
      input: { component: AntdvInputField, defaultValue: '' },
      textarea: { component: AntdvTextareaField, defaultValue: '' },
      number: { component: AntdvNumberField, defaultValue: undefined },
      select: { component: AntdvSelectField, defaultValue: undefined },
      switch: { component: AntdvSwitchField, defaultValue: false }
    }
  };
}
