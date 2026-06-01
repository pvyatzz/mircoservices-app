# Microservices Test Guide (Step by Step)

This guide helps you test the 4 services in this workspace:
- `service-registry`
- `question-service/quiz-service` (question microservice)
- `quiz-service/quiz-service` (quiz microservice)
- `api-gateway`

It focuses on direct endpoint checks first, then gateway checks.

## 1) Prerequisites

- Java and Maven wrapper support (project uses `mvnw.cmd`)
- MySQL running locally
- Databases available:
  - `quizapp` (for question service)
  - `quizdb` (for quiz service)
- DB user/password currently configured in both services:
  - username: `springstudent`
  - password: `springstudent`

> ce-registry` runs on port `8761`
> - `api-gatKnown from current config files:
> - `servieway` runs on port `8765`
> - `quiz-service` runs on port `8090`
> - `question-service` has no explicit `server.port` in config (Spring default is usually `8080` unless overridden)

---

## 2) Start services in order

Open **4 separate terminals** and run one service per terminal.

### Terminal A - Service Registry

```powershell
Set-Location "C:\Workspace\01_Springboot_Exercise\quiz-microservices\service-registry"
.\mvnw.cmd spring-boot:run
```

### Terminal B - Question Service

```powershell
Set-Location "C:\Workspace\01_Springboot_Exercise\quiz-microservices\question-service\quiz-service"
.\mvnw.cmd spring-boot:run
```

### Terminal C - Quiz Service

```powershell
Set-Location "C:\Workspace\01_Springboot_Exercise\quiz-microservices\quiz-service\quiz-service"
.\mvnw.cmd spring-boot:run
```

### Terminal D - API Gateway

```powershell
Set-Location "C:\Workspace\01_Springboot_Exercise\quiz-microservices\api-gateway"
.\mvnw.cmd spring-boot:run
```

---

## 3) Verify basic health/discovery

### 3.1 Eureka dashboard

Open in browser:

```text
http://localhost:8761/
```

You should see registered clients after all services start.

