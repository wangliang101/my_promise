import sdk from '@';

const { MyPromise } = sdk;
const promise = new MyPromise((resolve, reject) => {
  resolve('success');
  reject('err');
  setTimeout(() => {
    resolve('success');
  }, 2000);
});

promise.then(
  (value) => {
    console.log('resolve', value);
  },
  (reason) => {
    console.log('reject', reason);
  }
);
