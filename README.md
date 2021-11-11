# Checklist App

## [SERVER] Express.js

### List API

1. POST:/list  
(request)  
```
{
  "title": "팔뚝살 운동",
  "goal_count": 100,
  "user_id": "!23"
}
```

2. GET:/list 체크리스트 목록

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

3. GET:/list/detail/{{id}} 체크리스트 상세

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

```
{
  "month": [
      {
      "day": "1",
      "count": 10 // 총등록 todo 갯수
      "done_count": 8 // 그중 성공한거
      "all_done": false
      },
      {
      "day": "2",
      "count": 10 // 총등록 todo 갯수
      "done_count": 8 // 그중 성공한거
      "all_done": false
      },
  ]
}
```

### Todo API

**POST:/todo**
(request)

```
{
  "title": "걷기 30분",
  "date": "2021-11-04",
  "day_order": 3,
  "goal_order": null
}
```

**PATCH:/todo/{{id}}**
(request)

```
{
  "done": true
}
```

**PUT:/todo/{{id}}**  
(request)

```
{
  "title": "걷기 20분",
  "date": "2021-11-20",
  "content": "잘했다. 좀만더",
  "day_order": 5,
  "goal_order": 1
}
```

**DELETE:/todo/{{id}}**  
```
delte /todo/dfasdfsd
```

## [FRONT] React.js

## [DB] MongoDB
