// @flow
import React, { Component } from 'react';
import { Statistic } from 'semantic-ui-react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  value: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  state = {
    prefix: 'prefix',
    suffix: 'suffix'
  };

  render() {
    const { value } = this.props;
    const { prefix, suffix } = this.state;

    return (
      <Flexbox flexDirection="column" minHeight="100%" minWidth="100%">
        <Flexbox className={styles.contents} flexGrow={1}>
        <Statistic inverted color='red'>
          <Statistic.Value>{value}</Statistic.Value>
          <Statistic.Label>{suffix}</Statistic.Label>
        </Statistic>
        </Flexbox>
      </Flexbox>
    );
  }
}
