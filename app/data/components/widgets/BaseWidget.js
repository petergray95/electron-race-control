// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './BaseWidget.css';

import HeaderWidget from './HeaderWidget';
import NumericWidgetPage from '../../containers/widgets/NumericWidgetPage';

type Props = {
  onClose: method
};

export default class BaseWidget extends Component<Props> {
  props: Props;

  render() {
    const { onClose } = this.props;
    const channel = 'timestamp';
    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
      >
        <Flexbox>
          <HeaderWidget title="Numeric Widget" onClose={onClose} />
        </Flexbox>
        <Flexbox flexGrow={1}>
          <NumericWidgetPage channel={channel} />
        </Flexbox>
      </Flexbox>
    );
  }
}
