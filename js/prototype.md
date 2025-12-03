# JavaScript 原型与原型链

## 一、原型：对象的“隐藏模板”

JavaScript 中万物皆对象，但并非所有对象都“无中生有”。每个对象创建时，都会默认关联一个其他对象，这个被关联的对象就是它的`原型（prototype）`。原型就像对象的“隐藏模板”，当访问对象的某个属性或方法时，如果对象本身没有，就会去它的原型中查找。

### 1.1 构造函数与原型的关联

在 JavaScript 中，我们通常通过构造函数创建对象，而每个构造函数都有一个`prototype`属性，这个属性指向的就是该构造函数创建的所有对象的原型。举个例子：

```javascript
// 定义构造函数Person
function Person(name) {
  this.name = name; // 实例属性
}

// 给构造函数的prototype添加方法
Person.prototype.sayHello = function () {
  console.log(`Hello, I'm ${this.name}`);
};

// 创建实例
const person1 = new Person("Tom");
const person2 = new Person("Jerry");

// 调用方法
person1.sayHello(); // 输出：Hello, I'm Tom
person2.sayHello(); // 输出：Hello, I'm Jerry
```

这里有三个关键关联：

- 构造函数`Person`的`prototype`属性指向原型对象；

- 通过`new Person()`创建的实例`person1`、`person2`，会默认关联这个原型对象；

- 实例本身没有`sayHello`方法，但能通过原型查找到并调用。

### 1.2 实例的`proto`属性

实例如何关联到原型呢？答案是每个实例都有一个内置的`__proto__`属性（部分浏览器也叫`[[Prototype]]`），它直接指向创建该实例的构造函数的`prototype`。我们可以通过代码验证：

```javascript
console.log(person1.__proto__ === Person.prototype); // 输出：true
console.log(person2.__proto__ === Person.prototype); // 输出：true
```

这里要注意，`__proto__`是实例的属性，`prototype`是构造函数的属性，二者指向同一个原型对象，这是原型机制的核心关联。

## 二、原型链：原型的“连锁反应”

既然原型本身也是对象（除了 Object.prototype 的原型是 null），那它也会有自己的`__proto__`属性，指向它的原型。这样一层一层向上关联，就形成了一条链式结构，这就是`原型链`。

### 2.1 原型链的查找规则

当访问一个对象的属性或方法时，JavaScript 会遵循以下规则：

1. 先在对象本身查找，如果找到则直接使用；

2. 如果没找到，就通过`__proto__`去它的原型中查找；

3. 如果原型中也没有，就继续查找原型的原型，以此类推；

4. 直到找到 Object.prototype（原型链的顶端），如果还是没找到，就返回 undefined。

用代码演示原型链的查找过程：

```javascript
// 原型链顶端：Object.prototype
console.log(Person.prototype.__proto__ === Object.prototype); // 输出：true
// Object.prototype的原型是null
console.log(Object.prototype.__proto__); // 输出：null

// 查找person1的toString方法
console.log(person1.toString()); // 输出：[object Object]
// 查找路径：person1 → Person.prototype → Object.prototype → 找到toString
```

上面代码中，`person1`本身和`Person.prototype`都没有`toString`方法，但通过原型链找到了`Object.prototype`上的`toString`方法，这就是原型链的作用。

### 2.2 原型链的核心特性

原型链最核心的价值是实现`继承`。在 ES6 的`class`语法出现前，JavaScript 的继承几乎都是通过原型链实现的。比如让 Student 继承 Person 的属性和方法：

```javascript
// 构造函数Student
function Student(name, grade) {
  Person.call(this, name); // 继承Person的实例属性
  this.grade = grade; // 自身实例属性
}

// 让Student的原型指向Person的实例，实现方法继承
Student.prototype = new Person();
// 修复构造函数指向（关键步骤）
Student.prototype.constructor = Student;

// 给Student原型添加自身方法
Student.prototype.study = function () {
  console.log(`${this.name} is studying in grade ${this.grade}`);
};

// 创建Student实例
const student1 = new Student("Lily", 3);
student1.sayHello(); // 输出：Hello, I'm Lily（继承自Person）
student1.study(); // 输出：Lily is studying in grade 3（自身方法）
```

这里通过将`Student.prototype`指向`Person`的实例，让`Student`的实例能通过原型链访问到`Person`原型上的方法，从而实现继承。

## 三、实际应用：原型的常见使用场景

原型与原型链不仅是理论知识，在实际开发中也有很多实用场景，掌握这些场景能让代码更高效。

### 3.1 实现方法复用

如果每个实例都单独定义方法，会造成内存浪费。将方法定义在构造函数的原型上，所有实例可共享该方法，大幅节省内存。比如前面的`Person.prototype.sayHello`，`person1`和`person2`共享同一个方法。

### 3.2 扩展内置对象方法

我们可以通过修改内置对象的原型，给内置对象添加自定义方法。比如给 Array 添加一个求和方法：

```javascript
// 给Array原型添加sum方法
Array.prototype.sum = function () {
  return this.reduce((total, item) => total + item, 0);
};

const arr = [1, 2, 3, 4];
console.log(arr.sum()); // 输出：10
```

注意：扩展内置对象原型时要谨慎，避免覆盖原有方法。

### 3.3 判断对象类型

通过`instanceof`运算符可以判断对象是否是某个构造函数的实例，其原理就是检查构造函数的`prototype`是否在对象的原型链上：

```javascript
console.log(student1 instanceof Student); // 输出：true
console.log(student1 instanceof Person); // 输出：true（Student原型在Person原型链上）
console.log(student1 instanceof Object); // 输出：true（所有对象都在Object原型链上）
```

## 四、总结与梳理

原型与原型链的核心逻辑可总结为三句话：

- 每个构造函数都有`prototype`属性，指向原型对象；

- 每个实例都有隐式原型(`__proto__`)属性，指向构造函数的原型对象；

- 原型对象也是对象，通过隐式原型(`__proto__`)形成原型链，实现属性和方法的继承与查找。

理解原型与原型链，不仅能搞懂 JavaScript 的继承机制，更能为后续学习 ES6 类、框架源码等内容打下坚实基础。建议大家多写代码验证，在实践中加深对这一概念的理解。

为了巩固学习，不妨思考一个问题：如果修改了构造函数的 prototype 属性，之前创建的实例还能访问到新的原型方法吗？可以动手写代码验证一下，看看结果是否符合你的预期。
