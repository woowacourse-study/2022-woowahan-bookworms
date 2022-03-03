# 이펙티브 자바

아이템 22) 인터페이스는 타입을 정의하는 용도로만 사용하라 (p139-141)


## 아이템22) 인터페이스는 타입을 정의하는 용도로만 사용하라
- 인터페이스는 자신을 구현한 클래스의 인스턴스를 참조할 수 있는 타입 역할을 함
- 즉, 인터페이스로 무엇을 할 수 있는지를 클라이언트에 얘기해주는 것
- 인터페이스를 상수 공개용 수단으로 사용하지 말자

### 상수 인터페이스 안티패턴 - 사용금지!
```java
public interface Constants {
    static final int MAX = 9;
    static final int MIN = 0;
}
```

### 상수 유틸리티 클래스 - 이걸 사용하자
```java
public class Constants {
    private Constants() {} //인스턴스화 방지
    
    static final int MAX = 9;
    static final int MIN = 0;
}
```
