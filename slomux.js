// Slomux — упрощённая, сломанная реализация Flux.
// Перед вами небольшое приложение, написанное на React + Slomux.
// Это нерабочий секундомер с настройкой интервала обновления.

// Исправьте ошибки и потенциально проблемный код, почините приложение и прокомментируйте своё решение.

// При нажатии на "старт" должен запускаться секундомер и через заданный интервал времени увеличивать свое значение на значение интервала
// При нажатии на "стоп" секундомер должен останавливаться и сбрасывать свое значение

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const createStore = (reducer, initialState) => {
  let currentState = initialState
  const listeners = []

  const getState = () => currentState
  const dispatch = action => {
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = listener => listeners.push(listener)
  // Нужно добавить метод unsubscribe,
  // ниже написано почему

  return { getState, dispatch, subscribe }
}

const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    class WrappedComponent extends React.Component {
      render() {
        return (
          <Component
            {...this.props}
            {...mapStateToProps(this.context.store.getState(), this.props)}
            {...mapDispatchToProps(this.context.store.dispatch, this.props)}
          />
        )
      }

      componentDidUpdate() {
        this.context.store.subscribe(this.handleChange)
      }

      // При анмаунте компонента нужен вызов метода this.context.store.unsubscribe(this.handleChange)
      // чтобы отписаться от обновлений стора в этом компоненте
      // Иначе вылезет ошибка, когда мы вызовем handleChange(), который будет равнятся undefined

      handleChange = () => {
        this.forceUpdate()
      }
    }

    WrappedComponent.contextTypes = {
      store: PropTypes.object,
    }

    return WrappedComponent
  }

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    }
  }
  
  render() {
    return React.Children.only(this.props.children)
  }
}

Provider.childContextTypes = {
  store: PropTypes.object,
}

// APP

// actions
// Для большей наглядности (сугубо моё мнение)
// есть смысл сделать 2 actionCreator-а: на прибавление и убавление значения
const CHANGE_INTERVAL = 'CHANGE_INTERVAL'

// action creators
const changeInterval = value => ({
  type: CHANGE_INTERVAL,
  payload: value,
})


// reducers
// По-дефолту нужно возвращать число, т.к. в данном случае стейт у нас является числом
// Также нужно сделать так, чтобы возвращаемый интервал был не меньше 1
const reducer = (state, action) => {
  switch(action.type) {
    case CHANGE_INTERVAL:
      return state += action.payload
    default:
      return {}
  }
}

// components

// Каждый рендер создаются новые функции, что не есть хорошо
class IntervalComponent extends React.Component {
  render() {
    return (
      <div>
        <span>Интервал обновления секундомера: {this.props.currentInterval} сек.</span>
        <span>
          <button onClick={() => this.props.changeInterval(-1)}>-</button>
          <button onClick={() => this.props.changeInterval(1)}>+</button>
        </span>
      </div>
    )
  }
}

// Можно написать обертку, чтобы каждый раз не писать так много кода в экшенах
// Также тут неправильный порядок аргументов, нужно поменять их местами
const Interval = connect(dispatch => ({
  changeInterval: value => dispatch(changeInterval(value)),
}),
state => ({
  currentInterval: state,
}))(IntervalComponent)

// 1. Нужно забиндить handleStart и handleStop, чтобы методы имели доступ к контексту this
// 2. Нужно добавить метод clearInterval, чтобы таймер не продолжал идти после остановки
// 3. Для точной работы таймера и для возможности смены интервала прямо "на ходу"
//    нужно добавить 2 поля в стейт: currentInterval и isRunning
//    первое будет сравниваться с currentInterval из глобального стора в конце (это важно для корректного подсчета общего времени)
//    каждой итерации, а второе будет отвечать за определение состояния секундомера: работает сейчас или нет.
//    Если секундомер не запущен в данный момент, а currentInterval из глобального стора изменился, нужно синхронизировать
//    стейт компонента с глобальным хранилищем
class TimerComponent extends React.Component {
  state = {
    currentTime: 0
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
    )
  }

  handleStart() {
    setTimeout(() => this.setState({
      currentTime: this.state.currentTime + this.props.currentInterval,
    }), this.props.currentInterval)
  }
  
  handleStop() {
    this.setState({ currentTime: 0 })
  }
}

const Timer = connect(state => ({
  currentInterval: state,
}), () => {})(TimerComponent)

// init
// Нужно задать начальное значение интервала во втором аргументе createStore
ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Timer />
  </Provider>,
  document.getElementById('root')
)

// Для лучшей навигации по коду можно разбить его на отдельные файлы
