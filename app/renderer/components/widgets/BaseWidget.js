// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './BaseWidget.css';

import HeaderWidgetPage from '../../containers/widgets/HeaderWidgetPage';
import NumericWidgetPage from '../../containers/widgets/NumericWidgetPage';

type Props = {
  onClose: method,
  sessions: object
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
      activeSessionId: (Object.keys(props.sessions).length > 0) ? Object.values(props.sessions)[0].sessionId : ''
    };
  }

  componentDidUpdate(prevProps) {
    const { sessions } = this.props;
    if (sessions !== prevProps.sessions) {
      this.onSessionsUpdate();
    }
  };

  onSessionsUpdate() {
    const { sessions } = this.props;
    const { activeSessionId } = this.state;

    if (Object.keys(sessions).length === 0 && activeSessionId.length !== 0) {
      this.setState({activeSessionId: ''});
    };

    if (Object.keys(sessions).length > 0 && activeSessionId.length === 0) {
      this.setState({activeSessionId: Object.values(sessions)[0].sessionId});
    };
  };

  handleActiveSessionChange = (event, data) => {
    this.setState({ activeSessionId: data.value });
  }

  render() {
    const { onClose, sessions } = this.props;
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
            sessions={sessions}
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
