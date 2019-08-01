// @flow
import React, { Component } from 'react';

type Props = {
  counter: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { counter } = this.props;

    return <div>NW: {counter.timestamp}</div>;
  }
}
