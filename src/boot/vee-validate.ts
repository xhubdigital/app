import { defineRule, configure } from 'vee-validate';
import { required, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import ptBR from '@vee-validate/i18n/dist/locale/pt_BR.json';

defineRule('required', required);
defineRule('min', min);

configure({
  generateMessage: localize({
    'pt-BR': ptBR,
  }),
});
