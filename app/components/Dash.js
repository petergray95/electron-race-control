// @flow
import React, { Component } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';

import NumericWidgetPage from '../containers/widgets/NumericWidgetPage';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Dash extends Component<Props> {
  static defaultProps = {
    className: 'layout',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [0, 1, 2, 3, 4].map(i => ({
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2
      })),
      newCounter: 0
    };

    this.onAddItem = this.onAddItem.bind(this);
  }

  createElement(el) {
    const { i } = el;
    const channel = 'mspeed';

    return (
      <div key={i} data-grid={el}>
        <NumericWidgetPage
          channel={channel}
          onClose={this.onRemoveItem.bind(this, i)}
        />
      </div>
    );
  }

  onAddItem() {
    this.setState(prevState => ({
      items: prevState.items.concat({
        i: `n  ${prevState.newCounter}`,
        x: (prevState.items.length * 2) % (prevState.cols || 12),
        y: Infinity,
        w: 2,
        h: 2
      }),
      newCounter: prevState.newCounter + 1
    }));
  }

  onRemoveItem(i) {
    this.setState(prevState => ({ items: _.reject(prevState.items, { i }) }));
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <button type="button" onClick={this.onAddItem}>
          Add Item
        </button>
        <ResponsiveReactGridLayout {...this.props}>
          {_.map(items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
