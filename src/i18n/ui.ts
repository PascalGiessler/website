export const languages = {
  en: 'EN',
  de: 'DE',
} as const;

export const defaultLang = 'en';

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'meta.siteTitle': 'Pascal Giessler | AI Principal & Cloud Architect',
    'meta.defaultDescription': "Dr. Pascal Giessler is a German AI Principal, cloud architect, PhD and external lecturer at KIT Karlsruhe, and technical thought leader based in Freiburg. Helping engineering leaders move from AI experimentation to production confidence.",
    'meta.ogLocale': 'en_GB',
    'meta.ogLocaleAlternate': 'de_DE',
    'lang.htmlAttr': 'en',

    'nav.about': 'About',
    'nav.writing': 'Writing',
    'nav.publications': 'Publications',

    'switcher.label': 'Language',
    'switcher.toEnglish': 'English',
    'switcher.toGerman': 'Deutsch',

    'badge.languageEN': 'EN',
    'badge.languageDE': 'DE',

    'post.minRead': 'min read',
    'post.older': '← Older',
    'post.newer': 'Newer →',
    'post.allWriting': '← All writing',

    'footer.impressum': 'Impressum',
  },
  de: {
    'meta.siteTitle': 'Pascal Giessler | KI Principal & Cloud Architekt',
    'meta.defaultDescription': "Dr. Pascal Giessler ist KI Principal, Cloud-Architekt, promovierter Informatiker und externer Dozent am KIT Karlsruhe, technischer Vordenker aus Freiburg. Begleitet Engineering-Leitungen von KI-Experimenten zur produktiven Reife.",
    'meta.ogLocale': 'de_DE',
    'meta.ogLocaleAlternate': 'en_GB',
    'lang.htmlAttr': 'de',

    'nav.about': 'Über mich',
    'nav.writing': 'Schreiben',
    'nav.publications': 'Publikationen',

    'switcher.label': 'Sprache',
    'switcher.toEnglish': 'English',
    'switcher.toGerman': 'Deutsch',

    'badge.languageEN': 'EN',
    'badge.languageDE': 'DE',

    'post.minRead': 'Min. Lesezeit',
    'post.older': '← Älter',
    'post.newer': 'Neuer →',
    'post.allWriting': '← Alle Beiträge',

    'footer.impressum': 'Impressum',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment in languages) return segment as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Returns the equivalent URL path in the target language.
 * `/about` ↔ `/de/about`, `/` ↔ `/de/`, `/post/foo` ↔ `/de/post/foo`.
 */
export function getLocalizedPath(currentPath: string, targetLang: Lang): string {
  const stripped = currentPath.replace(/^\/de(\/|$)/, '/');
  const normalized = stripped === '' ? '/' : stripped;

  if (targetLang === defaultLang) {
    return normalized;
  }

  if (normalized === '/') return '/de/';
  return `/de${normalized}`;
}
