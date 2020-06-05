## react-native-pull-refresh

Pull down to refresh component for React Native, Automatically adapt to height like a normal View Tag.

## Screenshot

<img src="https://raw.githubusercontent.com/TokisakiYuu/react-native-pull-refresh/master/example/screenshot/Screenshot-2020-06-05-16-02-20-138.gif" height = "500" alt="screenshot" align=center />

## Installation

Using npm:

```shell
npm install --save react-native-pull-refresh
```

or using yarn:

```shell
yarn add react-native-pull-refresh
```

Then follow the instructions for your platform to link react-native-video into your project:

## Usage

```javascript
// Load the module

import PullRefreshView from 'react-native-pull-refresh';

// please use component state variable on `refreshing` prop

<PullRefreshView refreshing={false}>
  <YourContent />
</PullRefreshView>
```

### Configurable props
* [refreshing](#refreshing)
* [enabled](#enabled)
* [disableScroll](#disableScroll)
* [ControlContentComponent](#ControlContentComponent)

### Event props
* [onPull](#onPull)
* [onPullEnd](#onPullEnd)
* [onRefresh](#onRefresh)

### Methods
*none*


#### refreshing
Whether is refreshing state.
* **true**
* **false (default)**

Platforms: all

#### enabled
Whether to enable pull down to refresh gesture
* **true (default)**
* **false**

Platforms: all

#### disableScroll
Make ```<YourContent />``` unscrollable.
* **true**
* **false (default)**

Platforms: all

#### ControlContentComponent
Override default pull down controller.
* ```React Component```

Platforms: all

#### onPull
Receive touch move events.
* ```Callback Function```
```javascript
  (event) => {
    event.touch: Boolean,      // have finger on Compnenet
    event.process: Number,     // 0 ~ 1 , pull down percent
  }
```

Platforms: all

#### onPullEnd
Receive touch end events.
* ```Callback Function```
```javascript
  () => {}
```

Platforms: all

#### onRefresh
Pull down percent is more than 0.8 on onPullEnd event after.
* ```Callback Function```
```javascript
  () => {}
```

Platforms: all


**MIT Licensed**
