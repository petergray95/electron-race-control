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
        <Button
          positive
          onClick={() => {
            ipcRenderer.send(ipcConstants.COMMAND, [
              'server:start',
              session.id
            ]);
          }}
        >
          Start
        </Button>
        <Button
          negative
          onClick={() => {
            ipcRenderer.send(ipcConstants.COMMAND, ['server:stop', session.id]);
          }}
        >
          Stop
        </Button>
        <Button color="grey">Remove Session</Button>
      </div>
    );
  }
}
