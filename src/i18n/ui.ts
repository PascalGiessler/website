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
    'nav.series': 'Series',
    'nav.tools': 'Tools',
    'nav.glossary': 'Glossary',
    'nav.cognitiveDebt': 'Cognitive Debt',
    'series.eyebrow': 'Series',
    'series.heroTitle': 'Three',
    'series.heroTitleAccent': 'arcs',
    'series.heroTitleTail': ', told in atoms.',
    'series.heroBody': "Each series is a connected sequence of short LinkedIn posts, written across two weeks. They make an argument together that no single post can make alone. The long-form synthesis of each lives on Writing.",
    'atom.linkedinAttribution': 'Originally on LinkedIn',
    'atom.linkedinCta': 'Read & reply →',
    'atom.backToSeries': '← Back to series',
    'atom.nextAtom': 'Next atom',
    'atom.synthesis': 'Synthesis',
    'atom.allAtoms': (n: number) => `All ${n} atoms`,

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
    'nav.series': 'Serien',
    'nav.tools': 'Werkzeuge',
    'nav.glossary': 'Glossar',
    'nav.cognitiveDebt': 'Cognitive Debt',
    'series.eyebrow': 'Serien',
    'series.heroTitle': 'Drei',
    'series.heroTitleAccent': 'Bögen',
    'series.heroTitleTail': ', erzählt in Atomen.',
    'series.heroBody': "Jede Serie ist eine zusammenhängende Folge kurzer LinkedIn-Beiträge, geschrieben über zwei Wochen. Gemeinsam tragen sie ein Argument, das kein einzelner Beitrag tragen kann. Die ausführliche Synthese jeder Serie steht unter Schreiben.",
    'atom.linkedinAttribution': 'Ursprünglich auf LinkedIn',
    'atom.linkedinCta': 'Lesen & antworten →',
    'atom.backToSeries': '← Zur Serie',
    'atom.nextAtom': 'Nächstes Atom',
    'atom.synthesis': 'Synthese',
    'atom.allAtoms': (n: number) => `Alle ${n} Atome`,

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
  return function t(key: UIKey, ...args: unknown[]): string {
    const v = ui[lang][key] ?? ui[defaultLang][key];
    return typeof v === "function" ? (v as (...a: unknown[]) => string)(...args) : (v as string);
  };
}

/**
 * Article-level routes that exist in exactly ONE language: each essay and each
 * series atom is written once, in German or in English, and is not translated.
 * A German essay lives at `/de/post/<slug>/`, an English one at `/post/<slug>/`.
 *
 * These pages therefore have no hreflang counterpart. Emitting one would point
 * crawlers at a URL that does not exist, so the layout omits the alternates
 * entirely and lets the canonical speak for itself.
 */
const SINGLE_LANGUAGE_ROUTES: RegExp[] = [
  /^\/post\//,
  /^\/de\/post\//,
  /^\/series\/[^/]+\/[^/]+/,
];

/** Whether this route exists in only one language (no translation pair). */
export function isSingleLanguageRoute(currentPath: string): boolean {
  return SINGLE_LANGUAGE_ROUTES.some((p) => p.test(currentPath));
}

/**
 * Whether the current path has a counterpart in the target language.
 * Used by the layout to decide whether to emit `<link rel="alternate" hreflang="de">`.
 */
export function hasLocalizedMirror(currentPath: string, targetLang: Lang): boolean {
  if (isSingleLanguageRoute(currentPath)) return false;
  if (targetLang === defaultLang) return true;
  return true;
}

/**
 * Returns the equivalent URL path in the target language.
 * `/about` ↔ `/de/about`, `/` ↔ `/de/`.
 * Caller should guard with `hasLocalizedMirror` for routes that are EN-only
 * (otherwise this returns a path to a 404).
 */
export function getLocalizedPath(currentPath: string, targetLang: Lang): string {
  const stripped = currentPath.replace(/^\/de(\/|$)/, '/');
  const normalized = stripped === '' ? '/' : stripped;

  const base = targetLang === defaultLang
    ? normalized
    : normalized === '/' ? '/de/' : `/de${normalized}`;

  // Keep every generated link on the trailing-slash form (matches astro.config
  // trailingSlash:'always'), so hreflang + the language switcher never point at a
  // URL that GitHub Pages would 301-redirect.
  return base.endsWith('/') ? base : `${base}/`;
}
