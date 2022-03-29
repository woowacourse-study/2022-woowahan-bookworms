# 24장 클로저

---

자바스크립트는 렉시컬 스코프를 따르는 프로그래밍 언어이다.

## 24.1 렉시컬 스코프

---

렉시컬 스코프란?

- 함수를 어디에서 호출했는지가 아니라, 함수를 어디에 정의했는지에 따라 상위 스코프를 결정하는 것

스코프의 실체는?

- 실행 컨텍스트의 렉시컬 환경(LexicalEnvironment)
- 렉시컬 환경(LexicalEnvironment)은 자신의 "외부 렉시컬 환경에 대한 참조(OuterLexicalEnvironmentReference)"를 통해 상위 렉시컬 환경과 연결된다.
  - 이와 같은 현상을 **스코프 체인**이라고 말한다.

자바스크립트는 렉시컬 스코프를 따른다.
<br />
즉, 상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 환경(위치)에 의해 결정된다.

## 24.2 함수 객체의 내부 슬롯 [[Environment]]

---

함수는 자신의 내부 슬롯 [[Environment]]에 자신이 정의된 환경, 즉 상위 스코프의 참조를 저장한다.

풀어서 말하자면, 함수 정의가 평가되어 함수 객체를 생성할 때 자신이 정의된 환경(위치)에 의해 결정된 상위 스코프의 참조를 함수 객체 자신의 내부 슬롯 [[Environment]]에 저장한다.

또한 함수 객체는 내부 슬롯 [[Environment]]에 저장한 렉시컬 환경의 참조, 즉 상위 스코프를 자신이 존재하는 한 기억한다. (가비지 컬렉터의 대상이 되지 않는다.)

## 24.3 클로저와 렉시컬 환경

---

```js
const x = 1;

// 1
function outer() {
  const x = 10;
  const inner = function () {
    console.log(x); // 2
  };

  return inner;
}

const innerFunc = outer(); // 3
innerFunc(); // 4 -> 10
```

outer 함수를 호출하면(3) outer 함수는 중첩 함수 inner를 반환하고, 생명 주기를 마감한다.
(즉, outer 함수의 실행이 종료되면 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거 된다.)
이때, outer 함수의 지역 변수 x와 변수 값 10을 저장하고 있던 outer 함수의 실행 컨텍스트가 제거되었으므로 outer 함수의 지역 변수 x 또한 생명 주기를 마감한다.
따라서 outer 함수의 지역 변수 x는 더는 유효하지 않게 되어 x 변수에 접근할 수 있는 방법은 없어보인다.

하지만, 위 코드의 실행 결과(4)는 outer 함수의 지역 변수 x의 값인 10이다. 이미 생명 주기가 종료되어 실행 컨텍스트 스택에서 제거된 outer 함수의 지역 변수 x가 다시 부활이라도 한 듯이 동작하고 있다.

이처럼 외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 이미 생명 주기가 종료한 외부 함수의 변수를 참조할 수 있다.
이러한 현상을 클로저(closure)라고 부른다.

자바스크립트의 모든 함수는 자신의 상위 스코프를 기억한다.

- 모든 함수가 기억하는 상위 스코프는 함수를 어디서 호출하든 상관없이 유지된다.
- 함수를 어디서 호출하든 상관없이 함수는 언제나 자신이 기억하는 상위 스코프의 식별자를 참조할 수 있으며, 식별자에 바인딩된 값을 변경할 수도 있다.

이러한 현상을 클로저(closure)라고 한다.

```js
const x = 1;

// 1
function outer() {
  const x = 10;
  const inner = function () {
    console.log(x); // 2
  };

  return inner;
}

const innerFunc = outer(); // 3
innerFunc(); // 4 -> 10
```

1. outer 함수를 호출하면 outer 함수의 렉시컬 환경이 생성되고 앞서 outer 함수 객체의 [[Environment]] 내부 슬롯에 저장된 전역 렉시컬 환경을 outer 함수 렉시컬 환경의 "외부 렉시컬 환경에 대한 참조"에 할당한다.
2. 중첩 함수 inner가 평가된다. (inner 함수는 함수 표현식으로 정의했기 때문에 런타임에 평가된다.) 이때 중첩 함수 inner는 자신의 [[Environment]] 내부 슬롯에 현재 실행 중인 실행 컨텍스트의 렉시컬 환경, 즉 outer 함수의 렉시컬 환경을 상위 스코프로서 저장한다.
3. outer 함수의 실행이 종료하면 inner 함수를 반환하면서 outer 함수의 생명 주기가 종료된다.(즉 outer 함수의 실행 컨텍스트가 실행 컨텍스트 스택에서 제거된다.) 이때 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거되지만 outer 함수의 렉시컬 환경까지 소멸하는 것은 아니다.

- 이유: outer 함수의 렉시컬 환경은 inner 함수의 [[Environment]] 내부 슬롯에 의해 참조되고 있고 inner 함수는 전역 변수 innerFunc에 의해 참조되고 있으므로 가비지 컬렉션의 대상이 되지 않기 때문이다.
- 가비지 컬렉터는 누군가가 참조하고 있는 메모리 공간을 함부로 해제하지 않는다.

