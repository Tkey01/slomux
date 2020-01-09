import React from 'react';
import { bindActionCreators } from './bindActionCreators';
import PropTypes from 'prop-types';

export const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    class WrappedComponent extends React.Component {
      constructor(props, context) {
        super(props, context);

        const { dispatch } = this.context.store;

        this.state = {
          data: mapStateToProps(this.context.store.getState(), this.props),
          actions: bindActionCreators(mapDispatchToProps, dispatch, this.props)
        };
      }
      
      render() {
        return (
          <Component
            {...this.props}
            {...this.state.data}
            {...this.state.actions}
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
        const { dispatch } = this.context.store;
        
        this.setState({
          data: mapStateToProps(this.context.store.getState(), this.props),
          action: bindActionCreators(mapDispatchToProps, dispatch, this.props)
        });
      }
    }

    WrappedComponent.contextTypes = {
      store: PropTypes.object,
    }

    return WrappedComponent
  }
  