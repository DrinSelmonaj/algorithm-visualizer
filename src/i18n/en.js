// src/i18n/en.js — English dictionary: UI + animation messages + manual messages.
import { UI_EN } from './ui.en.js';
import { MESSAGES_EN } from './messages.en.js';
import { MANUAL_EN } from './messages.manual.js';

const EN = { ...UI_EN, ...MESSAGES_EN, ...MANUAL_EN };

export { EN };
