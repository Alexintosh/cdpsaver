import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';

const MOCK_CDP = {
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

const INITIAL_STATE = {
  cdp: MOCK_CDP,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CDP_SUCCESS:
      return { ...state, cdp: payload };

    default:
      return state;
  }
};
