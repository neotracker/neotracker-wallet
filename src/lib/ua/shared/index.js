/* @flow */
export type UserAgent = {
  ua: string,
  browser: {
    name: string,
    version: string,
  },
  device: {
    model: string,
    type: string,
    vendor: string,
  },
  engine: {
    name: string,
    version: string,
  },
  os: {
    name: string,
    version: string,
  },
  cpu: {
    architecture: string,
  },
};

const getVersionPrecision = (version: string) => version.split('.').length;

const getChunk = (version: string, precision: number) => {
  const delta = precision - getVersionPrecision(version);

  // 2) "9" -> "9.0" (for precision = 2)
  const newVersion = version + new Array(delta + 1).join('.0');

  // 3) "9.0" -> ["000000000"", "000000009"]
  return newVersion
    .split('.')
    .map(chunk => new Array(20 - chunk.length).join('0') + chunk)
    .reverse();
};

// eslint-disable-next-line
const compareVersions = (a: string, b: string) => {
  // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
  let precision = Math.max(
    getVersionPrecision(a),
    getVersionPrecision(b),
  );
  const chunkA = getChunk(a, precision);
  const chunkB = getChunk(b, precision);
  // iterate in reverse order by reversed chunks array
  // eslint-disable-next-line
  while (--precision >= 0) {
    // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
    if (chunkA[precision] > chunkB[precision]) {
      return 1;
    } else if (chunkA[precision] < chunkB[precision]) {
      return -1;
    }
  }

  return 0;
};

// TODO: Test me
type Comparison = '>' | '>=' | '=' | '<=' | '<';
// eslint-disable-next-line
const checkVersion = (
  versionA: string,
  comparison: Comparison,
  versionB: string,
) => {
  const result = compareVersions(versionA, versionB);
  switch (comparison) {
    case '>':
      return result > 0;
    case '<':
      return result < 0;
    case '>=':
      return result >= 0;
    case '<=':
      return result <= 0;
    case '=':
      return result === 0;
    // Should never hit this case
    default:
      return false;
  }
};

export default { checkVersion };
