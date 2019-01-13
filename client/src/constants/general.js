export const EMAIL_REGEX =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

export const MARKETPLACE_SORT_OPTIONS = [
  { label: 'Liquidation price descending', value: 'liq-dsc' },
  { label: 'Liquidation price ascending', value: 'liq-asc' },
  { label: 'Dai debt descending', value: 'liq-dsc' },
  { label: 'Dai debt ascending', value: 'liq-dsc' },
];

export const LS_ACCOUNT = 'LS_ACCOUNT';

export const MOCK_CDP = {
  id: 3613,
  owner: '0xB4cE4f46a567e794b91DE27BCc5a9D6A37AaB1c3',
  depositedPETH: 5820083806803827794,
  generatedDAI: 271015737916404574032,
  depositedETH: 6.054011114131279224655322198571386,
  depositedUSD: 870.93003887892582925891465148647958996,
  liquidationPrice: 67.14946491024752541585,
  debtDai: 271.02,
  isSafe: true,
  ratio: 3.2135773574432274,
};
