// @flow
import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './Session.css';

type Props = {
  session: object,
  sessionCursorMeta: object
};

export default class Session extends Component<Props> {
  props: Props;

  render() {
    const { session, sessionCursorMeta } = this.props;

    const type = 'type';
    const sessionId = 'id';
    const name = 'name';
    const ipAddress = 'ip';

    return (
      <div className={styles.container}>
        <Form inverted onSubmit={this.handleSubmit}>
          <Header as="h1" inverted>
            Data Server
          </Header>
          <Form.Input fluid disabled label="Type" value={type} />
          <Form.Input fluid disabled label="ID" value={sessionId} />
          <Form.Input fluid label="Name" value={name} />
          <Form.Input fluid label="IP Address" value={ipAddress} />
        </Form>

        <Form>
          <Form.Group widths="equal">
            <Form.Button
              positive
              labelPosition="left"
              icon="play"
              content="Start"
              onClick={() => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:start',
                  sessionId: session.sessionId
                });
              }}
            />
            <Form.Button
              negative
              labelPosition="left"
              icon="stop"
              content="Stop"
              onClick={() => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:stop',
                  sessionId: session.sessionId
                });
              }}
            />
            <Form.Button
              color="grey"
              content="Remove Session"
              icon="trash"
              onClick={() => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:remove',
                  sessionId: session.sessionId
                });
              }}
            />
          </Form.Group>
        </Form>

        <Header as="h3" inverted>
          Last Record: {sessionCursorMeta.lastRecord}
        </Header>

        <Header as="h3" inverted>
          Number of Records: {sessionCursorMeta.numberRecords}
        </Header>
      </div>
    );
  }
}
