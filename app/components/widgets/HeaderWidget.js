// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './HeaderWidget.css';

type Props = {
  channel: string,
  onClose: method
};

export default class HeaderWidget extends Component<Props> {
  props: Props;

  render() {
    const { onClose, channel } = this.props;
    const title = `Channel: ${channel}`;
    return (
      <Flexbox
        flexDirection="row"
        minWidth="100%"
        justifyContent="space-between"
        className={styles.body}
      >
        <Flexbox className={styles.title}>{title}</Flexbox>
        <Flexbox
          role="button"
          onClick={onClose}
          onKeyPress={() => {}}
          tabIndex={0}
        >
          X
        </Flexbox>
      </Flexbox>
    );
  }
}
