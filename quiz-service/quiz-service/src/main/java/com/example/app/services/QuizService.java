package com.example.app.services;

import com.example.app.feign.QuizInterface;
import com.example.app.model.QuestionWrapper;
import com.example.app.model.Quiz;
import com.example.app.model.Response;
import com.example.app.repo.QuizDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;

    @Autowired
    QuizInterface quizInterface;


    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        try {
            ResponseEntity<List<Integer>> response = quizInterface.getQuestionsForQuiz(category, numQ);
            if (response == null || response.getBody() == null) {
                return new ResponseEntity<>("Failed to fetch questions from QUESTION-SERVICE", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            List<Integer> questions = response.getBody();
            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setQuestionIds(questions);
            Quiz saved = quizDao.save(quiz);

            return new ResponseEntity<>(String.valueOf(saved.getId()), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating quiz: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        try {
            Quiz quiz = quizDao.findById(id)
                    .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
            List<Integer> questionIds = quiz.getQuestionIds();
            return quizInterface.getQuestionsFromId(questionIds);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        ResponseEntity<Integer> score = quizInterface.getScore(responses);
        return score;
    }
}
