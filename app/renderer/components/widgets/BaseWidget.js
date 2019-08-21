// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './BaseWidget.css';

import HeaderWidgetPage from '../../containers/widgets/HeaderWidgetPage';
import NumericWidgetPage from '../../containers/widgets/NumericWidgetPage';

type Props = {
  onClose: method
};

type State = {
  activeSessionId: string,
  channel: string
};

export default class BaseWidget extends Component<Props> {
  props: Props;

  state: State;

  constructor(props) {
    super(props);

    this.state = {
      channel: '49',
      activeSessionId: ''
    };
  }

  handleActiveSessionChange = sessionId =>
    this.setState({ activeSessionId: sessionId });

  render() {
    const { onClose } = this.props;
    const { activeSessionId, channel } = this.state;
    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
      >
        <Flexbox>
          <HeaderWidgetPage
            title="Numeric Widget"
            onClose={onClose}
            activeSessionId={activeSessionId}
            handleActiveSessionChange={this.handleActiveSessionChange}
          />
        </Flexbox>
        <Flexbox flexGrow={1}>
          <NumericWidgetPage sessionId={activeSessionId} channel={channel} />
        </Flexbox>
      </Flexbox>
    );
  }
}
