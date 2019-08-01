// @flow
import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';

type Props = {
  counter: object
};

export default class Counter extends Component<Props> {
  props: Props;

  render() {
    const { counter } = this.props;

    return (
      <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
        <div key="a" data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
          {counter.timestamp}
        </div>
        <div key="b" data-grid={{ x: 2, y: 0, w: 2, h: 2 }}>
          {counter.timestamp}
        </div>
        <div key="c" data-grid={{ x: 4, y: 0, w: 2, h: 2 }}>
          {counter.timestamp}
        </div>
      </GridLayout>
    );
  }
}
