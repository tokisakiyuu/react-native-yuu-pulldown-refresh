import React from 'react';
import createConfig from './config';
import PullControlView from './PullControlView';

function PullRefreshView(props) {
  const config = createConfig(props);
  return <PullControlView {...config}>{props.children}</PullControlView>;
}

PullRefreshView.REFRESH_ACTION_POSITION = 0.8;
PullRefreshView.PULL_DOWN_HEIGHT = 140;

export default PullRefreshView;
