# Summer Coding HomeWork API\
## 기능
* TODO 목록 보이기

  | 메소드 | 경로  | 설명             |
  | ------ | ----- | ---------------- |
  | GET    | /TODO | TODO list 보내기 |
#### 요청헤더

```
Content-Type: application/json
```

#### 응답 바디

##### 성공

```json
{
    "status": 200,
    "message": "로그인 성공",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY29jbyIsImlzcyI6IkRvSVRTT1BUIn0.Rplge4ISuuCrFzrddjOl55TCeRQ2QUD9yuwSMmOZ5X0"
    }
}
```

##### 실패

```json
{
    "status": 400,
    "message": "로그인 실패",
    "data": null
}
```

* TODO 항목의 제목과 내용 수정

  

* TODO 항목 삭제

* TODO에는 마감기한

* TODO 우선 순위 설정 가능, 조절 가능

* TODO 항목 완료 처리

* 마감기한이 지난 TODO 알림
## 성능
* 이용시 발생 오류 최소화
* 오류발생시 사용자 이해 쉽게
* 가독성 높게
* HTML,CSS 사용