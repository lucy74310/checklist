# Checklist App

## [SERVER] Express.js

### User Api

1. POST:/user 회원가입  
   (request)

   ```
   {
     "email": "test@google.com",
     "name": "Lucy Jo",
     "password": "test1234!!"
   }
   ```

   (response)

   ```
   (성공시)
   {
     "user": {
       ...
     }
   }

   (실패시)
   {
     "err": "This email already exist."
   }
   ```

2. POST:/user/login 로그인

   (requset)

   ```
   {
     "email": "test@google.com",
     "password": "test1234!!"
   }
   ```

   (response)

   ```
   //success
   {
     "login": true
   }

   //fail
   {
   "err": "password is incorrect"
   }
   ```

3. PATCH:/user 로그아웃
   request - (just uri)
   response
   ```
   {
    "logout": true
   }
   ```

### List API

1. POST:/list
   (request)

   ```
   {
     "title": "팔뚝살 운동",
     "goal_count": 100,
     "type": "designate_day",
     "start_date": "2021-11-09" // 값없을시 오늘부터.
     "day": ["mon","tue"],
     "interval": 3
     // type: everyday, after(나중에설정), weekend, weekday, designate_day
   }
   ```

2. GET:/list 체크리스트 목록
   (response)

   ```
   {
     "list": [
       {
         "title": "팔뚝살 운동",
         "goal_count": 100
         "done_count": 33,
         "user_id": "dfasdf"
       },
       {
         "title": "데이터베이스 진도 3개월",
         "goal_count": 100,
         "done_count": 0,
         "user_id": "dfasdf"
       }
     ]
   }
   ```

3. GET:/list/{{id}} 체크리스트 상세
   (response)

   ```
   {
     "list": {
       "title": "팔뚝살 운동",
       "goal_count": 100,
       "done_count": 33,
       "checks": [
         {
           "_id": "1",
           "title": "팔뚝살 운동",
           "date": "2021-11-03",
           "done": true,
           "content": "",
           "day_order": 1,
           "goal_order": 1
         },
         {
           "_id": "2",
           "done": false,
           "title": "팔뚝살 운동",
           "date": "2021-11-03",
           "content": "",
           "day_order": 3,
           "goal_order": 2
         }
       ]
     }
   }
   ```

4. GET:/list/date/{{id}} 특정한 날짜에 해야할 todolist
   (response)

   ```
   {
     "date": [
       {
         "_id": "1",
         "title": "팔뚝살 운동 10분",
         "date": "2021-11-01",
         "done": true,
         "content": "",
         "day_order": 1,
         "goal_order": 23
       },
       {
         "_id": "2",
         "title": "스터디",
         "date": "2021-11-01",
         "done": false,
         "content": "",
         "day_order": 1,
         "goal_order": null
       }
     ]
   }
   ```

5. GET:/list/month/{{id}} 1달치 날짜별 done 카운트
   (response)
   ```
   {
    "month": {
        "2021-10-14": {
            "count": 5,
            "done_count": 1,
            "all_done": false
        },
        "2021-10-15": {
            "count": 5,
            "done_count": 1,
            "all_done": false
        }
    }
   }
   ```

### Todo API

1. POST:/todo 할일 생성
   (request)

````
{
  "title": "걷기 30분",
  "date": "2021-11-04",
  "day_order": 3,
  "goal_order": null
}
```

2. PATCH:/todo/{{id}} done 여부 업데이트

(request)

  ```
  {
    "done": true
  }
  ```

3. PUT:/todo/{{id}} 할일 수정
  (request)

  ```
  {
    "title": "걷기 20분",
    "date": "2021-11-20",
    "comment": "40분걸음.",
  }
  ```


4. DELETE:/todo/{{id}} 삭제


## [FRONT] React.js

## [DB] MongoDB
```
````
