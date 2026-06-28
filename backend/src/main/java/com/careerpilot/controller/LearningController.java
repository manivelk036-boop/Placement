package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.entity.Assessment;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.Topic;
import com.careerpilot.entity.TopicProgress;
import com.careerpilot.repository.QuizRepository;
import com.careerpilot.service.LearningService;
import com.careerpilot.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {

    private final LearningService learningService;
    private final StudentService studentService;
    private final QuizRepository quizRepository;

    @GetMapping("/topics")
    public ResponseEntity<ApiResponse<List<Topic>>> getTopics(@AuthenticationPrincipal Student student) {
        List<Topic> topics = studentService.getTopicsForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(topics));
    }

    @PostMapping("/topics/{topicId}/activity")
    public ResponseEntity<ApiResponse<TopicProgress>> markActivity(
            @AuthenticationPrincipal Student student,
            @PathVariable Long topicId,
            @RequestParam String activity) {
        TopicProgress progress = learningService.markActivity(student.getId(), topicId, activity);
        return ResponseEntity.ok(ApiResponse.ok(progress));
    }

    @GetMapping("/topics/{topicId}/quiz")
    public ResponseEntity<ApiResponse<Object>> getQuiz(
            @AuthenticationPrincipal Student student,
            @PathVariable Long topicId) {
        Topic topic = learningService.getTopic(topicId);
        var quiz = quizRepository.findByTopic(topic);
        if (quiz.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok("No quiz available for this topic", null));
        }
        return ResponseEntity.ok(ApiResponse.ok(quiz.get()));
    }

    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<ApiResponse<Assessment>> submitQuiz(
            @AuthenticationPrincipal Student student,
            @PathVariable Long quizId,
            @RequestBody Map<Long, String> answers) {
        Assessment result = learningService.submitQuiz(student.getId(), quizId, answers);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
