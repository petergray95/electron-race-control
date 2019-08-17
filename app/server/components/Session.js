// @flow
import React, { Component } from 'react';
import { Button, Header } from 'semantic-ui-react'

import styles from './Session.css';

export default class Session extends Component<Props> {
  props: Props;

  render() {
    const name = 'Debug';
    return (
      <div className={styles.container}>
        <Header as='h1' inverted>{`Data Server: ${name}`}</Header>
        <Button positive>Start</Button>
        <Button negative>Stop</Button>
        <Button color='grey'>Remove Session</Button>
      </div>
    );
  }
}
