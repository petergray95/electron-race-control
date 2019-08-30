// @flow
import React, { Component } from 'react';
import { Header, Form, Segment, Button } from 'semantic-ui-react';
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
    const isLastRecordValid = lastRecord > 0;

    return (
      <div className={styles.container}>
        <Form inverted onSubmit={this.handleSubmit}>
          <Header as="h1" inverted>
            Data Server [{session.sessionType.toUpperCase()}]
          </Header>
          <Header as="h3" inverted>
            Configuration
          </Header>
          <Form.Group widths="equal" inline>
            <Form.Input fluid label="Name" value={session.name} />
            <Form.Input
              fluid
              disabled
              label="Type"
              value={session.sessionType.toUpperCase()}
            />
            <Form.Input fluid disabled label="ID" value={session.sessionId} />
          </Form.Group>
          <Form.Input fluid label="Color" value={session.color} />
        </Form>

        <Segment inverted>
          <Button
            inverted
            labelPosition="left"
            color="green"
            icon="play"
            content="Start"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:start',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
            color="red"
            icon="stop"
            content="Stop"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:stop',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
            color="orange"
            content="Remove Session"
            icon="trash"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:remove',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
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
        </Segment>

        <Segment inverted>
          <Header as="h3" inverted>
            Last record:{' '}
            {isLastRecordValid ? (
              <Moment unix format="HH:mm:ss.SSS">
                {lastRecord / 1000}
              </Moment>
            ) : null}
          </Header>

          <Header as="h3" inverted>
            Number of records: {sessionCursorMeta.numberRecords}
          </Header>
        </Segment>
      </div>
    );
  }
}
