# 04 콜백함수

---

## 01 콜백함수란?

---

콜백함수는 다른 코드(함수 또는 메서드)에게 인자를 넘겨줌으로써 그 제어권도 함께 위임한 함수이다.
<br />
콜백 함수를 위임받은 코드는 자체적인 내부 로직에 의해 이 콜백함수를 적절한 시점에 실행한다.

<br>

## 02 제어권

---

### 4-2-1 호출 시점

---

```js
var count = 0;
var cbFunc = function () {
  console.log(count);
  if (++count > 4) clearInterval(timer);
};

var timer = setInterval(cbFunc, 300);
```

| code                      | 호출 주체   | 제어권      |
| ------------------------- | ----------- | ----------- |
| cbFunc();                 | 사용자      | 사용자      |
| setInterval(cbFunc, 300); | setInterval | setInterval |

`setInterval`에 첫 번째 인자로 `cbFunc()`를 넘겨주면 cbFunc의 제어권을 setInterval이 갖게 되고, 스스로의 판단에 따라(setInterval에 두번째 인자로 넘어온 ms초 마다) cbFunc를 실행한다.

이처럼 콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수 호출 시점에 대한 제어권을 갖게 된다.

<br>

### 4-2-2 인자

---

```js
var newArr = [10, 20, 30].map(function (currentValue, index) {
  console.log(currentValue, index);
  return currentValue + 5;
});
console.log(newArr);
/**
 * 10 0
 * 20 1
 * 30 2
 * [15, 25, 35]
 */

var newArr2 = [10, 20, 30].map(function (index, currentValue) {
  console.log(index, currentValue);
  return currentValue + 5;
});
console.log(newArr2);
/**
 * 10 0
 * 20 1
 * 30 2
 * [5, 6, 7]
 */
```

map 메서드

- 메서드의 대상이 되는 배열의 모든 요소들을 처음부터 하나씩 꺼내어 콜백 함수를 반복 호출하고, 콜백 함수의 실행 결과들을 모아 새로운 배열을 만든다.
- 콜백함수의 첫 번째 인자 : 배열의 요소 중 현재 값
- 두 번째 인자 : 현재 값의 인덱스
- 세 번째 인자 : map 메서드의 대상이 되는 배열 자체

map 메서드를 호출해서 원하는 배열을 얻으려면 map 메서드에 정의된 규칙에 따라 함수를 작성해야 한다.
(newArr1, newArr2의 출력 결과를 비교해보면 알 수 있다.)
map 메서드에 정의된 규칙에는 콜백 함수의 인자로 넘어올 값들 및 그 순서도 포함돼 있다.

이처럼 콜백 함수의 제어권을 넘겨받은 코드는 콜백함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지에 대한 제어권을 가진다.

<br>

### 4-2-3 this

---

콜백 함수(함수 선언문으로 작성된 콜백 함수)도 함수이기 때문에 기본적으로는 this가 전역객체를 참조하지만, 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 this가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다.

별도로 this가 될 대상을 지정하는 방법

- call/apply/bind (명시적 바인딩)
- 예) forEach의 경우 두 번째 인자로 this를 설정해줄 수 있다.

함수 선언문일 경우

```js
setTimeout(function () {
  console.log(this);
}, 300); // window

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this); // window * 5
});

element.querySelector("element").addEventListener("click", function (e) {
  console.log(this); // element
});
```

함수 선언문으로 작성된 경우 this는 명시적으로 바인딩 되지 않았을 경우 window 객체를 가리킨다.

addEventListener의 callback 함수의 경우 예외적으로 이벤트 target이 this에 바인딩 된다.

- 화살표 함수로 작성할 경우 this는 예외적이지 않다. (상위 스코프의 this를 가리킨다.)

화살표 함수로 사용할 경우

```js
setTimeout(() => console.log(this), 300); // 상위 스코프의 this 즉, window

[1, 2, 3, 4, 5].forEach(() => console.log(this)); // 상위 스코프의 this 즉, window

element
  .querySelector("element")
  .addEventListener("click", () => console.log(this)); // 상위 스코프의 this 즉, window
```

화살표 함수의 this는 바인딩 되지 않고 상위 스코프의 this를 참조하게 된다.

<br>

## 03. 콜백 함수는 함수다

---

말 그대로 콜백함수는 함수다.
<br>
콜백 함수로 어떤 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아닌 함수로 호출된다.

```js
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  },
};
obj.logValues(1, 2); // {vals: [1, 2, 3], logValues: f} 1 2
[4, 5, 6].forEach(obj.logValues);
/**
 * window{} 4 0
 * window{} 5 1
 * window{} 6 2
 */
```

어떤 함수의 인자에 객체의 메서드를 전달하더라도 이는 결국 메서드가 아닌 함수일 뿐이다.

<br>

## 04. 콜백 함수 내부의 this에 다른 값 바인딩하기

---

#### ES5에 등장한 bind 메서드를 사용하는 방법

