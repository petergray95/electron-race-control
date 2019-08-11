// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  channel: string,
  message: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { message, channel } = this.props;

    return (
      <Flexbox flexDirection="column" minHeight="100%" minWidth="100%">
        <Flexbox className={styles.contents} flexGrow={1}>
          {message[channel]}
        </Flexbox>
      </Flexbox>
    );
  }
}
