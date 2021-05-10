import sdk from '@';

const { MyPromise } = sdk;
const promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve('success');
  // }, 2000);
  resolve('success');
});

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

function other() {
  return new MyPromise((resolve, reject) => {
    console.log('执行了other');
    resolve('other');
  });
}

promise
  .then((value) => {
    console.log(1);
    console.log('resolve', value);
    return other();
  })
  .then((value) => {
    console.log(2);
    console.log('resolve', value);
  });