### 3.2 Quick direct endpoint checks

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/question/allQuestions"
Invoke-RestMethod -Method Post -Uri "http://localhost:8090/quiz/get/1" -ContentType "application/json" -Body "[]"
```

If question-service is not on `8080`, replace with the actual port from startup logs.

---

## 4) Seed sample questions in question-service

Run these one by one in PowerShell:

```powershell
$q1 = @{
  questionTitle = "What is JVM?"
  option1 = "Java Virtual Machine"
  option2 = "Java Vendor Machine"
  option3 = "Just Virtual Memory"
  option4 = "Joint Vector Module"
  rightAnswer = "Java Virtual Machine"
  difficultylevel = "easy"
  category = "Java"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/question/add" -ContentType "application/json" -Body $q1

$q2 = @{
  questionTitle = "Which keyword creates an object?"
  option1 = "class"
  option2 = "new"
  option3 = "this"
  option4 = "import"
  rightAnswer = "new"
  difficultylevel = "easy"
  category = "Java"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/question/add" -ContentType "application/json" -Body $q2

$q3 = @{
  questionTitle = "Which collection disallows duplicates?"
  option1 = "List"
  option2 = "Queue"
  option3 = "Set"
  option4 = "Map"
  rightAnswer = "Set"
  difficultylevel = "easy"
  category = "Java"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/question/add" -ContentType "application/json" -Body $q3

$q4 = @{
  questionTitle = "What does JPA stand for?"
  option1 = "Java Persistence API"
  option2 = "Java Process API"
  option3 = "Joint Persistence Adapter"
  option4 = "JSON Persistence API"
  rightAnswer = "Java Persistence API"
  difficultylevel = "medium"
  category = "Java"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/question/add" -ContentType "application/json" -Body $q4

$q5 = @{
  questionTitle = "Which annotation marks a REST controller?"
  option1 = "@Component"
  option2 = "@Service"
  option3 = "@RestController"
  option4 = "@Bean"
  rightAnswer = "@RestController"
  difficultylevel = "easy"
  category = "Java"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/question/add" -ContentType "application/json" -Body $q5
```

Now verify category query:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/question/category/Java"
```

---

## 5) Test question generation directly

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/question/generate?categoryName=Java&numQuestions=5"
```


Expected: a JSON array of question IDs, for example:

```json
[2,5,1,4,3]
```

If this step fails with HTTP 500, fix this first before testing quiz creation.

---

## 6) Test quiz creation directly (quiz-service)

```powershell
$createQuiz = @{
  categoryName = "Java"
  numQuestions = 5
  title = "Spring Quiz 1"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8090/quiz/create" -ContentType "application/json" -Body $createQuiz
```
in my output, this returns: Error creating quiz: [500] during [GET] to [http://QUESTION-SERVICE/question/generate?categoryName=Java&numQuestions=5] [QuizInterface#getQuestionsForQuiz(String,Integer)]: [{"timestamp":"2026-05-28T14:05:55.543Z","status":500,"error":"Internal Server Error","path":"/question/generate"}]

Expected response: `Success`.

---

## 7) Test fetch/submit quiz

`/quiz/create` currently returns only text, not quiz id. To continue, get ID from DB.

### 7.1 Read latest quiz id from MySQL

```sql
SELECT id, title FROM quizdb.quiz ORDER BY id DESC LIMIT 1;
```

Assume latest id is `1`.

### 7.2 Fetch quiz questions

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8090/quiz/get/1" -ContentType "application/json" -Body "[]"
```

output: {
"timestamp": "2026-05-28T14:06:43.965Z",
"status": 405,
"error": "Method Not Allowed",
"path": "/quiz/get/1"
}


### 7.3 Submit quiz answers

```powershell
$submit = @(
  @{ id = 1; response = "Java Virtual Machine" },
  @{ id = 2; response = "new" },
  @{ id = 3; response = "Set" },
  @{ id = 4; response = "Java Persistence API" },
  @{ id = 5; response = "@RestController" }
) | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8090/quiz/submit/1" -ContentType "application/json" -Body $submit
```

Expected: integer score.

---

## 8) Test through API Gateway (optional after direct tests pass)

With discovery locator enabled in gateway config, test:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8765/quiz-service/quiz/create" -ContentType "application/json" -Body $createQuiz
Invoke-RestMethod -Method Get -Uri "http://localhost:8765/question-service/question/generate?categoryName=Java&numQuestions=5"
```

If these fail while direct calls work, check service registration in Eureka and service names.

---

## 9) Troubleshooting checklist

### Error: `Error creating quiz ... /question/generate ... 500`

Check in this order:

1. Confirm `question-service` is running and reachable directly.
2. Confirm category `Java` has at least requested number of questions.
3. Check `question-service` logs for SQL error in query method:
   - file: `question-service/quiz-service/src/main/java/com/example/app/repo/QuestionDao.java`
   - method: `findRandomQuestionsByCategory(...)`
4. If DB is MySQL, `ORDER BY RANDOM()` may fail. MySQL uses `RAND()`.

Suggested query adjustment for MySQL:

```java
@Query(value = "SELECT q.id FROM question q WHERE q.category=:category ORDER BY RAND() LIMIT :numQ", nativeQuery = true)
List<Integer> findRandomQuestionsByCategory(String category, int numQ);
```

### Error: Feign cannot find `QUESTION-SERVICE`

- Ensure both services are registered in Eureka dashboard.
- Confirm names match:
  - caller uses `@FeignClient("QUESTION-SERVICE")`
  - target app name is `question-service`
- If registration is unstable, add explicit Eureka URL in both service `application.properties`:

```ini
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
```

### Error: Connection refused to DB

- Confirm MySQL is running.
- Confirm user/password and DB names match properties in both services.

---

## 10) Minimal success criteria

You can consider setup working when all are true:

- `http://localhost:8761/` shows registered services
- `GET /question/generate?categoryName=Java&numQuestions=5` returns ID list
- `POST /quiz/create` returns `Success`
- `POST /quiz/get/{id}` returns question wrappers
- `POST /quiz/submit/{id}` returns numeric score

