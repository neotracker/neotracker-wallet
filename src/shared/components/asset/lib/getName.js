/* @flow */
import locale2 from 'locale2'

import { getBest } from '~/src/lib/locale-id';

import {
  ANTSHARES_ASSET_HASH,
  ANTCOINS_ASSET_HASH,
} from '~/src/lib/blockchain/shared/constants';

const NAME_MAP = {
  [ANTSHARES_ASSET_HASH]: 'NEO',
  [ANTCOINS_ASSET_HASH]: 'GAS',
};

const getName = (name, lang) => {
  const nameObj = name.find(n => n.lang === lang);
  return nameObj == null ? null : nameObj.name;
};

// TODO: INTL
export default (name: $ReadOnlyArray<{ +name: string, +lang: string }>, hash: string) => {
  let finalName = NAME_MAP[hash];
  if (finalName == null) {
    const langs = name.map(n => n.lang);
    const lang = getBest(langs, locale2);

    if (lang == null) {
      const enLang = getBest(langs, 'en');
      if (enLang != null) {
        finalName = getName(name, enLang);
      }
    } else {
      finalName = getName(name, lang);
    }

    if (finalName == null) {
      if (name.length > 0) {
        finalName = name[0].name;
      } else {
        finalName = hash;
      }
    }
  }

  return finalName;
}
