export const createStore = (reducer, initialState) => {
  let currentState = initialState
  const listeners = []

  const getState = () => currentState;

  const dispatch = action => {
    currentState = reducer(currentState, action);
    listeners.forEach(listener => listener());
  }

  const subscribe = listener => listeners.push(listener);

  const unsubscribe = listener => {
    const findedListenerIndex = listener.findIndex(listener);

    listeners.splice(findedListenerIndex, 1);
  }

  return {
    getState,
    dispatch,
    subscribe,
    unsubscribe
  }
}
