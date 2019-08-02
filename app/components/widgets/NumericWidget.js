// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  message: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { message } = this.props;

    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
      >
        <Flexbox className={styles.contents} flexGrow={1}>
          {message.timestamp}
        </Flexbox>
      </Flexbox>
    );
  }
}
