/* eslint-disable func-names */
/* eslint-disable no-debugger */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
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
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
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

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象

  // resolve 静态方法
  static resolve(parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }
    // 转成常规方法
    return new MyPromise((resolve) => {
      resolve(parameter);
    });
  }

  // 更改成功后的状态
  resolve = (value) => {
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // 判断成功回调是否存在，如果存在就调用
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  // 更改失败后的状态
  reject = (reason) => {
    if (this.status === PENDING) {
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

  /**
   * all 方法接收一个 promise 的 iterable 类型的输入，并且只返回一个Promise实例，
   * 那个输入的所有 promise 的 resolve 回调的结果是一个数组。这个Promise的 resolve
   * 回调执行是在所有输入的 promise 的 resolve 回调都结束，或者输入的 iterable 里没有
   * promise 了的时候。它的 reject 回调执行是，只要任何一个输入的 promise 的 reject
   * 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。
   * @param {*} promiseList
   * @returns
   */
  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      const { length } = promiseList;
      const result = [];
      if (length === 0) {
        return resolve(result);
      }

      promiseList.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            result[index] = value;
            if (index + 1 === length) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  /**
   * allSettled 方法返回一个在所有给定的 promise 都已经fulfilled或rejected后的 promise，
   * 并带有一个对象数组，每个对象表示对应的 promise 结果。
   * @param {*} promiseList
   * @returns [ { status: 'fulfilled', value: '' }, {status: "rejected", reason: ""}]
   */
  static allSettled(promiseList) {
    return new MyPromise((resolve) => {
      const { length } = promiseList;
      const result = [];
      if (length === 0) {
        return resolve(result);
      }

      promiseList.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            result[index] = { status: FULFILLED, value };
            if (index + 1 === length) {
              resolve(result);
            }
          },
          (reason) => {
            result[index] = {
              status: REJECTED,
              reason,
            };
            if (index + 1 === length) {
              resolve(result);
            }
          }
        );
      });
    });
  }

  /**
   * race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。
   * @param {*} promiseList
   * @returns promise
   */
  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      const { length } = promiseList;

      if (length === 0) {
        return resolve();
      }

      for (let i = 0; i < length; i += 1) {
        MyPromise.resolve(promiseList[i]).then(
          (value) => {
            return resolve(value);
          },
          (reason) => {
            return reject(reason);
          }
        );
      }
    });
  }

  // then方法的实现
  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      const rejectedMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.status === REJECTED) {
        rejectedMicrotask();
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => fulfilledMicrotask());
        this.onRejectedCallbacks.push(() => rejectedMicrotask());
      }
    });
    return promise2;
  };

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        MyPromise.resolve(onFinally()).then(() => value);
      },
      (reason) => {
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        });
      }
    );
  }
}

// 此处所以逻辑参考 https://promisesaplus.com/
function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }

  if (typeof x === 'object' || typeof x === 'function') {
    // x 为 null 直接返回，走后面的逻辑会报错
    if (x === null) {
      return resolve(x);
    }
    let then;
    try {
      // 把 x.then 赋值给 then
      then = x.then;
    } catch (err) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(err);
    }
    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (err) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;
        // 否则以 error 为据因拒绝 promise
        reject(err);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

MyPromise.deferred = function () {
  const result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;

// export default MyPromise;
