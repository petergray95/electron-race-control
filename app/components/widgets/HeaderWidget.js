// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './HeaderWidget.css';

type Props = {
  title: string,
  onClose: method
};

export default class HeaderWidget extends Component<Props> {
  props: Props;

  render() {
    const { onClose, title } = this.props;

    return (
      <Flexbox
        flexDirection="row"
        minWidth="100%"
        justifyContent="space-between"
        className={styles.title}
      >
        <Flexbox>{title}</Flexbox>
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
