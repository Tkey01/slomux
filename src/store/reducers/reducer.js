import { INCREMENT_INTERVAL, DECREMENT_INTERVAL } from '../actions';

export const reducer = (state, action) => {
  switch(action.type) {
    case INCREMENT_INTERVAL:
      return state + 1;
    case DECREMENT_INTERVAL:
      return state - 1 > 0 ? state - 1 : 1;
    default:
      return 1;
  }
}
