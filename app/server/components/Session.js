// @flow
import React, { Component } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './Session.css';

type Props = {
  session: object
};

export default class Session extends Component<Props> {
  props: Props;

  render() {
    const { session } = this.props;
    return (
      <div className={styles.container}>
        <Header as="h1" inverted>{`Data Server: ${session.id}`}</Header>
        <Button.Group>
          <Button
            positive
            labelPosition="left"
            icon="play"
            content="Start"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:start',
                session_id: session.id
              });
            }}
          />
          <Button
            negative
            labelPosition="left"
            icon="stop"
            content="Stop"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:stop',
                session_id: session.id
              });
            }}
          />
        </Button.Group>
        <Button
          color="grey"
          content="Remove Session"
          icon="trash"
          onClick={() => {
            ipcRenderer.send(ipcConstants.COMMAND, {
              command: 'server:remove',
              session_id: session.id
            });
          }}
        />
      </div>
    );
  }
}
