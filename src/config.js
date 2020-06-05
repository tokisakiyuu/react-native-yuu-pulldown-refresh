/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Spinkit from 'react-native-spinkit';
import {View} from 'react-native';

// 动态值参数(可用函数返回值)
const dynamicValueProps = {
  ControlContentComponent: (
    <Spinkit isVisible={true} color="blue" type="CircleFlip" size={40} />
    // <View style={{width: 40, height: 400, backgroundColor: 'green'}} />
  ),
};

// 值参数
const valueProps = {
  onPull: makeNoop(), // 当正在拉动时(高频调用)
  onPullEnd: makeNoop(), // 当拉动结束(抬手)时
  onRefresh: makeNoop(), // 当视图开始刷新时
  enabled: true, // 是否启用下拉刷新
  refreshing: false, // 是否正在刷新
  disableScroll: false, // 是否禁用滚动
};

/**
 * 创建配置
 * @param {{
 *  moveContent: boolean | Function;
 *  pullDownComponent: Component | Function;
 * }} props
 */
export function createConfig(props) {
  const config = {};
  for (var propName in dynamicValueProps) {
    if (Reflect.has(props, propName)) {
      let value = props[propName];
      if (typeof value === 'function') {
        config[propName] = value();
      } else {
        config[propName] = value;
      }
    } else {
      config[propName] = dynamicValueProps[propName];
    }
  }

  for (var propName in valueProps) {
    if (Reflect.has(props, propName)) {
      config[propName] = props[propName];
    } else {
      config[propName] = valueProps[propName];
    }
  }
  return config;
}

function makeNoop() {
  return () => {};
}

export default createConfig;
