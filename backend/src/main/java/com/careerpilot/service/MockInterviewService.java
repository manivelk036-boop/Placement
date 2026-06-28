package com.careerpilot.service;

import com.careerpilot.entity.MockInterview;
import com.careerpilot.entity.Student;
import com.careerpilot.entity.InterviewType;
import com.careerpilot.repository.MockInterviewRepository;
import com.careerpilot.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private static final List<String> HR_QUESTIONS = List.of(
            "Tell me about yourself.",
            "Why should we hire you?",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?"
    );

    private static final List<String> TECH_QUESTIONS = List.of(
            "Explain OOP concepts in Java.",
            "What is the difference between ArrayList and LinkedList?",
            "Explain REST API principles.",
            "What is dependency injection in Spring?"
    );

    private final MockInterviewRepository mockInterviewRepository;
    private final StudentRepository studentRepository;
    private final GamificationService gamificationService;
    private final PlacementScoreService placementScoreService;
    private final Random random = new Random();

    public Map<String, Object> generateInterview(Long studentId, InterviewType type) {
        List<String> questions = switch (type) {
            case HR -> HR_QUESTIONS;
            case TECHNICAL -> TECH_QUESTIONS;
            default -> {
                List<String> mixed = new java.util.ArrayList<>(HR_QUESTIONS.subList(0, 2));
                mixed.addAll(TECH_QUESTIONS.subList(0, 2));
                yield mixed;
            }
        };

        return Map.of(
                "type", type.name(),
                "questions", questions
        );
    }

    @Transactional
    public MockInterview submitInterview(Long studentId, InterviewType type, String answers) {
        Student student = studentRepository.findById(studentId).orElseThrow();

        int score = 55 + random.nextInt(35);
        String feedback = score >= 75
                ? "Strong performance. Good clarity and technical depth."
                : "Needs improvement. Focus on structuring answers and technical fundamentals.";

        MockInterview interview = MockInterview.builder()
                .student(student)
                .type(type)
                .questions(String.join("\n", HR_QUESTIONS.subList(0, 3)))
                .answers(answers)
                .score(score)
                .feedback(feedback)
                .improvementPlan("Practice STAR method. Review core technical concepts daily.")
                .build();

        mockInterviewRepository.save(interview);
        gamificationService.addCoins(student, GamificationService.COINS_MOCK_INTERVIEW);
        placementScoreService.recalculate(student);

        return interview;
    }
}
