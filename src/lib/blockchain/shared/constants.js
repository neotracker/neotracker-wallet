/* @flow */
export type AntSharesAssetIDType =
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';
export const ANTSHARES_ASSET_HASH =
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';
export const ANTSHARES_ASSET_ID = 1;
export type AntCoinsAssetIDType =
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7';
export const ANTCOINS_ASSET_HASH =
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7';
export const ANTCOINS_ASSET_ID = 2;

export const NEO_COIN_ASSET = {
  transaction_hash: ANTSHARES_ASSET_HASH,
  name: [
    { 'lang': 'zh-CN', 'name': '小蚁股' },
    { 'lang': 'en', 'name': 'AntShare' },
  ],
};

export const GAS_COIN_ASSET = {
  transaction_hash: ANTCOINS_ASSET_HASH,
  name: [
    { 'lang': 'zh-CN', 'name': '小蚁币' },
    { 'lang': 'en', 'name': 'AntCoin' },
  ],
};

export const TRANSACTION_TYPES = [
  'MinerTransaction',
  'IssueTransaction',
  'ClaimTransaction',
  'EnrollmentTransaction',
  'RegisterTransaction',
  'ContractTransaction',
  'PublishTransaction',
  'InvocationTransaction',
];
export type TransactionType =
  'MinerTransaction' | // 0x00 Transactions for allocating byte fees
  'IssueTransaction' | // 0x01
  'ClaimTransaction' | // 0x02 Transactions for the distribution of AntShares coins
  'EnrollmentTransaction' | // 0x20 (Not usable) Special transaction for registration as a consensus candidate
  'RegisterTransaction' | // 0x40
  'ContractTransaction' | // 0x80 Contract transaction, which is the most commonly used transaction type
  'PublishTransaction' | // 0xd0 (Not usuable) Special Transactions for Smart Contracts
  'InvocationTransaction'; // 0xd1 Special transcations for calling smart contracts
