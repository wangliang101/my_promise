/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
// 参考掘金文章 https://juejin.cn/post/6945319439772434469

// 定义状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject);
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;

  // 成功之后的值
  value = null;

  // 失败之后的原因
  reason = null;

  // 存储成功的回调函数
  // onFulfilledCallback = null;
  onFulfilledCallbacks = [];

  // 存储回调函数
  // onRejectedCallback = null;
  onRejectedCallbacks = [];

  // // resolve和reject为什么要用箭头函数？
  // // 如果直接调用的话，普通函数this指向的是window或者undefined
  // // 用箭头函数就可以让this指向当前实例对象

  // 更改成功后的状态
  resolve = (value) => {
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // 判断成功回调是否存在，如果存在就调用
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  // 更改失败后的状态
  reject = (reason) => {
    if (this.status === REJECTED) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  // then方法的实现
  then = (onFulfilled, onRejected) => {
    // // 判断状态
    // if (this.status === FULFILLED) {
    //   // 调用成功回调，并且把值返回
    //   onFulfilled(this.value);
    // } else if (this.status === REJECTED) {
    //   // 调用失败回调，并且把原因返回
    //   onRejected(this.reason);
    // } else if (this.status === PENDING) {
    //   // 因为不知道后面状态的变化，这里先将成功回调和失败回调存储起来
    //   // 等待后续调用
    //   this.onFulfilledCallbacks.push(onFulfilled);
    //   this.onRejectedCallbacks.push(onRejected);
    // }
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        const x = onFulfilled(this.value);
        // 传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    });
    return promise2;
  };
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if (x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}

export default MyPromise;
