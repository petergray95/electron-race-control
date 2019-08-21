// @flow
import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Flexbox from 'flexbox-react';

import styles from './HeaderWidget.css';

type Props = {
  title: string,
  onClose: method,
  handleActiveSessionChange: method,
  sessions: object,
  activeSessionId: string
};

export default class HeaderWidget extends Component<Props> {
  props: Props;

  handleActiveSessionChange = (event, data) => {
    const { handleActiveSessionChange } = this.props;
    handleActiveSessionChange(data.value);
  };

  render() {
    const { activeSessionId, title, onClose, sessions } = this.props;
    const options = [];

    if (activeSessionId.length === 0 && Object.keys(sessions).length > 0) {
      const { handleActiveSessionChange } = this.props;
      handleActiveSessionChange(Object.values(sessions)[0].sessionId);
    }

    Object.keys(sessions).forEach(sessionId => {
      const session = sessions[sessionId];

      const row = {
        key: session.sessionId,
        text: session.sessionId,
        value: session.sessionId
      };

      options.push(row);
    });

    return (
      <Flexbox
        flexDirection="row"
        minWidth="100%"
        justifyContent="space-between"
        className={styles.title}
      >
        <Flexbox>{title}</Flexbox>
        <Flexbox>
          <Dropdown
            color={
              activeSessionId.length === 0
                ? 'white'
                : sessions[activeSessionId].color
            }
            inline
            options={options}
            value={activeSessionId}
            onChange={this.handleActiveSessionChange}
          />
        </Flexbox>
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
