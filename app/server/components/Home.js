// @flow
import React, { Component } from 'react';
import SessionsPage from '../containers/SessionsPage';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return <SessionsPage />;
  }
}
