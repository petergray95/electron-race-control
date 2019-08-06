// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

import HeaderWidget from './HeaderWidget';

type Props = {
  channel: string,
  onClose: method,
  message: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { message, channel, onClose } = this.props;

    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
      >
        <Flexbox className={styles.header}>
          <HeaderWidget channel={channel} onClose={onClose} />
        </Flexbox>
        <Flexbox className={styles.contents} flexGrow={1}>
          {message.timestamp}
        </Flexbox>
      </Flexbox>
    );
  }
}
