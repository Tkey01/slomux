import React from 'react';
import { bindActionCreators } from './bindActionCreators';
import PropTypes from 'prop-types';

export const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    class WrappedComponent extends React.Component {
      render() {
        const { dispatch } = this.context.store;
        
        return (
          <Component
            {...this.props}
            {...mapStateToProps(this.context.store.getState(), this.props)}
            {...bindActionCreators(mapDispatchToProps, dispatch, this.props)}
          />
        )
      }

      componentDidMount() {
        this.context.store.subscribe(this.handleChange);
      }

      componentWillUnmount() {
        this.context.store.unsubscribe(this.handleChange);
      }

      handleChange = () => {
        this.forceUpdate();
      }
    }

    WrappedComponent.contextTypes = {
      store: PropTypes.object,
    }

    return WrappedComponent
  }
  