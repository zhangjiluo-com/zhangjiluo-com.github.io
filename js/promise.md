# JavaScript Promise

## 什么是 Promise？为什么需要 Promise？

> 什么是 Promise？Promise 是一个异步编程解决方案，用于解决回调地狱问题。在 JavaScript 中，表现为一个构造函数。

> 为什么需要 Promise？在 Promise 出现之前，JavaScript 处理异步操作主要依赖回调函数。当依赖多个异步任务时，就会产生层层嵌套的"回调地狱"，这种代码不仅可读性极差，更会带来维护难题和调试困境。

假设我们需要完成"获取用户信息 → 获取用户订单 → 获取订单详情"这一系列关联异步操作，回调写法如下：

```javascript
getUser(
  userId,
  function (user) {
    getOrders(
      user.id,
      function (orders) {
        getOrderDetail(
          orders[0].id,
          function (detail) {
            console.log(detail); // 最终需要的结果
          },
          function (error) {
            console.log("获取订单详情失败:", error);
          }
        );
      },
      function (error) {
        console.log("获取订单失败:", error);
      }
    );
  },
  function (error) {
    console.log("获取用户信息失败:", error);
  }
);
```

Promise 通过链式调用将嵌套结构扁平化解构，同时统一错误处理逻辑，让代码变得清晰易懂：

```javascript
getUser(userId) // 返回 Promise 的函数
  .then(function (user) {
    return getOrders(user.id);
  }) // 传递结果并返回下一个 Promise
  .then(function (orders) {
    return getOrderDetail(orders[0].id);
  })
  .then(function (detail) {
    console.log(detail);
  })
  .catch(function (error) {
    console.log("操作失败:", error);
  }); // 统一捕获所有错误
```

同时，在 ES2017 引入 `async`、 `await` 关键字后，将 Promise 的链式调用结构可以转换为同步代码（并非整的同步执行）：

```javascript
async function getUserOrderDetail() {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const detail = await getOrderDetail(orders[0].id);
    console.log(detail);
  } catch (error) {
    console.log("操作失败:", error);
  }
}
```

这就是 Promise 的核心价值：扁平化异步流程、统一错误处理、提升代码可读性。

## Promise 的核心概念

