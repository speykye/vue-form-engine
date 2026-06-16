import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import App from './App.vue';
import { createVueFormEngine, type FormPlugin } from '@speykye/vue-form-engine';
import { antdvAdapter } from '@speykye/vue-form-engine-adapter-antdv';
import CaptchaField from './custom/CaptchaField.vue';
import InvitationCodeBlock from './custom/InvitationCodeBlock.vue';
import './style.css';

const businessPreset: FormPlugin = {
  name: 'business-demo-preset',
  fields: {
    captcha: { component: CaptchaField, defaultValue: '' }
  },
  blocks: {
    invitationCode: {
      component: InvitationCodeBlock,
      defaultModel: () => ({ invitationCode: '', invitationVerified: false })
    }
  },
  validators: {
    async uniqueUsername(value) {
      await new Promise(resolve => window.setTimeout(resolve, 300));
      return value !== 'admin';
    }
  }
};

const app = createApp(App);

app.use(Antd);
app.use(
  createVueFormEngine({
    plugins: [antdvAdapter(), businessPreset]
  })
);

app.mount('#app');
