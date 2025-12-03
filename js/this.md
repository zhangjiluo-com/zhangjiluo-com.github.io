# JavaScript this

## this 是什么？

this 是 JavaScript 中一个特殊变量，它指的是一个执行上下文对象。他的值在运行时确定。

## this 指向什么？

this 的指向可大致分为 2 种情况，函数内（直接包含）和函数外。

### 函数内

在函数内，又可以大致分为：函数作为构造函数执行，函数作为普通函数执行，函数作为对象方法执行。

#### 函数作为构造函数执行

this 指向通过 new 创建的新对象，该对象的 `__proto__` 指向构造函数的原型对象。

```javascript
function Fn() {
  console.log("constructor this:", this); // this 指向通过 new 创建的新对象，该对象的 __proto__ 指向 Fn.prototype（即新对象是 Fn 的实例）
}

new Fn();
```

#### 函数作为普通函数执行

函数直接被调用的时候，this 绑定到全局对象。

```javascript
function fn() {
  console.log("fn() called this:", this); // 非严格模式下 this 绑定到全局对象
}
function foo() {
  "use strict";
  console.log("foo() called this:", this); // 严格模式下 this 为 undefined
}
fn();
foo();
```

#### 函数作为对象方法执行

```javascript
function fn() {
  console.log("ojb.fn() called this:", this);
}
var obj = {
  fn: fn,
};
obj.fn();
```

### 函数外

#### 全局作用域

- 严格模式下 this 指向 undefined
- 非严格模式下 this 指向 在全局作用域下指向全局对象（浏览器中是 window，Node.js 中是 global），相当于 全局对象.函数()。

```html
<script>
  console.log("global this:", this); // window （全局对象）
</script>
<script>
  "use strict";
  console.log("global this:", this); // undefined
</script>
```

### 模块作用域

模块作用域其顶层 this 固定为 undefined，一般模块作用域中都是严格模式。

```html
<script type="module">
  console.log("module this:", this); // undefined
</script>
```

### eval() 作用域

> eval() 函数执行动态代码，动态代码在非严格模式下会污染当前作用域，动态代码能访问作用域链中的变量，在严格模式 eval() 会创建一个独立的局部作用域，无法访问外层作用域链上的变量，只能访问全局作用域的变量。

eval 内 this：继承调用时的外层 this，而非固定值。

```html
<script>
  var obj = {};
  eval("console.log('eval() this:', this)"); // this 绑定到全局对象

  function fn() {
    eval("console.log('eval() this:', this)"); // this 为 obj
    ("use strict");
    eval("console.log('eval() this:', this)"); // this 为 obj
  }
  obj.fn = fn;
  obj.fn();
</script>
```

## 其他注意事项

### 指定函数中的 this 指向

函数中 this 可以通过 call、apply、bind 方法显示指定。call、apply 本质上是返回了一个新的函数。

```javascript
function fn() {
  console.log(this.name);
}
const obj = { name: "指定的 this" };

fn.call(obj); // 输出 "指定的 this"（call 传单个参数）
fn.apply(obj); // 输出 "指定的 this"（apply 传数组参数）
const boundFn = fn.bind(obj);
boundFn(); // 输出 "指定的 this"（bind 返回新函数，永久绑定）
```

### 箭头函数中的 this 指向

箭头函数是一个纯粹的函数，它不存在自身的 this，它的 this 绑定到创建它的外层作用域中的 this，外层作用域没有自身的 this 的，则向上查找，直到找到为止。

```html
<script>
  var fn = () => {
    console.log("this:", this); // this 指向全局对象
  };
  fn();

  var obj = {
    fn: function () {
      var fn = () => {
        console.log("this:", this); // this 绑定到函数作用域中的this
      };
      fn();
    },
  };
  obj.fn();
</script>
<script type="module">
  var fn = () => {
    console.log("this:", this); // this 指向模块作用域中的this（undefined）
  };
  fn();
</script>
```
