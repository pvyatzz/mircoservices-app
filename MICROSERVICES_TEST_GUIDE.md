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
Output : "Hibernate: SELECT q.id FROM question q Where q.category=? ORDER BY RANDOM() LIMIT ?
2026-05-28T22:03:50.410+08:00  WARN 30320 --- [question-service] [nio-8080-exec-1] org.hibernate.orm.jdbc.error             : HHH000247: ErrorCode: 1064, SQLState: 42000
2026-05-28T22:03:50.410+08:00  WARN 30320 --- [question-service] [nio-8080-exec-1] org.hibernate.orm.jdbc.error             : You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '() LIMIT 5' at line 1
2026-05-28T22:03:50.411+08:00 ERROR 30320 --- [question-service] [nio-8080-exec-1] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: org.springframework.dao.InvalidDataAccessResourceUsageException: JDBC exception executing SQL [You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '() LIMIT 5' at line 1] [SELECT q.id FROM question q Where q.category=? ORDER BY RANDOM() LIMIT ?]; SQL [SELECT q.id FROM question q Where q.category=? ORDER BY RANDOM() LIMIT ?]] with root cause

java.sql.SQLSyntaxErrorException: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '() LIMIT 5' at line 1
at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:112) ~[mysql-connector-j-9.7.0.jar:9.7.0]
at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:114) ~[mysql-connector-j-9.7.0.jar:9.7.0]
at com.mysql.cj.jdbc.ClientPreparedStatement.executeInternal(ClientPreparedStatement.java:988) ~[mysql-connector-j-9.7.0.jar:9.7.0]
at com.mysql.cj.jdbc.ClientPreparedStatement.executeQuery(ClientPreparedStatement.java:1056) ~[mysql-connector-j-9.7.0.jar:9.7.0]
at com.zaxxer.hikari.pool.ProxyPreparedStatement.executeQuery(ProxyPreparedStatement.java:52) ~[HikariCP-7.0.2.jar:na]
at com.zaxxer.hikari.pool.HikariProxyPreparedStatement.executeQuery(HikariProxyPreparedStatement.java) ~[HikariCP-7.0.2.jar:na]
at org.hibernate.sql.results.jdbc.internal.DeferredResultSetAccess.executeQuery(DeferredResultSetAccess.java:271) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.results.jdbc.internal.DeferredResultSetAccess.getResultSet(DeferredResultSetAccess.java:190) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.results.jdbc.internal.AbstractResultSetAccess.getResultSetMetaData(AbstractResultSetAccess.java:52) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.results.jdbc.internal.AbstractResultSetAccess.getColumnCount(AbstractResultSetAccess.java:66) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.query.results.internal.ResultSetMappingImpl.resolve(ResultSetMappingImpl.java:188) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.internal.JdbcSelectExecutorStandardImpl.resolveJdbcValues(JdbcSelectExecutorStandardImpl.java:409) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.internal.JdbcSelectExecutorStandardImpl.resolveJdbcValuesSource(JdbcSelectExecutorStandardImpl.java:349) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.internal.JdbcSelectExecutorStandardImpl.doExecuteQuery(JdbcSelectExecutorStandardImpl.java:143) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.internal.JdbcSelectExecutorStandardImpl.executeQuery(JdbcSelectExecutorStandardImpl.java:100) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.spi.JdbcSelectExecutor.executeQuery(JdbcSelectExecutor.java:63) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.spi.JdbcSelectExecutor.list(JdbcSelectExecutor.java:137) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.spi.JdbcSelectExecutor.list(JdbcSelectExecutor.java:114) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.sql.exec.spi.JdbcSelectExecutor.list(JdbcSelectExecutor.java:104) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.query.sql.internal.NativeSelectQueryPlanImpl.performList(NativeSelectQueryPlanImpl.java:138) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.query.sql.internal.NativeQueryImpl.doList(NativeQueryImpl.java:756) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.query.spi.AbstractSelectionQuery.list(AbstractSelectionQuery.java:153) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.hibernate.query.Query.getResultList(Query.java:121) ~[hibernate-core-7.2.12.Final.jar:7.2.12.Final]
at org.springframework.data.jpa.repository.query.JpaQueryExecution$CollectionExecution.doExecute(JpaQueryExecution.java:132) ~[spring-data-jpa-4.0.5.jar:4.0.5]
at org.springframework.data.jpa.repository.query.JpaQueryExecution.execute(JpaQueryExecution.java:99) ~[spring-data-jpa-4.0.5.jar:4.0.5]
at org.springframework.data.jpa.repository.query.AbstractJpaQuery.doExecute(AbstractJpaQuery.java:164) ~[spring-data-jpa-4.0.5.jar:4.0.5]
at org.springframework.data.jpa.repository.query.AbstractJpaQuery.execute(AbstractJpaQuery.java:154) ~[spring-data-jpa-4.0.5.jar:4.0.5]
at org.springframework.data.repository.core.support.RepositoryMethodInvoker.doInvoke(RepositoryMethodInvoker.java:169) ~[spring-data-commons-4.0.5.jar:4.0.5]
at org.springframework.data.repository.core.support.RepositoryMethodInvoker.invoke(RepositoryMethodInvoker.java:158) ~[spring-data-commons-4.0.5.jar:4.0.5]
at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.doInvoke(QueryExecutorMethodInterceptor.java:167) ~[spring-data-commons-4.0.5.jar:4.0.5]
at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.invoke(QueryExecutorMethodInterceptor.java:146) ~[spring-data-commons-4.0.5.jar:4.0.5]
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-7.0.7.jar:7.0.7]
at org.springframework.data.projection.DefaultMethodInvokingMethodInterceptor.invoke(DefaultMethodInvokingMethodInterceptor.java:69) ~[spring-data-commons-4.0.5.jar:4.0.5]
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-7.0.7.jar:7.0.7]
at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:133) ~[spring-tx-7.0.7.jar:7.0.7]
at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:371) ~[spring-tx-7.0.7.jar:7.0.7]
at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:130) ~[spring-tx-7.0.7.jar:7.0.7]
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-7.0.7.jar:7.0.7]
at org.springframework.dao.support.PersistenceExceptionTranslationInterceptor.invoke(PersistenceExceptionTranslationInterceptor.java:135) ~[spring-tx-7.0.7.jar:7.0.7]
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-7.0.7.jar:7.0.7]
at org.springframework.data.jpa.repository.support.CrudMethodMetadataPostProcessor$CrudMethodMetadataPopulatingMethodInterceptor.invoke(CrudMethodMetadataPostProcessor.java:137) ~[spring-data-jpa-4.0.5.jar:4.0.5]
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-7.0.7.jar:7.0.7]
at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:222) ~[spring-aop-7.0.7.jar:7.0.7]
at jdk.proxy2/jdk.proxy2.$Proxy134.findRandomQuestionsByCategory(Unknown Source) ~[na:na]
at com.example.app.service.QuestionService.getQuestionsForQuiz(QuestionService.java:46) ~[classes/:na]
at com.example.app.controller.QuestionController.getQuestionsForQuiz(QuestionController.java:46) ~[classes/:na]
at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104) ~[na:na]
at java.base/java.lang.reflect.Method.invoke(Method.java:565) ~[na:na]
at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:252) ~[spring-web-7.0.7.jar:7.0.7]
at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:184) ~[spring-web-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:934) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:853) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:86) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:866) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1000) ~[spring-webmvc-7.0.7.jar:7.0.7]
at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:892) ~[spring-webmvc-7.0.7.jar:7.0.7]
at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:622) ~[tomcat-embed-core-11.0.21.jar:6.1]
at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:874) ~[spring-webmvc-7.0.7.jar:7.0.7]
at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:710) ~[tomcat-embed-core-11.0.21.jar:6.1]
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:128) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53) ~[tomcat-embed-websocket-11.0.21.jar:11.0.21]
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:107) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100) ~[spring-web-7.0.7.jar:7.0.7]
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-7.0.7.jar:7.0.7]
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:107) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93) ~[spring-web-7.0.7.jar:7.0.7]
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-7.0.7.jar:7.0.7]
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:107) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:199) ~[spring-web-7.0.7.jar:7.0.7]
at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-7.0.7.jar:7.0.7]
at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:107) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:165) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:77) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:492) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:113) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:83) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:72) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:341) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:397) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:903) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1801) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:946) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:480) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:57) ~[tomcat-embed-core-11.0.21.jar:11.0.21]
at java.base/java.lang.Thread.run(Thread.java:1474) ~[na:na]"


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

