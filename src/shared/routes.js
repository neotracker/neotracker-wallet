/* @flow */
export const HOME = '/';
export const HEALTH_CHECK = '/healthcheck';
export const GRAPHQL = '/graphql';
export const PUBLIC = '/public';

export const makePublic = (path: string) => `${PUBLIC}${path}`;
export const makeRoot = (path: string) => path;

export const ERROR = '/error';

// Wallet
export const WALLET = '/wallet';
export const isWallet = (path: string) =>
  path.startsWith('/wallet');

// Transaction
export const TRANSACTION_HASH_ARGUMENT = 'transactionHash';
const TRANSACTION_HASH_PARAM = `:${TRANSACTION_HASH_ARGUMENT}`;
export const makeTransaction = (
  hash: string = TRANSACTION_HASH_PARAM,
) => `/tx/${hash}`;

export const TRANSACTION_SEARCH_PAGE_ARGUMENT = 'page';
const TRANSACTION_SEARCH_PAGE_PARAM = `:${TRANSACTION_SEARCH_PAGE_ARGUMENT}`;
export const makeTransactionSearch = (
  index: string | number = TRANSACTION_SEARCH_PAGE_PARAM,
) => `/browse/tx/${index}`

export const isTransaction = (path: string) =>
  path.startsWith('/tx/') ||
  path.startsWith('/browse/tx/');

// Address
export const ADDRESS_HASH_ARGUMENT = 'addressHash';
const ADDRESS_HASH_PARAM = `:${ADDRESS_HASH_ARGUMENT}`;
export const makeAddress = (
  hash: string = ADDRESS_HASH_PARAM,
) => `/address/${hash}`;

export const ADDRESS_SEARCH_PAGE_ARGUMENT = 'page';
const ADDRESS_SEARCH_PAGE_PARAM = `:${ADDRESS_SEARCH_PAGE_ARGUMENT}`;
export const makeAddressSearch = (
  index: string | number = ADDRESS_SEARCH_PAGE_PARAM,
) => `/browse/address/${index}`

export const isAddress = (path: string) =>
  path.startsWith('/address/') ||
  path.startsWith('/browse/address/');

// Block
export const BLOCK_HASH_ARGUMENT = 'blockHash';
const BLOCK_HASH_PARAM = `:${BLOCK_HASH_ARGUMENT}`;
export const makeBlockHash = (
  hash: string = BLOCK_HASH_PARAM,
) => `/block/hash/${hash}`;

export const BLOCK_INDEX_ARGUMENT = 'blockIndex';
const BLOCK_INDEX_PARAM = `:${BLOCK_INDEX_ARGUMENT}`;
export const makeBlockIndex = (
  index?: number,
) => `/block/height/${index == null ? BLOCK_INDEX_PARAM : index}`;

export const BLOCK_SEARCH_PAGE_ARGUMENT = 'page';
const BLOCK_SEARCH_PAGE_PARAM = `:${BLOCK_SEARCH_PAGE_ARGUMENT}`;
export const makeBlockSearch = (
  index: string | number = BLOCK_SEARCH_PAGE_PARAM,
) => `/browse/block/${index}`

export const isBlock = (path: string) =>
  path.startsWith('/block/hash/') ||
  path.startsWith('/block/height/') ||
  path.startsWith('/browse/block/');

// Asset
export const ASSET_HASH_ARGUMENT = 'assetHash';
const ASSET_HASH_PARAM = `:${ASSET_HASH_ARGUMENT}`;
export const makeAsset = (
  hash: string = ASSET_HASH_PARAM,
) => `/asset/${hash}`;

export const ASSET_SEARCH_PAGE_ARGUMENT = 'page';
const ASSET_SEARCH_PAGE_PARAM = `:${ASSET_SEARCH_PAGE_ARGUMENT}`;
export const makeAssetSearch = (
  index: string | number = ASSET_SEARCH_PAGE_PARAM,
) => `/browse/asset/${index}`

export const isAsset = (path: string) =>
  path.startsWith('/asset/') ||
  path.startsWith('/browse/asset/');

// Contract
export const CONTRACT_HASH_ARGUMENT = 'contractHash';
const CONTRACT_HASH_PARAM = `:${CONTRACT_HASH_ARGUMENT}`;
export const makeContract = (
  hash: string = CONTRACT_HASH_PARAM,
) => `/contract/${hash}`;

export const CONTRACT_SEARCH_PAGE_ARGUMENT = 'page';
const CONTRACT_SEARCH_PAGE_PARAM = `:${CONTRACT_SEARCH_PAGE_ARGUMENT}`;
export const makeContractSearch = (
  index: string | number = CONTRACT_SEARCH_PAGE_PARAM,
) => `/browse/contract/${index}`

export const isContract = (path: string) =>
  path.startsWith('/contract/') ||
  path.startsWith('/browse/contract/');

export const MAKE_SEARCH_VALUE_ARGUMENT = 'value';
const SEARCH_VALUE_PARAM = `:${MAKE_SEARCH_VALUE_ARGUMENT}`;
export const makeSearch = (
  value: string = SEARCH_VALUE_PARAM,
) => `/search/${value}`;

const EXPIRING_PATHS = [];
export const reloadLocation = (routerLocation: Object) => {
  if (EXPIRING_PATHS.includes(routerLocation.pathname)) {
    location.replace(HOME);
  } else {
    location.reload(true);
  }
};

export const makeURL = ({
  testNet,
  path,
}: {|
  testNet?: boolean,
  path: string,
|}) => {
  let subdomain = '';
  if (testNet) {
    subdomain = 'testnet.'
  }
  return `https://${subdomain}neotracker.io${path}`;
};
