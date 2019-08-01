// @flow
import React, { Component } from 'react';
import styles from './NumericWidget.css';

type Props = {
  counter: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { counter } = this.props;

    return <div className={styles.container}>NW: {counter.timestamp}</div>;
  }
}
