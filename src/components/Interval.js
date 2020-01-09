import React from 'react';
import { connect } from '../store';
import { incrementInterval, decrementInterval } from '../store/actions';

class IntervalComponent extends React.Component {
  render() {
    return (
      <div>
        <span>Интервал обновления секундомера: {this.props.currentInterval} сек.</span>
        <span>
          <button onClick={this.props.decrementInterval}>-</button>
          <button onClick={this.props.incrementInterval}>+</button>
        </span>
      </div>
    );
  }
}

export const Interval = connect(
state => ({
  currentInterval: state,
}),
{
  incrementInterval,
  decrementInterval
})(IntervalComponent);
