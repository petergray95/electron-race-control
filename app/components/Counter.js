// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes';

type Props = {
  newMessage: () => void,
  counter: object
};

export default class Counter extends Component<Props> {
  props: Props;

  render() {
    const { newMessage, counter } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter.timestamp}
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={newMessage}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-plus" />
          </button>
        </div>
      </div>
    );
  }
}
