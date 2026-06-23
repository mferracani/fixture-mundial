// Mapeo de nombres de equipos de openfootball (en inglés) al código ISO
// alpha-2 que usa nuestro mock. El join real con los partidos se hace por
// (grupo + par de códigos), así que la colisión de "GB" (Escocia e Inglaterra
// comparten código en el mock) queda desambiguada por el grupo: Escocia juega
// en el Grupo C e Inglaterra en el Grupo L.

/** Normaliza un nombre: minúsculas, sin acentos, sin signos, "&" -> "and". */
export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacríticos combinantes
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Clave: nombre normalizado de openfootball -> código ISO alpha-2 del mock.
const NAME_TO_CODE: Record<string, string> = {
  algeria: 'DZ',
  argentina: 'AR',
  australia: 'AU',
  austria: 'AT',
  belgium: 'BE',
  'bosnia and herzegovina': 'BA',
  brazil: 'BR',
  canada: 'CA',
  'cape verde': 'CV',
  'cabo verde': 'CV',
  colombia: 'CO',
  croatia: 'HR',
  curacao: 'CW',
  'czech republic': 'CZ',
  czechia: 'CZ',
  'dr congo': 'CD',
  'congo dr': 'CD',
  'democratic republic of the congo': 'CD',
  ecuador: 'EC',
  egypt: 'EG',
  england: 'GB',
  france: 'FR',
  germany: 'DE',
  ghana: 'GH',
  haiti: 'HT',
  iran: 'IR',
  'ir iran': 'IR',
  iraq: 'IQ',
  'ivory coast': 'CI',
  'cote divoire': 'CI',
  'cote d ivoire': 'CI',
  japan: 'JP',
  jordan: 'JO',
  mexico: 'MX',
  morocco: 'MA',
  netherlands: 'NL',
  'new zealand': 'NZ',
  norway: 'NO',
  panama: 'PA',
  paraguay: 'PY',
  portugal: 'PT',
  qatar: 'QA',
  'saudi arabia': 'SA',
  scotland: 'GB',
  senegal: 'SN',
  'south africa': 'ZA',
  'south korea': 'KR',
  'korea republic': 'KR',
  'korea south': 'KR',
  spain: 'ES',
  sweden: 'SE',
  switzerland: 'CH',
  tunisia: 'TN',
  turkey: 'TR',
  turkiye: 'TR',
  usa: 'US',
  'united states': 'US',
  'united states of america': 'US',
  uruguay: 'UY',
  uzbekistan: 'UZ',
}

/** Devuelve el código ISO alpha-2 para un nombre de openfootball, o null. */
export function ofNameToCode(name: string): string | null {
  return NAME_TO_CODE[normalizeName(name)] ?? null
}
