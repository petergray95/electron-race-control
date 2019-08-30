// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './BaseWidget.css';

import TitleBarWidgetPage from '../../containers/widgets/TitleBarWidgetPage';
import HeaderWidgetPage from '../../containers/widgets/HeaderWidgetPage';
import NumericWidgetPage from '../../containers/widgets/NumericWidgetPage';
import WidgetSettingsModal from './WidgetSettingsModal';

type Props = {
  onClose: method,
  sessions: object
};

type State = {
  activeSessionId: string,
  channel: string,
  isWidgetSettingsOpen: boolean,
  isHovering: boolean
};

export default class BaseWidget extends Component<Props> {
  props: Props;

  state: State;

  constructor(props) {
    super(props);

    this.state = {
      channel: 'm_engineRPM',
      activeSessionId:
        Object.keys(props.sessions).length > 0
          ? Object.values(props.sessions)[0].sessionId
          : '',
      isWidgetSettingsOpen: false,
      isHovering: false
    };
  }

  componentDidUpdate(prevProps) {
    const { sessions } = this.props;
    if (sessions !== prevProps.sessions) {
      this.onSessionsUpdate();
    }
  }

  onSessionsUpdate() {
    const { sessions } = this.props;
    const { activeSessionId } = this.state;

    if (Object.keys(sessions).length === 0 && activeSessionId.length !== 0) {
      this.setState({ activeSessionId: '' });
    }

    if (Object.keys(sessions).length > 0 && activeSessionId.length === 0) {
      this.setState({ activeSessionId: Object.values(sessions)[0].sessionId });
    }
  }

  handleActiveSessionChange = (event, data) => {
    this.setState({ activeSessionId: data.value });
  };

  handleSettingsToggle = () => {
    const { isWidgetSettingsOpen } = this.state;
    this.setState({ isWidgetSettingsOpen: !isWidgetSettingsOpen });
  };

  handleMouseHover = () => {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    const { onClose, sessions } = this.props;
    const { activeSessionId, channel, isWidgetSettingsOpen, isHovering } = this.state;

    return (
      <Flexbox
        className={styles.container}
        flexDirection="column"
        minHeight="100%"
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
      >
        <Flexbox>
          <WidgetSettingsModal
            handleSettingsToggle={this.handleSettingsToggle}
            isOpen={isWidgetSettingsOpen}
          />
          {
            isHovering &&
            <TitleBarWidgetPage
              title="Numeric Widget"
              sessions={sessions}
              onClose={onClose}
              activeSessionId={activeSessionId}
              handleActiveSessionChange={this.handleActiveSessionChange}
            />
          }
        </Flexbox>
        <Flexbox flexDirection="column" flexGrow={1}>
          <Flexbox>
            <HeaderWidgetPage
              handleSettingsToggle={this.handleSettingsToggle}
              sessionId={activeSessionId}
            />
          </Flexbox>
          <Flexbox flexGrow={1}>
            <NumericWidgetPage sessionId={activeSessionId} channel={channel} />
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  }
}
