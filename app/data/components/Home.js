// @flow
import React, { Component } from 'react';
import DashPage from './Dash';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return <DashPage />;
  }
}
