import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { setLocale } from '@vee-validate/i18n';

import messages from 'src/i18n';

const i18n = createI18n({
  locale: 'pt-BR',
  messages,
  numberFormats: {
    'pt-BR': {
      currency: {
        style: 'currency',
        currency: 'BRL',
      },
    },
  },
});

setLocale('pt-BR');

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
