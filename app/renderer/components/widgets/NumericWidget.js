// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  value: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  state = {
    prefix: '49',
    suffix: 'ms-1'
  };

  render() {
    const { value } = this.props;
    const { prefix, suffix } = this.state;

    return (
      <Flexbox flexDirection="column" minHeight="100%" minWidth="100%">
        <Flexbox className={styles.contents} flexGrow={1}>
          {prefix}: {value} {suffix}
        </Flexbox>
      </Flexbox>
    );
  }
}
