// import {} from '../actionTypes/generalActionTypes';

const INITIAL_STATE = {
  hasCdp: false,
};

export default (state = INITIAL_STATE, action) => {
  const { type /* ,payload */ } = action;

  switch (type) {
    default:
      return state;
  }
};
