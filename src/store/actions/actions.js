import { 
  INCREMENT_INTERVAL,
  DECREMENT_INTERVAL
} from './constants';

// action creators
export const incrementInterval = () => ({
  type: INCREMENT_INTERVAL
});

export const decrementInterval = () => ({
  type: DECREMENT_INTERVAL
});
