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

  // // resolve和reject为什么要用箭头函数？
  // // 如果直接调用的话，普通函数this指向的是window或者undefined
  // // 用箭头函数就可以让this指向当前实例对象

  // 更改成功后的状态
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };

  // 更改失败后的状态
  reject = (reason) => {
    if (this.status === REJECTED) {
      this.status = REJECTED;
      this.reason = reason;
    }
  };

  // then方法的实现
  then = (onFulfilled, onRejected) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason);
    }
  };
}

export default MyPromise;
