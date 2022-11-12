import sdk from '@';

console.log(sdk);
console.log(sdk.sum(1, 2));

const { MyPromise } = sdk;

function promise1() {
  const p = new MyPromise((resolve, reject) => {
    reject(1);
  });
  return p;
}

function promise2() {
  return new MyPromise((resolve, reject) => {
    reject('error');
  });
}
const a = promise1()
  .then(
    () => console.log(1, 'success'),
    () => console.log(1, 'error')
  )
  .then(
    () => console.log(2, 'success'),
    () => console.log(2, 'error')
  )
  .then(
    () => {
      throw Error('3 success error');
      // console.log(3, 'success');
    },
    () => console.log(3, 'error')
  )
  .then(
    () => console.log(4, 'success')
    // () => console.log(4, 'error')
  )
  .then(
    () => console.log(4, 'success')
    // () => console.log(4, 'error')
  )
  // .catch((error) => console.log('error catch', error))
  .finally(() => {
    console.log('finally');
  });
// .finally(() => console.log('finally1'));
promise2().then(() => console.log(2));
// .catch((err) => console.log(err));
// .finally(() => console.log('finally2'));

const promise3 = MyPromise.resolve(4);
const promise4 = 42;
const promise5 = new MyPromise((resolve, reject) => {
  setTimeout(reject, 100, 'foo');
});

MyPromise.all([promise3, promise4, promise5]).then(
  (values) => {
    console.log('111', values);
  },
  (err) => {
    console.log('222', err);
  }
);

const promise7 = MyPromise.resolve(3);
const promise8 = new MyPromise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise7, promise8];

MyPromise.allSettled(promises).then((results) => {
  console.log(results);
});

const promise9 = new MyPromise((resolve) => {
  setTimeout(resolve, 500, 'one');
});

const promise10 = new MyPromise((resolve) => {
  setTimeout(resolve, 100, 'two');
});

MyPromise.race([promise9, promise10]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
