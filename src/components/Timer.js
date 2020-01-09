import React from 'react';
import { connect } from '../store';

import { Interval } from './Interval';

class TimerComponent extends React.Component {
  state = {
    currentTime: 0,
    currentInterval: 1,
    isRunning: false
  }

  constructor(props) {
    super(props);
    
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isRunning) {
      return {
        currentInterval: nextProps.currentInterval
      }
    }
    return null;
  }

  clearInterval() {
    clearInterval(this.interval);
  }

  startInterval() {
    this.clearInterval();

    this.interval = setInterval(() => {
      this.setState({
        currentTime: this.state.currentTime + this.state.currentInterval,
        isRunning: true
      }, this.updateInterval);
    }, this.props.currentInterval * 1000);
  }

  updateInterval() {
    if (this.state.currentInterval !== this.props.currentInterval) {
      this.setState({
        currentInterval: this.props.currentInterval
      }, this.startInterval);
    }
  }

  handleStart() {
    this.startInterval();
  }
  
  handleStop() {
    this.setState({ currentTime: 0, isRunning: false });

    this.clearInterval();
  } 

  render() {
    return (
      <div>
        <Interval />
        <div>
          Секундомер: {this.state.currentTime} сек.
        </div>
        <div>
          <button onClick={this.handleStart}>Старт</button>
          <button onClick={this.handleStop}>Стоп</button>
        </div>
      </div>
    );
  }
}

export const Timer = connect(state => ({
  currentInterval: state,
}), {})(TimerComponent);
