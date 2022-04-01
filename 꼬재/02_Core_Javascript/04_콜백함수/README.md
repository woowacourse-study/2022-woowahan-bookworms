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

## 콜백 함수는 함수다

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
