// @flow
import React, { Component } from 'react';

type Props = {
  sessions: array
};

export default class Sessions extends Component<Props> {
  props: Props;

  render() {
    const { sessions } = this.props;
    console.log(sessions);
    return <div>Test</div>;
  }
}