```js
var obj1 = {
  name: "obj1",
  func: function () {
    console.log(this.name);
  },
};

setTimeout(obj1.func.bind(obj1), 1000);

var obj2 = { name: "obj2" };
setTimeout(obj1.func.bind(obj2), 1500);
```

<br>

## 05. 콜백 지옥과 비동기 제어

---

콜백 지옥(callback hell)

- 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상

비동기(asynchronous)

- 비동기적인 코드는 현재 실행 중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어가는 방식
- 별도의 요청, 실행 대기, 보류 등과 관련된 코드는 비동기적인 코드

동기(synchronous)

- 동기적인 코드는 현재 실행 중인 코드가 완료된 후에야 다음 코드를 실행하는 방식

### 콜백 지옥 예시)

```js
setTimeout(
  function (name) {
    var coffeeList = name;
    console.log(coffeeList);

    setTimeout(
      function (name) {
        coffeeList += `, ${name}`;
        console.log(coffeeList);

        setTimeout(
          function (name) {
            coffeeList += `, ${name}`;
            console.log(coffeeList);

            setTimeout(
              function (name) {
                coffeeList += `, ${name}`;
                console.log(coffeeList);
              },
              500,
              "카페라떼"
            );
          },
          500,
          "카페모카"
        );
      },
      500,
      "아메리카노"
    );
  },
  500,
  "에스프레소"
);
```

위 예제는 0.5초 주기마다 커피 목록을 수집하고 출력한다.
목적 달성에는 지장이 없지만 들여쓰기 수준이 과도하게 깊어졌을뿐더러 값이 전달되는 순서가 '아래에서 위로' 향하고 있어 어색하게 느껴진다.

### Promise 사용 예제)

```js
new Promise(function (resolve) {
  setTimeout(function () {
    var name = "에스프레소";
    console.log(name);
    resolve(name);
  }, 500);
})
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = `${prevName}, 아메리카노`;
        console.log(name);
        resolve(name);
      }, 500);
    });
  })
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = `${prevName}, 카페모카`;
        console.log(name);
        resolve(name);
      }, 500);
    });
  })
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = `${prevName}, 카페라떼`;
        console.log(name);
        resolve(name);
      }, 500);
    });
  });
```

new 연산자와 함께 호출한 Promise의 인자로 넘겨주는 콜백 함수는 호출할 때 바로 실행되지만 그 내부에 resolve, reject 함수를 호출하는 구문이 있을 경우 둘 중 하나가 실행되기 전까지는 다음(then) 또는 오류 구문 (catch)으로 넘어가지 않는다. 따라서 비동기 작업이 완료될 때 비로소 resolve 또는 reject를 호출하는 방법으로 비동기 작업의 동기적 표현이 가능하다.

<br>

### Promise + 클로저 표현 방법

```js
var addCoffee = function (name) {
  return function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var newName = prevName ? `${(prevName, name)}` : name;
        console.log(newName);
        resolve(newName);
      }, 500);
    });
  };
};

addCoffee("에스프레소")()
  .then(addCoffee("아메리카노"))
  .then(addCoffee("카페모카"))
  .then(addCoffee("카페라떼"));
```

<br>

### Promise + Async/await

```js
var addCoffee = function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 500);
  });
};

var coffeeMaker = async function () {
  var coffeeList = "";
  var _addCoffee = async function (name) {
    coffeeList += (coffeeList ? "," : "") + (await addCoffee(name));
  };
  await _addCoffee("에스프레소");
  console.log(coffeeList);
  await _addCoffee("아메리카노");
  console.log(coffeeList);
  await _addCoffee("카페모카");
  console.log(coffeeList);
  await _addCoffee("카페라떼");
  console.log(coffeeList);
};
coffeeMaker();
```

ES2017에서 async/await이 추가된다.
비동기 작업을 수행하고자 하는 함수 앞에 async를 표기하고, 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 await를 표기하는 것만으로 뒤의 내용을 Promise로 자동 전환하고, 해당 내용이 resolve된 이후에야 다음으로 진행한다.

<br>

## 06. 정리

---

- 콜백 함수는 다른 코드에 인자로 넘겨줌으로써 그 제어권도 함께 위임한 함수이다.
- 제어권을 넘겨받은 코드는 다음과 같은 제어권을 가진다.
  - 콜백 함수를 호출하는 시점을 스스로 판단해서 실행한다.
  - 콜백 함수를 호출할 때 인자로 넘겨줄 값들 및 그 순서가 정해져 있다. (이 순서를 따르지 않을 경우 엉뚱한 결과가 나온다.)
  - 콜백 함수의 this가 무엇을 바라보도록 할지가 정해져 있는 경우도 있다.
    - 정하지 않은 경우에는 전역 객체를 바라본다.
    - 사용자가 임의로 this를 바꾸고 싶을 경우 bind 메서드를 활용한다.
- 어떤 함수에 인자로 메서드를 전달하더라도 이는 결국 함수로서 실행된다.
- 비동기 제어를 위해 콜백 함수를 사용하다 보면 콜백 지옥에 빠지기 쉽다.
  - Promise, Generator, async/await 등 콜백 지옥에서 벗어날 수 있는 방법들이 존재한다.
