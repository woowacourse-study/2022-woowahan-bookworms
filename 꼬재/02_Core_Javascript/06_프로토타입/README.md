# 06. 프로토타입

---

자바스크립트는 프로토타입(prototype)기반 언어이다.

클래스 기반 언어에서 '상속'을 사용하지만 프로토타입 기반 언어에서는 어떤 객체를 원형(prototype)으로 삼고 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻는다.

## 01 프로토타입의 개념 이해

---

### 6-1-1 constructor, porotype, instance

---

```js
const instance = new Constructor();
```

- 어떤 생성자 함수(Constructor)를 new 연산자와 함께 호출하면
- Constructor에서 정의된 내용을 바탕으로 새로운 인스턴스(instance)가 생성된다.
- 이때 instance에는 `__proto__`라는 프로퍼티가 자동으로 부여되는데,
- 이 프로퍼티는 Constructor의 prototype이라는 프로퍼티를 참조한다.

정리 하자면,
Constructor의 prototype 객체 내부에는 인스턴스가 사용할 메서드를 저장한다.
instance의 `__proto__`는 Constructor의 prototype을 참조한다고 했으니,
instance에 숨겨진 프로퍼티인 `__proto__`를 통해 Constructor의 prototype 메서드들에 접근할 수 있게 된다.

```js
function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {
  return this.name;
};

const kkojae = new Person("kkojae");
console.log(kkojae.__proto__.getName()); // undefined
console.log(kkojae.getNmae()); // kkojae

kkojae.__proto__.name = "proto-kkojae";
console.log(kkojae.__proto__.getName()); // proto-kkojae
```

위 예제에서는 this 바인딩과 `__proto__`는 생략이 가능한 프로퍼티라는 것을 확인할 수 있다.

첫 번째 console.log에서 undefined를 출력하는 이유는?

- Person안에 prototype 프로퍼티에는 getName 메서드가 존재한다. 하지만 메서드 내에서 this 바인딩은 메서드명 바로 앞의 객체가 this로 바인딩이 되고, 현재 `kkojae.__proto__`에는 name 이라는 값이 없기 때문에 return 값이 this.name을 undefined 출력하는 것이다.

두 번째 console.log에서 kkojae를 출력하는 이유는?

- `__proto__`는 생략이 가능하기 때문에 this 바인딩은 메서드명 바로 앞의 객체를 this로 바인딩하고, kkojae에는 getName이라는 메서드와 name이라는 프로퍼티가 있기 때문에 정상적으로 kkojae를 출력한다.

세 번째 console.log에서 proto-kkojae를 출력하는 이유는?

- 첫 번째 console.log에서 undefined 반환한 것을 정상적으로 출력시키기 위해 `kkojae.__proto__`에 name이라는 프로퍼티 값을 proto-kkojae로 할당하고, getName()을 호출한 것이다.
- 이렇게되면 기존과 동일하게 this 바인딩은 메서드명 바로 앞의 객체가 this로 바인딩 되고, `kkojae.__proto__`에는 name이라는 프로퍼티와 getName이라는 메서드가 존재하기 때문에, name에 할당한 proto-kkojae를 출력한다.

즉, instance의 `__proto__`는 생략 가능한 프로퍼티 이다.

### 6-1-2 constructor 프로퍼티

---

생성자 함수인 prototype 객체 내부에는 constructor라는 프로퍼티가 있다. 생성자 함수로 호출한 인스턴스에도 constructor라는 프로퍼티가 존재한다.

constructor는 단어의 뜻 그대로 자기 자신을 참조하는 프로퍼티이다. constructor 프로퍼티가 존재하는 이유는?

- 생성자 함수로 호출한 인스턴스의 원형이 무엇인지 확인할 수 있기 때문이다.
- 즉, 해당하는 인스턴스가 누구로 부터 생성된 인스턴스인지 확인할 수 있다는 의미이다.

```js
const arr = [1, 2];

console.log(Array.prototype.constructor === Array); // true
console.log(arr.__proto__.constructor === Array); // true
console.log(arr.constructor === Array); // true

console.log(arr instanceof Array); // true
console.log(arr instanceof Person); // false
```

### 6-1-1, 6-1-2 결론

---

1. 생성자 함수의 prototype에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 마치 자신의 것처럼 해당 메서드나 프로퍼티에 접근할 수 있다.
2. constructor는 자기 자신을 참조하는 프로퍼티이다. constructor는 instanceof 를 통해 해당하는 인스턴스가 누구로 부터 생성된 인스턴스인지 확인할 수 있다.

## 02. 프로토타입 체인

---

### 6-2-1 메서드 오버라이드

---

```js
function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {
  return this.name;
};

const kkojae = new Person("꼬재");
console.log(kkojae.getName()); // 꼬재

kkojae.getName = function () {
  return `내가 바로 ${this.name}}`;
};

console.log(kkojae.getName()); // 내가 바로 꼬재
```

첫 번째 console.log의 kkojae.getName()은 생성자 함수 Person의 프로토타입 메서드인 getName이 호출된다.
<br />
두 번째 console.log의 kkojae.getName()은 kkojae 객체에 있는 getName 메서드가 호출된다.

여기서 이러난 현상을 메서드 오버라이드라고 한다.
<br />
메서드 오버라이드란 메서드 위에 메서드를 덮어씌웠다는 표현이다.
<br />
원본을 제거하고 다른 대상으로 교체하는 것이 아니라 원본이 그대로 있는 상태에서 다른 대상을 그 위에 얹는 이미지를 떠올리면 된다.

### 6-2-2 프로토타입 체인

---

프로토타입 체인(prototype chain)이란?

- 어떤 데이터의 `__proto__` 프로퍼티 내부에 다시 `__proto__` 프로퍼티가 연쇄적으로 이어진 것을 의미한다.
- 또 이 체인을 따라가며 검색하는 것을 프로토타입 체이닝(prototype chaining)이라고 한다.

```js
const arr = [1, 2];
console.log(Array.prototype.toString.call(arr)); // 1, 2
console.log(Object.prototype.toString.call(arr)); // [object Array]
console.log(arr.toString()); // 1, 2

arr.toString = function () {
  return this.join("__");
};

console.log(arr.toString()); // 1__2
```

위 예제의 arr 변수의 `__proto__`는 `Array.prototype`을 참조하고,
<br />
`Array.prototype`은 객체이므로 `Array.prototype.__proto__`를 참조한다.

즉, Object의 toString은 Array의 toString이 오버라이딩을 한 것이고,
<br />
arr는 Array의 toString을 `__proto__`로 접근하여 toString 메서드를 사용할 수 있다.

여기서, arr에 toString 메서드를 새롭게 추가하면
<br />
arr.toString은 Array의 toString 메서드를 오버라이딩하여 arr의 toString 메서드를 호출하게 되는 것이다.
