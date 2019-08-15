// @flow
import { ipcRenderer } from 'electron-better-ipc';
import React, { Component } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';

import BaseWidgetPage from '../containers/widgets/BaseWidgetPage';
import ipcConstants from '../../../shared/constants/ipc-channels';

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

    this.addItem = this.addItem.bind(this);

    this.initialiseCommands();
  }

  initialiseCommands() {
    ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
      switch (message) {
        case "dash:addwidget": {
          this.addItem();
          break;
        }
        default: {
          console.log(message);
          break;
        }
      }
    })
  }

  createElement(el) {
    const { i } = el;

    return (
      <div key={i} data-grid={el}>
        <BaseWidgetPage onClose={this.onRemoveItem.bind(this, i)} />
      </div>
    );
  }

  addItem() {
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
        <ResponsiveReactGridLayout {...this.props}>
          {_.map(items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
