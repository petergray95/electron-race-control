// @flow
import React, { Component } from 'react';

import dataModel from '../data';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    dataModel.addSession().debugStart();
  }

  render() {
    return <div>hello</div>;
  }
}
