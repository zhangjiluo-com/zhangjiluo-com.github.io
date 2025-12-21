# CSS

## flex: 1; 什么意思

1. flex 是 flex 布局中子项的属性；
2. flex 是 flex-grow, flex-shrink, flex-basis 三属性的缩写；
3. flex: 1;展开为三属性表示：
   flex-grow: 1; // 放大时以 1 为相对倍数
   flex-shrink: 1; // 缩写时以 1 为相对倍数
   flex-basis: 0%; // 放大缩小基础尺寸

## CSS 的盒子模型

css 盒子模型有两种: 标准盒模型 和 IE 盒子模型
标准盒子模型 (四个部分): margin + border + padding + content
IE 盒子模型(两个部分): margin + content（ border + padding + content ）

## display: none;与 visibility: hidden;的区别

1. display: none; 是不占用位置的
   visibility: hidden; 虽然隐藏了，但是占用位置(visibility:看不见)

2. visibility: hidden; 、 display: none; 产生重绘
   display: none; 还会产生一次回流

# JS

## JS 数据类型

基本类型:string number boolean undefined null; bigint symbol

引用类型:object

## 深拷贝和浅拷贝

1. 都是对象（数据）复制
2. 浅拷贝只复制栈空间
3. 深拷贝在基本数据复制栈空间，在引用数据复制堆空间
4. 实现深拷贝方法：1. JSON 方法 2. 遍历对象属性

## React 类组件生命周期（最新）

Render 阶段：用于计算一些必要的状态信息。这个阶段可能会被 React 暂停，这一点和 React16 引入的 Fiber 架构（我们后面会重点讲解）是有关的；

Pre-commit 阶段：所谓“commit”，这里指的是“更新真正的 DOM 节点”这个动作。所谓 Pre-commit，就是说我在这个阶段其实还并没有去更新真实的 DOM，不过 DOM 信息已经是可以读取的了；

Commit 阶段：在这一步，React 会完成真实 DOM 的更新工作。Commit 阶段，我们可以拿到真实 DOM（包括 refs）。

挂载过程：

constructor
getDerivedStateFromProps
render
componentDidMount

更新过程：

getDerivedStateFromProps
shouldComponentUpdate
render
getSnapshotBeforeUpdate
componentDidUpdate

卸载过程：

componentWillUnmount

## React.Component 和 React.PureComponent 的区别

PureComponent 表示一个纯组件，可以用来优化 React 程序，减少 render 函数执行的次数，从而提高组件的性能。

在 React 中，当 prop 或者 state 发生变化时，可以通过在 shouldComponentUpdate 生命周期函数中执行 return false 来阻止页面的更新，从而减少不必要的 render 执行。React.PureComponent 会自动执行 shouldComponentUpdate。

不过，pureComponent 中的 shouldComponentUpdate() 进行的是浅比较，也就是说如果是引用数据类型的数据，只会比较不是同一个地址，而不会比较这个地址里面的数据是否一致。浅比较会忽略属性和或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候 render 是不会执行的。如果需要重新渲染那么就需要重新开辟空间引用数据。PureComponent 一般会用在一些纯展示组件上。

使用 pureComponent 的好处：当组件更新时，如果组件的 props 或者 state 都没有改变，render 函数就不会触发。省去虚拟 DOM 的生成和对比过程，达到提升性能的目的。这是因为 react 自动做了一层浅比较。

## 常用 React Hook

1. useState、useReducer、useContext、useMemo、useCallback、useEffect、useRef...

## useMemo、useCallback 使用场景

1. 性能优化

## React 触发组件更新的原因

1. 父组件更新
2. state 更新
3. forceUpdate

---

## JS 微任务和宏任务

1. js 是单线程的语言
2. js 同步的任务都执行完了，才会执行事件循环的内容
3. 进入事件循环：微任务、宏任务
4. 微任务：promise.then
5. 宏任务：setTimeout、setInterval、事件...

## JS 作用域

1. 有全局作用域、函数作用域、块级作用域
2. 作用域链：内部可以访问外部的变量，但是外部不能访问内部的变量；如果内部有，优先查找到内部，如果内部没有就查找外部的。

## 闭包

1. 闭包是函数和函数的词法环境的组合；
2. 闭包中的变量就是函数词法作用域上的所有被引用的变量
3. 闭包可以让函数执行完以后变量内存不被浏览器回收
4. 闭包可以用于封装私有变量
5. 闭包变量常驻内存、容易内存溢出

## 原型链

1. 原型链是把原型串联起来的一种类似链表的链（原型 + 链）
2. 原型是一个对象；是构造函数的一个特有属性，构造函数实例对象可以通过 `__proto__` 属性引用到原型对象
3. 对象的属性方法查找优先顺序：对象本身查找 -> 原型对象查找 -> 原型对象的原型对象查找 -> 原型对象的原型对象的原型对象查找 ... -> null
4. 原型链的最顶端是 null

## new 操作符具体做了什么

1. 创建了一个空的对象
2. 将空对象的原型，指向于构造函数的原型
3. 将空对象作为构造函数的上下文（改变 this 指向）
4. 对构造函数有返回值的处理判断
