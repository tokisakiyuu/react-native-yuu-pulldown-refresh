/* eslint-disable consistent-this */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';

export default class PullControlView extends React.Component {
  pullDownHeight = 140;
  refreshActionPosition = 0.8;
  currentPullHeight = new Animated.Value(0);
  startPoint = {x: 0, y: 0};
  isRefreshing = false;
  constructor(props) {
    super(props);
  }

  render() {
    let self = this;
    let {pullDownHeight, currentPullHeight} = this;
    let {ControlContentComponent, refreshing} = this.props;
    let targetContent = this.props.children;
    if (refreshing) {
      self.activeRefresh();
    } else {
      self.cancelRefresh();
    }
    return (
      <View
        style={{...style.container}}
        // onStartShouldSetResponderCapture={event => this.touchStart(event)}
        onMoveShouldSetResponder={event => this.touchMove(event)}
        onTouchEnd={event => this.touchEnd(event)}>
        <Content display={targetContent} lock={this.props.disableScroll} />
        <Control
          height={pullDownHeight}
          translateY={currentPullHeight}
          content={ControlContentComponent}
        />
      </View>
    );
  }

  // 手指触碰时
  touchStart(event) {
    this.startPoint = this.getTouchPosition(event);
  }

  isTouching = false;

  // 手指移动
  touchMove(event) {
    if (!this.isAvailable()) {
      return;
    }
    if (!this.isTouching) {
      this.touchStart(event);
      this.isTouching = true;
    }
    let position = this.getTouchPosition(event);
    let frame = position.y - this.startPoint.y;
    this.moveByFrame(frame);
    let percent = frame / this.pullDownHeight;
    this.props.onPull({
      touch: true,
      process: percent > 1 ? 1 : percent < 0 ? 0 : percent,
    });
  }

  // 手指离开屏幕
  touchEnd(event) {
    this.isTouching = false;
    if (!this.isAvailable()) {
      return;
    }
    let self = this;
    let percent = this.currentPullHeight._value / this.pullDownHeight;
    this.props.onPull({touch: false, process: percent});
    this.props.onPullEnd();
    // 超过额定位置就触发刷新事件，用户需要在onRefresh事件中把refreshing状态改为true，否则将在回弹动画结束时立刻结束刷新动作
    if (percent >= this.refreshActionPosition) {
      self.attachOnRefresh();
      this.moveByPercent(this.refreshActionPosition).then(() => {
        self.setState({refreshing: false});
      });
    } else {
      this.cancelRefresh();
    }
  }

  getTouchPosition(event) {
    let e = event.nativeEvent;
    return {x: e.pageX, y: e.pageY};
  }

  // 主动刷新
  activeRefresh() {
    let self = this;
    let {isRefreshing, refreshActionPosition} = this;
    if (isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    return self.moveByPercent(refreshActionPosition);
  }

  // 取消刷新状态
  cancelRefresh() {
    let self = this;
    return self
      .moveByPercent(0)
      .then(() => {
        self.isRefreshing = false;
        self.startPoint = {x: 0, y: 0};
      })
      .then(() => {
        self.moveByFrame(0);
      });
  }

  // 触发onRefresh事件
  attachOnRefresh() {
    let self = this;
    return self.props.onRefresh();
  }

  // 按百分比移动下拉指示器
  moveByPercent(percent, duration) {
    return new Promise((resolve, _) => {
      let {currentPullHeight, pullDownHeight} = this;
      Animated.timing(currentPullHeight, {
        toValue: pullDownHeight * percent,
        duration: duration || 300,
        // useNativeDriver: true,
      }).start(res => {
        if (res.finished) {
          resolve();
        }
      });
    });
  }

  // 按帧移动 (高频调用)
  moveByFrame(num) {
    if (num > this.pullDownHeight) {
      return this.currentPullHeight.setValue(this.pullDownHeight);
    }
    if (num < 0) {
      return this.currentPullHeight.setValue(0);
    }
    this.currentPullHeight.setValue(num);
  }

  // 按帧移动 (阻尼)
  moveByFrameWithDamping(num) {
    let value = this.currentPullHeight._value;
    if (num === value) {
      return;
    }
    if (value < num) {
      this.moveByFrame(num - parseFloat((value * 0.8).toFixed(6)));
    } else {
      this.moveByFrame(num + parseFloat((value * 0.8).toFixed(6)));
    }
  }

  // 下拉刷新是否可用(当前未处于刷新状态且配置为可用)
  isAvailable() {
    return !this.isRefreshing && this.props.enabled;
  }
}

// 下拉指示器
function Control(props) {
  let {height, translateY, content} = props;
  return (
    <Animated.View
      style={{
        ...style.controller,
        height: height,
        top: -height,
        translateY: translateY,
      }}>
      {content}
    </Animated.View>
  );
}

// 要刷新的内容
function Content({display, lock}) {
  return (
    <View style={{...style.content}} pointerEvents={lock ? 'none' : 'auto'}>
      {display}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  controller: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});
