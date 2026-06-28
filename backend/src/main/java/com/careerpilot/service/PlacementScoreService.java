package com.careerpilot.service;

import com.careerpilot.dto.PlacementScoreResponse;
import com.careerpilot.entity.MockInterview;
import com.careerpilot.entity.PlacementScore;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PlacementScoreService {

    private final StudentRepository studentRepository;
    private final PlacementScoreRepository placementScoreRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final MockInterviewRepository mockInterviewRepository;

    @Transactional
    public PlacementScoreResponse recalculate(Student student) {
        int technical = calculateTechnical(student);
        int communication = 50;
        int problemSolving = 50;
        int interviewReadiness = mockInterviewRepository.findByStudentOrderByCompletedAtDesc(student).stream()
                .findFirst()
                .map(MockInterview::getScore)
                .orElse(40);

        int overall = (int) ((technical * 0.35) + (communication * 0.15) +
                (problemSolving * 0.25) + (interviewReadiness * 0.25));

        if (student.getCgpa() != null) {
            overall = Math.min(100, overall + (int) (student.getCgpa() * 2));
        }

        student.setPlacementScore(overall);
        studentRepository.save(student);

        PlacementScore score = PlacementScore.builder()
                .student(student)
                .overallScore(overall)
                .technicalSkills(technical)
                .communication(communication)
                .problemSolving(problemSolving)
                .interviewReadiness(interviewReadiness)
                .build();
        placementScoreRepository.save(score);

        return buildResponse(student, score);
    }

    public PlacementScoreResponse getPlacementScore(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        PlacementScore score = placementScoreRepository.findFirstByStudentOrderByCalculatedAtDesc(student)
                .orElseGet(() -> {
                    recalculate(student);
                    return placementScoreRepository.findFirstByStudentOrderByCalculatedAtDesc(student).orElseThrow();
                });

        return buildResponse(student, score);
    }

    private int calculateTechnical(Student student) {
        if (student.getCareerGoal() == null) return 20;

        long completed = topicProgressRepository.countByStudentAndCompletedTrue(student);
        long total = Math.max(1, topicProgressRepository.findByStudent(student).size());

        int skillBonus = student.getSkills() != null ? Math.min(30, student.getSkills().size() * 5) : 0;
        return Math.min(100, (int) ((completed * 100.0 / total) * 0.7) + skillBonus);
    }

    private PlacementScoreResponse buildResponse(Student student, PlacementScore score) {
        List<String> weakAreas = new ArrayList<>();
        if (score.getTechnicalSkills() < 60) weakAreas.add("Technical Skills");
        if (score.getCommunication() < 60) weakAreas.add("Communication");
        if (score.getProblemSolving() < 60) weakAreas.add("Problem Solving");
        if (score.getInterviewReadiness() < 60) weakAreas.add("Interview Readiness");

        Map<String, Integer> predictions = new LinkedHashMap<>();
        predictions.put("Current Score", score.getOverallScore());
        predictions.put("If Spring Boot Completed", Math.min(100, score.getOverallScore() + 12));
        predictions.put("If Internship Added", Math.min(100, score.getOverallScore() + 19));
        predictions.put("If All Topics Completed", Math.min(100, score.getOverallScore() + 25));

        return PlacementScoreResponse.builder()
                .overallScore(score.getOverallScore())
                .technicalSkills(score.getTechnicalSkills())
                .communication(score.getCommunication())
                .problemSolving(score.getProblemSolving())
                .interviewReadiness(score.getInterviewReadiness())
                .weakAreas(weakAreas)
                .careerTwinPredictions(predictions)
                .build();
    }
}
