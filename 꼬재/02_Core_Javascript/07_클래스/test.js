// // 생성자
// const Rectangle = function (width, height) {
//   this.width = width;
//   this.height = height;
// };

// // 프로토 타입 메서드
// Rectangle.prototype.getArea = function () {
//   return this.width * this.height;
// };

// // 스태틱 메서드
// Rectangle.isRectangle = function (instance) {
//   return (
//     instance instanceof Rectangle && instance.width > 0 && instance.height > 0
//   );
// };

// const rect1 = new Rectangle(3, 4);
// console.log(rect1.getArea()); // 12
// console.log(rect1.isRectangle(rect1)); // TypeError
// console.log(Rectangle.isRectangle(rect1)); // true

// // Rectangel 생성자
// const Rectangle = function (width, height) {
//   this.width = width;
//   this.height = height;
// };

// // Rectangle 프로토타입 메서드
// Rectangle.prototype.getArea = function () {
//   return this.width * this.height;
// };

// // 인스턴스 생성
// const rect = new Rectangle(3, 4);
// console.log(rect.getArea()); // 12

// // Square 생성자
// const Square = function (width) {
//   this.width = width;
// };

// // Square 프로토타입 메서드
// Square.prototype.getArea = function () {
//   return this.width * this.width;
// };

// const sq = new Square(5);
// console.log(sq.getArea()); // 25

// Rectangel 생성자
const Rectangle = function (width, height) {
  this.width = width;
  this.height = height;
};

// Rectangle 프로토타입 메서드
Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};

// Square 생성자
const Square = function (width) {
  // Rectangle의 생성자 함수를 함수로써 호출
  Rectangle.call(this, width, width);
};

// Square 프로토타입을 Rectangle로 설정
Square.prototype = new Rectangle();

const sq = new Square(5);
console.dir(sq);
console.log(sq.getArea()); // 25
