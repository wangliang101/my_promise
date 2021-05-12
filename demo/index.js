/* eslint-disable no-unused-vars */
import sdk from '@';

const { MyPromise } = sdk;

MyPromise.resolve()
  .then(() => {
    console.log(0);
    return MyPromise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

// const promise = new MyPromise((resolve, reject) => {
//   // setTimeout(() => {
//   //   resolve('success');
//   // }, 2000);
//   // throw new Error('执行器错误');
//   // resolve('succ');
//   reject('err');
// });
// console.log('dddd', promise.then().then());

// promise
//   .then()
//   .then()
//   .then(
//     (value) => console.log(value),
//     (reason) => console.log(reason)
//   );

// promise.then(
//   (value) => {
//     console.log('resolve', value);
//   },
//   (reason) => {
//     console.log('reject', reason);
//   }
// );

// promise.then((value) => {
//   console.log(1);
//   console.log('resolve', value);
// });

// promise.then((value) => {
//   console.log(2);
//   console.log('resolve', value);
// });

// promise.then((value) => {
//   console.log(3);
//   console.log('resolve', value);
// });

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
// const p1 = promise.then((value) => {
//   console.log(1);
//   console.log('resolve', value);
//   return p1;
// });

// p1.then(
//   (value) => {
//     console.log(2);
//     console.log('resolve', value);
//   },
//   (reason) => {
//     console.log(3);
//     console.log(reason.message);
//   }
// );

// function other() {
//   return new MyPromise((resolve, reject) => {
//     console.log('执行了other');
//     resolve('other');
//   });
// }

// promise
//   .then((value) => {
//     console.log(1);
//     console.log('resolve', value);
//     return other();
//   })
//   .then((value) => {
//     console.log(2);
//     console.log('resolve', value);
//   });

// 运行的时候会走reject
