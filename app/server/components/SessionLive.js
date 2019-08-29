// @flow
import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import Moment from 'react-moment';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './Session.css';

type Props = {
  session: object,
  sessionCursorMeta: object
};

export default class SessionLive extends Component<Props> {
  props: Props;

  render() {
    const { session, sessionCursorMeta } = this.props;

    const { lastRecord } = sessionCursorMeta;
    const lastRecordValid = lastRecord > 0;

    return (
      <div className={styles.container}>
        <Form inverted onSubmit={this.handleSubmit}>
          <Header as="h1" inverted>
            Data Server [LIVE]
          </Header>
          <Form.Group widths="equal" inline>
            <Form.Input fluid label="Name" value={session.name} />
            <Form.Input
              fluid
              disabled
              label="Type"
              value={session.sessionType}
            />
            <Form.Input fluid disabled label="ID" value={session.sessionId} />
          </Form.Group>
          <Form.Input fluid label="Color" value={session.color} />
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
            <Form.Button
              color="blue"
              content="Export Session"
              icon="download"
              onClick={() => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:download',
                  sessionId: session.sessionId
                });
              }}
            />
          </Form.Group>
        </Form>

        <Header as="h3" inverted>
          Last record:{' '}
          {lastRecordValid ? (
            <Moment unix format="HH:mm:ss.SSS">
              {lastRecord / 1000}
            </Moment>
          ) : null}
        </Header>

        <Header as="h3" inverted>
          Number of records: {sessionCursorMeta.numberRecords}
        </Header>
      </div>
    );
  }
}
