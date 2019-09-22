// @flow
import React, { Component } from 'react';
import { Button, Header, Form, Segment } from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './Session.css';

type Props = {
  session: object,
  laps: object
};

export default class SessionHistoric extends Component<Props> {
  props: Props;

  render() {
    const { session, laps } = this.props;
    console.log(laps);

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
            <Form.Input
              fluid
              required
              onChange={(event, data) => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:set_session_name',
                  sessionId: session.sessionId,
                  name: data.value
                });
              }}
              label="Name"
              value={session.name}
            />
            <Form.Input
              fluid
              disabled
              label="Type"
              value={session.sessionType.toUpperCase()}
            />
            <Form.Input fluid disabled label="ID" value={session.sessionId} />
          </Form.Group>
        </Form>

        <Segment inverted>
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
            Laps
          </Header>
        </Segment>
      </div>
    );
  }
}
