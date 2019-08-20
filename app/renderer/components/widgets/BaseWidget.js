// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './BaseWidget.css';

import HeaderWidget from './HeaderWidget';
import NumericWidgetPage from '../../containers/widgets/NumericWidgetPage';

type Props = {
  onClose: method,
  sessionId: string
};

export default class BaseWidget extends Component<Props> {
  props: Props;

  render() {
    const { onClose, sessionId } = this.props;
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
          <NumericWidgetPage sessionId={sessionId} channel={channel} />
        </Flexbox>
      </Flexbox>
    );
  }
}
