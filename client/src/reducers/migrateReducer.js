import {
  MIGRATE_CDP_REQUEST,
  MIGRATE_CDP_SUCCESS,
  MIGRATE_CDP_FAILURE,
  MIGRATE_CDP_RESET,
} from '../actionTypes/migrateActionsTypes';

const INITIAL_STATE = {
  migrating: false,
  migratingError: '',
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case MIGRATE_CDP_REQUEST:
      return { ...state, migrating: true };

    case MIGRATE_CDP_SUCCESS:
      return {
        ...state,
        migrating: false,
        migratingError: '',
      };

    case MIGRATE_CDP_FAILURE:
      return {
        ...state,
        migrating: false,
        migratingError: payload,
      };

    case MIGRATE_CDP_RESET:
      return {
        ...state,
        migrating: false,
        migratingError: '',
      };

    default:
      return state;
  }
};