Promise 的本质是一个代表异步操作最终状态的对象，其核心特性体现在不可逆转的状态转换上。社区有 [Promises/A+ 规范](https://promisesaplus.com/)，现行很多 Promise 实现都遵循该规范。

### 三种核心状态

- pending（等待态）：初始状态，异步操作尚未完成。此时 Promise 既不代表成功也不代表失败。
- fulfilled（成功态）：异步操作顺利完成，Promise 会携带操作结果（value）。
- rejected（失败态）：异步操作失败，Promise 会携带失败原因（reason）。

### 不可逆的状态转换

Promise 的状态转换遵循严格的规则：只能从 pending 转换为 fulfilled 或 pending 转换为 rejected，且转换一旦发生就永久固定，后续操作无法改变状态。

## 使用 ES5 模拟（实现） Promise 核心 API

Promise 的核心 API 只有 2 个：Promise 对象的创建和，then 方法。完整实现参考[https://github.com/zhangjiluo-com/MyPromise](https://github.com/zhangjiluo-com/MyPromise)。

### Promise 的创建

Promise 一般是通过 new Promise() 创建的，即：使用 Promise 构造函数创建 Promise 对象。

```javascript
function Promise(executor) {
  var self = this;

  if (!(self instanceof Promise)) {
    throw new Error("Promise 必须通过 'new' 关键字作为构造函数调用");
  }

  self.state = "pending"; // 一个 `promise` 只能是以下仨状态之一: pending, fulfilled, rejected
  self.result = undefined; // result 存放 `promise` 的值或者拒因
  self.handlers = []; // 存放 then 方法的注册的回调函数

  function resolve(value) {
    resolvePromise(self, value);
  }

  function reject(reason) {
    rejectPromise(self, reason);
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

/**
 * 执行 `promise` 的回调函数
 * @param {Promise} promise
 */
function flushHandlers(promise) {
  var state = promise.state;

  if (state === "pending") return; // 保证已决状态才能执行回调

  var handlers = promise.handlers;
  var result = promise.result;

  queueMicrotask(function () {
    while (handlers.length) {
      var handler = handlers.shift(); // 取出第一个回调函数
      var onFulfilled = handler.onFulfilled;
      var onRejected = handler.onRejected;

      try {
        var cb = state === "fulfilled" ? onFulfilled : onRejected;
        var x = cb(result);
        resolvePromise(handler.promise, x);
      } catch (error) {
        rejectPromise(handler.promise, error);
      }
    }
  });
}

/**
 * Promise 解析过程
 * @link https://promisesaplus.com/#the-promise-resolution-procedure
 * @param {Promise} promise
 * @param {any} x 待处理的值
 */
function resolvePromise(promise, x) {
  if (promise.state !== "pending") return;

  if (promise === x) return rejectPromise(promise, new TypeError("循环引用")); // 循环引用

  if (x instanceof Promise) {
    // 这里可以逻辑其实可以直接使用 thenable 的逻辑
    return queueMicrotask(function () {
      x.then(
        function (y) {
          resolvePromise(promise, y);
        },
        function (r) {
          rejectPromise(promise, r);
        }
      );
    });
  }

  var isThenable = false;
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    var then;
    try {
      then = x.then;
    } catch (error) {
      return rejectPromise(promise, error);
    }

    if (typeof then === "function") {
      isThenable = true;
      queueMicrotask(function () {
        var called = false; // 防止多次调用，多次调用只取第一次
        try {
          then.call(
            x,
            function (y) {
              if (called) return;
              called = true;
              resolvePromise(promise, y);
            },
            function (r) {
              if (called) return;
              called = true;
              rejectPromise(promise, r);
            }
          );
        } catch (error) {
          if (called) return;
          called = true;
          rejectPromise(promise, error);
        }
      });
    }
  }

  if (isThenable) return;

  promise.state = "fulfilled";
  promise.result = x;
  flushHandlers(promise);
}

/**
 * Promise 失败
 * @param {Promise} promise
 * @param {Any} reason 失败原因
 */
function rejectPromise(promise, reason) {
  if (promise.state !== "pending") return;
  promise.state = "rejected";
  promise.result = reason;
  flushHandlers(promise);
}
```

### then 方法

`then` 方法用于注册 `promise` 的成功和失败回调，返回一个新的 `promise` 对象。

```javascript
/**
 * then 方法，支持链式调用
 * @param {Function} onFulfilled 成功回调
 * @param {Function} onRejected 失败回调
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;

  if (typeof onFulfilled !== "function") {
    onFulfilled = function (value) {
      return value;
    };
  }

  if (typeof onRejected !== "function") {
    onRejected = function (reason) {
      throw reason;
    };
  }

  var promise2 = new Promise(function () {});

  self.handlers.push({
    onFulfilled: onFulfilled,
    onRejected: onRejected,
    promise: promise2,
  });

  flushHandlers(self);

  return promise2;
};
```

## EcmaScript Promise API

- Promise.prototype.catch() 方法用于注册一个在 promise 被拒绝时调用的函数。它会立即返回一个等效的 Promise 对象，这可以允许你链式调用其他 promise 的方法。
- Promise.prototype.finally() 方法用于注册一个在 promise 敲定（兑现或拒绝）时调用的函数。它会立即返回一个等效的 Promise 对象，这可以允许你链式调用其他 promise 方法。
- Promise.resolve() 静态方法以给定值“解决（resolve）”一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；否则，返回的 Promise 将会以该值兑现。
- Promise.reject() 静态方法返回一个已拒绝（rejected）的 Promise 对象，拒绝原因为给定的参数。
- Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
- Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。这个返回的 promise 会随着第一个 promise 的敲定而敲定。
- Promise.any() 静态方法将一个 Promise 可迭代对象作为输入，并返回一个 Promise。当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，它会以一个包含拒绝原因数组的 AggregateError 拒绝。
- Promise.allSettled() 静态方法将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。
- Promise.try() 静态方法接受一个任意类型的回调函数（无论其是同步或异步，返回结果或抛出异常），并将其结果封装成一个 Promise。
- Promise.withResolvers() 静态方法返回一个对象，其包含一个新的 Promise 对象和两个函数，用于解决或拒绝它，对应于传入给 Promise() 构造函数执行器的两个参数。

## 最后

随着 ES2017 中 async/await 语法的普及，异步代码变得更加简洁直观，但需要明确的是：async/await 本质是 Promise 的语法糖，其底层依然依赖 Promise 实现。
