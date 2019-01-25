# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.0.10"></a>
# 0.0.10 (2018-12-25)

<a name="0.0.11"></a>
# 0.0.11 (2018-12-25)

### Features

* onLoad强制不走延时（需要设置初始数据）

<a name="0.0.12"></a>
# 0.0.12 (2018-12-27)

### Features

* 完善README.md

<a name="0.0.13"></a>
# 0.0.13 (2018-12-28)

### Features

* 命名修改：throttle => debounce
* 部分参数初始值兜底

<a name="0.0.15"></a>
# 0.0.14 0.0.15 (2018-12-28)

### Features

* StateDiff判断是否相等函数化，并对es6新数据类型进行规避，减少纯使用JSON.stringify对特殊情况判断不出bug
* README中增加禁止store使用Set、Map、WeakSet、WeakMap、Symbol类型