4. outer 함수가 반환한 inner 함수를 호출하면 inner 함수의 실행 컨텍스트가 생성되고 실행 컨텍스트 스택에 푸시된다. 그리고 렉시컬 환경의 외부 환경에 대한 참조에는 inner 함수 객체의 [[Environment]] 내부 슬롯에 저장되어 있는 참조값이 할당한다.
5. 중첩 함수 inner는 외부 함수 outer 보다 더 오래 생존했다. 이때 외부 함수보다 더 오래 생존한 중첩 함수는 외부 함수의 생존 여부(실행 컨텍스트의 생존 여부)와는 상관없이 자신이 정의된 위치에 의해 결정된 상위 스코프를 기억한다. 이처럼 중첩 함수 inner의 내부에서는 상위 스코프를 참조할 수 있으므로 상위 스코프의 식별자를 참조할 수 있고 식별자의 값을 변경할 수도 있다.

이러한 현상을 클로저라고 한다.

## 24.4 클로저의 활용

---

클로저는 상태(state)가 의도치 않게 변경되지 않도록 안전하게 은닉(information hiding)하고 특정 함수에게만 상태 변경을 허용하여 상태를 언전하게 변경하고 유지하기 위해 사용한다.

```js
const increase = (function () {
  // 카운트 상태 변수
  let num = 0;

  return function () {
    // 카운트 상태를 1만큼 증가시킨다.
    return ++num;
  };
})();

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```

즉시 실행 함수가 반환한 클로저는 카운트 상태를 유지하기 위한 자유 변수 num을 언제 어디서 호출하든지 참조하고 변경할 수 있다.
또한, num 변수는 외부에서 직접 접근할 수 없는 은닉된 private 변수이므로 전역 변수를 사용했을 때와 같이 의도하지 않은 변경을 걱정할 필요가 없기 때문에 더 안정적인 프로그래밍이 가능하다.

```js
const counter = (function () {
  let num = 0;

  // 클로저인 메서드를 갖는 객체를 반환한다.
  // 객체 리터럴은 스코프를 만들지 않는다.
  // 따라서 아래 메서드들의 상위 스코프는 즉시 실행 함수의 렉시컬 환경이다.
  return {
    increase() {
      return ++num;
    },
    decrease() {
      return num > 0 ? --num : 0;
    },
  };
})();

console.log(counter.increase()); // 1
console.log(counter.increase()); // 2

console.log(counter.increase()); // 1
console.log(counter.increase()); // 0
```

객체 리터럴의 중괄호는 코드 블록이 아니므로 별도의 스코프를 생성하지 않는다.
increase, decrease 메서드가 언제 어디서 호출되든 상관없이 increase, decrease 함수는 즉시 실행 함수의 식별자를 참조할 수 있다.

함수형 프로그래밍에서 클로저를 활용하는 간단한 예제

```js
// 함수를 인수로 전달받고 함수를 반환하는 고차 함수
// 이 함수는 카운트 상태를 유지하기 위한 자유 변수 counter를 기억하는 클로저를 반환한다.
function makeCounter(predicate) {
  // 카운트 상태를 유지하기 위한 자유 변수
  let counter = 0;

  // 클로저를 반환
  return function () {
    // 인수로 전달받은 보조 함수에 상태 변경을 위임한다.
    counter = predicate(counter);
    return counter;
  };
}

// 보조함수
function increase(n) {
  return ++n;
}

function decrease(n) {
  return --n;
}

// 함수로 함수를 생성한다.
// makeCounter 함수는 보조 함수를 인수로 전달받아 함수를 반환한다.
const increaser = makeCounter(increase);
console.log(increaser()); // 1
console.log(increaser()); // 2

const decreaser = makeCounter(decrease);
console.log(decreaser()); // -1
console.log(decreaser()); // -2
```

makeCounter 함수를 호출해 함수를 반환할 때 반환된 함수는 자신만의 독립된 렉시컬 환경을 갖는다.
함수를 호출할 때마다 새로운 makeCounter 함수 실생 컨텍스트의 렉시컬 환경이 생성되기 때문이다.
increaser와 decreaser는 각각 자신만의 독립된 렉시컬 환경을 갖기 때문에 카운트를 유지하기 위한 자유 변수 counter를 공유하지 않아 카운터의 증감이 연동되지 않는다.

```js
// 함수를 반환하는 고차함수
// 이 함수는 카운트 상태를 유지하기 위한 자유 변수 counter를 기억하는 클로저를 반환한다.
const counter = (function () {
  // 카운트 상태를 유지하기 위한 자유 변수
  let counter = 0;

  // 함수를 인수로 전달받는 클로저를 반환
  return function (predicate) {
    // 인수로 전달받은 보조 함수에 상태 변경을 위임한다.
    counter = predicate(counter);
    return counter;
  };
})();

// 보조 함수
function increase(n) {
  return ++n;
}

function decrease(n) {
  return --n;
}

// 보조 함수를 전달하여 호출
console.log(counter(increase)); // 1
console.log(counter(increase)); // 2

// 자유 변수를 공유 한다.
console.log(counter(decrease)); // 1
console.log(counter(decrease)); // 0
```

독립된 카운터가 아니라 연동하여 증감이 가능한 카운터를 만드려면 렉시컬 환경을 공유하는 클로저를 만들어야 한다.
이를 위해서는 makeCounter 함수를 두 번 호출하지 않아야 한다.
