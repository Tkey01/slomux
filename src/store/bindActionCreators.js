export const bindActionCreators = (actions, dispatch, props) => {
  let bindedActions = {};

  if (typeof actions === 'function') {
    bindedActions = actions(dispatch, props);
  } else if (typeof actions === 'object') {
    bindedActions = Object.keys(actions).reduce((acc, actionName) => {
      acc[actionName] = () => dispatch(actions[actionName]());
      return acc;
    }, {});
  }
    
  return bindedActions;
}
