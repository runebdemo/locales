import type {LocaleRegistry} from '../src/types'

// See CONTRIBUTING.md for more information on how to add a new locale
const registry: LocaleRegistry = [
  {
    id: 'cs-CZ',
    name: 'Čeština',
    englishName: 'Czech',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'de-DE',
    name: 'Deutsch',
    englishName: 'German',
    maintainers: ['wrknd'],
    contributors: [],
  },
  {
    id: 'es-ES',
    name: 'Español',
    englishName: 'Spanish',
    maintainers: ['imaprototype'],
    contributors: [],
  },
  {
    id: 'fi-FI',
    name: 'Suomi',
    englishName: 'Finnish',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'fr-FR',
    name: 'Français',
    englishName: 'French',
    maintainers: ['AymericWilke'],
    contributors: [],
  },
  {
    id: 'is-IS',
    name: 'Íslenska',
    englishName: 'Icelandic',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'it-IT',
    name: 'Italiano',
    englishName: 'Italian',
    maintainers: ['valse'],
    contributors: [],
  },
  {
    id: 'ja-JP',
    name: '日本語',
    englishName: 'Japanese',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'ko-KR',
    name: '한국어',
    englishName: 'Korean',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'nb-NO',
    name: 'Norsk (Bokmål)',
    englishName: 'Norwegian (Bokmål)',
    maintainers: ['rexxars'],
    contributors: ['rexxars'],
  },
  {
    id: 'nl-NL',
    name: 'Nederlands',
    englishName: 'Dutch',
    maintainers: ['nickspaargaren'],
    contributors: [],
  },
  {
    id: 'nn-NO',
    name: 'Norsk (Nynorsk)',
    englishName: 'Norwegian (Nynorsk)',
    maintainers: ['s-rd'],
    contributors: [],
  },
  {
    id: 'pl-PL',
    name: 'Polski',
    englishName: 'Polish',
    maintainers: ['marcinincreo'],
    contributors: [],
  },
  {
    id: 'pt-BR',
    name: 'Português (Brasil)',
    englishName: 'Portuguese (Brazil)',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'pt-PT',
    name: 'Português',
    englishName: 'Portuguese',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'ru-KZ',
    name: 'Русский',
    englishName: 'Russian (Kazakhstan)',
    maintainers: ['yenbekbay'],
    contributors: [],
  },
  {
    id: 'sv-SE',
    name: 'Svenska',
    englishName: 'Swedish',
    maintainers: ['wisechimp'],
    contributors: [],
  },
  {
    id: 'th-TH',
    name: 'ไทย',
    englishName: 'Thai',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'tr-TR',
    name: 'Türkçe',
    englishName: 'Turkish',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'vi-VN',
    name: 'Tiếng Việt',
    englishName: 'Vietnamese',
    maintainers: [],
    contributors: [],
  },
  {
    id: 'zh-Hans',
    name: '简体中文',
    englishName: 'Chinese (Simplified)',
    maintainers: [],
    contributors: [],
    weekInfo: {
      firstDay: 1,
      weekend: [6, 7],
      minimalDays: 1,
    },
  },
  {
    id: 'zh-Hant',
    name: '繁體中文',
    englishName: 'Chinese (Traditional)',
    maintainers: [],
    contributors: [],
    weekInfo: {
      firstDay: 7,
      weekend: [6, 7],
      minimalDays: 1,
    },
  },
]

export default registry
