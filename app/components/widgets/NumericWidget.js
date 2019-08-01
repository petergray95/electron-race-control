// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  counter: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { counter } = this.props;

    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
      >
        <Flexbox className={styles.contents} flexGrow={1}>
          {counter.timestamp}
        </Flexbox>
      </Flexbox>
    );
  }
}
