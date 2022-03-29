// const Person = function (name) {
//   this._name = name;
// };

function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {
  return this.name;
};

const kkojae = new Person("kkojae");

console.dir(Person);
console.dir(kkojae);

console.log(kkojae instanceof Person);

const kkojaeDunderProto = Object.getPrototypeOf(kkojae);

// console.log(kkojaeDunderProto);

// console.log(kkojae.getName()); // kkojae
// console.log(kkojae.__proto__.getName()); // undefined

// console.log(kkojae.__proto__);

// kkojae.__proto__.name = "proto - kkojae";
// console.log(kkojae.__proto__.getName()); // proto - kkojae

console.log("================");
console.log("================");

const arr = [1, 2];
// console.dir(Array);
// console.log(Array.prototype);
// console.log(Array.prototype.constructor === Array);
// console.log(arr.__proto__.constructor === Array);
// console.log(arr.constructor === Array);

console.log(arr instanceof Array); // true

console.log("================");
console.log("================");

function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {
  return this.name;
};

const kkojae2 = new Person("꼬재");
console.log(kkojae2.getName());
kkojae2.getName = function () {
  return `내가 바로 ${this.name}`;
};

console.log(kkojae2.getName()); // 내가 바로 꼬재

const arr1 = [1, 2];
console.log(Array.prototype.toString.call(arr1)); // 1, 2
console.log(Object.prototype.toString.call(arr1)); // [object Array]
console.log(arr1.toString()); // 1, 2

arr1.toString = function () {
  return this.join("__");
};

console.log(arr1.toString()); // 1__2

console.log("================");
console.log("================");

function Grade(...args) {
  const arr = [...args];
  // const arr = Array.prototype.slice.call(arguments);

  for (let i = 0; i < arr.length; i++) {
    this[i] = arr[i];
  }

  this.length = arr.length;
}

const g = new Grade(100, 80);

console.log(g); // Grade { '0': 100, '1': 80, length: 2 }

console.log(Array.prototype.slice.call(g)); // [ 100, 80 ]

Grade.prototype = [];

// console.dir(Grade);
// console.log(Grade);

const g2 = new Grade(100, 80);

console.log(g2);
g2.pop();
console.log(g2);
g2.push(90);
console.log(g2);
