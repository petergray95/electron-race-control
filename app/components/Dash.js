// @flow
import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import NumericWidgetPage from '../containers/widgets/NumericWidgetPage';

export default class Dash extends Component<Props> {
  props: Props;

  render() {
    return (
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={30}
        width={1200}
        margin={[5, 5]}
      >
        <div key="a" data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
          <NumericWidgetPage />
        </div>
        <div key="b" data-grid={{ x: 2, y: 0, w: 2, h: 2 }}>
          <NumericWidgetPage />
        </div>
        <div key="c" data-grid={{ x: 4, y: 0, w: 2, h: 2 }}>
          <NumericWidgetPage />
        </div>
      </GridLayout>
    );
  }
}
