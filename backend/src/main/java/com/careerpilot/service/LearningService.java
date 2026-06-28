package com.careerpilot.service;

import com.careerpilot.entity.*;
import com.careerpilot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LearningService {

    private final TopicRepository topicRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final StudentRepository studentRepository;
    private final GamificationService gamificationService;
    private final AssessmentRepository assessmentRepository;
    private final QuizRepository quizRepository;
    private final RoadmapRepository roadmapRepository;

    public Topic getTopic(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found"));
    }

    @Transactional
    public TopicProgress markActivity(Long studentId, Long topicId, String activity) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Topic topic = getTopic(topicId);

        TopicProgress progress = topicProgressRepository.findByStudentAndTopic(student, topic)
                .orElse(TopicProgress.builder().student(student).topic(topic).build());

        switch (activity.toLowerCase()) {
            case "notes" -> {
                if (!progress.isNotesRead()) {
                    progress.setNotesRead(true);
                    gamificationService.addXp(student, GamificationService.XP_READ_NOTES);
                }
            }
            case "video" -> {
                if (!progress.isVideoWatched()) {
                    progress.setVideoWatched(true);
                    gamificationService.addXp(student, GamificationService.XP_WATCH_VIDEO);
                }
            }
            case "assignment" -> {
                if (!progress.isAssignmentDone()) {
                    progress.setAssignmentDone(true);
                    gamificationService.addXp(student, GamificationService.XP_ASSIGNMENT);
                }
            }
            case "project" -> {
                if (!progress.isProjectDone()) {
                    progress.setProjectDone(true);
                    gamificationService.addXp(student, GamificationService.XP_PROJECT);
                    gamificationService.addCoins(student, GamificationService.COINS_PROJECT);
                    gamificationService.awardBadge(student, "First Project Completed",
                            "Completed your first project", "🏆");
                }
            }
            default -> throw new IllegalArgumentException("Unknown activity: " + activity);
        }

        checkTopicCompletion(progress, student);
        return topicProgressRepository.save(progress);
    }

    @Transactional
    public Assessment submitQuiz(Long studentId, Long quizId, Map<Long, String> answers) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        int totalPoints = 0;
        int earnedPoints = 0;

        for (QuizQuestion q : quiz.getQuestions()) {
            totalPoints += q.getPoints();
            String answer = answers.get(q.getId());
            if (answer != null && answer.equalsIgnoreCase(q.getCorrectAnswer())) {
                earnedPoints += q.getPoints();
            }
        }

        int score = totalPoints == 0 ? 0 : (earnedPoints * 100) / totalPoints;
        String proficiency = gamificationService.getProficiencyLevel(score);

        Assessment assessment = Assessment.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .proficiencyLevel(proficiency)
                .build();
        assessmentRepository.save(assessment);

        if (score >= quiz.getPassingScore()) {
            gamificationService.addXp(student, GamificationService.XP_PASS_QUIZ);
            gamificationService.addCoins(student, GamificationService.COINS_QUIZ);
            gamificationService.awardBadge(student, "First Quiz Completed",
                    "Passed your first quiz", "✅");

            TopicProgress progress = topicProgressRepository
                    .findByStudentAndTopic(student, quiz.getTopic())
                    .orElse(TopicProgress.builder().student(student).topic(quiz.getTopic()).build());
            progress.setQuizPassed(true);
            checkTopicCompletion(progress, student);
            topicProgressRepository.save(progress);
        }

        return assessment;
    }

    private void checkTopicCompletion(TopicProgress progress, Student student) {
        if (progress.isNotesRead() && progress.isVideoWatched() && progress.isQuizPassed()) {
            if (!progress.isCompleted()) {
                progress.setCompleted(true);
                gamificationService.addCoins(student, GamificationService.COINS_TOPIC);
                updateRoadmapProgress(student);
            }
        }
    }

    private void updateRoadmapProgress(Student student) {
        roadmapRepository.findByStudent(student).ifPresent(roadmap -> {
            long total = topicRepository.findByCareerGoalOrderByMonthNumberAscOrderIndexAsc(student.getCareerGoal()).size();
            long completed = topicProgressRepository.countByStudentAndCompletedTrue(student);
            roadmap.setProgressPercent(total == 0 ? 0 : (int) ((completed * 100) / total));
            roadmapRepository.save(roadmap);
        });
    }
}
